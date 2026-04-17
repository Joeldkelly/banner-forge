/* banner-forge — per-network packaging rules.
 * package.js reads this to decide manifest shape, clickTag case, polite-load, retina.
 *
 * clickMode values:
 *   "basic"   — dual-global (clickTag + clickTAG) + window.open(). Covers Google/DV360/TTD/Adform.
 *   "studio"  — CM360 Studio ad. Uses Enabler.exit('exitName', url). Requires studio.js at runtime.
 *   "sizmek"  — Sizmek/Amazon Sizmek. Uses EB.clickthrough(url). Requires Sizmek SDK.
 *   "xandr"   — Xandr (formerly AppNexus). Reads APPNEXUS.getClickTag() at runtime.
 *
 * MVP ships "basic" for all networks. The others are V1 wrappers planned in the
 * Tier 1 Feature Brief (ClickTag Forge).
 */

const COMMON_ASSETS = ["html", "css", "js", "jpg", "jpeg", "png", "gif", "svg", "woff", "woff2"];

export const NETWORKS = {
  google: {
    label: "Google Ads / Google Display Network",
    manifest: null,
    clickTagCase: "lowercase",
    clickMode: "basic",
    initialLoadCeilingBytes: 150000,
    totalLoadCeilingBytes: 2200000,
    maxInitialRequests: 15,
    politeLoad: true,
    retina: false,
    allowedAssetTypes: COMMON_ASSETS
  },
  dv360: {
    label: "Display & Video 360",
    manifest: null,
    clickTagCase: "lowercase",
    clickMode: "basic",
    initialLoadCeilingBytes: 150000,
    totalLoadCeilingBytes: 2200000,
    maxInitialRequests: 15,
    politeLoad: true,
    retina: false,
    allowedAssetTypes: COMMON_ASSETS
  },
  ttd: {
    label: "The Trade Desk",
    manifest: null,
    clickTagCase: "both",
    clickMode: "basic",
    initialLoadCeilingBytes: 200000,
    totalLoadCeilingBytes: 2500000,
    maxInitialRequests: 20,
    politeLoad: true,
    retina: false,
    allowedAssetTypes: COMMON_ASSETS
  },
  adform: {
    label: "Adform",
    manifest: "adform",
    clickTagCase: "both",
    clickMode: "basic",
    initialLoadCeilingBytes: 200000,
    totalLoadCeilingBytes: 2500000,
    maxInitialRequests: 20,
    politeLoad: true,
    retina: false,
    allowedAssetTypes: COMMON_ASSETS
  },
  amazon: {
    label: "Amazon DSP",
    manifest: null,
    clickTagCase: "lowercase",
    clickMode: "basic",
    initialLoadCeilingBytes: 200000,
    totalLoadCeilingBytes: 2500000,
    maxInitialRequests: 20,
    politeLoad: true,
    retina: true,
    retinaSizes: ["320x50", "414x125"],
    allowedAssetTypes: COMMON_ASSETS
  },
  cm360: {
    label: "Campaign Manager 360 (Studio)",
    manifest: null,
    clickTagCase: "lowercase",
    clickMode: "studio", // V1 — falls back to "basic" with a warning in MVP
    initialLoadCeilingBytes: 150000,
    totalLoadCeilingBytes: 2200000,
    maxInitialRequests: 15,
    politeLoad: true,
    retina: false,
    allowedAssetTypes: COMMON_ASSETS
  },
  sizmek: {
    label: "Sizmek by Amazon Ads",
    manifest: null,
    clickTagCase: "lowercase",
    clickMode: "sizmek", // V1 — falls back to "basic" with a warning in MVP
    initialLoadCeilingBytes: 200000,
    totalLoadCeilingBytes: 2500000,
    maxInitialRequests: 20,
    politeLoad: true,
    retina: false,
    allowedAssetTypes: COMMON_ASSETS
  },
  xandr: {
    label: "Xandr (formerly AppNexus)",
    manifest: null,
    clickTagCase: "both",
    clickMode: "xandr", // V1 — falls back to "basic" with a warning in MVP
    initialLoadCeilingBytes: 200000,
    totalLoadCeilingBytes: 2500000,
    maxInitialRequests: 20,
    politeLoad: true,
    retina: false,
    allowedAssetTypes: COMMON_ASSETS
  }
};

export function getNetwork(name) {
  const n = NETWORKS[name];
  if (!n) {
    throw new Error(
      `Unknown network "${name}". Supported: ${Object.keys(NETWORKS).join(", ")}`
    );
  }
  return { key: name, ...n };
}

/**
 * Resolve clickMode for a network, falling back to "basic" when the requested
 * wrapper isn't yet implemented (CM360 Studio, Sizmek, Xandr wrappers are V1).
 */
export function resolveClickMode(network) {
  const mode = network.clickMode || "basic";
  const implemented = new Set(["basic"]);
  if (!implemented.has(mode)) {
    console.warn(
      `[networks] ${network.key} clickMode="${mode}" not yet implemented; ` +
      `falling back to basic dual-global. Tier 1 Feature Brief #1 tracks this.`
    );
    return "basic";
  }
  return mode;
}

/**
 * Adform manifest shape. Dropped at zip root as manifest.json.
 */
export function adformManifest({ width, height, clickUrl, campaignName }) {
  return {
    version: "1.0",
    title: `${campaignName} ${width}x${height}`,
    description: `${campaignName} display banner ${width}x${height}`,
    width,
    height,
    events: { enabled: true, list: { 1: { name: "clickTag", type: "interaction" } } },
    clicktags: { clickTag: clickUrl },
    source: "index.html"
  };
}
