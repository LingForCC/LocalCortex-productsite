/* =================================================================
   LocalCortex — product site
   Vanilla JS, no dependencies. Handles: nav state, mobile menu,
   platform tabs, and scroll reveal.
   ================================================================= */
(function () {
  "use strict";

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
     Feature tab bar: solid background while pinned under the nav
     ---------------------------------------------------------------- */
  var tabsWrap = document.querySelector(".feature-tabs-wrap");
  var onTabsScroll = function () {
    if (!tabsWrap) return;
    var navH = parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue("--nav-h")
    ) || 64;
    // A sticky element's viewport top never passes its sticky offset,
    // so reaching it means the bar is pinned.
    tabsWrap.classList.toggle(
      "is-stuck",
      tabsWrap.getBoundingClientRect().top <= navH + 1
    );
  };
  onTabsScroll();
  window.addEventListener("scroll", onTabsScroll, { passive: true });
  window.addEventListener("resize", onTabsScroll);

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
     Feature audience tabs (For Human / For Agent)
     ---------------------------------------------------------------- */
  var featureTabs = document.querySelectorAll(".feature-tab");
  var featurePanels = document.querySelectorAll(".feature-panel");

  var setFeaturePanel = function (id) {
    featureTabs.forEach(function (t) {
      var on = t.getAttribute("aria-controls") === id;
      t.classList.toggle("is-active", on);
      t.setAttribute("aria-selected", on ? "true" : "false");
      t.setAttribute("tabindex", on ? "0" : "-1");
    });
    featurePanels.forEach(function (p) {
      p.hidden = p.id !== id;
      // Sections inside a hidden panel never intersect the reveal observer.
      if (!p.hidden) {
        p.querySelectorAll(".reveal:not(.is-visible)").forEach(function (el) {
          el.classList.add("is-visible");
        });
      }
    });
  };

  featureTabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      setFeaturePanel(tab.getAttribute("aria-controls"));
    });
  });

  // In-page links that target a section inside a panel activate that panel first.
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function () {
      var target = document.getElementById(a.getAttribute("href").slice(1));
      var panel = target ? target.closest(".feature-panel") : null;
      if (panel && panel.hidden) setFeaturePanel(panel.id);
      else if (target && target.classList.contains("feature-tabs")) {
        // The tab bar itself: return to the default (For Human) view.
        setFeaturePanel(featurePanels[0].id);
      }
    });
  });

  // On load, For Human is the default. A hash that points inside a panel
  // (e.g. #agent from the footer) activates that panel instead.
  var applyPanelFromHash = function () {
    var hash = window.location.hash.slice(1);
    var target = hash ? document.getElementById(hash) : null;
    var panel = target ? target.closest(".feature-panel") : null;
    setFeaturePanel(panel ? panel.id : featurePanels[0].id);
  };
  applyPanelFromHash();
  // Back/forward cache restores the previous panel state; re-apply the default.
  window.addEventListener("pageshow", function (e) {
    if (e.persisted) applyPanelFromHash();
  });

  /* ---------------------------------------------------------------
     Scroll reveal (respects prefers-reduced-motion)
     ---------------------------------------------------------------- */
  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var revealTargets = document.querySelectorAll(
    ".feature, .download, .hero__text, .hero__visual"
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
     Screenshots: pick up assets/screenshots/<data-shot>.{png,jpg,webp}
     Each figure keeps its placeholder until the file exists, so the
     page works out of the box and shows real screenshots as soon as
     they are dropped into assets/screenshots/.
     ---------------------------------------------------------------- */
  var shotFigs = document.querySelectorAll("figure[data-shot]");
  var shotExts = ["png", "jpg", "webp"];
  shotFigs.forEach(function (fig) {
    var name = fig.getAttribute("data-shot");
    var tryExt = function (i) {
      if (i >= shotExts.length) return;
      var probe = new Image();
      probe.onload = function () {
        var ph = fig.querySelector(".shot__placeholder");
        if (!ph) return;
        var img = document.createElement("img");
        img.src = probe.src;
        img.alt = fig.getAttribute("data-caption") || name;
        fig.replaceChild(img, ph);
      };
      probe.onerror = function () { tryExt(i + 1); };
      probe.src = "assets/screenshots/" + name + "." + shotExts[i];
    };
    tryExt(0);
  });

  /* ---------------------------------------------------------------
     Current year in footer
     ---------------------------------------------------------------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
