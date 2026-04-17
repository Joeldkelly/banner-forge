/* banner-forge — config load + validate. */

import fs from "node:fs";
import path from "node:path";

export function loadConfig(root = process.cwd()) {
  const p = path.join(root, "banner.config.json");
  if (!fs.existsSync(p)) {
    throw new Error(
      `banner.config.json not found at ${p}. Copy banner.config.example.json to get started.`
    );
  }
  const raw = fs.readFileSync(p, "utf8");
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (e) {
    throw new Error(`banner.config.json is not valid JSON: ${e.message}`);
  }
  return validateConfig(parsed);
}

export function validateConfig(c) {
  const errors = [];
  if (!c.campaign?.name) errors.push("campaign.name is required");
  if (!c.campaign?.clickUrl) errors.push("campaign.clickUrl is required — clickTag without a URL is useless");
  if (!/^https?:\/\//.test(c.campaign?.clickUrl || "")) errors.push("campaign.clickUrl must be http:// or https://");
  if (!c.brand?.colors?.primary) errors.push("brand.colors.primary is required");
  if (!c.creative?.headline) errors.push("creative.headline is required");
  if (!c.creative?.cta) errors.push("creative.cta is required");
  if (!Array.isArray(c.sizes) || c.sizes.length === 0) errors.push("sizes array is required");
  if (!Array.isArray(c.networks) || c.networks.length === 0) errors.push("networks array is required");

  if (errors.length) {
    throw new Error("banner.config.json validation failed:\n  - " + errors.join("\n  - "));
  }

  // Font refusal list — stale commercial fonts we substitute.
  const REFUSED_FONTS = new Set(["Helvetica", "Helvetica Neue", "Futura", "Avenir", "Gotham", "Proxima Nova"]);
  const substitutions = [];
  for (const role of ["headline", "body"]) {
    const f = c.brand?.fonts?.[role];
    if (f && REFUSED_FONTS.has(f.family)) {
      substitutions.push({ role, from: f.family, to: role === "headline" ? "Figtree" : "Inter" });
      f.family = role === "headline" ? "Figtree" : "Inter";
      f.source = "fontsource";
    }
  }
  if (substitutions.length) {
    console.warn("[banner-forge] Font substitutions:");
    for (const s of substitutions) {
      console.warn(`  - ${s.role}: ${s.from} → ${s.to} (commercial licensing; see references/LEGAL.md)`);
    }
  }

  return c;
}
