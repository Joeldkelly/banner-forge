---
tags: [domain, clicktag, ads]
---

# clickTag Pattern

The single most important piece of ad plumbing. Get it wrong and every click lands on the default page instead of the tracked URL. The fix is 40 bytes of JavaScript.

## The canonical snippet

```html
<script type="text/javascript">
  var clickTag = "https://example.com/landing";
  var clickTAG = clickTag; // legacy uppercase for TTD + Adform
</script>
```

Then on the click surface:

```html
<div id="banner" onclick="window.open(window.clickTag, '_blank')">…</div>
```

## Why two variables

- **Google Ads / DV360** read `clickTag` (lowercase).
- **The Trade Desk** — newer adapters read either; older ones read `clickTAG` (uppercase).
- **Adform** — both are required for full adapter compatibility.

One zip that passes all four networks = ship both globals, aliased to the same value. Total cost: 30 bytes.

## The rules that cost real money when you break them

1. **`var`, not `let`/`const`.** Trafficking systems string-match `var clickTag`. A `const` or `let` declaration fails some validators.

2. **Global scope.** The variable must be attached to `window`. Do **not** wrap it in an IIFE.

3. **String value, not a function.** Some agencies pass a function reference — fails trafficker review.

4. **`https://`, not `http://`.** Most networks reject http in 2026. `scripts/lib/config.js:validateConfig()` enforces this.

5. **Do not let a minifier rename the name.** `scripts/build.js` passes `clickTag`, `clickTAG`, and the banner globals to Terser's `reserved` list:
   ```js
   reserved: ["clickTag", "clickTAG", "__BANNER__", "__BANNER_READY__", "__BANNER_FINAL__", "gsap"]
   ```
   Do not remove that line without reading this note first.

6. **Use `window.open(window.clickTag, '_blank')`.** Not `location.href = clickTag`. The `_blank` target is what most networks expect; `location.href` opens inside the ad iframe which Safari blocks.

7. **One click target in MVP.** Multi-click is for expandables and rich-media only — out of scope.

## What breaks when you do it wrong

### If the minifier renames `clickTag` to `a`

The zip still runs in the designer's preview. At serve time, the network's ad server substitutes its tracked URL into the `clickTag` variable by name. If the name is `a`, the substitution is a no-op. The banner uses whatever URL was baked in at build time. You see:

- Huge impression volume.
- Zero tracked clicks.
- The advertiser thinks the creative is broken. It's not — the tracking is.

### If you use `let clickTag =`

Some networks' preflight checks regex-match `var\s+clickTag`. `let` misses. Zip rejected at upload.

### If you only ship `clickTag` (missing `clickTAG`)

The zip passes Google and DV360. When the traffic team uploads to TTD, it serves but some older adapters can't find the variable. Clicks on those adapters silently don't register. No error thrown. Hard to diagnose.

### If `clickTag = "http://..."` (not https)

Most networks' 2024+ reviewers reject. Some pass it through and the click works, but the user's browser blocks the redirect as insecure (mixed content). Invisible failure.

## banner-forge's enforcement

### At config time (`scripts/lib/config.js`)

- `campaign.clickUrl` required.
- Must match `/^https?:\/\//`.

### At build time (`scripts/build.js`)

- `clickTag`, `clickTAG`, and `__BANNER__` globals reserved from minification.
- Both variables written to every `index.html` regardless of network.

### At package time (`scripts/package.js`)

- Adform: `manifest.json` carries the `clickTag` → URL mapping in the `clicktags` block.

### At validate time (`scripts/validate.js`)

- `/\bvar\s+clickTag\s*=/` must match for every zip.
- For ttd and adform networks, `/\bvar\s+clickTAG\s*=/` must also match.
- Click URL must be non-empty and http(s).

## Multiple clickTags (V2)

Expandable / rich-media units use `clickTag1`, `clickTag2`, etc. Pattern extends:

```js
var clickTag1 = "https://example.com/panel-A";
var clickTag2 = "https://example.com/panel-B";
```

Each clickable element gets its own `onclick="window.open(window.clickTag1,'_blank')"`.

Out of MVP scope.

## Related

- [[Ad Networks]]
- [[Package Stage]]
- [[Validate Stage]]
- [[Build Stage]]
- [references/CLICKTAG.md](../references/CLICKTAG.md) — code-adjacent reference
