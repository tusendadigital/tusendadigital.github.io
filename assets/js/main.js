/*
  Tu Senda Digital - interactions
  - Mobile menu toggle
  - Matrix effect in hero (subtle)
  - Contact form demo submit
*/

(function () {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Mobile menu
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const mobileMenu = document.getElementById("mobileMenu");

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener("click", () => {
      const isOpen = mobileMenuBtn.getAttribute("aria-expanded") === "true";
      mobileMenuBtn.setAttribute("aria-expanded", String(!isOpen));
      mobileMenu.classList.toggle("hidden", isOpen);
    });

    // Close on navigation click
    mobileMenu.querySelectorAll("a[href^='#']").forEach((a) => {
      a.addEventListener("click", () => {
        mobileMenuBtn.setAttribute("aria-expanded", "false");
        mobileMenu.classList.add("hidden");
      });
    });
  }

  // Contact form (demo): prevents navigation and shows a status.
  const form = document.getElementById("contactForm");
  const formStatus = document.getElementById("formStatus");
  if (form && formStatus) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      formStatus.classList.remove("hidden");
      formStatus.textContent =
        "Recibido. Este formulario es demo (estático). Conecta tu endpoint o email y quedará listo.";
    });
  }

  // Matrix effect (subtle, lightweight)
  const canvas = document.getElementById("matrix");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const dpr = Math.max(1, Math.floor(window.devicePixelRatio || 1));
  const chars =
    "01ABCDEFGHIJKLMNOPQRSTUVWXYZ#$%&*+<>/\\[]{}()".split("");

  let width = 0;
  let height = 0;
  let columns = 0;
  let drops = [];
  const fontSize = 14;

  function resize() {
    width = Math.floor(window.innerWidth || document.documentElement.clientWidth || 0);
    height = Math.floor(window.innerHeight || document.documentElement.clientHeight || 0);

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    columns = Math.max(1, Math.floor(width / fontSize));
    drops = new Array(columns).fill(0).map(() => Math.random() * height);
  }

  resize();
  window.addEventListener("resize", resize);

  let last = 0;
  const fps = 30;
  const frameMs = 1000 / fps;

  function draw(ts) {
    if (ts - last < frameMs) {
      requestAnimationFrame(draw);
      return;
    }
    last = ts;

    // Fading background for trailing effect
    ctx.fillStyle = "rgba(10, 10, 10, 0.10)";
    ctx.fillRect(0, 0, width, height);

    ctx.font = `600 ${fontSize}px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace`;

    for (let i = 0; i < drops.length; i++) {
      const text = chars[(Math.random() * chars.length) | 0];
      const x = i * fontSize;
      const y = drops[i];

      // A touch of neon + occasional electric
      const isElectric = Math.random() < 0.04;
      ctx.fillStyle = isElectric ? "rgba(139,92,246,0.75)" : "rgba(0,255,65,0.55)";
      ctx.fillText(text, x, y);

      drops[i] = y + fontSize * (0.9 + Math.random() * 0.6);
      if (drops[i] > height + 40 && Math.random() > 0.975) {
        drops[i] = -Math.random() * 120;
      }
    }

    requestAnimationFrame(draw);
  }

  // Respect reduced motion
  const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)");
  if (reduceMotion && reduceMotion.matches) {
    ctx.clearRect(0, 0, width, height);
    return;
  }

  requestAnimationFrame(draw);
})();
