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

function writeZip({ srcDir, zipPath, network, meta, config }) {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(zipPath);
    const archive = archiver("zip", { zlib: { level: 9 } });

    output.on("close", () => resolve(archive.pointer()));
    archive.on("warning", err => { if (err.code !== "ENOENT") reject(err); });
    archive.on("error", reject);

    archive.pipe(output);

    // index.html always at zip root.
    archive.file(path.join(srcDir, "index.html"), { name: "index.html" });

    // Assets.
    const assetsDir = path.join(srcDir, "assets");
    if (fs.existsSync(assetsDir)) {
      archive.directory(assetsDir, "assets");
    }

    // backup.png always at root (required by most networks for backup-image requirement).
    const backup = path.join(srcDir, "backup.png");
    if (fs.existsSync(backup)) archive.file(backup, { name: "backup.png" });

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
