/**
 * ==============================================================================
 * SEPIA INTERACTIONS & ANIMATION ENGINE
 * Inspired by myportfolio-sepia-xi-37.vercel.app
 * Features:
 * 1. 3D Flip ID Badge Card (preserve-3d rotation)
 * 2. Mouse-Following Fluid Particle Canvas
 * 3. Mobile Navigation Menu Toggle
 * 4. Scroll-Triggered Stagger Animations
 * ==============================================================================
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    initFlipCard();
    initFluidCanvas();
    initMobileNav();
    initSmoothScroll();
  });

  /**
   * 1. 3D FLIP ID CARD INTERACTION
   */
  function initFlipCard() {
    const card = document.getElementById('sepia-flip-id-card');
    if (!card) return;

    // Toggle flip on click / tap
    card.addEventListener('click', function () {
      card.classList.toggle('is-flipped');
    });

    // Keyboard accessibility (Space or Enter to flip)
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', '3D ID Badge. Click or press Enter to flip.');
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.classList.toggle('is-flipped');
      }
    });
  }

  /**
   * 2. FLUID PARTICLE TRAIL CANVAS (#sepia-fluid-canvas)
   */
  function initFluidCanvas() {
    const canvas = document.getElementById('sepia-fluid-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = (canvas.width = canvas.parentElement.offsetWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement.offsetHeight || window.innerHeight);

    window.addEventListener('resize', function () {
      if (canvas.parentElement) {
        width = canvas.width = canvas.parentElement.offsetWidth;
        height = canvas.height = canvas.parentElement.offsetHeight;
      }
    });

    // Particle array for smooth ripples
    const particles = [];
    const maxParticles = 60;

    let mouse = {
      x: width / 2,
      y: height / 2,
      prevX: width / 2,
      prevY: height / 2,
      speed: 0
    };

    window.addEventListener('mousemove', function (e) {
      const rect = canvas.getBoundingClientRect();
      const currentX = e.clientX - rect.left;
      const currentY = e.clientY - rect.top;

      const dist = Math.hypot(currentX - mouse.x, currentY - mouse.y);
      mouse.speed = dist;
      mouse.prevX = mouse.x;
      mouse.prevY = mouse.y;
      mouse.x = currentX;
      mouse.y = currentY;

      // Spawn particles only when cursor moves inside or near the hero
      if (currentY >= 0 && currentY <= height && currentX >= 0 && currentX <= width) {
        for (let i = 0; i < Math.min(3, Math.ceil(dist / 8)); i++) {
          if (particles.length < maxParticles) {
            particles.push({
              x: mouse.x + (Math.random() - 0.5) * 20,
              y: mouse.y + (Math.random() - 0.5) * 20,
              vx: (Math.random() - 0.5) * 1.5,
              vy: (Math.random() - 0.5) * 1.5 - 0.5,
              radius: Math.random() * 24 + 10,
              alpha: 0.35,
              color: Math.random() > 0.4 ? '255, 255, 255' : '255, 120, 120'
            });
          }
        }
      }
    });

    function animate() {
      ctx.clearRect(0, 0, width, height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.008;
        p.radius += 0.4;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
        gradient.addColorStop(0, `rgba(${p.color}, ${p.alpha})`);
        gradient.addColorStop(1, `rgba(${p.color}, 0)`);
        ctx.fillStyle = gradient;
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      requestAnimationFrame(animate);
    }

    animate();
  }

  /**
   * 3. MOBILE NAVIGATION MENU
   */
  function initMobileNav() {
    const toggleBtn = document.getElementById('sepia-mobile-toggle');
    const navLinks = document.getElementById('sepia-nav-links');
    if (!toggleBtn || !navLinks) return;

    toggleBtn.addEventListener('click', function () {
      navLinks.classList.toggle('is-open');
      const expanded = toggleBtn.getAttribute('aria-expanded') === 'true';
      toggleBtn.setAttribute('aria-expanded', !expanded);
    });

    // Close when clicking a link
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('is-open');
        toggleBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /**
   * 4. SMOOTH SCROLL FOR ALL ANCHORS
   */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#' || targetId === '') return;

        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          targetEl.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }

})();
