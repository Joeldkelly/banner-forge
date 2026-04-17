#!/usr/bin/env node
/* banner-forge — package.js
 * For each (network, size) in config, builds dist/<network>/<size>.zip
 * with the right manifest, clickTag case, and polite-load pattern.
 *
 * Usage:
 *   node scripts/package.js
 *   node scripts/package.js --network adform
 *   node scripts/package.js --sizes 300x250,728x90
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import archiver from "archiver";

import { loadConfig } from "./lib/config.js";
import { getNetwork, adformManifest } from "./lib/networks.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const BUILD = path.join(ROOT, "build");
const DIST = path.join(ROOT, "dist");

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const config = loadConfig(ROOT);

  const networks = args.network ? [args.network] : config.networks;
  const sizes = args.sizes?.length ? args.sizes : config.sizes;

  fs.mkdirSync(DIST, { recursive: true });

  const entries = [];
  for (const networkName of networks) {
    const network = getNetwork(networkName);
    const networkDir = path.join(DIST, networkName);
    fs.mkdirSync(networkDir, { recursive: true });

    for (const sizeKey of sizes) {
      const srcDir = path.join(BUILD, sizeKey);
      if (!fs.existsSync(path.join(srcDir, "index.html"))) {
        console.warn(`[package] skip ${networkName}/${sizeKey}: build missing. Run build.js first.`);
        continue;
      }
      const meta = JSON.parse(fs.readFileSync(path.join(srcDir, "meta.json"), "utf8"));
      const zipPath = path.join(networkDir, `${sizeKey}.zip`);
      const bytes = await writeZip({ srcDir, zipPath, network, meta, config });
      entries.push({
        network: networkName,
        size: sizeKey,
        zipPath: path.relative(ROOT, zipPath),
        bytes,
        ceilingOk: bytes <= network.totalLoadCeilingBytes,
        politeLoadOk: bytes <= network.initialLoadCeilingBytes
      });
      console.log(
        `[package] ${networkName.padEnd(7)} ${sizeKey.padEnd(10)} ${String(bytes).padStart(6)}B` +
        (bytes > network.initialLoadCeilingBytes ? "  [over polite-load ceiling]" : "")
      );
    }
  }

  fs.writeFileSync(
    path.join(DIST, "package-report.json"),
    JSON.stringify({ generatedAt: new Date().toISOString(), entries }, null, 2)
  );
  console.log(`[package] done. ${entries.length} zips → dist/`);
}

// Junk files macOS Finder / Windows Explorer inject that break DSP uploaders
// (CM360 and DV360 both reject zips containing __MACOSX/ directories).
const JUNK_BASENAMES = new Set([".DS_Store", "Thumbs.db", "desktop.ini", "ehthumbs.db"]);
const JUNK_DIR_PREFIXES = ["__MACOSX/", "__MACOSX\\"];

function isJunk(relPath) {
  const base = path.basename(relPath);
  if (JUNK_BASENAMES.has(base)) return true;
  if (JUNK_DIR_PREFIXES.some(p => relPath.startsWith(p) || relPath.includes("/" + p))) return true;
  return false;
}

function writeZip({ srcDir, zipPath, network, meta, config }) {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(zipPath);
    const archive = archiver("zip", { zlib: { level: 9 } });

    output.on("close", () => resolve(archive.pointer()));
    archive.on("warning", err => { if (err.code !== "ENOENT") reject(err); });
    archive.on("error", reject);

    archive.pipe(output);

    // index.html at zip root depth 0 — required by every DSP.
    // Silently: no leading slash, no parent folders, exactly "index.html".
    archive.file(path.join(srcDir, "index.html"), { name: "index.html" });

    // Assets subdirectory — filter out OS-injected junk (__MACOSX, .DS_Store, Thumbs.db)
    // and zero-byte files that inflate request counts against IAB LEAN.
    const assetsDir = path.join(srcDir, "assets");
    if (fs.existsSync(assetsDir)) {
      walkAssets(assetsDir).forEach(({ abs, rel }) => {
        if (isJunk(rel)) return;
        const stat = fs.statSync(abs);
        if (stat.size === 0) {
          console.warn(`[package] skip 0-byte asset: ${rel}`);
          return;
        }
        archive.file(abs, { name: `assets/${rel}` });
      });
    }

    // backup.png at zip root (CM360/DV360/Sizmek backup-image requirement).
    const backup = path.join(srcDir, "backup.png");
    const backupJpg = path.join(srcDir, "backup.jpg");
    if (fs.existsSync(backupJpg)) {
      archive.file(backupJpg, { name: "backup.jpg" });
    } else if (fs.existsSync(backup)) {
      archive.file(backup, { name: "backup.png" });
    }

    // Adform: manifest.json at zip root.
    if (network.manifest === "adform") {
      archive.append(
        JSON.stringify(adformManifest({
          width: meta.width,
          height: meta.height,
          clickUrl: meta.clickUrl,
          campaignName: meta.campaignName
        }), null, 2),
        { name: "manifest.json" }
      );
    }

    archive.finalize();
  });
}

function walkAssets(dir, prefix = "") {
  const out = [];
  for (const name of fs.readdirSync(dir)) {
    const abs = path.join(dir, name);
    const rel = prefix ? `${prefix}/${name}` : name;
    const stat = fs.statSync(abs);
    if (stat.isDirectory()) {
      out.push(...walkAssets(abs, rel));
    } else {
      out.push({ abs, rel });
    }
  }
  return out;
}

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--network") out.network = argv[++i];
    if (argv[i] === "--sizes") out.sizes = argv[++i].split(",").map(s => s.trim()).filter(Boolean);
  }
  return out;
}

main().catch(err => {
  console.error("[package] failed:", err.message);
  process.exit(1);
});
