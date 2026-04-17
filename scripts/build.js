#!/usr/bin/env node
/* banner-forge — build.js
 * Reads banner.config.json, fills templates for each size, writes build/<size>/.
 *
 * Usage:
 *   node scripts/build.js                      # all sizes in config
 *   node scripts/build.js --sizes 300x250,728x90
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { minify as terserMinify } from "terser";
import { minify as cssoMinify } from "csso";
import { optimize as svgoOptimize } from "svgo";
import sharp from "sharp";

import { loadConfig } from "./lib/config.js";
import { getSize, resolveTemplate, layoutFor } from "./lib/sizes.js";
import { render, renderRaw } from "./lib/template.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const TEMPLATES = path.join(ROOT, "templates");
const BUILD = path.join(ROOT, "build");

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const config = loadConfig(ROOT);
  const sizes = args.sizes?.length ? args.sizes : config.sizes;

  fs.mkdirSync(BUILD, { recursive: true });
  const gsapBundle = loadGsapBundle();
  console.log(`[build] ${sizes.length} sizes, GSAP ${gsapBundle ? "inlined" : "not-loaded"}`);

  const reports = [];
  for (const sizeKey of sizes) {
    const report = await buildSize(sizeKey, config, gsapBundle);
    reports.push(report);
    console.log(
      `[build] ${sizeKey.padEnd(10)} ${report.template.padEnd(9)} ${String(report.bytes).padStart(6)}B`
    );
  }

  fs.writeFileSync(
    path.join(BUILD, "build-report.json"),
    JSON.stringify({ generatedAt: new Date().toISOString(), entries: reports }, null, 2)
  );
  console.log(`[build] done. report → build/build-report.json`);
}

async function buildSize(sizeKey, config, gsapBundle) {
  const size = getSize(sizeKey);
  const template = resolveTemplate(sizeKey, config.animation?.template || "gsap");
  const layout = layoutFor(sizeKey);
  const outDir = path.join(BUILD, sizeKey);
  fs.mkdirSync(outDir, { recursive: true });
  const assetsDir = path.join(outDir, "assets");
  fs.mkdirSync(assetsDir, { recursive: true });

  // Copy and optimize assets referenced by config.
  const assetRefs = await copyAssets(config, assetsDir);

  // Load template parts.
  const htmlTpl = read(path.join(TEMPLATES, template, "index.html"));
  const cssTpl = read(path.join(TEMPLATES, template, "styles.css"));

  // Build token dict for interpolation.
  const tokens = {
    campaignName: config.campaign.name,
    width: size.w,
    height: size.h,
    clickUrl: config.campaign.clickUrl,
    ariaLabel: `${config.campaign.advertiser}: ${config.creative.headline}`,
    staticSrc: assetRefs.staticSrc || "assets/static.jpg",

    headline: truncateWords(config.creative.headline, layout.headlineMaxWords),
    subhead: layout.subheadSize > 0 ? config.creative.subhead : "",
    cta: config.creative.cta,
    legal: config.creative.legal || "",

    hero: assetRefs.hero,
    logo: assetRefs.logo,

    headlineFont: config.brand.fonts?.headline?.family || "Figtree",
    headlineWeight: config.brand.fonts?.headline?.weight || 800,
    bodyFont: config.brand.fonts?.body?.family || "Inter",
    bodyWeight: config.brand.fonts?.body?.weight || 500,

    colorBackground: config.brand.colors.background || "#FFFFFF",
    colorText: config.brand.colors.text || "#111111",
    colorPrimary: config.brand.colors.primary,
    colorAccent: config.brand.colors.accent || config.brand.colors.primary,
    colorCtaBg: config.brand.colors.ctaBackground || config.brand.colors.primary,
    colorCtaText: config.brand.colors.ctaText || "#FFFFFF",

    heroFocalX: Math.round((config.creative.hero?.focalPoint?.x ?? 0.5) * 100),
    heroFocalY: Math.round((config.creative.hero?.focalPoint?.y ?? 0.5) * 100),

    padding: layout.padding,
    gap: layout.gap,
    headlineSize: layout.headlineSize,
    subheadSize: layout.subheadSize,
    ctaSize: layout.ctaSize,
    ctaPaddingY: layout.ctaPaddingY,
    ctaPaddingX: layout.ctaPaddingX,
    ctaRadius: layout.ctaRadius,
    logoMaxWidth: layout.logoMaxWidth
  };

  // CSS: render + append prefers-reduced-motion guard + minify.
  // WCAG 2.3.3 requires respect for reduced-motion preferences. In practice,
  // we disable all CSS animations / transitions and let the GSAP timeline's
  // onComplete final-state handler determine the visible state (headline,
  // subhead, CTA all visible at rest). For CSS-only templates this removes
  // the staggered delays so everything appears immediately.
  const reducedMotionBlock = `
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.001ms !important;
    animation-delay: 0ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
    transition-delay: 0ms !important;
  }
  #logo, #headline, #subhead, #cta { opacity: 1 !important; transform: none !important; }
}`;
  const css = renderRaw(cssTpl, tokens) + reducedMotionBlock;
  const cssMin = cssoMinify(css, { restructure: true }).css;

  // Animation script: read + wrap with scene/loop config, then minify.
  let animationInlined = "";
  if (template === "gsap") {
    const animTpl = read(path.join(TEMPLATES, "gsap", "animation.js"));
    const scenes = filterScenes(config.animation?.scenes || [], tokens);
    const loops = Math.max(1, Math.min(3, config.animation?.loops || 3));

    // Reject user-supplied animation overrides that contain `repeat: -1`
    // (infinite loops violate the ≤3-loop cap enforced by Google/DV360/TTD).
    // We check both the config-level animation.userScript (V1 hook) and the
    // scenes array for accidental inclusion.
    const configAsJson = JSON.stringify(config.animation || {});
    if (/repeat\s*:\s*-1/.test(configAsJson)) {
      throw new Error(
        `Animation config uses repeat: -1 (infinite loop). Google/DV360/TTD enforce ≤3 loops. ` +
        `Remove the -1 and use loops: 1|2|3 instead.`
      );
    }

    const animWithConfig =
      `window.__BANNER__ = ${JSON.stringify({ scenes, loops })};\n` + animTpl;
    const minified = await terserMinify(animWithConfig, {
      compress: true,
      mangle: {
        // Preserve clickTag globals and the ready flag.
        reserved: ["clickTag", "clickTAG", "__BANNER__", "__BANNER_READY__", "__BANNER_FINAL__", "gsap"]
      }
    });
    animationInlined = minified.code;
  }

  // HTML render.
  // Order matters: do the three inline-content replacements BEFORE render(), because
  // render() strips unknown {{key}} placeholders as empty strings. The three inline
  // blocks (CSS, GSAP, animation) are pre-prepared raw strings that must not be
  // HTML-escaped; render() is only for user-facing tokens.
  const htmlWithInlines = htmlTpl
    .replace("{{inlineCss}}", cssMin)
    .replace("{{inlineGsap}}", gsapBundle || "")
    .replace("{{inlineAnimation}}", animationInlined);
  const html = render(htmlWithInlines, tokens);

  const htmlPath = path.join(outDir, "index.html");
  fs.writeFileSync(htmlPath, html);

  // Sidecar metadata for downstream stages.
  const meta = {
    size: sizeKey,
    width: size.w,
    height: size.h,
    template,
    ceiling: size.ceiling,
    clickUrl: config.campaign.clickUrl,
    campaignName: config.campaign.name,
    assets: assetRefs,
    durationMs: (config.animation?.scenes || []).reduce((a, s) => a + (s.durationMs || 0), 0),
    loops: Math.max(1, Math.min(3, config.animation?.loops || 3)),
    bytes: fs.statSync(htmlPath).size,
    generatedAt: new Date().toISOString()
  };
  fs.writeFileSync(path.join(outDir, "meta.json"), JSON.stringify(meta, null, 2));

  return meta;
}

/** Scenes reference DOM ids — drop any whose target doesn't render at this size. */
function filterScenes(scenes, tokens) {
  return scenes.filter(s => {
    if (s.id === "subhead" && !tokens.subhead) return false;
    if (s.id === "intro") return true;
    return true;
  });
}

async function copyAssets(config, assetsDir) {
  const refs = {};
  if (config.creative.hero?.src) {
    const src = config.creative.hero.src;
    if (fs.existsSync(src)) {
      const ext = path.extname(src).toLowerCase();
      const out = path.join(assetsDir, "hero" + ext);
      if (ext === ".jpg" || ext === ".jpeg") {
        await sharp(src).jpeg({ quality: 72, progressive: true, mozjpeg: true }).toFile(out);
      } else if (ext === ".png") {
        await sharp(src).png({ quality: 72, compressionLevel: 9 }).toFile(out);
      } else {
        fs.copyFileSync(src, out);
      }
      refs.hero = { src: "assets/" + path.basename(out), alt: config.creative.hero.alt || "" };
    }
  }
  if (config.brand.logo?.src) {
    const src = config.brand.logo.src;
    if (fs.existsSync(src)) {
      const ext = path.extname(src).toLowerCase();
      const out = path.join(assetsDir, "logo" + ext);
      if (ext === ".svg") {
        const optimized = svgoOptimize(fs.readFileSync(src, "utf8"), { multipass: true });
        fs.writeFileSync(out, optimized.data);
      } else {
        fs.copyFileSync(src, out);
      }
      refs.logo = { src: "assets/" + path.basename(out), alt: config.brand.logo.alt || "" };
    }
  }
  return refs;
}

function loadGsapBundle() {
  // Prefer locally-installed gsap. Fall back to empty string; build still works with CSS-only.
  const p = path.join(ROOT, "node_modules", "gsap", "dist", "gsap.min.js");
  if (fs.existsSync(p)) return fs.readFileSync(p, "utf8");
  console.warn("[build] GSAP not found in node_modules. Install with: npm i gsap");
  return "";
}

function read(p) { return fs.readFileSync(p, "utf8"); }

function truncateWords(s, maxWords) {
  if (!s || !maxWords) return s || "";
  const words = String(s).split(/\s+/);
  if (words.length <= maxWords) return s;
  return words.slice(0, maxWords).join(" ") + "…";
}

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--sizes") out.sizes = argv[++i].split(",").map(s => s.trim()).filter(Boolean);
  }
  return out;
}

main().catch(err => {
  console.error("[build] failed:", err.message);
  process.exit(1);
});
