/* banner-forge — per-network packaging rules.
 * package.js reads this to decide manifest shape, clickTag case, polite-load, retina.
 */

export const NETWORKS = {
  google: {
    label: "Google Ads / Google Display Network",
    manifest: null,
    clickTagCase: "lowercase",
    initialLoadCeilingBytes: 150000,
    totalLoadCeilingBytes: 2200000,
    politeLoad: true,
    retina: false,
    allowedAssetTypes: ["html", "css", "js", "jpg", "jpeg", "png", "gif", "svg", "woff", "woff2"]
  },
  dv360: {
    label: "Display & Video 360",
    manifest: null,
    clickTagCase: "lowercase",
    initialLoadCeilingBytes: 150000,
    totalLoadCeilingBytes: 2200000,
    politeLoad: true,
    retina: false,
    allowedAssetTypes: ["html", "css", "js", "jpg", "jpeg", "png", "gif", "svg", "woff", "woff2"]
  },
  ttd: {
    label: "The Trade Desk",
    manifest: null,
    clickTagCase: "both",
    initialLoadCeilingBytes: 200000,
    totalLoadCeilingBytes: 2500000,
    politeLoad: true,
    retina: false,
    allowedAssetTypes: ["html", "css", "js", "jpg", "jpeg", "png", "gif", "svg", "woff", "woff2"]
  },
  adform: {
    label: "Adform",
    manifest: "adform",
    clickTagCase: "both",
    initialLoadCeilingBytes: 200000,
    totalLoadCeilingBytes: 2500000,
    politeLoad: true,
    retina: false,
    allowedAssetTypes: ["html", "css", "js", "jpg", "jpeg", "png", "gif", "svg", "woff", "woff2"]
  },
  amazon: {
    label: "Amazon DSP",
    manifest: null,
    clickTagCase: "lowercase",
    initialLoadCeilingBytes: 200000,
    totalLoadCeilingBytes: 2500000,
    politeLoad: true,
    retina: true,
    retinaSizes: ["320x50", "414x125"],
    allowedAssetTypes: ["html", "css", "js", "jpg", "jpeg", "png", "gif", "svg", "woff", "woff2"]
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
