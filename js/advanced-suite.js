/**
 * ==============================================================================
 * ADVANCED PORTFOLIO INTERACTION SUITE (v9.5)
 * 1. Procedural Web Audio Synthesis Engine (Zero external audio assets)
 * 2. Command Palette (Ctrl+K / ⌘K Spotlight Center)
 * 3. Interactive Developer CLI Terminal (jagan-cli)
 * 4. Interactive System Architecture Blueprint Modal
 * 5. Apple-Style Kinetic Magnetic Dock
 * 6. 3D Holographic Prismatic Card Tilt & Shimmer
 * 7. Interactive Cyber Matrix Rain Mode
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

    function playTerminalKey() {
      if (isMuted()) return;
      try {
        const c = getAudioContext();
        if (!c) return;
        const osc = c.createOscillator();
        const gain = c.createGain();
        const now = c.currentTime;

        osc.type = "sine";
        const f = 700 + Math.random() * 200;
        osc.frequency.setValueAtTime(f, now);

        gain.gain.setValueAtTime(0.01, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.02);

        osc.connect(gain);
        gain.connect(c.destination);

        osc.start(now);
        osc.stop(now + 0.02);
      } catch (_) {}
    }

    function updateAudioToggleBtn() {
      const btns = document.querySelectorAll("#audio-toggle-btn, .dock-audio-btn");
      const muted = isMuted();
      btns.forEach(btn => {
        btn.setAttribute("aria-pressed", muted ? "false" : "true");
        btn.title = muted ? "Turn Sound FX On (Web Audio)" : "Mute Sound FX";
        btn.classList.toggle("active", !muted);
      });
    }

    return {
      playHover,
      playClick,
      playSuccess,
      playSwitch,
      playTerminalKey,
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

      // Interactive Architecture Blueprints
      { id: "arch-synora", label: "Inspect Architecture: Synora'26 Tech Suite", category: "Architecture Blueprints", icon: "📐", action: () => ArchitectureInspector.open("synora26-suite") },
      { id: "arch-aqua", label: "Inspect Architecture: Aqua Needs GST Hub", category: "Architecture Blueprints", icon: "📐", action: () => ArchitectureInspector.open("fish-billing") },
      { id: "arch-crime", label: "Inspect Architecture: Facial Crime Detection", category: "Architecture Blueprints", icon: "📐", action: () => ArchitectureInspector.open("crime-monitoring") },
      { id: "arch-assistant", label: "Inspect Architecture: AI Desktop Assistant", category: "Architecture Blueprints", icon: "📐", action: () => ArchitectureInspector.open("desktop-assistant") },

      // Developer Tools & Terminal
      { id: "dev-cli", label: "Open Developer CLI Terminal (jagan-cli)", category: "Developer Tools", icon: "💻", action: () => DeveloperTerminal.open() },
      { id: "dev-matrix", label: "Toggle Cyber Matrix Rain Mode", category: "Developer Tools", icon: "🟢", action: () => toggleMatrixMode() },
      { id: "dev-sound", label: "Toggle Futuristic Sound FX (Web Audio)", category: "Developer Tools", icon: "🔊", action: () => AudioEngine.toggle() },
      { id: "dev-theme", label: "Toggle Dark / Light Theme", category: "Developer Tools", icon: "🌗", action: () => toggleTheme() },
      { id: "dev-vault", label: "Unlock / Open Projects Vault Door", category: "Developer Tools", icon: "🔓", action: () => unlockProjectsVault() },

      // Quick Actions
      { id: "act-resume", label: "Download Official Resume (PDF)", category: "Quick Actions", icon: "📥", action: () => downloadResume() },
      { id: "act-email", label: "Copy Email (kandukurijagan99@gmail.com)", category: "Quick Actions", icon: "📋", action: () => copyToClipboard("kandukurijagan99@gmail.com", "Email copied to clipboard!") },
      { id: "act-wa", label: "Open WhatsApp (+91 8367047947)", category: "Quick Actions", icon: "💬", action: () => window.open("https://api.whatsapp.com/send?phone=918367047947", "_blank") },
      { id: "act-github", label: "Open GitHub Profile (kandukurijagan1)", category: "Quick Actions", icon: "🐙", action: () => window.open("https://github.com/kandukurijagan1", "_blank") },
      { id: "act-linkedin", label: "Open LinkedIn Profile", category: "Quick Actions", icon: "💼", action: () => window.open("https://www.linkedin.com/in/jagan-kandukuri-053a0331b/", "_blank") }
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
            <input type="text" id="cmd-palette-input" class="cmd-palette-input" placeholder="Type a command or jump to... (e.g. 'projects', 'resume', 'matrix', 'terminal')" autocomplete="off" spellcheck="false">
            <kbd class="cmd-esc-badge">ESC</kbd>
          </div>

          <div class="cmd-palette-results" id="cmd-palette-results" role="listbox"></div>

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

      const input = overlay.querySelector("#cmd-palette-input");
      input.addEventListener("input", onSearchInput);
      input.addEventListener("keydown", onKeyDown);

      overlay.addEventListener("click", (e) => {
        if (e.target === overlay) close();
      });
    }

    function bindKeyboardShortcuts() {
      document.addEventListener("keydown", (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
          e.preventDefault();
          toggle();
        }
        if (e.key === "/" && !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) {
          e.preventDefault();
          open();
        }
        if (e.key === "Escape" && isOpen) {
          e.preventDefault();
          close();
        }
      });
    }

    function bindTriggerButtons() {
      const triggers = document.querySelectorAll(".cmd-k-trigger, [data-trigger='cmd-palette'], .dock-cmd-btn");
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

      const items = resultsContainer.querySelectorAll(".cmd-item");
      items.forEach(el => {
        el.addEventListener("mouseenter", () => AudioEngine.playHover());
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
     3. INTERACTIVE DEVELOPER CLI TERMINAL (jagan-cli)
     ------------------------------------------------------------------ */
  const DeveloperTerminal = (function () {
    let isOpen = false;
    let history = [];
    let historyIndex = -1;

    const bannerText = `
  __  __   _      _   ___    _   _        ___ ___ ___ 
  \\ \\/ /  | |    / \\ / ___| / \\ | \\ | |  / __|_ _|_ _|
   \\  / _ | |   / _ \\ |  _ / _ \\|  \\| | | |   | | | | 
   /  \\| |_| |  / ___ \\ |_| / ___ \\ |\\  | | |___| | | | 
  /_/\\_\\\\___/  /_/   \\_\\____/_/   \\_\\_| \\_|  \\____|___|___|

  ⚡ Kandukuri Jagan [v2.4.0-prod] • Saveetha University (CGPA 9.04)
  Type 'help' to view available commands.
    `;

    const commandsHelp = [
      { cmd: "help", desc: "List all executable terminal commands" },
      { cmd: "about", desc: "Display software engineering profile and background" },
      { cmd: "skills", desc: "Print full-stack, AI, database & tooling competencies" },
      { cmd: "projects", desc: "List production systems (Synora'26, Aqua GST, SIH)" },
      { cmd: "metrics", desc: "Show verified academic & hackathon scale metrics" },
      { cmd: "resume", desc: "Initiate download of official PDF resume" },
      { cmd: "contact", desc: "Display verified communication endpoints" },
      { cmd: "matrix", desc: "Toggle background cyber matrix code rain" },
      { cmd: "audio", desc: "Toggle synthesized procedural sound effects" },
      { cmd: "theme", desc: "Switch between Cyber Dark and Day Light modes" },
      { cmd: "sudo hire", desc: "Authorize high-priority recruitment fast-track" },
      { cmd: "clear", desc: "Wipe terminal session history" }
    ];

    function init() {
      createTerminalDOM();
      bindShortcuts();
    }

    function createTerminalDOM() {
      if (document.getElementById("dev-terminal-overlay")) return;

      const overlay = document.createElement("div");
      overlay.id = "dev-terminal-overlay";
      overlay.className = "dev-terminal-overlay";
      overlay.setAttribute("role", "dialog");
      overlay.setAttribute("aria-label", "Developer CLI Terminal");

      overlay.innerHTML = `
        <div class="dev-terminal-window">
          <div class="dev-terminal-titlebar">
            <div class="terminal-traffic-lights">
              <span class="traffic-dot dot-red" id="term-close-btn" title="Close Terminal"></span>
              <span class="traffic-dot dot-yellow" title="Minimize"></span>
              <span class="traffic-dot dot-green" id="term-max-btn" title="Maximize"></span>
            </div>
            <div class="terminal-title-text">
              <span class="term-status-dot"></span>
              jagan@portfolio: ~/core (zsh)
            </div>
            <div class="terminal-titlebar-tag">KJ-OS v2.4</div>
          </div>

          <div class="dev-terminal-body" id="dev-terminal-body">
            <pre class="terminal-banner">${bannerText}</pre>
            <div id="terminal-output-feed" class="terminal-output-feed"></div>

            <div class="terminal-prompt-line">
              <span class="term-user-path">jagan@saveetha:<span class="term-tilde">~</span>$</span>
              <input type="text" id="terminal-cmd-input" class="terminal-cmd-input" spellcheck="false" autocomplete="off" autocapitalize="off">
            </div>
          </div>
        </div>
      `;

      document.body.appendChild(overlay);

      const input = overlay.querySelector("#terminal-cmd-input");
      const closeBtn = overlay.querySelector("#term-close-btn");

      input.addEventListener("keydown", handleTerminalInput);
      closeBtn.addEventListener("click", close);

      overlay.addEventListener("click", (e) => {
        if (e.target === overlay) close();
        else input.focus();
      });
    }

    function bindShortcuts() {
      // Toggle with Ctrl+` or ~ key
      document.addEventListener("keydown", (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === "`") {
          e.preventDefault();
          toggle();
        }
        if (e.key === "Escape" && isOpen) {
          e.preventDefault();
          close();
        }
      });

      const triggers = document.querySelectorAll(".btn-terminal-trigger, .dock-terminal-btn");
      triggers.forEach(btn => btn.addEventListener("click", open));
    }

    function open() {
      const overlay = document.getElementById("dev-terminal-overlay");
      const input = document.getElementById("terminal-cmd-input");
      if (!overlay || !input) return;

      isOpen = true;
      overlay.classList.add("open");
      document.body.style.overflow = "hidden";
      setTimeout(() => input.focus(), 60);
      AudioEngine.playSuccess();
    }

    function close() {
      const overlay = document.getElementById("dev-terminal-overlay");
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

    function handleTerminalInput(e) {
      AudioEngine.playTerminalKey();
      const input = e.target;

      if (e.key === "Enter") {
        const raw = input.value.trim();
        input.value = "";
        if (!raw) return;

        history.push(raw);
        historyIndex = history.length;

        printLine(`jagan@saveetha:~$ ${raw}`, "term-line-echo");
        executeCommand(raw);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (historyIndex > 0) {
          historyIndex--;
          input.value = history[historyIndex] || "";
        }
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        if (historyIndex < history.length - 1) {
          historyIndex++;
          input.value = history[historyIndex] || "";
        } else {
          historyIndex = history.length;
          input.value = "";
        }
      } else if (e.key === "Tab") {
        e.preventDefault();
        const current = input.value.trim().toLowerCase();
        if (!current) return;
        const match = commandsHelp.find(c => c.cmd.startsWith(current));
        if (match) input.value = match.cmd;
      }
    }

    function printLine(text, className = "") {
      const feed = document.getElementById("terminal-output-feed");
      const body = document.getElementById("dev-terminal-body");
      if (!feed) return;

      const p = document.createElement("div");
      p.className = `terminal-line ${className}`;
      p.innerHTML = text;
      feed.appendChild(p);

      if (body) body.scrollTop = body.scrollHeight;
    }

    function executeCommand(raw) {
      const args = raw.trim().split(/\s+/);
      const cmd = args[0].toLowerCase();

      switch (cmd) {
        case "help":
          let helpHtml = `<div class="term-table-header">AVAILABLE COMMANDS:</div>`;
          commandsHelp.forEach(c => {
            helpHtml += `<div class="term-table-row"><span class="term-cmd-key">${c.cmd}</span><span class="term-cmd-desc">${c.desc}</span></div>`;
          });
          printLine(helpHtml);
          break;

        case "about":
          printLine(`
            <div class="term-block-accent">
              <strong>KANDUKURI JAGAN</strong> &bull; Full Stack &amp; AI Systems Developer<br/>
              &bull; <strong>University:</strong> Saveetha University, Chennai (B.E. Computer Science, 3rd Year)<br/>
              &bull; <strong>CGPA:</strong> 9.04 / 10.0 (Rank Holder)<br/>
              &bull; <strong>Leadership:</strong> Main Tech Lead, Synora'26 Hackathon (80+ Teams, 350+ Devs)<br/>
              &bull; <strong>Focus:</strong> High-concurrency MERN ecosystems, Computer Vision (DeepFace/OpenCV), Production Billing Systems.
            </div>
          `);
          break;

        case "skills":
          printLine(`
            <div class="term-block">
              <span style="color:#38bdf8; font-weight:700;">[FRONTEND]:</span> React.js, Next.js, Redux, TailwindCSS, Three.js, GSAP<br/>
              <span style="color:#10b981; font-weight:700;">[BACKEND]:</span>  Node.js, Express, Python (FastAPI/Flask), REST APIs, WebSockets<br/>
              <span style="color:#a855f7; font-weight:700;">[DATABASE]:</span> Supabase PostgreSQL, MySQL, Redis, MongoDB, IndexedDB<br/>
              <span style="color:#f59e0b; font-weight:700;">[AI / ML]:</span>   OpenCV, DeepFace, PyTorch, Gemini API, PyAutoGUI
            </div>
          `);
          break;

        case "projects":
          printLine(`
            <div class="term-block">
              <strong>1. Synora'26 Hackathon Suite:</strong> Unified 4-platform ecosystem for 80+ teams.<br/>
              <strong>2. Aaryan Aqua Needs:</strong> Production Cloud GST Billing &amp; Inventory Hub.<br/>
              <strong>3. Facial Crime Alert System:</strong> SIH national surveillance with 512-d embeddings.<br/>
              <strong>4. AI Voice Desktop Assistant:</strong> Offline speech automation with local LLMs.<br/>
              <em>Type 'arch &lt;project-id&gt;' or inspect via Command Palette.</em>
            </div>
          `);
          break;

        case "metrics":
          printLine(`
            <div class="term-block-accent">
              🎓 <strong>CGPA:</strong> 9.04 / 10.0 (Saveetha University)<br/>
              🏆 <strong>Hackathons:</strong> 14 Verified Wins &amp; Finalist Placements<br/>
              🚀 <strong>Teams Managed:</strong> 80+ Teams (~350 Developers)<br/>
              📜 <strong>Credentials:</strong> 22 Verified Accreditations &amp; Papers
            </div>
          `);
          break;

        case "resume":
          downloadResume();
          printLine(`<span style="color:#10b981;">[SUCCESS]</span> Initiated download of official resume PDF.`);
          break;

        case "contact":
          printLine(`
            <div class="term-block">
              📧 <strong>Email:</strong> <a href="mailto:kandukurijagan99@gmail.com" style="color:#38bdf8;">kandukurijagan99@gmail.com</a><br/>
              💬 <strong>WhatsApp:</strong> <a href="https://api.whatsapp.com/send?phone=918367047947" target="_blank" style="color:#10b981;">+91 8367047947</a><br/>
              🐙 <strong>GitHub:</strong> <a href="https://github.com/kandukurijagan1" target="_blank" style="color:#94a3b8;">github.com/kandukurijagan1</a><br/>
              💼 <strong>LinkedIn:</strong> <a href="https://www.linkedin.com/in/jagan-kandukuri-053a0331b/" target="_blank" style="color:#38bdf8;">linkedin.com/in/jagan-kandukuri</a>
            </div>
          `);
          break;

        case "matrix":
          toggleMatrixMode();
          printLine(`<span style="color:#38bdf8;">[MATRIX]</span> Toggled background cyber stream mode.`);
          break;

        case "audio":
        case "sound":
          AudioEngine.toggle();
          printLine(`<span style="color:#38bdf8;">[AUDIO]</span> Sound FX state: ${AudioEngine.isMuted() ? "MUTED" : "ENABLED"}`);
          break;

        case "theme":
          toggleTheme();
          printLine(`<span style="color:#38bdf8;">[THEME]</span> Switched color scheme.`);
          break;

        case "sudo":
          if (args[1] === "hire") {
            AudioEngine.playSuccess();
            printLine(`
              <div style="background:rgba(16,185,129,0.15); border:1px solid #10b981; padding:10px; border-radius:6px; color:#10b981;">
                <strong>ACCESS GRANTED &bull; CLEARANCE LEVEL 5:</strong><br/>
                Kandukuri Jagan is immediately available for Software Engineering Internships and Full-Stack Developer opportunities!<br/>
                Email: <em>kandukurijagan99@gmail.com</em> | Direct Line: <em>+91 8367047947</em>
              </div>
            `);
          } else {
            printLine(`<span style="color:#ef4444;">sudo: permission denied. Try 'sudo hire'</span>`);
          }
          break;

        case "clear":
          const feed = document.getElementById("terminal-output-feed");
          if (feed) feed.innerHTML = "";
          break;

        default:
          printLine(`<span style="color:#f87171;">Command not found: '${cmd}'. Type 'help' to see valid commands.</span>`);
          break;
      }
    }

    return { init, open, close, toggle };
  })();

  window.PortfolioTerminal = DeveloperTerminal;


  /* ------------------------------------------------------------------
     4. INTERACTIVE SYSTEM ARCHITECTURE BLUEPRINT MODAL
     ------------------------------------------------------------------ */
  const ArchitectureInspector = (function () {
    const blueprints = {
      "synora26-suite": {
        title: "Synora'26 &ndash; Complete Hackathon Tech Suite",
        tag: "High-Concurrency Event Infrastructure &bull; 80+ Teams Scale",
        desc: "Unified 4-platform ecosystem engineered to automate registration, biometric QR check-ins, multi-judge score normalization, and cryptographic vector credential generation.",
        nodes: [
          { name: "Client Layer", tech: "React 18 + Vite PWA", role: "Dynamic QR Scanner, Team Management, Real-time Leaderboard" },
          { name: "API Gateway", tech: "Node.js Express + WebSockets", role: "Bi-directional score syncing, rate-limited auth endpoints" },
          { name: "Database Cluster", tech: "MySQL 8.0 + Redis Cache", role: "ACID transaction guarantees for team quotas & score tallies" },
          { name: "Credential Engine", tech: "Node Vector Canvas + QR", role: "Anti-tamper cryptographic certificate synthesis (350+ passes)" }
        ],
        metrics: [
          { label: "Concurrent Teams", val: "80+ Teams" },
          { label: "Live Participants", val: "350+ Devs" },
          { label: "QR Check-in Latency", val: "< 180 ms" },
          { label: "Leaderboard Sync", val: "Real-Time WSS" }
        ]
      },
      "fish-billing": {
        title: "Aaryan Aqua Needs &ndash; Cloud GST Billing &amp; Inventory Hub",
        tag: "Commercial Enterprise Client &bull; Offline-First POS",
        desc: "Mission-critical retail seafood billing platform operating with offline-first client persistence, Web Serial hardware scale interface, and automated WhatsApp invoice dispatch.",
        nodes: [
          { name: "Client POS Terminal", tech: "React.js + IndexedDB", role: "Zero-latency offline billing operations during internet drops" },
          { name: "Hardware Scale Bridge", tech: "Web Serial API (RS-232)", role: "Direct automated COM3 continuous weight scale reading" },
          { name: "Cloud Synchronization", tech: "Supabase PostgreSQL", role: "Bi-directional master database sync with row-level security" },
          { name: "Dispatch Pipeline", tech: "Puppeteer + WhatsApp API", role: "Instant GST-compliant tax invoice compilation & delivery" }
        ],
        metrics: [
          { label: "Tax Computation", val: "CGST/SGST/IGST" },
          { label: "Offline Resilience", val: "100% Standalone" },
          { label: "Checkout Duration", val: "< 15 seconds" },
          { label: "Invoice Delivery", val: "WhatsApp Auto" }
        ]
      },
      "crime-monitoring": {
        title: "Facial-Based Crime Monitoring &amp; Alert System",
        tag: "Smart India Hackathon (SIH) &bull; Computer Vision",
        desc: "High-security surveillance pipeline processing continuous RTSP video streams, extracting 512-dimensional facial feature vectors, and triggering geofenced alerts.",
        nodes: [
          { name: "Stream Ingestion", tech: "RTSP Video Streamer", role: "Multi-threaded camera frame capture & pre-processing" },
          { name: "Detection Core", tech: "OpenCV Haar / MTCNN", role: "Real-time bounding box extraction & face alignment" },
          { name: "Vector Embedding", tech: "DeepFace / FaceNet", role: "512-d feature extraction with Cosine distance indexing" },
          { name: "Alert Gateway", tech: "FastAPI + Telegram API", role: "Sub-second emergency dispatch with captured face crops" }
        ],
        metrics: [
          { label: "Processing Speed", val: "30+ FPS" },
          { label: "Vector Dimension", val: "512-d Floats" },
          { label: "Alert Dispatch", val: "< 450 ms" },
          { label: "Accuracy Rate", val: "97.4%" }
        ]
      },
      "desktop-assistant": {
        title: "AI-Powered Real-Time Desktop Assistant",
        tag: "Multimodal Voice &amp; OS Automation Engine",
        desc: "Hands-free voice assistant featuring wake-word detection, local LLM context parsing, system automation primitives, and offline neural speech synthesis.",
        nodes: [
          { name: "Audio Ingestion", tech: "PyAudio + Noise Filter", role: "Continuous microphone streaming with ambient noise calibration" },
          { name: "Speech-to-Text", tech: "Google STT / Whisper", role: "Low-latency phonetic speech transcription" },
          { name: "Cognitive Router", tech: "Ollama LLM + Gemini API", role: "Intent categorization, system function mapping & tool execution" },
          { name: "OS Automation", tech: "PyAutoGUI + Subprocesses", role: "Window management, application launch, automated screen tasks" }
        ],
        metrics: [
          { label: "Wake-Word Latency", val: "< 200 ms" },
          { label: "TTS Synthesis", val: "Neural pyttsx3" },
          { label: "Tool Automation", val: "25+ OS Primitives" },
          { label: "Local LLM Option", val: "Ollama Llama 3" }
        ]
      }
    };

    function init() {
      createModalDOM();
      bindProjectButtons();
    }

    function createModalDOM() {
      if (document.getElementById("arch-blueprint-modal")) return;

      const modal = document.createElement("div");
      modal.id = "arch-blueprint-modal";
      modal.className = "arch-blueprint-modal";
      modal.setAttribute("role", "dialog");
      modal.setAttribute("aria-label", "System Architecture Blueprint");

      modal.innerHTML = `
        <div class="arch-modal-dialog">
          <div class="arch-modal-header">
            <div>
              <div class="arch-blueprint-tag" id="arch-blueprint-tag">SYSTEM ARCHITECTURE // SPEC-01</div>
              <h3 class="arch-blueprint-title" id="arch-blueprint-title">Project System Blueprint</h3>
            </div>
            <button type="button" class="arch-modal-close" id="arch-modal-close-btn" aria-label="Close Blueprint Modal">&times;</button>
          </div>

          <div class="arch-modal-body">
            <p class="arch-blueprint-desc" id="arch-blueprint-desc"></p>

            <div class="arch-diagram-canvas" id="arch-diagram-canvas">
              <!-- Rendered Nodes & Circuit Lines -->
            </div>

            <div class="arch-metrics-grid" id="arch-metrics-grid">
              <!-- Rendered Performance Benchmarks -->
            </div>
          </div>
        </div>
      `;

      document.body.appendChild(modal);

      const closeBtn = modal.querySelector("#arch-modal-close-btn");
      closeBtn.addEventListener("click", close);

      modal.addEventListener("click", (e) => {
        if (e.target === modal) close();
      });
    }

    function bindProjectButtons() {
      document.addEventListener("click", (e) => {
        const btn = e.target.closest(".btn-inspect-arch, [data-arch-project]");
        if (btn) {
          const projectId = btn.getAttribute("data-arch-project");
          if (projectId) open(projectId);
        }
      });
    }

    function open(projectId) {
      const data = blueprints[projectId];
      if (!data) return;

      const modal = document.getElementById("arch-blueprint-modal");
      if (!modal) return;

      modal.querySelector("#arch-blueprint-tag").innerHTML = data.tag;
      modal.querySelector("#arch-blueprint-title").innerHTML = data.title;
      modal.querySelector("#arch-blueprint-desc").innerHTML = data.desc;

      // Render Nodes Flowchart
      const canvas = modal.querySelector("#arch-diagram-canvas");
      let nodesHtml = `<div class="arch-flow-row">`;
      data.nodes.forEach((node, i) => {
        nodesHtml += `
          <div class="arch-node-box">
            <div class="arch-node-badge">LAYER 0${i + 1}</div>
            <div class="arch-node-name">${node.name}</div>
            <div class="arch-node-tech">${node.tech}</div>
            <div class="arch-node-role">${node.role}</div>
          </div>
        `;
        if (i < data.nodes.length - 1) {
          nodesHtml += `
            <div class="arch-node-arrow">
              <span class="arch-arrow-line"></span>
              <span class="arch-pulse-packet"></span>
              <span class="arch-arrow-head">&rarr;</span>
            </div>
          `;
        }
      });
      nodesHtml += `</div>`;
      canvas.innerHTML = nodesHtml;

      // Render Metrics
      const metricsGrid = modal.querySelector("#arch-metrics-grid");
      let metricsHtml = "";
      data.metrics.forEach(m => {
        metricsHtml += `
          <div class="arch-metric-card">
            <span class="arch-metric-label">${m.label}</span>
            <strong class="arch-metric-val">${m.val}</strong>
          </div>
        `;
      });
      metricsGrid.innerHTML = metricsHtml;

      modal.classList.add("open");
      document.body.style.overflow = "hidden";
      AudioEngine.playSuccess();
    }

    function close() {
      const modal = document.getElementById("arch-blueprint-modal");
      if (!modal) return;
      modal.classList.remove("open");
      document.body.style.overflow = "";
      AudioEngine.playClick();
    }

    return { init, open, close };
  })();

  window.PortfolioArchitecture = ArchitectureInspector;


  /* ------------------------------------------------------------------
     5. APPLE-STYLE KINETIC MAGNETIC DOCK
     ------------------------------------------------------------------ */
  const MagneticDock = (function () {
    function init() {
      if (document.getElementById("kinetic-magnetic-dock")) return;

      const dock = document.createElement("nav");
      dock.id = "kinetic-magnetic-dock";
      dock.className = "kinetic-magnetic-dock";
      dock.setAttribute("aria-label", "Quick Dock Navigation");

      dock.innerHTML = `
        <div class="dock-wrapper" id="dock-wrapper">
          <a href="#home" class="dock-item" data-tooltip="Home" aria-label="Home">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
          </a>
          <a href="#about" class="dock-item" data-tooltip="About Me" aria-label="About Me">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
          </a>
          <a href="#skills" class="dock-item" data-tooltip="Skills" aria-label="Skills">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
          </a>
          <a href="#projects" class="dock-item" data-tooltip="Projects" aria-label="Projects">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
          </a>
          <a href="#lab" class="dock-item" data-tooltip="Engineering Lab" aria-label="Engineering Lab">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 2v7.31M14 2v7.31M8.5 2h7M14 9.3a6.5 6.5 0 1 1-4 0"></path></svg>
          </a>
          <a href="#certifications" class="dock-item" data-tooltip="Certifications" aria-label="Certifications">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>
          </a>
          <a href="#contact" class="dock-item" data-tooltip="Contact" aria-label="Contact">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
          </a>
          <span class="dock-divider"></span>
          <button type="button" class="dock-item dock-terminal-btn" data-tooltip="CLI Terminal (Ctrl+\`)" aria-label="CLI Terminal">
            <span class="dock-terminal-icon">&gt;_</span>
          </button>
          <button type="button" class="dock-item dock-cmd-btn" data-tooltip="Spotlight (Ctrl+K)" aria-label="Command Palette">
            <span class="dock-cmd-icon">⌘K</span>
          </button>
          <button type="button" class="dock-item dock-audio-btn" data-tooltip="Toggle Audio FX" aria-label="Toggle Audio">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
          </button>
        </div>
      `;

      document.body.appendChild(dock);

      // Kinetic Magnetic Spring Physics
      const items = dock.querySelectorAll(".dock-item");
      const wrapper = dock.querySelector(".dock-wrapper");

      wrapper.addEventListener("mousemove", (e) => {
        items.forEach(item => {
          const rect = item.getBoundingClientRect();
          const itemCenterX = rect.left + rect.width / 2;
          const distance = Math.abs(e.clientX - itemCenterX);
          const maxDistance = 120; // Influence radius

          if (distance < maxDistance) {
            // Gaussian bell curve scaling
            const scale = 1 + 0.38 * Math.cos((distance / maxDistance) * (Math.PI / 2));
            item.style.transform = `scale(${scale.toFixed(3)}) translateY(-${((scale - 1) * 12).toFixed(1)}px)`;
          } else {
            item.style.transform = "scale(1) translateY(0)";
          }
        });
      });

      wrapper.addEventListener("mouseleave", () => {
        items.forEach(item => {
          item.style.transform = "scale(1) translateY(0)";
        });
      });

      // Bind audio toggle inside dock
      const dockAudioBtn = dock.querySelector(".dock-audio-btn");
      if (dockAudioBtn) {
        dockAudioBtn.addEventListener("click", () => {
          AudioEngine.toggle();
          AudioEngine.playClick();
        });
      }
    }

    return { init };
  })();


  /* ------------------------------------------------------------------
     6. 3D HOLOGRAPHIC PRISMATIC CARD TILT & SPECULAR SHINE
     ------------------------------------------------------------------ */
  function initHolographicCards() {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const cards = document.querySelectorAll(".project-card, .cert-folder-card, .hero-photo-card, .about-card, .stat-card");

    cards.forEach(card => {
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

        const rotateX = -deltaY * 7;
        const rotateY = deltaX * 7;

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
     7. INTERACTIVE CYBER MATRIX RAIN MODE
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

      matrixCtx.fillStyle = "#38bdf8";
      matrixCtx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = characters.charAt(Math.floor(Math.random() * characters.length));
        const x = i * fontSize;
        const y = drops[i] * fontSize;

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
    if (matrixCanvas) matrixCanvas.style.display = "none";
    window.removeEventListener("resize", onMatrixResize);
  }


  /* ------------------------------------------------------------------
     8. GLOBAL SHARED HELPERS
     ------------------------------------------------------------------ */
  function scrollToSection(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    el.style.transition = "box-shadow 0.6s ease";
    el.style.boxShadow = "0 0 0 2px var(--accent-cyan, #38bdf8)";
    setTimeout(() => { el.style.boxShadow = ""; }, 1200);
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
     9. SUITE INITIALIZATION
     ------------------------------------------------------------------ */
  document.addEventListener("DOMContentLoaded", () => {
    CommandPalette.init();
    DeveloperTerminal.init();
    ArchitectureInspector.init();
    MagneticDock.init();
    initHolographicCards();

    // Bind audio toggle in header
    const audioBtn = document.getElementById("audio-toggle-btn");
    if (audioBtn) {
      audioBtn.addEventListener("click", () => {
        AudioEngine.toggle();
        AudioEngine.playClick();
      });
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
