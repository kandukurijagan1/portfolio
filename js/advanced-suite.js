/**
 * ==============================================================================
 * ADVANCED PORTFOLIO INTERACTION SUITE
 * 1. Command Palette (Ctrl+K / ⌘K Spotlight Center)
 * 2. Web Audio API Procedural Sound Engine (Zero external audio assets)
 * 3. 3D Holographic Prismatic Card Tilt & Shimmer
 * 4. Interactive Matrix Cyber Rain Mode
 * ==============================================================================
 */

(function () {
  "use strict";

  /* ------------------------------------------------------------------
     1. PROCEDURAL WEB AUDIO SYNTHESIS ENGINE
     ------------------------------------------------------------------ */
  const AudioEngine = (function () {
    let ctx = null;
    let enabled = false;

    function getAudioContext() {
      if (!ctx && (window.AudioContext || window.webkitAudioContext)) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        ctx = new AudioCtx();
      }
      if (ctx && ctx.state === "suspended") {
        ctx.resume();
      }
      return ctx;
    }

    function isMuted() {
      return localStorage.getItem("portfolio_audio_enabled") !== "true";
    }

    function setMuted(muted) {
      enabled = !muted;
      localStorage.setItem("portfolio_audio_enabled", enabled ? "true" : "false");
      updateAudioToggleBtn();
    }

    function playHover() {
      if (isMuted()) return;
      try {
        const c = getAudioContext();
        if (!c) return;
        const osc = c.createOscillator();
        const gain = c.createGain();
        const now = c.currentTime;

        osc.type = "sine";
        osc.frequency.setValueAtTime(580, now);
        osc.frequency.exponentialRampToValueAtTime(840, now + 0.04);

        gain.gain.setValueAtTime(0.015, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);

        osc.connect(gain);
        gain.connect(c.destination);

        osc.start(now);
        osc.stop(now + 0.04);
      } catch (_) {}
    }

    function playClick() {
      if (isMuted()) return;
      try {
        const c = getAudioContext();
        if (!c) return;
        const osc = c.createOscillator();
        const gain = c.createGain();
        const now = c.currentTime;

        osc.type = "triangle";
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(680, now + 0.05);

        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);

        osc.connect(gain);
        gain.connect(c.destination);

        osc.start(now);
        osc.stop(now + 0.05);
      } catch (_) {}
    }

    function playSuccess() {
      if (isMuted()) return;
      try {
        const c = getAudioContext();
        if (!c) return;
        const now = c.currentTime;
        const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 chord

        notes.forEach((freq, idx) => {
          const osc = c.createOscillator();
          const gain = c.createGain();
          const startTime = now + idx * 0.05;

          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, startTime);

          gain.gain.setValueAtTime(0.03, startTime);
          gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.35);

          osc.connect(gain);
          gain.connect(c.destination);

          osc.start(startTime);
          osc.stop(startTime + 0.35);
        });
      } catch (_) {}
    }

    function playSwitch() {
      if (isMuted()) return;
      try {
        const c = getAudioContext();
        if (!c) return;
        const osc = c.createOscillator();
        const gain = c.createGain();
        const now = c.currentTime;

        osc.type = "sine";
        osc.frequency.setValueAtTime(900, now);
        osc.frequency.exponentialRampToValueAtTime(450, now + 0.08);

        gain.gain.setValueAtTime(0.03, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);

        osc.connect(gain);
        gain.connect(c.destination);

        osc.start(now);
        osc.stop(now + 0.08);
      } catch (_) {}
    }

    function updateAudioToggleBtn() {
      const btn = document.getElementById("audio-toggle-btn");
      if (!btn) return;
      const muted = isMuted();
      btn.setAttribute("aria-pressed", muted ? "false" : "true");
      btn.title = muted ? "Turn Sound FX On (Web Audio)" : "Mute Sound FX";
      btn.classList.toggle("active", !muted);
    }

    return {
      playHover,
      playClick,
      playSuccess,
      playSwitch,
      isMuted,
      setMuted,
      toggle: () => setMuted(!isMuted())
    };
  })();

  window.PortfolioAudio = AudioEngine;


  /* ------------------------------------------------------------------
     2. COMMAND PALETTE (CTRL+K / ⌘K SPOTLIGHT MODAL)
     ------------------------------------------------------------------ */
  const CommandPalette = (function () {
    let isOpen = false;
    let selectedIndex = 0;
    let filteredCommands = [];

    const commands = [
      // Navigation
      { id: "nav-home", label: "Jump to Home / Hero", category: "Navigation", icon: "🏠", action: () => scrollToSection("home") },
      { id: "nav-about", label: "Jump to About & Education", category: "Navigation", icon: "👤", action: () => scrollToSection("about") },
      { id: "nav-skills", label: "Jump to Technical Skills", category: "Navigation", icon: "⚡", action: () => scrollToSection("skills") },
      { id: "nav-projects", label: "Jump to Featured Projects Vault", category: "Navigation", icon: "🚀", action: () => scrollToSection("projects") },
      { id: "nav-lab", label: "Jump to Interactive Engineering Lab", category: "Navigation", icon: "🧪", action: () => scrollToSection("lab") },
      { id: "nav-certs", label: "Jump to Verified Certifications (22 Files)", category: "Navigation", icon: "📜", action: () => scrollToSection("certifications") },
      { id: "nav-faq", label: "Jump to Frequently Asked Questions", category: "Navigation", icon: "❓", action: () => scrollToSection("faq") },
      { id: "nav-contact", label: "Jump to Contact & Messages", category: "Navigation", icon: "📬", action: () => scrollToSection("contact") },

      // Quick Actions
      { id: "act-resume", label: "Download Official Resume (PDF)", category: "Quick Actions", icon: "📥", action: () => downloadResume() },
      { id: "act-email", label: "Copy Email (kandukurijagan99@gmail.com)", category: "Quick Actions", icon: "📋", action: () => copyToClipboard("kandukurijagan99@gmail.com", "Email copied to clipboard!") },
      { id: "act-wa", label: "Open WhatsApp (+91 8367047947)", category: "Quick Actions", icon: "💬", action: () => window.open("https://api.whatsapp.com/send?phone=918367047947", "_blank") },
      { id: "act-github", label: "Open GitHub Profile (kandukurijagan1)", category: "Quick Actions", icon: "🐙", action: () => window.open("https://github.com/kandukurijagan1", "_blank") },
      { id: "act-linkedin", label: "Open LinkedIn Profile", category: "Quick Actions", icon: "💼", action: () => window.open("https://www.linkedin.com/in/jagan-kandukuri-053a0331b/", "_blank") },

      // Interactive Dev Mode & Features
      { id: "dev-matrix", label: "Toggle Cyber Matrix Rain Mode", category: "Developer Tools", icon: "🟢", action: () => toggleMatrixMode() },
      { id: "dev-sound", label: "Toggle Futuristic Sound FX (Web Audio)", category: "Developer Tools", icon: "🔊", action: () => AudioEngine.toggle() },
      { id: "dev-theme", label: "Toggle Dark / Light Theme", category: "Developer Tools", icon: "🌗", action: () => toggleTheme() },
      { id: "dev-vault", label: "Unlock / Open Projects Vault Door", category: "Developer Tools", icon: "🔓", action: () => unlockProjectsVault() }
    ];

    function init() {
      createPaletteDOM();
      bindKeyboardShortcuts();
      bindTriggerButtons();
    }

    function createPaletteDOM() {
      if (document.getElementById("cmd-palette-overlay")) return;

      const overlay = document.createElement("div");
      overlay.id = "cmd-palette-overlay";
      overlay.className = "cmd-palette-overlay";
      overlay.setAttribute("role", "dialog");
      overlay.setAttribute("aria-modal", "true");
      overlay.setAttribute("aria-label", "Command Palette");

      overlay.innerHTML = `
        <div class="cmd-palette-container" id="cmd-palette-container">
          <div class="cmd-palette-header">
            <svg class="cmd-palette-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input type="text" id="cmd-palette-input" class="cmd-palette-input" placeholder="Type a command or jump to... (e.g. 'projects', 'resume', 'matrix')" autocomplete="off" spellcheck="false">
            <kbd class="cmd-esc-badge">ESC</kbd>
          </div>

          <div class="cmd-palette-results" id="cmd-palette-results" role="listbox">
            <!-- Rendered dynamically -->
          </div>

          <div class="cmd-palette-footer">
            <div class="cmd-footer-hints">
              <span><kbd>↑</kbd><kbd>↓</kbd> Navigate</span>
              <span><kbd>↵</kbd> Select</span>
              <span><kbd>ESC</kbd> Close</span>
            </div>
            <div class="cmd-footer-tag">Kandukuri Jagan &bull; Portfolio Spotlight</div>
          </div>
        </div>
      `;

      document.body.appendChild(overlay);

      // Bind input events
      const input = overlay.querySelector("#cmd-palette-input");
      input.addEventListener("input", onSearchInput);
      input.addEventListener("keydown", onKeyDown);

      // Click outside to close
      overlay.addEventListener("click", (e) => {
        if (e.target === overlay) close();
      });
    }

    function bindKeyboardShortcuts() {
      document.addEventListener("keydown", (e) => {
        // Ctrl+K or Cmd+K
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
          e.preventDefault();
          toggle();
        }
        // "/" when not focused on an input/textarea
        if (e.key === "/" && !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) {
          e.preventDefault();
          open();
        }
        // Escape closes
        if (e.key === "Escape" && isOpen) {
          e.preventDefault();
          close();
        }
      });
    }

    function bindTriggerButtons() {
      const triggers = document.querySelectorAll(".cmd-k-trigger, [data-trigger='cmd-palette']");
      triggers.forEach(btn => {
        btn.addEventListener("click", () => {
          open();
        });
      });
    }

    function open() {
      const overlay = document.getElementById("cmd-palette-overlay");
      const input = document.getElementById("cmd-palette-input");
      if (!overlay || !input) return;

      isOpen = true;
      overlay.classList.add("open");
      document.body.style.overflow = "hidden";
      input.value = "";
      filterCommands("");
      selectedIndex = 0;
      renderResults();

      setTimeout(() => input.focus(), 50);
      AudioEngine.playClick();
    }

    function close() {
      const overlay = document.getElementById("cmd-palette-overlay");
      if (!overlay) return;

      isOpen = false;
      overlay.classList.remove("open");
      document.body.style.overflow = "";
      AudioEngine.playClick();
    }

    function toggle() {
      if (isOpen) close();
      else open();
    }

    function onSearchInput(e) {
      const query = (e.target.value || "").trim().toLowerCase();
      filterCommands(query);
      selectedIndex = 0;
      renderResults();
    }

    function filterCommands(query) {
      if (!query) {
        filteredCommands = [...commands];
        return;
      }
      filteredCommands = commands.filter(cmd => {
        return cmd.label.toLowerCase().includes(query) || cmd.category.toLowerCase().includes(query);
      });
    }

    function renderResults() {
      const resultsContainer = document.getElementById("cmd-palette-results");
      if (!resultsContainer) return;

      if (filteredCommands.length === 0) {
        resultsContainer.innerHTML = `
          <div class="cmd-empty-state">
            <p>No matching commands found.</p>
            <span class="cmd-empty-sub">Try searching for "projects", "resume", "matrix", or "skills"</span>
          </div>
        `;
        return;
      }

      // Group by category
      let currentCategory = "";
      let html = "";

      filteredCommands.forEach((cmd, idx) => {
        if (cmd.category !== currentCategory) {
          currentCategory = cmd.category;
          html += `<div class="cmd-category-header">${currentCategory}</div>`;
        }
        const isSelected = idx === selectedIndex;
        html += `
          <div class="cmd-item ${isSelected ? "selected" : ""}" data-index="${idx}" role="option" aria-selected="${isSelected}">
            <span class="cmd-item-icon">${cmd.icon}</span>
            <span class="cmd-item-label">${cmd.label}</span>
            <span class="cmd-item-action-hint">&crarr;</span>
          </div>
        `;
      });

      resultsContainer.innerHTML = html;

      // Click event on items
      const items = resultsContainer.querySelectorAll(".cmd-item");
      items.forEach(el => {
        el.addEventListener("mouseenter", () => {
          AudioEngine.playHover();
        });
        el.addEventListener("click", () => {
          const idx = parseInt(el.getAttribute("data-index"), 10);
          executeCommand(idx);
        });
      });

      scrollSelectedIntoView();
    }

    function onKeyDown(e) {
      if (filteredCommands.length === 0) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        selectedIndex = (selectedIndex + 1) % filteredCommands.length;
        renderResults();
        AudioEngine.playHover();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        selectedIndex = (selectedIndex - 1 + filteredCommands.length) % filteredCommands.length;
        renderResults();
        AudioEngine.playHover();
      } else if (e.key === "Enter") {
        e.preventDefault();
        executeCommand(selectedIndex);
      }
    }

    function scrollSelectedIntoView() {
      const selectedEl = document.querySelector(".cmd-item.selected");
      if (selectedEl) {
        selectedEl.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }
    }

    function executeCommand(idx) {
      const cmd = filteredCommands[idx];
      if (cmd && typeof cmd.action === "function") {
        close();
        AudioEngine.playClick();
        setTimeout(() => cmd.action(), 150);
      }
    }

    return { init, open, close, toggle };
  })();


  /* ------------------------------------------------------------------
     3. COMMAND PALETTE ACTION HELPERS
     ------------------------------------------------------------------ */
  function scrollToSection(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    // Flash subtle highlight outline
    el.style.transition = "box-shadow 0.6s ease";
    el.style.boxShadow = "0 0 0 2px var(--accent-cyan, #38bdf8)";
    setTimeout(() => {
      el.style.boxShadow = "";
    }, 1200);
  }

  function downloadResume() {
    const link = document.createElement("a");
    link.href = "assets/resume.pdf";
    link.download = "Kandukuri_Jagan_Resume.pdf";
    document.body.appendChild(link);
    link.click();
    link.remove();
    if (window.showToast) window.showToast("📄 Official Resume download started!", "success");
    AudioEngine.playSuccess();
  }

  function copyToClipboard(text, successMsg) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        if (window.showToast) window.showToast(`📋 ${successMsg}`, "success");
        AudioEngine.playSuccess();
      }).catch(() => fallbackCopy(text, successMsg));
    } else {
      fallbackCopy(text, successMsg);
    }
  }

  function fallbackCopy(text, successMsg) {
    const temp = document.createElement("textarea");
    temp.value = text;
    document.body.appendChild(temp);
    temp.select();
    document.execCommand("copy");
    temp.remove();
    if (window.showToast) window.showToast(`📋 ${successMsg}`, "success");
    AudioEngine.playSuccess();
  }

  function toggleTheme() {
    const themeBtn = document.querySelector(".theme-toggle-btn");
    if (themeBtn) {
      themeBtn.click();
      AudioEngine.playSwitch();
    }
  }

  function unlockProjectsVault() {
    const trigger = document.getElementById("vault-door-trigger");
    if (trigger) {
      trigger.click();
      AudioEngine.playSuccess();
    }
    scrollToSection("projects");
  }


  /* ------------------------------------------------------------------
     4. 3D HOLOGRAPHIC PRISMATIC CARD TILT & SPECULAR SHINE
     ------------------------------------------------------------------ */
  function initHolographicCards() {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const cards = document.querySelectorAll(".project-card, .cert-folder-card, .hero-photo-card, .about-card, .stat-card");

    cards.forEach(card => {
      // Ensure specular shine overlay element exists
      if (!card.querySelector(".holo-specular-shine")) {
        const shine = document.createElement("div");
        shine.className = "holo-specular-shine";
        shine.setAttribute("aria-hidden", "true");
        card.appendChild(shine);
      }

      card.addEventListener("mouseenter", () => {
        card.style.transition = "transform 0.1s ease-out, box-shadow 0.2s ease";
      });

      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const deltaX = (x - centerX) / centerX;
        const deltaY = (y - centerY) / centerY;

        const rotateX = -deltaY * 8; // degrees
        const rotateY = deltaX * 8;

        const percentX = (x / rect.width) * 100;
        const percentY = (y / rect.height) * 100;

        card.style.setProperty("--holo-x", `${percentX}%`);
        card.style.setProperty("--holo-y", `${percentY}%`);
        card.style.transform = `perspective(900px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
      });

      card.addEventListener("mouseleave", () => {
        card.style.transition = "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.5s ease";
        card.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
      });
    });
  }


  /* ------------------------------------------------------------------
     5. INTERACTIVE CYBER MATRIX RAIN MODE
     ------------------------------------------------------------------ */
  let matrixCanvas = null;
  let matrixCtx = null;
  let matrixAnimId = null;
  let matrixActive = false;

  function toggleMatrixMode() {
    if (matrixActive) {
      stopMatrixMode();
      if (window.showToast) window.showToast("🟢 Cyber Matrix Mode deactivated.", "info");
    } else {
      startMatrixMode();
      if (window.showToast) window.showToast("⚡ Cyber Matrix Stream activated! Press ESC or re-open Ctrl+K to toggle.", "success");
      AudioEngine.playSuccess();
    }
  }

  function startMatrixMode() {
    if (!matrixCanvas) {
      matrixCanvas = document.createElement("canvas");
      matrixCanvas.id = "cyber-matrix-canvas";
      matrixCanvas.className = "cyber-matrix-canvas";
      document.body.appendChild(matrixCanvas);
      matrixCtx = matrixCanvas.getContext("2d");
    }

    matrixCanvas.style.display = "block";
    matrixCanvas.width = window.innerWidth;
    matrixCanvas.height = window.innerHeight;
    matrixActive = true;

    const characters = "01アイウエオカキクケコサシスセソタチツテトKJ904SYNORA";
    const fontSize = 14;
    const columns = Math.floor(matrixCanvas.width / fontSize);
    const drops = [];

    for (let i = 0; i < columns; i++) {
      drops[i] = Math.floor(Math.random() * -50);
    }

    function draw() {
      matrixCtx.fillStyle = "rgba(7, 9, 14, 0.08)";
      matrixCtx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);

      matrixCtx.fillStyle = "#38bdf8"; // Neon cyan matrix font
      matrixCtx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = characters.charAt(Math.floor(Math.random() * characters.length));
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // Head of stream glow
        if (Math.random() > 0.95) {
          matrixCtx.fillStyle = "#ffffff";
        } else {
          matrixCtx.fillStyle = "#38bdf8";
        }

        matrixCtx.fillText(text, x, y);

        if (y > matrixCanvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }

      matrixAnimId = requestAnimationFrame(draw);
    }

    draw();

    window.addEventListener("resize", onMatrixResize);
  }

  function onMatrixResize() {
    if (matrixCanvas && matrixActive) {
      matrixCanvas.width = window.innerWidth;
      matrixCanvas.height = window.innerHeight;
    }
  }

  function stopMatrixMode() {
    matrixActive = false;
    if (matrixAnimId) cancelAnimationFrame(matrixAnimId);
    if (matrixCanvas) {
      matrixCanvas.style.display = "none";
    }
    window.removeEventListener("resize", onMatrixResize);
  }


  /* ------------------------------------------------------------------
     6. INITIALIZATION HOOK
     ------------------------------------------------------------------ */
  document.addEventListener("DOMContentLoaded", () => {
    CommandPalette.init();
    initHolographicCards();

    // Bind audio toggle button in header
    const audioBtn = document.getElementById("audio-toggle-btn");
    if (audioBtn) {
      audioBtn.addEventListener("click", () => {
        AudioEngine.toggle();
        AudioEngine.playClick();
      });
      // Set initial visual state
      if (!AudioEngine.isMuted()) audioBtn.classList.add("active");
    }

    // Attach subtle audio feedback to interactive buttons
    const interactiveButtons = document.querySelectorAll(".btn, .filter-btn, .theme-toggle-btn, .mobile-nav-toggle, .cert-folder-card");
    interactiveButtons.forEach(btn => {
      btn.addEventListener("mouseenter", () => AudioEngine.playHover());
      btn.addEventListener("click", () => AudioEngine.playClick());
    });
  });

})();
