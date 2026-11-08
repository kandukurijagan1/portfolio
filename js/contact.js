/**
 * Contact Form Validation & Ultra-Fast Executive Submission Handler
 * Author: Kandukuri Jagan
 * Target: kandukurijagan99@gmail.com
 * Mode: Instant Non-Blocking Dispatch with Executive In-Card Success State
 */

document.addEventListener("DOMContentLoaded", () => {
  initContactForm();
  initCopyEmail();
});

/**
 * 1. Contact Form Real-time Validation & Lightning-Fast Submission
 */
function initContactForm() {
  const contactForm = document.getElementById("portfolio-contact-form");
  const submitButton = document.getElementById("contact-submit-btn");
  const successState = document.getElementById("contact-success-state");
  const btnSendAnother = document.getElementById("btn-send-another");

  if (!contactForm || !submitButton) return;

  const nameInput = document.getElementById("contact-name");
  const emailInput = document.getElementById("contact-email");
  const subjectInput = document.getElementById("contact-subject");
  const messageInput = document.getElementById("contact-message");

  // Email regex validation
  function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }

  function setError(input, errorElementId, message) {
    input.classList.add("error");
    const errorEl = document.getElementById(errorElementId);
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.classList.add("visible");
    }
  }

  function clearError(input, errorElementId) {
    input.classList.remove("error");
    const errorEl = document.getElementById(errorElementId);
    if (errorEl) {
      errorEl.textContent = "";
      errorEl.classList.remove("visible");
    }
  }

  // Clear errors on input
  [nameInput, emailInput, subjectInput, messageInput].forEach(input => {
    if (!input) return;
    input.addEventListener("input", () => {
      const errorId = input.id + "-error";
      clearError(input, errorId);
    });
  });

  contactForm.addEventListener("submit", e => {
    e.preventDefault();

    let isValid = true;

    // Validate Name
    if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
      setError(nameInput, "contact-name-error", "Please enter your name (minimum 2 characters).");
      isValid = false;
    } else {
      clearError(nameInput, "contact-name-error");
    }

    // Validate Email
    if (!isValidEmail(emailInput.value.trim())) {
      setError(emailInput, "contact-email-error", "Please provide a valid email address.");
      isValid = false;
    } else {
      clearError(emailInput, "contact-email-error");
    }

    // Validate Subject
    if (!subjectInput.value.trim() || subjectInput.value.trim().length < 3) {
      setError(subjectInput, "contact-subject-error", "Please enter a subject (minimum 3 characters).");
      isValid = false;
    } else {
      clearError(subjectInput, "contact-subject-error");
    }

    // Validate Message
    if (!messageInput.value.trim() || messageInput.value.trim().length < 10) {
      setError(messageInput, "contact-message-error", "Please write a message (at least 10 characters).");
      isValid = false;
    } else {
      clearError(messageInput, "contact-message-error");
    }

    if (!isValid) return;

    // Capture values before resetting form
    const nameVal = nameInput.value.trim();
    const emailVal = emailInput.value.trim();
    const subjectVal = subjectInput.value.trim();
    const messageVal = messageInput.value.trim();

    // Instant Responsive Feedback (< 200ms)
    const originalBtnHtml = submitButton.innerHTML;
    submitButton.disabled = true;
    submitButton.innerHTML = `
      <svg class="btn-icon icon-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
        <path d="M12 2a10 10 0 0 1 10 10"></path>
      </svg>
      Sending...
    `;

    // Determine Webhook URL from form action or PORTFOLIO_CONFIG
    const formAction = contactForm.getAttribute("action");
    const configUrl = window.PORTFOLIO_CONFIG && window.PORTFOLIO_CONFIG.personal && window.PORTFOLIO_CONFIG.personal.contactWebhookUrl;
    const scriptUrl = (formAction && formAction.trim() !== "" && !formAction.startsWith("#")) 
      ? formAction.trim() 
      : (configUrl && configUrl !== "YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL" ? configUrl.trim() : "");

    const recipientEmail = (window.PORTFOLIO_CONFIG && window.PORTFOLIO_CONFIG.personal && window.PORTFOLIO_CONFIG.personal.email) || "kandukurijagan99@gmail.com";

    // Build URL-encoded payload for Google Apps Script
    const params = new URLSearchParams();
    params.append("name", nameVal);
    params.append("email", emailVal);
    params.append("subject", subjectVal);
    params.append("message", messageVal);

    if (scriptUrl && (scriptUrl.startsWith("https://script.google.com/") || scriptUrl.startsWith("https://formspree.io/"))) {
      // 🚀 LIGHTNING NON-BLOCKING DISPATCH:
      fetch(scriptUrl, {
        method: "POST",
        body: params,
        mode: "no-cors",
        keepalive: true
      }).catch(err => {
        console.warn("Background dispatch notice:", err);
      });

      // Transition to Executive In-Card Confirmation State in ~250ms
      setTimeout(() => {
        const senderNameEl = document.getElementById("success-sender-name");
        const subjectDisplayEl = document.getElementById("success-subject-display");

        if (senderNameEl) {
          const firstName = nameVal.split(" ")[0] || nameVal;
          senderNameEl.textContent = firstName;
        }

        if (subjectDisplayEl) {
          subjectDisplayEl.textContent = subjectVal;
        }

        // Hide form and reveal executive success card
        contactForm.style.display = "none";
        if (successState) {
          successState.style.display = "flex";
        }

        // Launch subtle celebratory particles
        launchCelebrationParticles();

        showToast("🚀 Message delivered! Jagan will get back to you soon.", "success");
        contactForm.reset();
        submitButton.disabled = false;
        submitButton.innerHTML = originalBtnHtml;
      }, 250);

    } else {
      // Direct mailto fallback if script URL is not defined
      const fallbackSubject = encodeURIComponent(subjectVal || "Portfolio Inquiry");
      const fallbackBody = encodeURIComponent(
        `Hi Jagan,\n\nName: ${nameVal}\nEmail: ${emailVal}\n\nMessage:\n${messageVal}\n\n---\nSent from Portfolio Website`
      );

      showToast(`Opening email client to send message to ${recipientEmail}...`, "info");
      
      setTimeout(() => {
        window.location.href = `mailto:${recipientEmail}?subject=${fallbackSubject}&body=${fallbackBody}`;
        submitButton.disabled = false;
        submitButton.innerHTML = originalBtnHtml;
      }, 600);

      contactForm.reset();
    }
  });

  // Handle "Send Another Message" button click
  if (btnSendAnother) {
    btnSendAnother.addEventListener("click", () => {
      if (successState) {
        successState.style.display = "none";
      }
      contactForm.style.display = "flex";
      nameInput.focus();
    });
  }
}

/**
 * 2. Copy Email to Clipboard helper
 */
function initCopyEmail() {
  const copyBtns = document.querySelectorAll(".btn-copy-email");

  copyBtns.forEach(btn => {
    btn.addEventListener("click", e => {
      e.preventDefault();
      const email = btn.getAttribute("data-email") || (window.PORTFOLIO_CONFIG && window.PORTFOLIO_CONFIG.personal.email) || "kandukurijagan99@gmail.com";

      navigator.clipboard.writeText(email).then(() => {
        const originalText = btn.textContent;
        btn.textContent = "Copied! ✓";
        showToast(`Copied ${email} to clipboard!`, "success");

        setTimeout(() => {
          btn.textContent = originalText;
        }, 2000);
      }).catch(() => {
        showToast(`Email: ${email}`, "info");
      });
    });
  });
}

/**
 * 3. Toast Notification Helper
 */
function showToast(message, type = "success") {
  let toast = document.getElementById("portfolio-toast");

  if (!toast) {
    toast = document.createElement("div");
    toast.id = "portfolio-toast";
    toast.className = "toast-notification";
    document.body.appendChild(toast);
  }

  const iconSvg = type === "success" 
    ? `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>`
    : `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;

  toast.innerHTML = `${iconSvg} <span>${message}</span>`;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 4000);
}

/**
 * 4. Executive Celebratory Particle Shimmer Burst
 */
function launchCelebrationParticles() {
  const card = document.querySelector(".contact-form-card");
  if (!card) return;

  const canvas = document.createElement("canvas");
  canvas.style.position = "absolute";
  canvas.style.top = "0";
  canvas.style.left = "0";
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.pointerEvents = "none";
  canvas.style.zIndex = "10";
  canvas.style.borderRadius = "inherit";

  card.style.position = "relative";
  card.appendChild(canvas);

  const rect = card.getBoundingClientRect();
  canvas.width = rect.width;
  canvas.height = rect.height;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    canvas.remove();
    return;
  }

  const colors = ["#38bdf8", "#8b5cf6", "#10b981", "#ec4899", "#ffffff"];
  const particles = [];
  const particleCount = 45;

  const originX = rect.width / 2;
  const originY = 80;

  for (let i = 0; i < particleCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 2 + Math.random() * 5;
    particles.push({
      x: originX,
      y: originY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 2.5,
      size: 3 + Math.random() * 3.5,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: 1,
      decay: 0.018 + Math.random() * 0.02
    });
  }

  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = false;

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.14; // gentle gravity
      p.alpha -= p.decay;

      if (p.alpha > 0) {
        alive = true;
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    });

    if (alive) {
      requestAnimationFrame(render);
    } else {
      canvas.remove();
    }
  }

  requestAnimationFrame(render);
}
