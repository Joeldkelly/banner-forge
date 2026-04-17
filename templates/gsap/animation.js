/* banner-forge — GSAP animation timeline.
 * Uses global gsap loaded from the inlined bundle. Configured from window.__BANNER__
 * which build.js writes before this script executes.
 *
 * Respects prefers-reduced-motion (WCAG 2.3.3) by short-circuiting the timeline
 * and jumping every animated element to its end state.
 */
(function () {
  "use strict";
  var cfg = window.__BANNER__ || {};
  var loops = Math.max(1, Math.min(3, cfg.loops || 3));
  var scenes = cfg.scenes || [];

  // prefers-reduced-motion — skip animation, show final composition.
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    if (window.gsap) {
      gsap.set(["#logo", "#headline", "#subhead", "#cta", "#legal"], { opacity: 1, y: 0, scale: 1 });
      if (document.getElementById("hero")) gsap.set("#hero", { scale: 1 });
    }
    window.__BANNER_READY__ = true;
    window.__BANNER_FINAL__ = function () {};
    return;
  }

  var tl = gsap.timeline({
    repeat: loops - 1,
    defaults: { ease: "power3.out", duration: 0.6 },
    onComplete: function () {
      // Park on final frame so the Puppeteer backup-image capture is deterministic.
      gsap.set(["#logo", "#headline", "#subhead", "#cta", "#legal"], { opacity: 1, y: 0, scale: 1 });
    }
  });

  if (document.getElementById("hero")) {
    tl.from("#hero", { scale: 1.06, duration: 0.9, ease: "power2.out" }, 0);
  }

  var t = 0;
  scenes.forEach(function (scene, i) {
    var dur = (scene.durationMs || 1500) / 1000;
    var target = "#" + (scene.id || "headline");
    var startEase = scene.transition || "fade";

    if (startEase === "slide-up") {
      tl.fromTo(target, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.55 }, t);
    } else if (startEase === "slide-down") {
      tl.fromTo(target, { opacity: 0, y: -12 }, { opacity: 1, y: 0, duration: 0.55 }, t);
    } else if (startEase === "scale-in") {
      tl.fromTo(target, { opacity: 0, scale: 0.92 }, { opacity: 1, scale: 1, duration: 0.55, ease: "back.out(1.6)" }, t);
    } else if (startEase === "scale-out") {
      tl.fromTo(target, { opacity: 0, scale: 1.08 }, { opacity: 1, scale: 1, duration: 0.55 }, t);
    } else {
      tl.fromTo(target, { opacity: 0 }, { opacity: 1, duration: 0.55 }, t);
    }

    t += dur;
  });

  // Persistent UI: logo stays on once it enters.
  tl.to("#logo", { opacity: 1, duration: 0.4 }, 0.1);

  // Deterministic final-frame state for Puppeteer backup capture.
  window.__BANNER_READY__ = true;
  window.__BANNER_FINAL__ = function () {
    tl.progress(1);
  };
})();
