/**
 * Portfolio Animations & Advanced Interactive Effects:
 * 1. Top Viewport Scroll Progress Bar
 * 2. Dynamic Typewriter Effect for Hero Headline
 * 3. IntersectionObserver Scroll Reveals
 * 4. 3D Card Tilt on Hover
 * 5. Card Spotlight Mouse Glow (Linear / Vercel style)
 * 6. Magnetic Spring Attraction for Buttons & Interactive Icons
 * 7. Tactile Click Ripple Wave Effect
 * 8. Animated Metric Counter Roll (CountUp on Scroll)
 * 9. Cyber Matrix / Text Scramble Decoder on Hover
 * 10. Ambient Fluid Cursor Aura (Smooth Physics Follower)
 * 11. Cosmic Particle Spark Burst on Clicks
 */

document.addEventListener("DOMContentLoaded", () => {
  initScrollProgressBar();
  initTypewriter();
  initScrollReveal();
  initCardTilt();
  initSpotlightCards();
  initMagneticButtons();
  initClickRipples();
  initCounterRoll();
  initTextScramble();
  initCursorAura();
  initCustomCursor();
  initClickSparkBurst();
  initHeroPhotoEffects();
});

/**
 * 1. Top Viewport Scroll Progress Bar
 */
function initScrollProgressBar() {
  const bar = document.getElementById("scroll-progress-bar");
  if (!bar) return;

  let ticking = false;

  function updateProgress() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
    ticking = false;
  }

  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(updateProgress);
      ticking = true;
    }
  }, { passive: true });

  updateProgress();
}

/**
 * 2. Dynamic Typewriter Effect for Hero Headline
 */
function initTypewriter() {
  const typingElement = document.getElementById("typing-role");
  if (!typingElement) return;

  const roles = (window.PORTFOLIO_CONFIG && window.PORTFOLIO_CONFIG.typingRoles) || [
    "Python Developer",
    "Frontend Developer",
    "AI & Computer Vision Enthusiast",
    "Full-Stack Problem Solver"
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 90;

  function type() {
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      typingElement.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 45;
    } else {
      typingElement.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 90;
    }

    if (!isDeleting && charIndex === currentRole.length) {
      typingSpeed = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typingSpeed = 400;
    }

    setTimeout(type, typingSpeed);
  }

  setTimeout(type, 800);
}

/**
 * 3. IntersectionObserver for Performant Scroll Reveals
 */
function initScrollReveal() {
  // If GSAP and ScrollTrigger are active, cinematic.js handles high-performance cinematic reveals
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') return;

  const revealElements = document.querySelectorAll(".reveal, .reveal-left, .reveal-right, .reveal-scale");

  if (!("IntersectionObserver" in window)) {
    revealElements.forEach(el => el.classList.add("active"));
    return;
  }

  const observerOptions = {
    root: null,
    rootMargin: "0px 0px -60px 0px",
    threshold: 0.12
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => observer.observe(el));
}

/**
 * 4. 3D Tilt Effect on Desktop Hover
 */
function initCardTilt() {
  if (window.matchMedia("(pointer: coarse)").matches) return;

  const tiltCards = document.querySelectorAll("[data-tilt]");

  tiltCards.forEach(card => {
    card.addEventListener("mousemove", e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -5;
      const rotateY = ((x - centerX) / centerX) * 5;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px) scale(1.08)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)";
    });
  });
}

/**
 * 5. Card Spotlight Glow Effect (Linear / Vercel style radial illumination)
 */
function initSpotlightCards() {
  if (window.matchMedia("(pointer: coarse)").matches) return;

  const cardSelector = ".project-card, .timeline-card, .highlight-box, .pillar-card, .contact-info-card, .cert-folder-card, .skill-category-card, .about-card, .contact-form-card";

  document.addEventListener("mousemove", (e) => {
    const card = e.target.closest(cardSelector);
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    card.style.setProperty("--mouse-x", `${x}px`);
    card.style.setProperty("--mouse-y", `${y}px`);
  });
}

/**
 * 6. Magnetic Spring Attraction for Buttons & Interactive Icons
 */
function initMagneticButtons() {
  if (window.matchMedia("(pointer: coarse)").matches) return;

  const magneticSelector = ".btn, .social-icon-btn, .theme-toggle-btn, .filter-btn";
  const elements = document.querySelectorAll(magneticSelector);

  elements.forEach((el) => {
    el.addEventListener("mousemove", (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);

      const pull = 0.25;
      el.style.transform = `translate(${x * pull}px, ${y * pull}px)`;
    });

    el.addEventListener("mouseleave", () => {
      el.style.transform = "";
    });
  });
}

/**
 * 7. Tactile Click Ripple Wave Effect
 */
function initClickRipples() {
  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".btn, .social-icon-btn, .filter-btn");
    if (!btn) return;

    const rect = btn.getBoundingClientRect();
    const circle = document.createElement("span");
    const diameter = Math.max(rect.width, rect.height);
    const radius = diameter / 2;

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${e.clientX - rect.left - radius}px`;
    circle.style.top = `${e.clientY - rect.top - radius}px`;
    circle.classList.add("click-ripple");

    const existing = btn.querySelector(".click-ripple");
    if (existing) {
      existing.remove();
    }

    btn.appendChild(circle);

    circle.addEventListener("animationend", () => {
      circle.remove();
    });
  });
}

/**
 * 8. Animated Metric Counter Roll (CountUp on Scroll)
 */
function initCounterRoll() {
  const counters = document.querySelectorAll("[data-countup]");
  if (!counters.length) return;

  if (!("IntersectionObserver" in window)) {
    counters.forEach(counter => {
      const val = counter.getAttribute("data-countup");
      const suffix = counter.getAttribute("data-suffix") || "";
      const prefix = counter.getAttribute("data-prefix") || "";
      counter.textContent = `${prefix}${val}${suffix}`;
    });
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  counters.forEach(counter => observer.observe(counter));

  function animateCounter(el) {
    const target = parseFloat(el.getAttribute("data-countup"));
    const decimals = parseInt(el.getAttribute("data-decimals") || "0", 10);
    const prefix = el.getAttribute("data-prefix") || "";
    const suffix = el.getAttribute("data-suffix") || "";
    const duration = 1600;
    const startTime = performance.now();

    function update(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = (target * ease).toFixed(decimals);
      el.textContent = `${prefix}${current}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = `${prefix}${target.toFixed(decimals)}${suffix}`;
      }
    }

    requestAnimationFrame(update);
  }
}

/**
 * 9. Cyber Matrix / Text Scramble Decoder on Hover
 */
function initTextScramble() {
  const scrambleElements = document.querySelectorAll(
    ".project-title, .section-tag, .brand-monogram, .pillar-content h4, .timeline-item-title"
  );

  const glyphChars = "!<>-_\\/[]{}—=+*^?#________0101";

  scrambleElements.forEach((el) => {
    let isScrambling = false;
    const originalText = el.textContent.trim();

    el.addEventListener("mouseenter", () => {
      if (isScrambling) return;
      isScrambling = true;

      let iteration = 0;
      const maxIterations = originalText.length;
      const interval = setInterval(() => {
        el.innerHTML = originalText
          .split("")
          .map((letter, index) => {
            if (letter === " ") return " ";
            if (index < iteration) {
              return originalText[index];
            }
            const randomGlyph = glyphChars[Math.floor(Math.random() * glyphChars.length)];
            return `<span class="scramble-glyph">${randomGlyph}</span>`;
          })
          .join("");

        if (iteration >= maxIterations) {
          clearInterval(interval);
          el.textContent = originalText;
          isScrambling = false;
        }

        iteration += 1 / 2.2;
      }, 30);
    });
  });
}

/**
 * 10. Ambient Fluid Cursor Aura (Smooth Physics Follower)
 */
function initCursorAura() {
  if (window.matchMedia("(pointer: coarse)").matches) return;

  const aura = document.createElement("div");
  aura.className = "cursor-ambient-aura";
  aura.setAttribute("aria-hidden", "true");
  document.body.appendChild(aura);

  let mouseX = -500;
  let mouseY = -500;
  let currentX = -500;
  let currentY = -500;

  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }, { passive: true });

  document.addEventListener("mouseover", (e) => {
    if (e.target.closest("a, button, .project-card, .timeline-card, .skill-badge, .highlight-box, .cert-folder-card")) {
      aura.classList.add("aura-active");
    }
  });

  document.addEventListener("mouseout", (e) => {
    if (e.target.closest("a, button, .project-card, .timeline-card, .skill-badge, .highlight-box, .cert-folder-card")) {
      aura.classList.remove("aura-active");
    }
  });

  function renderAura() {
    currentX += (mouseX - currentX) * 0.12;
    currentY += (mouseY - currentY) * 0.12;

    aura.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
    requestAnimationFrame(renderAura);
  }

  requestAnimationFrame(renderAura);
}

/**
 * 10b. Interactive Cinematic Custom Cursor System
 * - High-precision core dot tracking pointer instantly
 * - Fluid spring follower outer ring with lerp interpolation
 * - Interactive magnetic hover states on buttons, links, cards, & inputs
 * - Micro-stardust particle trail on cursor motion
 * - Full Dark & Light theme reactivity
 * - Complete touch/mobile suppression
 */
function initCustomCursor() {
  // Disable on touchscreen and coarse pointer devices
  if (window.matchMedia("(pointer: coarse)").matches || "ontouchstart" in window) return;

  // 1. Create Core Dot
  const dot = document.createElement("div");
  dot.className = "custom-cursor-dot";
  dot.setAttribute("aria-hidden", "true");
  document.body.appendChild(dot);

  // 2. Create Outer Ring
  const ring = document.createElement("div");
  ring.className = "custom-cursor-ring";
  ring.setAttribute("aria-hidden", "true");
  document.body.appendChild(ring);

  // 3. Create Canvas for Fluid Stardust Particle Trail
  const canvas = document.createElement("canvas");
  canvas.id = "cursor-trail-canvas";
  canvas.style.position = "fixed";
  canvas.style.top = "0";
  canvas.style.left = "0";
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.pointerEvents = "none";
  canvas.style.zIndex = "999997";
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  // Coordinates & Interpolation
  let mouseX = -200;
  let mouseY = -200;
  let dotX = -200;
  let dotY = -200;
  let ringX = -200;
  let ringY = -200;
  let isVisible = false;

  // Trail particles pool
  const trailParticles = [];
  const darkPalette = ["#38bdf8", "#818cf8", "#c084fc", "#06b6d4", "#a855f7"];
  const lightPalette = ["#2563eb", "#3b82f6", "#1d4ed8", "#0284c7", "#7c3aed"];
  let prevMouseX = -200;
  let prevMouseY = -200;

  // Track mouse coordinates
  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (!isVisible) {
      isVisible = true;
      dot.classList.add("custom-cursor-visible");
      ring.classList.add("custom-cursor-visible");
      dotX = ringX = mouseX;
      dotY = ringY = mouseY;
    }

    // Spawn subtle stardust trail particles if cursor is moving fast enough
    const dist = Math.hypot(mouseX - prevMouseX, mouseY - prevMouseY);
    if (dist > 4 && trailParticles.length < 35) {
      const isLight = document.documentElement.getAttribute("data-theme") === "light";
      const palette = isLight ? lightPalette : darkPalette;
      trailParticles.push({
        x: mouseX + (Math.random() - 0.5) * 4,
        y: mouseY + (Math.random() - 0.5) * 4,
        size: Math.random() * 2.2 + 1.2,
        color: palette[Math.floor(Math.random() * palette.length)],
        alpha: 0.7,
        decay: Math.random() * 0.035 + 0.025,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6 + 0.15
      });
      prevMouseX = mouseX;
      prevMouseY = mouseY;
    }
  }, { passive: true });

  // Handle window leave / enter
  document.addEventListener("mouseleave", () => {
    isVisible = false;
    dot.classList.remove("custom-cursor-visible");
    ring.classList.remove("custom-cursor-visible");
  });

  document.addEventListener("mouseenter", () => {
    isVisible = true;
    dot.classList.add("custom-cursor-visible");
    ring.classList.add("custom-cursor-visible");
  });

  // Handle mousedown & mouseup for tactile click punch
  window.addEventListener("mousedown", () => {
    ring.classList.add("cursor-click");
    dot.classList.add("cursor-click");
  });

  window.addEventListener("mouseup", () => {
    ring.classList.remove("cursor-click");
    dot.classList.remove("cursor-click");
  });

  // Interactive Target Selectors
  const interactiveSelector = "a, button, .btn, input[type='button'], input[type='submit'], [role='button'], .project-card, .timeline-card, .skill-badge, .highlight-box, .cert-folder-card, .social-icon-btn, .theme-toggle-btn, .nav-link, .exp-tab-btn, .lab-tab-btn, .contact-tab-btn, .contact-info-card, .back-to-top, .auth-profile-card";
  const textSelector = "input[type='text'], input[type='email'], input[type='password'], input[type='search'], textarea";

  document.addEventListener("mouseover", (e) => {
    if (e.target.closest(textSelector)) {
      ring.classList.add("cursor-text");
      dot.classList.add("cursor-text");
      ring.classList.remove("cursor-hover");
      dot.classList.remove("cursor-hover");
    } else if (e.target.closest(interactiveSelector)) {
      ring.classList.add("cursor-hover");
      dot.classList.add("cursor-hover");
      ring.classList.remove("cursor-text");
      dot.classList.remove("cursor-text");
    }
  });

  document.addEventListener("mouseout", (e) => {
    const fromText = e.target.closest(textSelector);
    const fromInteractive = e.target.closest(interactiveSelector);

    if (fromText) {
      ring.classList.remove("cursor-text");
      dot.classList.remove("cursor-text");
    }
    if (fromInteractive) {
      ring.classList.remove("cursor-hover");
      dot.classList.remove("cursor-hover");
    }
  });

  // 60/120fps Animation Loop
  function renderCursor() {
    if (isVisible) {
      // Precision dot snaps instantly with micro-interpolation
      dotX += (mouseX - dotX) * 0.8;
      dotY += (mouseY - dotY) * 0.8;
      dot.style.transform = `translate3d(${dotX}px, ${dotY}px, 0) translate(-50%, -50%)`;

      // Outer follower ring glides with fluid spring physics
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
    }

    // Render micro-stardust particles on canvas
    ctx.clearRect(0, 0, width, height);
    for (let i = trailParticles.length - 1; i >= 0; i--) {
      const p = trailParticles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= p.decay;

      if (p.alpha <= 0) {
        trailParticles.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    requestAnimationFrame(renderCursor);
  }

  requestAnimationFrame(renderCursor);
}

/**
 * 11. Cosmic Particle Spark Burst on Clicks
 */
function initClickSparkBurst() {
  const canvas = document.createElement("canvas");
  canvas.id = "particle-burst-canvas";
  canvas.style.position = "fixed";
  canvas.style.top = "0";
  canvas.style.left = "0";
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.pointerEvents = "none";
  canvas.style.zIndex = "99999";
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const palette = ["#38bdf8", "#818cf8", "#c084fc", "#10b981", "#34d399", "#67e8f9"];

  function spawnBurst(x, y) {
    const count = 14;
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.6;
      const speed = Math.random() * 4.5 + 2;
      particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 2.8 + 1.8,
        color: palette[Math.floor(Math.random() * palette.length)],
        alpha: 1,
        decay: Math.random() * 0.025 + 0.02,
        gravity: 0.12
      });
    }
  }

  window.addEventListener("click", (e) => {
    spawnBurst(e.clientX, e.clientY);
  });

  function update() {
    ctx.clearRect(0, 0, width, height);

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.vx *= 0.96;
      p.alpha -= p.decay;

      if (p.alpha <= 0) {
        particles.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.shadowBlur = 8;
      ctx.shadowColor = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}


/**
 * 12. Advanced Hero Photo Holographic HUD, 3D Gyroscopic Tilt & Parallax System
 */
function initHeroPhotoEffects() {
  const photoCard = document.getElementById("hero-photo-card");
  if (!photoCard) return;

  const glare = document.getElementById("photo-specular-glare");
  const badges = document.querySelectorAll(".floating-photo-badge");
  const isTouch = window.matchMedia("(pointer: coarse)").matches;

  if (isTouch) return; // Retain smooth CSS keyframe bobbing on touch devices

  let bounds = null;
  let rafId = null;

  function updateBounds() {
    bounds = photoCard.getBoundingClientRect();
  }

  window.addEventListener("resize", updateBounds, { passive: true });
  window.addEventListener("scroll", updateBounds, { passive: true });

  photoCard.addEventListener("mouseenter", () => {
    updateBounds();
    if (glare) glare.style.opacity = "1";
  });

  photoCard.addEventListener("mousemove", (e) => {
    if (!bounds) updateBounds();
    const mouseX = e.clientX - bounds.left;
    const mouseY = e.clientY - bounds.top;

    // Normalized coordinates from -1 (left/top) to +1 (right/bottom)
    const normX = Math.max(-1, Math.min(1, (mouseX / bounds.width) * 2 - 1));
    const normY = Math.max(-1, Math.min(1, (mouseY / bounds.height) * 2 - 1));

    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => {
      // 1. Natural 3D Perspective Tilt (subtle, high fidelity)
      const rotX = (-normY * 8).toFixed(2);
      const rotY = (normX * 8).toFixed(2);
      photoCard.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-5px) scale3d(1.02, 1.02, 1.02)`;

      // 2. Dynamic Specular Light Glare
      if (glare) {
        const pctX = ((mouseX / bounds.width) * 100).toFixed(1);
        const pctY = ((mouseY / bounds.height) * 100).toFixed(1);
        glare.style.background = `radial-gradient(circle at ${pctX}% ${pctY}%, rgba(255, 255, 255, 0.28) 0%, rgba(56, 189, 248, 0.15) 30%, transparent 65%)`;
      }

      // 3. Floating Holographic Badge 3D Parallax Offsets
      badges.forEach(badge => {
        const depth = parseFloat(badge.getAttribute("data-float-depth")) || 20;
        const offsetX = (normX * depth * 0.45).toFixed(1);
        const offsetY = (normY * depth * 0.45).toFixed(1);
        badge.style.setProperty("--tx", `${offsetX}px`);
        badge.style.setProperty("--ty", `${offsetY}px`);
      });
    });
  });

  photoCard.addEventListener("mouseleave", () => {
    if (rafId) cancelAnimationFrame(rafId);
    photoCard.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px) scale3d(1, 1, 1)";
    if (glare) {
      glare.style.opacity = "0";
    }
    badges.forEach(badge => {
      badge.style.removeProperty("--tx");
      badge.style.removeProperty("--ty");
    });
  });
}
