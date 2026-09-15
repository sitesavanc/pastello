(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Ano no rodapé */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* Header: sombra/fundo ao rolar */
  var header = document.querySelector(".site-header");
  var onScroll = function () {
    if (window.scrollY > 12) header.classList.add("is-scrolled");
    else header.classList.remove("is-scrolled");
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* Logo: clicar sempre volta ao topo da página */
  var brandLink = document.querySelector(".brand");
  if (brandLink) {
    brandLink.addEventListener("click", function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    });
  }

  /* Menu mobile */
  var hamburger = document.getElementById("hamburger");
  var nav = document.getElementById("main-nav");
  if (hamburger && nav) {
    var closeNav = function () {
      hamburger.setAttribute("aria-expanded", "false");
      hamburger.setAttribute("aria-label", "Abrir menu");
      nav.classList.remove("is-open");
    };
    hamburger.addEventListener("click", function () {
      var expanded = hamburger.getAttribute("aria-expanded") === "true";
      hamburger.setAttribute("aria-expanded", String(!expanded));
      hamburger.setAttribute("aria-label", expanded ? "Abrir menu" : "Fechar menu");
      nav.classList.toggle("is-open");
    });
    nav.addEventListener("click", function (e) {
      if (e.target.tagName === "A") closeNav();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeNav();
    });
  }

  /* Filtro de categorias do cardápio */
  var filterChips = document.querySelectorAll(".chip[data-filter]");
  var productCards = document.querySelectorAll("#product-grid .product-card");
  var groupHeadings = document.querySelectorAll("#product-grid .menu-group-heading");
  var salgadosCats = ["simples", "especiais"];
  filterChips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      filterChips.forEach(function (c) {
        c.classList.remove("is-active");
        c.setAttribute("aria-selected", "false");
      });
      chip.classList.add("is-active");
      chip.setAttribute("aria-selected", "true");
      var filter = chip.getAttribute("data-filter");
      productCards.forEach(function (card) {
        var show = filter === "todos" || card.getAttribute("data-cat") === filter;
        card.classList.toggle("is-hidden", !show);
      });
      groupHeadings.forEach(function (heading) {
        var group = heading.getAttribute("data-group");
        var show =
          filter === "todos" ||
          (group === "salgados" && salgadosCats.indexOf(filter) !== -1) ||
          (group === "doces" && filter === "doces");
        heading.classList.toggle("is-hidden", !show);
      });
    });
  });

  /* Acordeon do FAQ */
  var triggers = document.querySelectorAll(".accordion-trigger");
  triggers.forEach(function (btn) {
    var panel = btn.closest(".accordion-item").querySelector(".accordion-panel");
    panel.style.maxHeight = "0px";
    btn.addEventListener("click", function () {
      var isOpen = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", String(!isOpen));
      panel.style.maxHeight = isOpen ? "0px" : panel.scrollHeight + "px";
    });
  });

  /* Parallax leve na seção "O pastel é Pastello" */
  var parallaxEls = document.querySelectorAll("[data-parallax]");
  if (parallaxEls.length && !reduceMotion) {
    var pTicking = false;
    var updateParallax = function () {
      var vh = window.innerHeight;
      parallaxEls.forEach(function (el) {
        var speed = parseFloat(el.getAttribute("data-parallax")) || 0;
        var rect = el.getBoundingClientRect();
        var centerOffset = (rect.top + rect.height / 2) - vh / 2;
        var translate = centerOffset * -0.14 * speed;
        el.style.setProperty("--py", translate.toFixed(1) + "px");
      });
      pTicking = false;
    };
    window.addEventListener(
      "scroll",
      function () {
        if (!pTicking) {
          requestAnimationFrame(updateParallax);
          pTicking = true;
        }
      },
      { passive: true }
    );
    updateParallax();
  }

  /* Reveal on scroll */
  var revealEls = document.querySelectorAll("[data-reveal]");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    revealEls.forEach(function (el) {
      var delay = el.getAttribute("data-reveal-delay");
      if (delay) el.style.setProperty("--reveal-delay", delay);
    });
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  }
})();
