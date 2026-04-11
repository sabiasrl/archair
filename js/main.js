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

  (function initLightbox() {
    var strip = document.querySelector("#gallery .gallery__strip");
    var lightbox = document.getElementById("lightbox");
    if (!strip || !lightbox) return;

    var imgs = Array.prototype.slice.call(
      strip.querySelectorAll("figure.gallery__item > img")
    );
    if (!imgs.length) return;

    var imgEl = lightbox.querySelector(".lightbox__img");
    var closeBtn = lightbox.querySelector(".lightbox__close");
    var prevBtn = lightbox.querySelector(".lightbox__nav--prev");
    var nextBtn = lightbox.querySelector(".lightbox__nav--next");
    var counter = lightbox.querySelector(".lightbox__counter");
    var stage = lightbox.querySelector(".lightbox__stage");

    var index = 0;
    var touchStartX = null;
    var lastFocus = null;

    function updateImage() {
      var item = imgs[index];
      if (!item || !imgEl || !counter) return;
      imgEl.src = item.currentSrc || item.src;
      imgEl.alt = item.alt || "";
      counter.textContent = index + 1 + " / " + imgs.length;
    }

    function openAt(i) {
      index = ((i % imgs.length) + imgs.length) % imgs.length;
      lastFocus = document.activeElement;
      updateImage();
      lightbox.hidden = false;
      document.body.classList.add("lightbox-open");
      if (closeBtn) closeBtn.focus();
    }

    function close() {
      lightbox.hidden = true;
      document.body.classList.remove("lightbox-open");
      if (imgEl) imgEl.removeAttribute("src");
      if (lastFocus && typeof lastFocus.focus === "function") {
        try {
          lastFocus.focus();
        } catch (e) {
          /* ignore */
        }
      }
    }

    function showNext() {
      index = (index + 1) % imgs.length;
      updateImage();
    }

    function showPrev() {
      index = (index - 1 + imgs.length) % imgs.length;
      updateImage();
    }

    imgs.forEach(function (img, i) {
      var fig = img.closest("figure");
      if (!fig) return;
      fig.classList.add("gallery__item--lightbox");
      fig.setAttribute("role", "button");
      fig.setAttribute("tabindex", "0");
      var label = img.alt ? "Apri immagine: " + img.alt : "Apri immagine a schermo intero";
      fig.setAttribute("aria-label", label);
      fig.addEventListener("click", function () {
        openAt(i);
      });
      fig.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openAt(i);
        }
      });
    });

    if (closeBtn) closeBtn.addEventListener("click", close);
    if (prevBtn) prevBtn.addEventListener("click", showPrev);
    if (nextBtn) nextBtn.addEventListener("click", showNext);

    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) close();
    });

    if (stage) {
      stage.addEventListener("click", function (e) {
        if (e.target === stage) close();
      });

      stage.addEventListener(
        "touchstart",
        function (e) {
          touchStartX = e.changedTouches[0].clientX;
        },
        { passive: true }
      );

      stage.addEventListener(
        "touchend",
        function (e) {
          if (touchStartX === null) return;
          var dx = e.changedTouches[0].clientX - touchStartX;
          touchStartX = null;
          if (Math.abs(dx) < 48) return;
          if (dx > 0) showPrev();
          else showNext();
        },
        { passive: true }
      );

      stage.addEventListener("touchcancel", function () {
        touchStartX = null;
      });
    }

    window.addEventListener("keydown", function (e) {
      if (lightbox.hidden) return;
      if (e.key === "Escape") {
        e.preventDefault();
        close();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        showNext();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        showPrev();
      }
    });
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
