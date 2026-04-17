# clickTag implementation

One zip, every network. The dual-global pattern passes Google, DV360, TTD, and Adform.

## The canonical snippet

Place this in `<head>` before any other script:

```html
<script type="text/javascript">
  var clickTag = "https://example.com/landing";
  var clickTAG = clickTag; // legacy uppercase for TTD + Adform
</script>
```

On the clickable element:

```html
<div id="banner" onclick="window.open(window.clickTag, '_blank')">…</div>
```

## Rules that cost real money when you get them wrong

1. **`var`, not `let`/`const`.** Trafficking systems string-match `var clickTag`. A `const` or `let` declaration fails some validators.
2. **Global scope.** The variable must be attached to `window`. Do not wrap it in an IIFE.
3. **String, not function.** The variable's value is the URL string. Some agencies pass a function reference instead — that fails polite trafficker review.
4. **`https://`, not `http://`.** Most networks reject http in 2026. The config validator enforces this.
5. **Do not minify away the name.** `scripts/build.js` passes `clickTag` and `clickTAG` in Terser's `reserved` list. Do not remove that.
6. **Use `window.open(window.clickTag, '_blank')`.** Not `location.href =`. The `_blank` target is what most networks expect; `location.href` opens inside the iframe which Safari blocks.
7. **One click target.** Multiple clickTags (clickTag1, clickTag2) are for expandable/rich media only. The MVP uses a single clickTag.

## Why the dual global

- **Google Ads / DV360:** uses lowercase `clickTag` only. An extra `clickTAG` does no harm.
- **The Trade Desk:** legacy adapters read `clickTAG` (uppercase); modern adapters read either. Declare both to be safe.
- **Adform:** the `manifest.json` references the variable by name — match whatever the manifest declares. banner-forge writes `"clicktags": { "clickTag": "..." }` so we ship `clickTag` lowercase as the authoritative one, with `clickTAG` as an alias.

## Validation checks (scripts/validate.js)

- `/\bvar\s+clickTag\s*=/` must match in `index.html`.
- For networks `ttd` and `adform`, `/\bvar\s+clickTAG\s*=/` must also match.
- The RHS of the first assignment must be a non-empty `https?://` URL.
- For Adform, `manifest.json` must reference the same variable name.

## Multiple clickTags (future)

Expandable units and rich-media banners use `clickTag1`, `clickTag2`, etc. Out of MVP scope. When we add expandables (V2), the pattern extends:

```js
var clickTag1 = "https://example.com/panel-A";
var clickTag2 = "https://example.com/panel-B";
```

And each element gets its own `onclick`.

## What breaks when stripped

If a minifier renames `clickTag` to `a`, the zip still runs in a preview but the traffic team's ad-server substitution fails and every click lands on the default page. Symptom: huge impression volume with zero tracked clicks. That's why we reserve both names.
