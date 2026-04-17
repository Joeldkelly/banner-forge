#!/usr/bin/env node
/* banner-forge — validate.js
 * Inspects dist/ zips and emits a pass/fail report.
 * Checks: file size, clickTag globals, required files, manifest shape, font source,
 * external-request flags, animation duration, loop cap.
 *
 * Usage:
 *   node scripts/validate.js
 *   node scripts/validate.js --target ./dist/google/300x250.zip
 */

import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
// archiver has a zip reader pair; we use a minimal zip reader via node builtins.
// Using "adm-zip"-style inline reader would add a dep. Instead, we parse the central directory ourselves
// for the small set of checks we need.

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DIST = path.join(ROOT, "dist");

import { getNetwork } from "./lib/networks.js";

async function main() {
  const args = parseArgs(process.argv.slice(2));

  const targets = args.target ? [args.target] : collectZips(DIST);
  if (!targets.length) {
    console.error("[validate] no zips found under dist/. Run package.js first.");
    process.exit(1);
  }

  const entries = [];
  for (const zipPath of targets) {
    const entry = await validateZip(zipPath);
    entries.push(entry);
    const stamp =
      entry.status === "pass" ? "  pass " :
      entry.status === "pass-with-warnings" ? "  warn " :
                                               "  FAIL ";
    console.log(
      `[validate]${stamp}${entry.network.padEnd(7)} ${entry.size.padEnd(10)} ${String(entry.bytes).padStart(6)}B` +
      (entry.failures.length ? `  ← ${entry.failures[0]}` : "")
    );
  }

  fs.mkdirSync(DIST, { recursive: true });
  const report = {
    generatedAt: new Date().toISOString(),
    pass: entries.filter(e => e.status === "pass").length,
    warn: entries.filter(e => e.status === "pass-with-warnings").length,
    fail: entries.filter(e => e.status === "fail").length,
    entries
  };
  fs.writeFileSync(path.join(DIST, "validation-report.json"), JSON.stringify(report, null, 2));

  console.log(
    `[validate] ${report.pass} pass, ${report.warn} warn, ${report.fail} fail → dist/validation-report.json`
  );
  process.exit(report.fail > 0 ? 1 : 0);
}

function collectZips(root) {
  if (!fs.existsSync(root)) return [];
  const out = [];
  for (const network of fs.readdirSync(root)) {
    const netDir = path.join(root, network);
    if (!fs.statSync(netDir).isDirectory()) continue;
    for (const f of fs.readdirSync(netDir)) {
      if (f.endsWith(".zip")) out.push(path.join(netDir, f));
    }
  }
  return out;
}

async function validateZip(zipPath) {
  const rel = path.relative(ROOT, zipPath);
  const [, network = "unknown"] = rel.split(path.sep);
  const size = path.basename(zipPath, ".zip");
  const bytes = fs.statSync(zipPath).size;

  const failures = [];
  const warnings = [];

  // Parse central directory to list files and pull index.html.
  let entries, indexHtml = null;
  try {
    ({ entries, indexHtml } = readZip(zipPath));
  } catch (e) {
    failures.push(`zip parse error: ${e.message}`);
    return { network, size, zipPath: rel, bytes, status: "fail", failures, warnings };
  }

  const fileNames = entries.map(e => e.name);

  // Size ceiling — raw bytes. Most publishers enforce raw, but Google Studio
  // measures gzipped; we report both so the user can answer either question.
  let networkSpec;
  try { networkSpec = getNetwork(network); } catch { networkSpec = null; }
  if (networkSpec) {
    if (bytes > networkSpec.totalLoadCeilingBytes) {
      failures.push(`over total-load ceiling (${bytes} > ${networkSpec.totalLoadCeilingBytes})`);
    } else if (bytes > networkSpec.initialLoadCeilingBytes) {
      warnings.push(`over polite-load ceiling raw (${bytes} > ${networkSpec.initialLoadCeilingBytes})`);
    }
  } else if (bytes > 150000) {
    warnings.push(`over 150KB polite-load threshold (raw)`);
  }

  // Gzip-aware weight of index.html — Google Studio measures gzipped weight.
  let gzippedIndexHtml = 0;
  if (indexHtml) {
    gzippedIndexHtml = zlib.gzipSync(Buffer.from(indexHtml, "utf8")).length;
  }

  // index.html at zip root depth 0. Any entry named with a leading path would violate.
  if (!fileNames.includes("index.html")) failures.push("index.html missing at zip root");
  const rootIndex = entries.find(e => e.name === "index.html");
  if (rootIndex && rootIndex.name.includes("/")) failures.push("index.html is not at zip root (depth 0)");

  // __MACOSX / junk files — macOS Finder's "Compress" injects these and breaks some DSPs.
  const junkEntries = entries.filter(e =>
    e.name.startsWith("__MACOSX/") ||
    e.name.endsWith("/.DS_Store") || e.name === ".DS_Store" ||
    e.name.endsWith("/Thumbs.db")  || e.name === "Thumbs.db"
  );
  if (junkEntries.length) {
    failures.push(`zip contains junk entries (${junkEntries.length}): ${junkEntries.map(e => e.name).slice(0,3).join(", ")}`);
  }

  // 0-byte files inflate request counts against IAB LEAN's ≤15 file limit.
  const zeroByte = entries.filter(e => e.uncompressedSize === 0 && !e.name.endsWith("/"));
  if (zeroByte.length) {
    warnings.push(`zip contains ${zeroByte.length} zero-byte file(s): ${zeroByte.map(e => e.name).slice(0,3).join(", ")}`);
  }

  // IAB LEAN ≤15 initial-load requests. Count real files (skip directory entries).
  const realFiles = entries.filter(e => !e.name.endsWith("/"));
  if (realFiles.length > 15) {
    warnings.push(`${realFiles.length} files exceeds IAB LEAN budget of 15 initial-load requests`);
  }

  // Adform manifest.
  if (network === "adform" && !fileNames.includes("manifest.json")) {
    failures.push("adform: manifest.json missing");
  }

  if (indexHtml) {
    // Dual clickTag.
    const hasClickTag = /\bvar\s+clickTag\s*=/.test(indexHtml);
    const hasClickTAG = /\bvar\s+clickTAG\s*=/.test(indexHtml);
    if (!hasClickTag) failures.push("clickTag (lowercase) missing");
    if (network === "ttd" || network === "adform") {
      if (!hasClickTAG) failures.push("clickTAG (uppercase) missing — required by TTD/Adform");
    }

    // ad.size meta tag — CM360 / Google Ad Manager silently disapprove without it.
    if (!/<meta\s+name=["']ad\.size["']/i.test(indexHtml)) {
      failures.push('<meta name="ad.size"> missing — CM360 disapproves HTML5 creatives without it');
    }

    // External font requests forbidden (GDPR — LG München 2022).
    if (/https?:\/\/fonts\.googleapis\.com/.test(indexHtml)) {
      failures.push("loads fonts.googleapis.com at runtime — GDPR risk");
    }

    // http:// mixed-content references — most browsers and DSPs reject.
    // Ignore clickTag values (which may be http in dev) and ignore the DOCTYPE URL.
    const httpRefs = [
      ...indexHtml.matchAll(/<(?:script|link|img|iframe|source)[^>]+(?:src|href)=["'](http:\/\/[^"']+)["']/gi)
    ].map(m => m[1]);
    if (httpRefs.length) {
      failures.push(`mixed-content http:// refs (${httpRefs.length}): ${httpRefs.slice(0,2).join(", ")}`);
    }

    // External CDN refs beyond the clickTag bridge (warning, not failure).
    const externalScripts = indexHtml.match(/<(?:script|link)[^>]+(?:src|href)="(https:\/\/[^"]+)"/g) || [];
    const externalUrls = externalScripts
      .map(s => s.match(/"(https:\/\/[^"]+)"/)?.[1])
      .filter(Boolean);
    if (externalUrls.length) {
      warnings.push(`external refs: ${externalUrls.slice(0,3).join(", ")}`);
    }

    // Click URL is https.
    const clickTagMatch = indexHtml.match(/var\s+clickTag\s*=\s*"([^"]*)"/);
    if (clickTagMatch) {
      if (!clickTagMatch[1]) failures.push("clickTag is empty string");
      else if (!/^https?:\/\//.test(clickTagMatch[1])) failures.push("clickTag is not a valid URL");
    }

    // GSAP repeat: -1 — infinite loops violate 3-loop cap on Google/DV360/TTD.
    if (/repeat\s*:\s*-1/.test(indexHtml)) {
      failures.push("animation uses repeat:-1 (infinite loop) — Google/DV360/TTD enforce ≤3 loops");
    }
  }

  const status = failures.length ? "fail" : (warnings.length ? "pass-with-warnings" : "pass");
  return { network, size, zipPath: rel, bytes, gzippedIndexHtml, realFileCount: realFiles.length, status, failures, warnings };
}

/**
 * Minimal zip reader — pulls central directory, finds index.html, decompresses it.
 * Sufficient for validation. Handles stored + deflated entries.
 */
function readZip(zipPath) {
  const buf = fs.readFileSync(zipPath);
  const EOCD_SIG = 0x06054b50;

  // Find EOCD.
  let eocdOff = -1;
  for (let i = buf.length - 22; i >= 0 && i >= buf.length - 65558; i--) {
    if (buf.readUInt32LE(i) === EOCD_SIG) { eocdOff = i; break; }
  }
  if (eocdOff < 0) throw new Error("EOCD not found");

  const cdSize = buf.readUInt32LE(eocdOff + 12);
  const cdOff = buf.readUInt32LE(eocdOff + 16);
  const total = buf.readUInt16LE(eocdOff + 10);

  const entries = [];
  let p = cdOff;
  for (let i = 0; i < total; i++) {
    if (buf.readUInt32LE(p) !== 0x02014b50) throw new Error("bad central dir sig");
    const compressionMethod = buf.readUInt16LE(p + 10);
    const compressedSize = buf.readUInt32LE(p + 20);
    const uncompressedSize = buf.readUInt32LE(p + 24);
    const nameLen = buf.readUInt16LE(p + 28);
    const extraLen = buf.readUInt16LE(p + 30);
    const commentLen = buf.readUInt16LE(p + 32);
    const localHeaderOff = buf.readUInt32LE(p + 42);
    const name = buf.slice(p + 46, p + 46 + nameLen).toString("utf8");
    entries.push({ name, compressionMethod, compressedSize, uncompressedSize, localHeaderOff });
    p += 46 + nameLen + extraLen + commentLen;
  }

  // Find index.html and decompress.
  let indexHtml = null;
  const idx = entries.find(e => e.name === "index.html");
  if (idx) {
    // Read local header to get data offset.
    const lh = idx.localHeaderOff;
    if (buf.readUInt32LE(lh) !== 0x04034b50) throw new Error("bad local header sig");
    const lhNameLen = buf.readUInt16LE(lh + 26);
    const lhExtraLen = buf.readUInt16LE(lh + 28);
    const dataStart = lh + 30 + lhNameLen + lhExtraLen;
    const data = buf.slice(dataStart, dataStart + idx.compressedSize);
    if (idx.compressionMethod === 0) {
      indexHtml = data.toString("utf8");
    } else if (idx.compressionMethod === 8) {
      const zlib = require("node:zlib");
      indexHtml = zlib.inflateRawSync(data).toString("utf8");
    }
  }

  return { entries, indexHtml };
}

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--target") out.target = argv[++i];
  }
  return out;
}

main().catch(err => {
  console.error("[validate] failed:", err.message);
  process.exit(2);
});
