/* banner-forge — tiny mustache-ish template engine.
 * Supports {{var}}, {{obj.path}}, and {{#if key}}...{{/if}} blocks.
 * Kept dependency-free to keep bundles small.
 */

export function render(tpl, data) {
  // Handle {{#if key}}...{{/if}} blocks first (non-greedy, allow nested blocks with distinct keys).
  let out = tpl.replace(/\{\{#if ([\w.]+)\}\}([\s\S]*?)\{\{\/if\}\}/g, (_, key, body) => {
    const value = resolve(data, key);
    return value ? body : "";
  });

  // Then {{var}} and {{obj.path}} interpolation.
  out = out.replace(/\{\{([\w.]+)\}\}/g, (_, key) => {
    const value = resolve(data, key);
    if (value === undefined || value === null) return "";
    return escapeHtml(String(value));
  });

  return out;
}

function resolve(obj, path) {
  return path.split(".").reduce((acc, k) => (acc == null ? undefined : acc[k]), obj);
}

function escapeHtml(s) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Interpolate into CSS/JS without HTML-escaping (for use in <style> and <script> content
 * that we've already prepared ourselves — user-derived strings should be escaped by caller).
 */
export function renderRaw(tpl, data) {
  let out = tpl.replace(/\{\{#if ([\w.]+)\}\}([\s\S]*?)\{\{\/if\}\}/g, (_, key, body) => {
    return resolve(data, key) ? body : "";
  });
  out = out.replace(/\{\{([\w.]+)\}\}/g, (_, key) => {
    const v = resolve(data, key);
    return v == null ? "" : String(v);
  });
  return out;
}
