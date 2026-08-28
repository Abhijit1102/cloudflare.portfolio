/* ==========================================================================
   Abhijit Rajkumar — Portfolio
   scripts.js
   ========================================================================== */

/**
 * Components are pre-inlined directly into index.html by build.py, so this
 * file only wires up interactivity — no fetch() needed, which means the
 * site works by double-clicking index.html (no local server required).
 *
 * If you edit a file in components/, re-run `python3 build.py` to
 * regenerate index.html with your changes baked in.
 */
function init() {
  initNav();
  initResumeModal();
  initCertLightbox();
  initContactForm();
  initRevealAnimations();
  initFooterYear();
  initActiveLinkOnScroll();
}

/* ---------- Navbar: mobile toggle + close on link click ---------- */
function initNav() {
  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");
  if (!toggle || !links) return;

  toggle.addEventListener("click", () => links.classList.toggle("open"));

  links.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => links.classList.remove("open"));
  });

  document.addEventListener("click", (e) => {
    if (!links.contains(e.target) && !toggle.contains(e.target)) {
      links.classList.remove("open");
    }
  });
}

/* ---------- Highlight active nav link based on scroll position ---------- */
function initActiveLinkOnScroll() {
  const sections = document.querySelectorAll("main > div[id$='-root'] > section[id]");
  const navAnchors = document.querySelectorAll(".nav-links a");
  if (!sections.length || !navAnchors.length) return;

  const map = new Map();
  navAnchors.forEach((a) => map.set(a.getAttribute("href").replace("#", ""), a));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const link = map.get(entry.target.id);
        if (!link) return;
        if (entry.isIntersecting) {
          navAnchors.forEach((a) => a.classList.remove("active"));
          link.classList.add("active");
        }
      });
    },
    { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
  );

  sections.forEach((s) => observer.observe(s));
}

/* ---------- Resume modal (PDF viewer) ---------- */
function initResumeModal() {
  const modal = document.getElementById("resumeModal");
  const frame = document.getElementById("resumeFrame");
  const openers = [
    document.getElementById("openResumeBtn"),
    document.getElementById("openResumeBtnHero"),
  ].filter(Boolean);
  const closeBtn = document.getElementById("closeResumeBtn");
  if (!modal || !frame || !openers.length) return;

  const open = () => {
    frame.src = "assets/resume.pdf";
    modal.classList.add("open");
    document.body.style.overflow = "hidden";
  };
  const close = () => {
    modal.classList.remove("open");
    document.body.style.overflow = "";
    frame.src = "";
  };

  openers.forEach((btn) => btn.addEventListener("click", open));
  closeBtn?.addEventListener("click", close);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) close();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("open")) close();
  });
}

/* ---------- Certificate lightbox ---------- */
function initCertLightbox() {
  const lightbox = document.getElementById("certLightbox");
  const img = document.getElementById("certLightboxImg");
  const closeBtn = document.getElementById("certLightboxClose");
  if (!lightbox || !img) return;

  document.addEventListener("click", (e) => {
    const card = e.target.closest(".cert-card");
    if (!card) return;
    const src = card.getAttribute("data-cert");
    const title = card.getAttribute("data-title") || "Certificate";
    if (!src) return;
    img.src = src;
    img.alt = title;
    lightbox.classList.add("open");
    document.body.style.overflow = "hidden";
  });

  const close = () => {
    lightbox.classList.remove("open");
    document.body.style.overflow = "";
  };
  closeBtn?.addEventListener("click", close);
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) close();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lightbox.classList.contains("open")) close();
  });
}

/* ---------- Contact form → mailto ---------- */
function initContactForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const subject = form.subject.value.trim() || `Portfolio contact from ${name}`;
    const message = form.message.value.trim();

    const body = `Name: ${name}\nEmail: ${email}\n\n${message}`;
    const mailto = `mailto:abhijitrajkumar2@gmail.com?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    window.location.href = mailto;

    const note = document.getElementById("cf-note");
    if (note) note.textContent = "Opening your email client…";
  });
}

/* ---------- Scroll-reveal animation ---------- */
function initRevealAnimations() {
  const targets = document.querySelectorAll(".reveal");
  if (!targets.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  targets.forEach((t) => observer.observe(t));
}

/* ---------- Footer year ---------- */
function initFooterYear() {
  const el = document.getElementById("footerYear");
  if (el) el.textContent = new Date().getFullYear();
}

document.addEventListener("DOMContentLoaded", init);
