/* banner-forge — canonical size matrix and per-size layout heuristics.
 * One source of truth for dimensions, template routing, and typography scale.
 * build.js, package.js, and validate.js all read from here.
 */

export const SIZE_MATRIX = {
  "300x250":  { w: 300,  h: 250,  shape: "rectangle", ceiling: 150000, template: "gsap"     },
  "336x280":  { w: 336,  h: 280,  shape: "rectangle", ceiling: 150000, template: "gsap"     },
  "300x600":  { w: 300,  h: 600,  shape: "skyscraper-wide", ceiling: 150000, template: "gsap" },
  "728x90":   { w: 728,  h: 90,   shape: "leaderboard", ceiling: 150000, template: "gsap"   },
  "970x90":   { w: 970,  h: 90,   shape: "leaderboard-xl", ceiling: 150000, template: "gsap" },
  "970x250":  { w: 970,  h: 250,  shape: "billboard", ceiling: 150000, template: "gsap"     },
  "160x600":  { w: 160,  h: 600,  shape: "skyscraper", ceiling: 150000, template: "gsap"    },
  "120x600":  { w: 120,  h: 600,  shape: "skyscraper-narrow", ceiling: 150000, template: "gsap" },
  "320x50":   { w: 320,  h: 50,   shape: "mobile-banner", ceiling: 50000, template: "css-only" },
  "320x100":  { w: 320,  h: 100,  shape: "mobile-banner-xl", ceiling: 50000, template: "css-only" },
  "300x50":   { w: 300,  h: 50,   shape: "mobile-banner", ceiling: 50000, template: "css-only" },
  "300x1050": { w: 300,  h: 1050, shape: "portrait", ceiling: 150000, template: "gsap"      },
  "468x60":   { w: 468,  h: 60,   shape: "banner-legacy", ceiling: 50000, template: "css-only" },
  "250x250":  { w: 250,  h: 250,  shape: "square", ceiling: 150000, template: "gsap"        },
  "200x200":  { w: 200,  h: 200,  shape: "square-small", ceiling: 50000, template: "css-only" }
};

export function getSize(sizeKey) {
  const s = SIZE_MATRIX[sizeKey];
  if (!s) {
    throw new Error(
      `Unknown size "${sizeKey}". Supported: ${Object.keys(SIZE_MATRIX).join(", ")}`
    );
  }
  return { key: sizeKey, ...s };
}

/**
 * Pick a template for a size, with user-config override.
 * Sizes flagged with ceiling ≤ 50000 always force css-only regardless of config
 * (GSAP bundle alone exceeds the ceiling).
 */
export function resolveTemplate(sizeKey, configTemplate = "gsap") {
  const s = getSize(sizeKey);
  if (s.ceiling <= 50000) return "css-only";
  if (configTemplate === "static") return "static";
  return "gsap";
}

/**
 * Layout heuristics per size. Build.js uses these to pick font sizes and padding.
 * Hand-tuned for readability at each aspect ratio.
 */
export function layoutFor(sizeKey) {
  const s = getSize(sizeKey);
  const shape = s.shape;

  const table = {
    "rectangle":          { padding: 16, gap: 6,  headlineSize: 22, subheadSize: 13, ctaSize: 13, ctaPaddingY: 8,  ctaPaddingX: 14, ctaRadius: 4, logoMaxWidth: 80, headlineMaxWords: 7 },
    "skyscraper-wide":    { padding: 16, gap: 10, headlineSize: 26, subheadSize: 14, ctaSize: 14, ctaPaddingY: 10, ctaPaddingX: 16, ctaRadius: 4, logoMaxWidth: 90, headlineMaxWords: 8 },
    "leaderboard":        { padding: 12, gap: 4,  headlineSize: 18, subheadSize: 11, ctaSize: 12, ctaPaddingY: 6,  ctaPaddingX: 12, ctaRadius: 3, logoMaxWidth: 70, headlineMaxWords: 8 },
    "leaderboard-xl":     { padding: 14, gap: 4,  headlineSize: 22, subheadSize: 12, ctaSize: 13, ctaPaddingY: 7,  ctaPaddingX: 14, ctaRadius: 3, logoMaxWidth: 80, headlineMaxWords: 10 },
    "billboard":          { padding: 20, gap: 8,  headlineSize: 36, subheadSize: 16, ctaSize: 15, ctaPaddingY: 10, ctaPaddingX: 18, ctaRadius: 4, logoMaxWidth: 120, headlineMaxWords: 10 },
    "skyscraper":         { padding: 12, gap: 8,  headlineSize: 18, subheadSize: 11, ctaSize: 12, ctaPaddingY: 7,  ctaPaddingX: 12, ctaRadius: 3, logoMaxWidth: 60, headlineMaxWords: 6 },
    "skyscraper-narrow":  { padding: 10, gap: 6,  headlineSize: 15, subheadSize: 10, ctaSize: 11, ctaPaddingY: 6,  ctaPaddingX: 10, ctaRadius: 3, logoMaxWidth: 50, headlineMaxWords: 5 },
    "mobile-banner":      { padding: 8,  gap: 2,  headlineSize: 13, subheadSize: 0,  ctaSize: 11, ctaPaddingY: 5,  ctaPaddingX: 10, ctaRadius: 3, logoMaxWidth: 40, headlineMaxWords: 4 },
    "mobile-banner-xl":   { padding: 10, gap: 3,  headlineSize: 15, subheadSize: 10, ctaSize: 11, ctaPaddingY: 5,  ctaPaddingX: 10, ctaRadius: 3, logoMaxWidth: 48, headlineMaxWords: 5 },
    "banner-legacy":      { padding: 8,  gap: 2,  headlineSize: 14, subheadSize: 0,  ctaSize: 11, ctaPaddingY: 5,  ctaPaddingX: 10, ctaRadius: 3, logoMaxWidth: 48, headlineMaxWords: 5 },
    "portrait":           { padding: 18, gap: 14, headlineSize: 28, subheadSize: 15, ctaSize: 14, ctaPaddingY: 10, ctaPaddingX: 16, ctaRadius: 4, logoMaxWidth: 90, headlineMaxWords: 10 },
    "square":             { padding: 14, gap: 6,  headlineSize: 20, subheadSize: 12, ctaSize: 12, ctaPaddingY: 7,  ctaPaddingX: 12, ctaRadius: 3, logoMaxWidth: 70, headlineMaxWords: 6 },
    "square-small":       { padding: 10, gap: 4,  headlineSize: 15, subheadSize: 10, ctaSize: 11, ctaPaddingY: 6,  ctaPaddingX: 10, ctaRadius: 3, logoMaxWidth: 50, headlineMaxWords: 5 }
  };

  const base = table[shape] || table["rectangle"];
  return { ...base, w: s.w, h: s.h, shape };
}

export function allSizes() {
  return Object.keys(SIZE_MATRIX);
}
