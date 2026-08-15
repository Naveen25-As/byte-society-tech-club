// =========================================================
// BYTE SOCIETY — script.js
// =========================================================

document.addEventListener('DOMContentLoaded', () => {
  initNavbarScrollState();
  initScrollSpy();
  initHeroTyping();
  initStatCounters();
  initContactFormValidation();
  initBackToTop();
});

/* ---------- Navbar background on scroll ---------- */
function initNavbarScrollState() {
  const nav = document.getElementById('mainNav');
  if (!nav) return;

  const update = () => {
    if (window.scrollY > 12) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  };
  update();
  window.addEventListener('scroll', update, { passive: true });
}

/* ---------- Highlight active nav link based on section in view ---------- */
function initScrollSpy() {
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.navbar-nav .nav-link[href^="#"]');
  if (!sections.length || !navLinks.length) return;

  const linkFor = (id) => [...navLinks].find(a => a.getAttribute('href') === `#${id}`);

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const link = linkFor(entry.target.id);
      if (!link) return;
      if (entry.isIntersecting) {
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

  sections.forEach(sec => observer.observe(sec));
}

/* ---------- Hero terminal: typewriter effect ---------- */
function initHeroTyping() {
  const output = document.getElementById('typedLine');
  const cursor = document.getElementById('blinkCursor');
  if (!output) return;

  const message = 'a student who ships things';
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    output.textContent = message;
    return;
  }

  let i = 0;
  const type = () => {
    if (i <= message.length) {
      output.textContent = message.slice(0, i);
      i++;
      setTimeout(type, 45);
    } else if (cursor) {
      // idle blink continues via CSS animation on #blinkCursor
      cursor.textContent = '';
    }
  };

  // Start after a short delay so the "$ whoami" line reads first
  setTimeout(type, 600);
}

/* ---------- Animated stat counters (members / projects / events) ---------- */
function initStatCounters() {
  const counters = document.querySelectorAll('.stat-num[data-count]');
  if (!counters.length) return;

  const animate = (el) => {
    const target = parseInt(el.getAttribute('data-count'), 10) || 0;
    const duration = 1200;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      el.textContent = Math.round(eased * target);
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target;
      }
    };
    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animate(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });

  counters.forEach(c => observer.observe(c));
}

/* ---------- Contact form: Bootstrap-style client-side validation ---------- */
function initContactFormValidation() {
  const form = document.getElementById('contactForm');
  const successMsg = document.getElementById('formSuccess');
  if (!form) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!form.checkValidity()) {
      form.classList.add('was-validated');
      successMsg?.classList.add('d-none');
      return;
    }

    // No backend wired up — simulate a successful send.
    form.classList.add('was-validated');
    successMsg?.classList.remove('d-none');
    form.reset();
    form.classList.remove('was-validated');

    setTimeout(() => successMsg?.classList.add('d-none'), 6000);
  });
}

/* ---------- Back to top button ---------- */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
