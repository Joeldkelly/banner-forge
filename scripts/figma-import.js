#!/usr/bin/env node
/* banner-forge — figma-import.js (stub, V1 feature)
 *
 * Converts a Figma frame URL into banner.config.json via the Figma MCP. In the MVP
 * this is a stub: it emits instructions rather than calling MCP from Node (the
 * Figma MCP is wired through Claude Code, not this script). The real flow is:
 *
 *   1. User invokes /banner-from-figma <url>
 *   2. Claude (the skill) calls the Figma MCP tools (get_metadata, get_design_context, etc.)
 *   3. Claude writes banner.config.json using the extracted tokens, fonts, copy, and assets
 *   4. Claude then runs scripts/build.js → render.js → package.js → validate.js
 *
 * This script exists as a placeholder for a future headless ingest path (Figma REST API +
 * personal access token), which is deliberately out of MVP scope.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

function main() {
  const url = process.argv[2];
  if (!url) {
    console.error("Usage: node scripts/figma-import.js <figma-frame-url>");
    process.exit(1);
  }

  console.log("");
  console.log("[figma-import] This script is a stub. Figma ingest runs inside the Claude Code");
  console.log("[figma-import] skill via the Figma MCP, not directly from Node.");
  console.log("");
  console.log("To ingest this frame:");
  console.log(`  1. Ensure the Figma MCP is connected (Claude Code settings).`);
  console.log(`  2. Run /banner-from-figma ${url}`);
  console.log(`  3. The skill will extract tokens and write banner.config.json here.`);
  console.log("");
  console.log("Free-seat Figma users: write-back is disabled, read-only mode works.");
  console.log("");

  // As a courtesy: if no banner.config.json exists, emit a starter one the user can fill.
  const cfgPath = path.join(ROOT, "banner.config.json");
  if (!fs.existsSync(cfgPath)) {
    const example = fs.readFileSync(path.join(ROOT, "banner.config.example.json"), "utf8");
    fs.writeFileSync(cfgPath, example);
    console.log(`[figma-import] Seeded banner.config.json from the example. Edit and re-run.`);
  }
}

main();
