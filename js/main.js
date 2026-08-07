/* =================================================================
   LocalCortex — product site
   Vanilla JS, no dependencies. Handles: nav state, mobile menu,
   platform tabs, scroll reveal, and the TestFlight link source-of-truth.
   ================================================================= */
(function () {
  "use strict";

  /* ---------------------------------------------------------------
     TESTFLIGHT / DOWNLOAD LINK — single source of truth.
     Change this ONE value and every [data-testflight] button updates.
     ---------------------------------------------------------------- */
  const TESTFLIGHT_URL = "#"; // <-- replace with your TestFlight / store URL

  document.querySelectorAll("[data-testflight]").forEach(function (el) {
    el.setAttribute("href", TESTFLIGHT_URL);
    // Make it visibly inert until a real URL is set.
    if (TESTFLIGHT_URL === "#") {
      el.setAttribute("aria-disabled", "true");
      el.style.cursor = "default";
    }
  });

  /* ---------------------------------------------------------------
     Nav: add shadow/border when scrolled
     ---------------------------------------------------------------- */
  var nav = document.getElementById("nav");
  var onScroll = function () {
    if (window.scrollY > 8) nav.classList.add("is-scrolled");
    else nav.classList.remove("is-scrolled");
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------------------------------------------------------------
     Mobile menu toggle
     ---------------------------------------------------------------- */
  var navToggle = document.getElementById("navToggle");
  var navMobile = document.getElementById("navMobile");

  var setMenu = function (open) {
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    if (open) { navMobile.hidden = false; }
    else { navMobile.hidden = true; }
  };
  navToggle.addEventListener("click", function () {
    setMenu(navToggle.getAttribute("aria-expanded") !== "true");
  });
  // Close on link click
  navMobile.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", function () { setMenu(false); });
  });
  // Close on Escape / resize to desktop
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") setMenu(false);
  });
  window.addEventListener("resize", function () {
    if (window.innerWidth > 720) setMenu(false);
  });

  /* ---------------------------------------------------------------
     Platform tabs (Mac / iPad-iPhone) on tabbed shots
     ---------------------------------------------------------------- */
  document.querySelectorAll(".shot--tabbed").forEach(function (shot) {
    var tabs = shot.querySelectorAll(".shot__tab");
    var panels = shot.querySelectorAll(".shot__panel");
    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        var target = tab.getAttribute("data-platform");
        tabs.forEach(function (t) {
          var on = t === tab;
          t.classList.toggle("is-active", on);
          t.setAttribute("aria-selected", on ? "true" : "false");
        });
        panels.forEach(function (p) {
          var on = p.getAttribute("data-panel") === target;
          p.classList.toggle("is-active", on);
          p.hidden = !on;
        });
      });
    });
  });

  /* ---------------------------------------------------------------
     Scroll reveal (respects prefers-reduced-motion)
     ---------------------------------------------------------------- */
  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var revealTargets = document.querySelectorAll(
    ".feature, .small-things, .download, .hero__text, .hero__visual"
  );
  if (prefersReduced || !("IntersectionObserver" in window)) {
    revealTargets.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    revealTargets.forEach(function (el) { el.classList.add("reveal"); });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0.05 });
    revealTargets.forEach(function (el) { io.observe(el); });
  }

  /* ---------------------------------------------------------------
     Current year in footer
     ---------------------------------------------------------------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
