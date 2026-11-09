/**
 * ============================================================================
 * CINEMATIC GSAP ANIMATION ENGINE
 * Netflix-style dramatic reveals, scroll-triggered animations, parallax,
 * text scramble, page loader & staggered section intros.
 * Requires: gsap.min.js + ScrollTrigger.min.js
 * ============================================================================
 */

(function () {
  "use strict";

  /* ------------------------------------------------------------------
     0. ACCESSIBILITY: Respect prefers-reduced-motion
     ------------------------------------------------------------------ */
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion) {
    // Immediately remove loader and show all content
    const loader = document.getElementById("page-loader");
    if (loader) loader.remove();
    document.body.classList.remove("cinematic-init");
    return; // Skip all cinematic animations
  }

  /* ------------------------------------------------------------------
     1. REGISTER GSAP PLUGINS
     ------------------------------------------------------------------ */
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
    console.warn("[Cinematic] GSAP or ScrollTrigger not found. Skipping cinematic animations.");
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  /* ------------------------------------------------------------------
     2. UTILITY HELPERS
     ------------------------------------------------------------------ */
  const qs = (sel, ctx) => (ctx || document).querySelector(sel);
  const qsa = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));

  /** Tiny text scramble/decode effect on a DOM element */
  function textScrambleDecode(el, duration) {
    if (!el || !el.textContent.trim()) return;
    const original = el.textContent;
    const glyphs = "!<>-_\\/[]{}—=+*^?#01";
    const len = original.length;
    const obj = { progress: 0 };

    gsap.to(obj, {
      progress: 1,
      duration: duration || 0.8,
      ease: "none",
      onUpdate() {
        const p = obj.progress;
        let out = "";
        for (let i = 0; i < len; i++) {
          if (original[i] === " ") { out += " "; continue; }
          if (i / len < p) {
            out += original[i];
          } else {
            out += glyphs[Math.floor(Math.random() * glyphs.length)];
          }
        }
        el.textContent = out;
      },
      onComplete() {
        el.textContent = original;
      }
    });
  }

  /* ------------------------------------------------------------------
     3. PAGE LOADER INTRO SEQUENCE
     ------------------------------------------------------------------ */
  function initPageLoader() {
    const loader = document.getElementById("page-loader");
    if (!loader) {
      initHeroEntrance();
      return;
    }

    // Add cinematic-init class so CSS hides elements until animated in
    document.body.classList.add("cinematic-init");

    const tl = gsap.timeline({
      onComplete() {
        loader.classList.add("loader-hidden");
        // Remove from DOM after transition
        setTimeout(() => loader.remove(), 500);
        document.body.classList.remove("cinematic-init");
        initHeroEntrance();
      }
    });

    // Loader bar fill is handled by CSS animation; we just wait and slide away
    tl.to(loader, {
      delay: 1.2,
      opacity: 0,
      duration: 0.6,
      ease: "power2.inOut"
    });
  }

  /* ------------------------------------------------------------------
     4. HERO ENTRANCE SEQUENCE (Staggered Cinematic Intro)
     ------------------------------------------------------------------ */
  function initHeroEntrance() {
    const header = qs(".site-header");
    const heroContent = qs(".hero-content");
    const photoWrapper = qs(".hero-photo-wrapper");

    if (!heroContent) return;

    // Gather hero child elements
    const statusPill = qs(".status-pill", heroContent) || qs("[style*='status']", heroContent);
    const statusArea = heroContent.children[0]; // first child - the status area
    const heroName = qs(".hero-name", heroContent);
    const verifiedBadge = heroName ? heroName.nextElementSibling : null;
    const roleWrapper = qs(".hero-role-wrapper", heroContent);
    const heroBio = qs(".hero-bio", heroContent);
    const heroSocials = qs(".hero-socials", heroContent);
    const socialBtns = heroSocials ? qsa(".social-icon-btn", heroSocials) : [];
    const ctaGroup = qs(".hero-cta-group", heroContent);
    const ctaBtns = ctaGroup ? qsa(".btn", ctaGroup) : [];
    const photoCard = qs(".hero-photo-card");
    const floatingBadges = qsa(".floating-photo-badge");

    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

    // Set initial states
    if (header) gsap.set(header, { y: -60, opacity: 0 });
    if (statusArea) gsap.set(statusArea, { y: 30, opacity: 0 });
    if (heroName) gsap.set(heroName, { y: 50, opacity: 0, scale: 0.92 });
    if (verifiedBadge) gsap.set(verifiedBadge, { y: 20, opacity: 0 });
    if (roleWrapper) gsap.set(roleWrapper, { y: 25, opacity: 0 });
    if (heroBio) gsap.set(heroBio, { y: 25, opacity: 0 });
    if (socialBtns.length) gsap.set(socialBtns, { y: 30, opacity: 0 });
    if (ctaBtns.length) gsap.set(ctaBtns, { y: 30, opacity: 0 });
    if (photoWrapper) gsap.set(photoWrapper, { opacity: 0 });
    if (photoCard) gsap.set(photoCard, { scale: 0.7, rotation: -5, opacity: 0 });
    if (floatingBadges.length) gsap.set(floatingBadges, { scale: 0, opacity: 0 });

    // Build the timeline
    if (header) {
      tl.to(header, { y: 0, opacity: 1, duration: 0.8 }, 0);
    }

    if (statusArea) {
      tl.to(statusArea, { y: 0, opacity: 1, duration: 0.7 }, 0.2);
    }

    if (heroName) {
      tl.to(heroName, { y: 0, opacity: 1, scale: 1, duration: 0.9 }, 0.35);
    }

    if (verifiedBadge) {
      tl.to(verifiedBadge, { y: 0, opacity: 1, duration: 0.5 }, 0.7);
    }

    if (roleWrapper) {
      tl.to(roleWrapper, { y: 0, opacity: 1, duration: 0.6 }, 0.75);
    }

    if (heroBio) {
      tl.to(heroBio, { y: 0, opacity: 1, duration: 0.6 }, 0.9);
    }

    if (socialBtns.length) {
      tl.to(socialBtns, { y: 0, opacity: 1, duration: 0.5, stagger: 0.08 }, 1.0);
    }

    if (ctaBtns.length) {
      tl.to(ctaBtns, { y: 0, opacity: 1, duration: 0.5, stagger: 0.1 }, 1.15);
    }

    // Photo card entrance
    if (photoWrapper) {
      tl.to(photoWrapper, { opacity: 1, duration: 0.01 }, 0.5);
    }
    if (photoCard) {
      tl.to(photoCard, {
        scale: 1,
        rotation: 0,
        opacity: 1,
        duration: 1.1,
        ease: "back.out(1.4)"
      }, 0.55);
    }

    // Floating badges pop in
    if (floatingBadges.length) {
      tl.to(floatingBadges, {
        scale: 1,
        opacity: 1,
        duration: 0.6,
        stagger: 0.12,
        ease: "elastic.out(1, 0.5)"
      }, 1.2);
    }
  }

  /* ------------------------------------------------------------------
     5. SECTION HEADER CINEMATIC REVEALS
     ------------------------------------------------------------------ */
  function initSectionHeaders() {
    const headers = qsa(".section-header");

    headers.forEach(header => {
      const tag = qs(".section-tag", header);
      const title = qs(".section-title", header);
      const subtitle = qs(".section-subtitle", header);

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: header,
          start: "top 85%",
          end: "bottom 20%",
          toggleActions: "play none none none",
          once: true
        }
      });

      if (tag) {
        gsap.set(tag, { y: 30, opacity: 0 });
        tl.to(tag, { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" }, 0);
        // Text scramble on the tag
        tl.call(() => textScrambleDecode(tag, 0.6), null, 0.1);
      }

      if (title) {
        gsap.set(title, { clipPath: "inset(100% 0 0 0)", opacity: 0 });
        tl.to(title, {
          clipPath: "inset(0% 0 0 0)",
          opacity: 1,
          duration: 0.8,
          ease: "power4.out"
        }, 0.15);
      }

      if (subtitle) {
        gsap.set(subtitle, { y: 20, opacity: 0 });
        tl.to(subtitle, { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" }, 0.4);
      }
    });
  }

  /* ------------------------------------------------------------------
     6. ABOUT SECTION CINEMATIC
     ------------------------------------------------------------------ */
  function initAboutSection() {
    const aboutCard = qs(".about-card");
    const pillarCards = qsa(".pillar-card");
    const highlightBoxes = qsa(".highlight-box");

    // About card - slide from left with perspective
    if (aboutCard) {
      gsap.set(aboutCard, {
        x: -80,
        opacity: 0,
        rotateY: 8,
        transformPerspective: 1200
      });

      gsap.to(aboutCard, {
        scrollTrigger: {
          trigger: aboutCard,
          start: "top 85%",
          once: true
        },
        x: 0,
        opacity: 1,
        rotateY: 0,
        duration: 1,
        ease: "power4.out"
      });
    }

    // Pillar cards stagger from right with rotation
    if (pillarCards.length) {
      gsap.set(pillarCards, {
        x: 60,
        opacity: 0,
        rotateY: -6,
        transformPerspective: 1000
      });

      gsap.to(pillarCards, {
        scrollTrigger: {
          trigger: pillarCards[0].closest(".pillars-list") || pillarCards[0],
          start: "top 85%",
          once: true
        },
        x: 0,
        opacity: 1,
        rotateY: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: "power3.out"
      });
    }

    // Highlight boxes counter-roll up one by one
    if (highlightBoxes.length) {
      gsap.set(highlightBoxes, { y: 50, opacity: 0, scale: 0.92 });

      highlightBoxes.forEach((box, i) => {
        gsap.to(box, {
          scrollTrigger: {
            trigger: box,
            start: "top 88%",
            once: true
          },
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.7,
          delay: i * 0.08,
          ease: "back.out(1.4)"
        });
      });
    }
  }

  /* ------------------------------------------------------------------
     7. SKILLS SECTION
     ------------------------------------------------------------------ */
  function initSkillsSection() {
    const skillCards = qsa(".skill-category-card");
    if (!skillCards.length) return;

    gsap.set(skillCards, {
      y: 70,
      opacity: 0,
      scale: 0.88,
      rotateX: 6,
      transformPerspective: 1000
    });

    gsap.to(skillCards, {
      scrollTrigger: {
        trigger: skillCards[0].closest("#skills") || skillCards[0],
        start: "top 82%",
        once: true
      },
      y: 0,
      opacity: 1,
      scale: 1,
      rotateX: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: "power4.out"
    });
  }

  /* ------------------------------------------------------------------
     8. PROJECTS SECTION
     ------------------------------------------------------------------ */
  function initProjectsSection() {
    const projectCards = qsa(".project-card");
    if (!projectCards.length) return;

    projectCards.forEach(card => {
      gsap.set(card, {
        y: 100,
        opacity: 0,
        scale: 0.85,
        rotateX: 4,
        transformPerspective: 1200
      });

      gsap.to(card, {
        scrollTrigger: {
          trigger: card,
          start: "top 88%",
          once: true
        },
        y: 0,
        opacity: 1,
        scale: 1,
        rotateX: 0,
        duration: 0.9,
        ease: "power4.out"
      });

      // Parallax on project images (moves slower than card on scroll)
      const img = qs(".project-image-box img", card);
      if (img) {
        gsap.to(img, {
          scrollTrigger: {
            trigger: card,
            start: "top bottom",
            end: "bottom top",
            scrub: 1
          },
          y: -30,
          ease: "none"
        });
      }
    });

    // Filter tab click animations
    const filterBtns = qsa(".filter-btn");
    filterBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        // Briefly animate visible project cards
        const visibleCards = qsa(".project-card:not([style*='display: none'])");
        if (visibleCards.length) {
          gsap.fromTo(visibleCards,
            { opacity: 0, y: 30, scale: 0.95 },
            { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.06, ease: "power3.out", delay: 0.05 }
          );
        }
      });
    });
  }

  /* ------------------------------------------------------------------
     9. EDUCATION TIMELINE
     ------------------------------------------------------------------ */
  function initEducationSection() {
    const timelineCards = qsa(".timeline-card");
    if (!timelineCards.length) return;

    timelineCards.forEach((card, i) => {
      const fromLeft = i % 2 === 0;
      gsap.set(card, {
        x: fromLeft ? -70 : 70,
        opacity: 0,
        rotateY: fromLeft ? 5 : -5,
        transformPerspective: 1000
      });

      gsap.to(card, {
        scrollTrigger: {
          trigger: card,
          start: "top 88%",
          once: true
        },
        x: 0,
        opacity: 1,
        rotateY: 0,
        duration: 0.8,
        ease: "power4.out"
      });
    });
  }

  /* ------------------------------------------------------------------
     10. CERTIFICATIONS VAULT (3D Flip)
     ------------------------------------------------------------------ */
  function initCertificationsSection() {
    const certCards = qsa(".cert-folder-card");
    if (!certCards.length) return;

    gsap.set(certCards, {
      rotateY: -90,
      opacity: 0,
      transformPerspective: 1200,
      transformOrigin: "left center"
    });

    gsap.to(certCards, {
      scrollTrigger: {
        trigger: certCards[0].closest("#certifications") || certCards[0],
        start: "top 82%",
        once: true
      },
      rotateY: 0,
      opacity: 1,
      duration: 0.9,
      stagger: 0.1,
      ease: "power4.out"
    });
  }

  /* ------------------------------------------------------------------
     11. CONTACT SECTION
     ------------------------------------------------------------------ */
  function initContactSection() {
    const formCard = qs(".contact-form-card");
    const infoCards = qsa(".contact-info-card");

    if (formCard) {
      gsap.set(formCard, {
        y: 80,
        opacity: 0,
        rotateX: 5,
        transformPerspective: 1200
      });

      gsap.to(formCard, {
        scrollTrigger: {
          trigger: formCard,
          start: "top 88%",
          once: true
        },
        y: 0,
        opacity: 1,
        rotateX: 0,
        duration: 0.9,
        ease: "power4.out"
      });
    }

    if (infoCards.length) {
      gsap.set(infoCards, { y: 50, opacity: 0 });

      gsap.to(infoCards, {
        scrollTrigger: {
          trigger: infoCards[0],
          start: "top 88%",
          once: true
        },
        y: 0,
        opacity: 1,
        duration: 0.7,
        stagger: 0.1,
        ease: "power3.out"
      });
    }
  }

  /* ------------------------------------------------------------------
     12. FAQ SECTION
     ------------------------------------------------------------------ */
  function initFaqSection() {
    const faqItems = qsa("#faq .faq-item, #faq .accordion-item");
    if (!faqItems.length) return;

    gsap.set(faqItems, { y: 40, opacity: 0 });

    gsap.to(faqItems, {
      scrollTrigger: {
        trigger: faqItems[0].closest("#faq") || faqItems[0],
        start: "top 85%",
        once: true
      },
      y: 0,
      opacity: 1,
      duration: 0.6,
      stagger: 0.08,
      ease: "power3.out"
    });
  }

  /* ------------------------------------------------------------------
     13. SMOOTH PARALLAX EFFECTS
     ------------------------------------------------------------------ */
  function initParallax() {
    // Ambient orbs parallax
    const orbs = qsa(".ambient-orb");
    orbs.forEach((orb, i) => {
      const speed = 0.15 + i * 0.08;
      gsap.to(orb, {
        scrollTrigger: {
          trigger: document.body,
          start: "top top",
          end: "bottom bottom",
          scrub: 1.5
        },
        y: () => window.innerHeight * speed * (i % 2 === 0 ? 1 : -1),
        ease: "none"
      });
    });

    // Hero 3D container parallax on scroll
    const hero3d = qs("#hero-3d-container");
    if (hero3d) {
      gsap.to(hero3d, {
        scrollTrigger: {
          trigger: "#home",
          start: "top top",
          end: "bottom top",
          scrub: 1
        },
        y: 150,
        opacity: 0.3,
        ease: "none"
      });
    }
  }

  /* ------------------------------------------------------------------
     14. SECTION TITLE TEXT SCRAMBLE ON ENTER
     ------------------------------------------------------------------ */
  function initSectionTitleScramble() {
    const titles = qsa(".section-title");

    titles.forEach(title => {
      ScrollTrigger.create({
        trigger: title,
        start: "top 85%",
        once: true,
        onEnter() {
          // Short delay to let clip-path animation start first
          setTimeout(() => textScrambleDecode(title, 1.0), 300);
        }
      });
    });
  }

  /* ------------------------------------------------------------------
     15. GENERIC REVEAL FALLBACK
     All remaining .reveal, .reveal-left, .reveal-right, .reveal-scale
     that weren't handled by specific section animations above.
     ------------------------------------------------------------------ */
  function initGenericReveals() {
    const allRevealEls = qsa(".reveal, .reveal-left, .reveal-right, .reveal-scale");

    allRevealEls.forEach(el => {
      // Skip if already handled by GSAP (has an inline transform from gsap.set)
      if (el._gsap) return;

      let fromVars = { opacity: 0, y: 40 };
      if (el.classList.contains("reveal-left")) {
        fromVars = { opacity: 0, x: -60 };
      } else if (el.classList.contains("reveal-right")) {
        fromVars = { opacity: 0, x: 60 };
      } else if (el.classList.contains("reveal-scale")) {
        fromVars = { opacity: 0, scale: 0.85 };
      }

      gsap.set(el, fromVars);

      gsap.to(el, {
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
          once: true
        },
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: "power4.out",
        onComplete() {
          // Add the active class for compatibility with existing CSS
          el.classList.add("active");
        }
      });
    });
  }

  /* ------------------------------------------------------------------
     15B. INTERACTIVE SCI-FI PROJECTS VAULT DOOR
     ------------------------------------------------------------------ */
  function initProjectsVaultDoor() {
    const portal = document.getElementById("projects-vault-portal");
    const trigger = document.getElementById("vault-door-trigger");
    const chamber = document.getElementById("projects-vault-chamber");
    const resealBtn = document.getElementById("btn-reseal-vault");

    if (!portal || !trigger || !chamber) return;

    // Web Audio API Synthesized Sci-Fi Sound Effects
    function playVaultSound(type) {
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();
        if (ctx.state === "suspended") ctx.resume();

        if (type === "open") {
          // Hydraulic heavy unlatch sub-bass
          const osc1 = ctx.createOscillator();
          const gain1 = ctx.createGain();
          osc1.type = "sawtooth";
          osc1.frequency.setValueAtTime(80, ctx.currentTime);
          osc1.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.8);
          gain1.gain.setValueAtTime(0.25, ctx.currentTime);
          gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.85);
          osc1.connect(gain1);
          gain1.connect(ctx.destination);
          osc1.start();
          osc1.stop(ctx.currentTime + 0.9);

          // Pneumatic air hiss & high-tech scan sweep
          const osc2 = ctx.createOscillator();
          const gain2 = ctx.createGain();
          osc2.type = "sine";
          osc2.frequency.setValueAtTime(320, ctx.currentTime);
          osc2.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.4);
          osc2.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.7);
          gain2.gain.setValueAtTime(0.08, ctx.currentTime);
          gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.75);
          osc2.connect(gain2);
          gain2.connect(ctx.destination);
          osc2.start();
          osc2.stop(ctx.currentTime + 0.8);
        } else if (type === "close") {
          // Re-seal latch clank
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "triangle";
          osc.frequency.setValueAtTime(130, ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(45, ctx.currentTime + 0.5);
          gain.gain.setValueAtTime(0.22, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.55);
        }
      } catch (err) {
        // AudioContext not allowed or unsupported; fail silently
      }
    }

    function openVault() {
      if (portal.classList.contains("is-opening") || portal.classList.contains("is-opened")) return;

      playVaultSound("open");

      // 1. Trigger opening animation state on the door wings & lock
      portal.classList.add("is-opening");
      const statusText = portal.querySelector(".status-text");
      if (statusText) statusText.textContent = "ACCESS GRANTED // OPENING";

      // 2. Animate projects chamber into view
      setTimeout(() => {
        portal.classList.add("is-opened");
        chamber.classList.remove("is-locked");
        chamber.classList.add("is-unlocked");

        // Stagger in the project cards with high-impact GSAP
        const projectCards = chamber.querySelectorAll(".project-card");
        if (projectCards.length && typeof gsap !== "undefined") {
          gsap.fromTo(projectCards, 
            { opacity: 0, y: 70, scale: 0.88, rotateX: 6 },
            { opacity: 1, y: 0, scale: 1, rotateX: 0, duration: 0.9, stagger: 0.14, ease: "power4.out" }
          );
        }

        // Stagger in engineering lab container
        const labContainer = chamber.querySelector(".engineering-lab-container");
        if (labContainer && typeof gsap !== "undefined") {
          gsap.fromTo(labContainer,
            { opacity: 0, y: 50 },
            { opacity: 1, y: 0, duration: 0.8, delay: 0.5, ease: "power3.out" }
          );
        }

        // Refresh ScrollTrigger so all positions align smoothly
        if (typeof ScrollTrigger !== "undefined") {
          ScrollTrigger.refresh();
        }
      }, 950);
    }

    function resealVault() {
      playVaultSound("close");

      // Hide projects chamber
      chamber.classList.remove("is-unlocked");
      chamber.classList.add("is-locked");

      // Restore door portal
      portal.classList.remove("is-opened");
      portal.classList.remove("is-opening");
      const statusText = portal.querySelector(".status-text");
      if (statusText) statusText.textContent = "PROJECTS LOCKED";

      // Scroll smoothly back to projects header so user sees the closed door
      const projectsSection = document.getElementById("projects");
      if (projectsSection) {
        projectsSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }

      if (typeof ScrollTrigger !== "undefined") {
        ScrollTrigger.refresh();
      }
    }

    trigger.addEventListener("click", openVault);
    trigger.addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openVault();
      }
    });

    if (resealBtn) {
      resealBtn.addEventListener("click", resealVault);
    }
  }

  /* ------------------------------------------------------------------
     16. INITIALIZE EVERYTHING
     ------------------------------------------------------------------ */
  function initCinematic() {
    initPageLoader();
    initSectionHeaders();
    initAboutSection();
    initSkillsSection();
    initProjectsSection();
    initEducationSection();
    initCertificationsSection();
    initContactSection();
    initFaqSection();
    initParallax();
    initSectionTitleScramble();
    initGenericReveals();
    initProjectsVaultDoor();

    // Refresh ScrollTrigger after images/fonts load
    window.addEventListener("load", () => {
      ScrollTrigger.refresh();
    });
  }

  // Run on DOMContentLoaded or immediately if already loaded
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initCinematic);
  } else {
    initCinematic();
  }

})();
