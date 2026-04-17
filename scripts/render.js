#!/usr/bin/env node
/* banner-forge — render.js
 * For each size in build/, captures:
 *   - backup.png  (last animation frame, sharp-optimized, target <40KB)
 *   - preview.mp4 (full animation via ffmpeg, from sequential frames)
 *   - preview.gif (via gifski if available; else skipped with a warning)
 *
 * Usage:
 *   node scripts/render.js                # all sizes in build/
 *   node scripts/render.js --sizes 300x250
 *   node scripts/render.js --skip gif,mp4 # backup only
 */

import fs from "node:fs";
import path from "node:path";
import { spawn, spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer";
import sharp from "sharp";
import ffmpegStatic from "ffmpeg-static";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const BUILD = path.join(ROOT, "build");
const FPS = 24;

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const skip = new Set((args.skip || "").split(",").filter(Boolean));
  const sizes = args.sizes?.length ? args.sizes : listBuildSizes();

  if (!sizes.length) {
    console.error("[render] no build/<size>/ directories found. Run build.js first.");
    process.exit(1);
  }

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--font-render-hinting=none"]
  });

  const reports = [];
  try {
    for (const sizeKey of sizes) {
      const report = await renderSize(browser, sizeKey, skip);
      reports.push(report);
      console.log(
        `[render] ${sizeKey.padEnd(10)} png:${report.backupBytes}B  ` +
        `gif:${report.gifBytes || "skip"}  mp4:${report.mp4Bytes || "skip"}`
      );
    }
  } finally {
    await browser.close();
  }

  fs.writeFileSync(
    path.join(BUILD, "render-report.json"),
    JSON.stringify({ generatedAt: new Date().toISOString(), entries: reports }, null, 2)
  );
}

async function renderSize(browser, sizeKey, skip) {
  const dir = path.join(BUILD, sizeKey);
  const meta = JSON.parse(fs.readFileSync(path.join(dir, "meta.json"), "utf8"));
  const htmlPath = path.join(dir, "index.html");

  const framesDir = path.join(dir, ".frames");
  fs.mkdirSync(framesDir, { recursive: true });

  const durationMs = Math.max(1000, meta.durationMs || 5000);
  const totalFrames = Math.max(2, Math.round((durationMs / 1000) * FPS));

  const page = await browser.newPage();
  await page.setViewport({ width: meta.width, height: meta.height, deviceScaleFactor: 1 });
  await page.goto("file://" + htmlPath, { waitUntil: "networkidle0" });

  // Wait for template's ready signal or a short settle.
  await page.waitForFunction(() => window.__BANNER_READY__ === true || true, { timeout: 3000 }).catch(() => {});

  // Drive the animation manually by driving gsap timeline progress for determinism.
  // For the CSS-only template, fall back to natural time steps using CDP screencast frames.
  const isGsap = await page.evaluate(() => typeof window.gsap !== "undefined");

  if (isGsap) {
    await page.evaluate(() => { if (window.gsap) window.gsap.globalTimeline.pause(); });
    for (let i = 0; i < totalFrames; i++) {
      const t = i / (totalFrames - 1); // 0..1
      await page.evaluate((progress) => {
        if (window.gsap) {
          const tls = window.gsap.getTweensOf("*");
          if (window.gsap.globalTimeline) window.gsap.globalTimeline.progress(progress);
        }
      }, t);
      const buf = await page.screenshot({ type: "png", omitBackground: false });
      fs.writeFileSync(path.join(framesDir, `f${String(i).padStart(4, "0")}.png`), buf);
    }
  } else {
    // CSS-only: step wallclock and snapshot.
    const step = durationMs / (totalFrames - 1);
    for (let i = 0; i < totalFrames; i++) {
      await sleep(step);
      const buf = await page.screenshot({ type: "png", omitBackground: false });
      fs.writeFileSync(path.join(framesDir, `f${String(i).padStart(4, "0")}.png`), buf);
    }
  }

  // Backup = last frame, sharp-optimized.
  const lastFramePath = path.join(framesDir, `f${String(totalFrames - 1).padStart(4, "0")}.png`);
  const backupPath = path.join(dir, "backup.png");
  await sharp(lastFramePath).png({ quality: 80, compressionLevel: 9, palette: true }).toFile(backupPath);
  const backupBytes = fs.statSync(backupPath).size;

  // MP4 via ffmpeg.
  let mp4Bytes = 0;
  if (!skip.has("mp4")) {
    const mp4Path = path.join(dir, "preview.mp4");
    await runFfmpeg([
      "-y",
      "-r", String(FPS),
      "-i", path.join(framesDir, "f%04d.png"),
      "-c:v", "libx264",
      "-pix_fmt", "yuv420p",
      "-vf", "scale=trunc(iw/2)*2:trunc(ih/2)*2",
      "-movflags", "+faststart",
      mp4Path
    ]);
    mp4Bytes = fs.existsSync(mp4Path) ? fs.statSync(mp4Path).size : 0;
  }

  // GIF via gifski if present, else skip.
  let gifBytes = 0;
  if (!skip.has("gif")) {
    const gifskiBin = resolveGifski();
    if (gifskiBin) {
      const gifPath = path.join(dir, "preview.gif");
      const frames = fs.readdirSync(framesDir).filter(f => f.endsWith(".png")).map(f => path.join(framesDir, f));
      await runCmd(gifskiBin, ["-o", gifPath, "--fps", String(FPS), "--quality", "85", ...frames]);
      gifBytes = fs.existsSync(gifPath) ? fs.statSync(gifPath).size : 0;
    } else {
      console.warn(`[render] ${sizeKey}: gifski not installed, skipping GIF. See SKILL.md failure modes.`);
    }
  }

  // Cleanup frames.
  fs.rmSync(framesDir, { recursive: true, force: true });
  await page.close();

  return { size: sizeKey, backupBytes, gifBytes, mp4Bytes };
}

function listBuildSizes() {
  if (!fs.existsSync(BUILD)) return [];
  return fs.readdirSync(BUILD).filter(f => {
    const p = path.join(BUILD, f);
    return fs.statSync(p).isDirectory() && fs.existsSync(path.join(p, "meta.json"));
  });
}

function resolveGifski() {
  // Try the gifski npm package first, else PATH.
  try {
    const p = path.join(ROOT, "node_modules", "gifski", "bin", "gifski");
    if (fs.existsSync(p)) return p;
  } catch {}
  const which = spawnSync("which", ["gifski"]);
  if (which.status === 0) return which.stdout.toString().trim();
  return null;
}

function runFfmpeg(args) {
  return runCmd(ffmpegStatic, args);
}

function runCmd(cmd, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { stdio: ["ignore", "ignore", "pipe"] });
    let stderr = "";
    child.stderr?.on("data", d => (stderr += d.toString()));
    child.on("close", code => code === 0 ? resolve() : reject(new Error(`${cmd} exited ${code}: ${stderr.slice(-400)}`)));
  });
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--sizes") out.sizes = argv[++i].split(",").map(s => s.trim()).filter(Boolean);
    if (argv[i] === "--skip") out.skip = argv[++i];
  }
  return out;
}

main().catch(err => {
  console.error("[render] failed:", err.message);
  process.exit(1);
});
