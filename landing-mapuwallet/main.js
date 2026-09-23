(function () {
  "use strict";

  var $ = function (selector, scope) { return (scope || document).querySelector(selector); };
  var $$ = function (selector, scope) { return Array.prototype.slice.call((scope || document).querySelectorAll(selector)); };
  var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function safe(fn, name) {
    try { fn(); } catch (error) { console.warn("[" + name + "] failed", error); }
  }

  function initSplash() {
    var splash = $("[data-splash]");
    if (!splash) return;
    var hide = function () { splash.classList.add("is-out"); };
    if (document.readyState === "complete") window.setTimeout(hide, 400);
    else window.addEventListener("load", function () { window.setTimeout(hide, 380); }, { once: true });
    window.setTimeout(hide, 4000);
  }

  function initHeader() {
    var header = $("[data-header]");
    if (!header) return;
    var update = function () { header.classList.toggle("is-solid", window.scrollY > 28); };
    update();
    window.addEventListener("scroll", update, { passive: true });
  }

  function initMenu() {
    var button = $("[data-menu-toggle]");
    var menu = $("[data-menu]");
    if (!button || !menu) return;
    var close = function () {
      button.classList.remove("is-open");
      menu.classList.remove("is-open");
      button.setAttribute("aria-expanded", "false");
    };
    button.addEventListener("click", function () {
      var open = !button.classList.contains("is-open");
      button.classList.toggle("is-open", open);
      menu.classList.toggle("is-open", open);
      button.setAttribute("aria-expanded", String(open));
    });
    $$("a", menu).forEach(function (link) { link.addEventListener("click", close); });
  }

  function initSmoothScroll() {
    document.addEventListener("click", function (event) {
      var link = event.target.closest('a[href^="#"]');
      if (!link) return;
      var target = $(link.getAttribute("href"));
      if (!target) return;
      event.preventDefault();
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 72, behavior: reduced ? "auto" : "smooth" });
    });
  }

  function initMouseGradient() {
    var hero = $("[data-mouse-gradient]");
    if (!hero || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    hero.addEventListener("mousemove", function (event) {
      var rect = hero.getBoundingClientRect();
      var x = ((event.clientX - rect.left) / rect.width) * 100;
      var y = ((event.clientY - rect.top) / rect.height) * 100;
      hero.style.setProperty("--mx", x + "%");
      hero.style.setProperty("--my", y + "%");
    });
  }

  function initReveals() {
    var targets = $$('[data-reveal]:not(.is-visible)');
    if (!targets.length) return;
    if (!("IntersectionObserver" in window)) {
      targets.forEach(function (item) { item.classList.add("is-visible"); });
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.03, rootMargin: "0px 0px -2% 0px" });
    targets.forEach(function (item) { observer.observe(item); });
    window.setTimeout(function () {
      targets.forEach(function (item) {
        if (item.getBoundingClientRect().top < window.innerHeight) item.classList.add("is-visible");
      });
    }, 6000);
  }

  function initFormPreview() {
    var form = $("[data-demo-form]");
    var note = $("[data-form-note]");
    if (!form || !note) return;
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      if (!form.reportValidity()) return;
      note.textContent = "Gracias. El formulario ya está listo; conectaremos el correo comercial para recibir solicitudes reales.";
      note.classList.add("is-sent");
      form.reset();
    });
  }

  function initJourneyMap() {
    var nodes = $$('[data-journey-node]');
    var detail = $('[data-journey-detail]');
    if (!nodes.length || !detail) return;
    var show = function (node) {
      nodes.forEach(function (item) { item.classList.toggle('is-active', item === node); });
      detail.innerHTML = '<p>' + node.getAttribute('data-title') + '</p><strong>' + node.getAttribute('data-detail') + '</strong>';
    };
    nodes.forEach(function (node) {
      node.addEventListener('click', function () { show(node); });
      node.addEventListener('focus', function () { show(node); });
    });
  }

  function initYear() {
    $$('[data-year]').forEach(function (node) { node.textContent = String(new Date().getFullYear()); });
  }

  function boot() {
    safe(initSplash, "initSplash");
    safe(initHeader, "initHeader");
    safe(initMenu, "initMenu");
    safe(initSmoothScroll, "initSmoothScroll");
    safe(initMouseGradient, "initMouseGradient");
    safe(initReveals, "initReveals");
    safe(initFormPreview, "initFormPreview");
    safe(initJourneyMap, "initJourneyMap");
    safe(initYear, "initYear");
    document.documentElement.classList.add("is-ready");
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
