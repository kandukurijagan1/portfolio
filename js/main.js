/**
 * Main Portfolio Application Script
 * Theme toggle, navigation, scroll-spy, back-to-top progress
 */

document.addEventListener("DOMContentLoaded", () => {
  initThemeToggle();
  initHeaderScroll();
  initMobileMenu();
  initScrollSpy();
  initBackToTop();
  initCurrentYear();
  initPhotoLightbox();
  initSEODynamicSync();
});

/**
 * 1. Dark / Light Theme Toggle with LocalStorage Persistence
 */
function initThemeToggle() {
  const themeToggleBtns = document.querySelectorAll(".theme-toggle-btn");
  const storedTheme = localStorage.getItem("portfolio-theme");

  // Default to the signature dark theme matching the inspiration UI
  let currentTheme = storedTheme ? storedTheme : "dark";

  document.documentElement.setAttribute("data-theme", currentTheme);

  themeToggleBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const activeTheme = document.documentElement.getAttribute("data-theme");
      const nextTheme = activeTheme === "dark" ? "light" : "dark";

      document.documentElement.setAttribute("data-theme", nextTheme);
      localStorage.setItem("portfolio-theme", nextTheme);

      // Trigger subtle transition class
      document.body.classList.add("theme-transition");
      setTimeout(() => document.body.classList.remove("theme-transition"), 500);
    });
  });
}

/**
 * 2. Sticky Header with Scroll Glassmorphism
 */
function initHeaderScroll() {
  const header = document.querySelector(".site-header");
  if (!header) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 40) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  }, { passive: true });
}

/**
 * 3. Mobile Navigation Drawer & Toggle
 */
function initMobileMenu() {
  const toggleBtn = document.querySelector(".mobile-nav-toggle");
  const drawer = document.querySelector(".mobile-nav-drawer");
  const navLinks = document.querySelectorAll(".mobile-nav-link");

  if (!toggleBtn || !drawer) return;

  function toggleMenu() {
    const isOpen = drawer.classList.contains("open");
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  function openMenu() {
    toggleBtn.classList.add("active");
    toggleBtn.setAttribute("aria-expanded", "true");
    drawer.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeMenu() {
    toggleBtn.classList.remove("active");
    toggleBtn.setAttribute("aria-expanded", "false");
    drawer.classList.remove("open");
    document.body.style.overflow = "";
  }

  toggleBtn.addEventListener("click", toggleMenu);

  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      closeMenu();
    });
  });

  // Close when clicking outside drawer
  document.addEventListener("click", e => {
    if (drawer.classList.contains("open") && !drawer.contains(e.target) && !toggleBtn.contains(e.target)) {
      closeMenu();
    }
  });
}

/**
 * 4. Scroll Spy: Active Navigation Link Highlighting
 */
function initScrollSpy() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link, .mobile-nav-link");

  if (sections.length === 0 || navLinks.length === 0) return;

  function highlightNav() {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 140;
      const sectionId = section.getAttribute("id");

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove("active");
          if (link.getAttribute("href") === `#${sectionId}`) {
            link.classList.add("active");
          }
        });
      }
    });
  }

  window.addEventListener("scroll", highlightNav, { passive: true });
  highlightNav(); // Run once on load
}

/**
 * 5. Back-to-Top Button with Circular SVG Scroll Progress Ring
 */
function initBackToTop() {
  const backToTopBtn = document.getElementById("back-to-top");
  const progressCircle = document.querySelector(".scroll-progress-circle");

  if (!backToTopBtn) return;

  const totalLength = 145; // Circumference for r=23: 2 * pi * 23 ≈ 144.5

  window.addEventListener("scroll", () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercent = scrollTop / (docHeight || 1);

    if (scrollTop > 400) {
      backToTopBtn.classList.add("visible");
    } else {
      backToTopBtn.classList.remove("visible");
    }

    if (progressCircle) {
      const offset = totalLength - (scrollPercent * totalLength);
      progressCircle.style.strokeDashoffset = offset;
    }
  }, { passive: true });

  backToTopBtn.addEventListener("click", e => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
}

/**
 * 6. Dynamic Current Year in Footer
 */
function initCurrentYear() {
  const yearEl = document.getElementById("current-year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

/**
 * 7. Photo Enlargement Lightbox Modal
 */
function initPhotoLightbox() {
  const heroTrigger = document.getElementById("hero-photo-trigger");
  const aboutTrigger = document.getElementById("about-photo-trigger");
  const modal = document.getElementById("photo-lightbox-modal");
  const closeBtn = document.getElementById("lightbox-close-btn");

  if (!modal) return;

  function openLightbox() {
    modal.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    modal.classList.remove("open");
    document.body.style.overflow = "";
  }

  const heroCard = document.getElementById("hero-photo-card");
  if (heroCard) {
    heroCard.addEventListener("click", (e) => {
      if (e.target.closest(".floating-photo-badge")) return;
      openLightbox();
    });
  } else if (heroTrigger) {
    heroTrigger.addEventListener("click", openLightbox);
  }

  if (aboutTrigger) {
    aboutTrigger.addEventListener("click", openLightbox);
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", closeLightbox);
  }

  modal.addEventListener("click", e => {
    if (e.target === modal) {
      closeLightbox();
    }
  });

  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && modal.classList.contains("open")) {
      closeLightbox();
    }
  });
}



/**
 * 8. Dynamic Production Canonical & Meta Sync (Custom Domain & Preview Compatibility)
 */
function initSEODynamicSync() {
  if (window.location.protocol === 'https:' && window.location.hostname !== 'localhost') {
    const origin = window.location.origin;
    const canonicalLink = document.querySelector('link[rel="canonical"]');
    if (canonicalLink && !canonicalLink.getAttribute('href').startsWith(origin)) {
      canonicalLink.setAttribute('href', origin + '/');
    }
  }
}
