(function () {
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".nav");
  var body = document.body;
  if (toggle && nav) {
    var closeMenu = function () {
      nav.classList.remove("is-open");
      body.classList.remove("nav-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Apri menu");
    };

    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      body.classList.toggle("nav-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Chiudi menu" : "Apri menu");
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        closeMenu();
      });
    });

    window.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && nav.classList.contains("is-open")) {
        closeMenu();
      }
    });
  }

  var prefersReduced =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReduced) return;

  var layers = document.querySelectorAll("[data-parallax]");
  if (!layers.length) return;

  var ticking = false;

  function updateParallax() {
    var vh = window.innerHeight || 1;
    layers.forEach(function (el) {
      var rate = parseFloat(el.getAttribute("data-parallax"), 10);
      if (isNaN(rate)) rate = 0.2;
      var rect = el.getBoundingClientRect();
      var centerOffset = (rect.top + rect.height / 2 - vh / 2) / vh;
      var shift = centerOffset * rate * 80;
      var inner = el.querySelector(".hero__bg, .split__img, .parallax-cta__bg");
      if (inner) {
        inner.style.transform = "translate3d(0, " + shift.toFixed(2) + "px, 0)";
      } else if (el.classList.contains("gallery__strip")) {
        el.style.transform = "translate3d(0, " + (shift * 0.5).toFixed(2) + "px, 0)";
      }
    });
    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(updateParallax);
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  updateParallax();
})();
