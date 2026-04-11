(function () {
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".nav");
  var body = document.body;

  var closeMenu = function () {
    if (!nav || !toggle) return;
    nav.classList.remove("is-open");
    body.classList.remove("nav-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Apri menu");
  };

  if (toggle && nav) {
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

  document.querySelectorAll('a.brand[href="#top"], a.nav__logo[href="#top"]').forEach(function (link) {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
      if (window.history && window.history.replaceState) {
        var path = window.location.pathname + window.location.search;
        window.history.replaceState(null, "", path);
      }
      closeMenu();
    });
  });

  (function initGalleryMasonry() {
    var strip = document.querySelector("#gallery .gallery__strip");
    if (!strip || typeof Masonry === "undefined" || typeof imagesLoaded === "undefined") return;

    var msnry = new Masonry(strip, {
      itemSelector: ".gallery__item",
      columnWidth: ".gallery__sizer",
      percentPosition: true,
      gutter: 0,
      horizontalOrder: true,
      transitionDuration: 0,
    });

    imagesLoaded(strip, function () {
      msnry.layout();
    });

    var resizeTimer;
    window.addEventListener(
      "resize",
      function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
          msnry.layout();
        }, 150);
      },
      { passive: true }
    );
  })();

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
      var inner = el.querySelector(".hero__bg, .split__img, .split__img-split, .parallax-cta__bg");
      if (inner) {
        inner.style.transform = "translate3d(0, " + shift.toFixed(2) + "px, 0)";
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
