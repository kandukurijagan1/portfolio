/**
 * Interactive Engineering Lab & Live System Simulators
 * Built for Kandukuri Jagan's Portfolio
 * Features:
 * 1. Biometric Age-Gap Cold Case Forensic Studio (SIH // IBVAP)
 * 2. Aaryan Aqua Needs - Cloud GST Billing & Weigh Scale POS (v5.4 Pro)
 * 3. Synora'26 - Dynamic Event Ticket & Live QR Pass Verifier
 */

document.addEventListener("DOMContentLoaded", () => {
  initLabTabs();
  initBiometricsDemo();
  initGstBillingDemo();
  initSynoraPassDemo();
});

/**
 * 1. Lab Navigation Tabs
 */
function initLabTabs() {
  const tabs = document.querySelectorAll(".lab-tab-btn");
  const panels = document.querySelectorAll(".lab-panel");

  if (!tabs.length || !panels.length) return;

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      panels.forEach(p => p.classList.remove("active"));

      tab.classList.add("active");
      const targetId = `tab-${tab.getAttribute("data-tab")}`;
      const targetPanel = document.getElementById(targetId);
      if (targetPanel) {
        targetPanel.classList.add("active");
      }
    });
  });
}

/**
 * 2. Biometric Age-Gap Cold Case Forensic Studio
 */
function initBiometricsDemo() {
  const slider = document.getElementById("bio-split-slider");
  const youthWrap = document.getElementById("bio-youth-crop");
  const agedWrap = document.getElementById("bio-aged-crop");
  const agedImg = document.getElementById("bio-aged-img");
  const filterBtns = document.querySelectorAll(".bio-filter-btn");
  const alertBtn = document.getElementById("btn-trigger-police-alert");
  const landmarksToggle = document.getElementById("toggle-landmarks");
  const landmarkMeshes = document.querySelectorAll(".landmark-mesh");

  if (slider && youthWrap && agedWrap) {
    slider.addEventListener("input", (e) => {
      const val = e.target.value; // 0 to 100
      // 0 = Full Query Face (Aged), 100 = Full Master Record (Youth)
      youthWrap.style.opacity = (val / 100).toFixed(2);
      agedWrap.style.opacity = (1 - val / 100).toFixed(2);
    });
  }

  // Multi-Spectral Filters on Aged Suspect
  if (filterBtns && agedImg) {
    filterBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        filterBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        const mode = btn.getAttribute("data-mode");

        if (mode === "thermal") {
          agedImg.style.filter = "invert(1) hue-rotate(180deg) saturate(2.5) contrast(1.4)";
        } else if (mode === "nvg") {
          agedImg.style.filter = "sepia(1) hue-rotate(85deg) saturate(3.5) brightness(1.2) contrast(1.3)";
        } else {
          agedImg.style.filter = "none";
        }
      });
    });
  }

  // Toggle Landmark Wireframe
  if (landmarksToggle) {
    landmarksToggle.addEventListener("change", (e) => {
      landmarkMeshes.forEach(mesh => {
        mesh.style.display = e.target.checked ? "block" : "none";
      });
    });
  }

  // Simulate Instant WhatsApp & Telegram Dispatch
  if (alertBtn) {
    alertBtn.addEventListener("click", () => {
      showToast(
        "🚨 High-Priority Suspect Sighting Dispatched!",
        "Target PAUL (~74y) matched with 15y POI Master Record (62.0% ArcFace Consensus). Geotagged snapshot & Section 65B FIR sent to WhatsApp Emergency Dispatch & Telegram Bot.",
        "success"
      );
    });
  }
}

/**
 * 3. Aaryan Aqua Needs - Cloud GST Billing & Weigh Scale POS
 */
function initGstBillingDemo() {
  const varietySelect = document.getElementById("pos-item-select");
  const weightSlider = document.getElementById("pos-weight-slider");
  const weightDisplay = document.getElementById("pos-weight-display");
  const scaleReadout = document.getElementById("pos-scale-readout");
  const basePriceEl = document.getElementById("pos-base-price");
  const gstAmountEl = document.getElementById("pos-gst-amount");
  const totalAmountEl = document.getElementById("pos-total-amount");
  const dispatchBtn = document.getElementById("btn-dispatch-invoice");
  const toggleUpiBtn = document.getElementById("btn-toggle-upi");
  const upiQrBox = document.getElementById("pos-upi-box");

  if (!varietySelect || !weightSlider) return;

  const catalog = {
    vanjaram: { name: "Fresh Seer Fish (Vanjaram)", rate: 420, gstRate: 0 },
    prawns: { name: "Tiger Prawns (Grade A)", rate: 550, gstRate: 0.05 },
    pomfret: { name: "Silver Pomfret (Vawwal)", rate: 680, gstRate: 0 }
  };

  function updateBill() {
    const selectedKey = varietySelect.value;
    const item = catalog[selectedKey] || catalog.vanjaram;
    const weight = parseFloat(weightSlider.value) || 0;

    const basePrice = weight * item.rate;
    const gstPrice = basePrice * item.gstRate;
    const totalPrice = basePrice + gstPrice;

    if (weightDisplay) weightDisplay.textContent = `${weight.toFixed(2)} kg`;
    if (scaleReadout) scaleReadout.textContent = `${weight.toFixed(3)} kg`;
    if (basePriceEl) basePriceEl.textContent = `₹${basePrice.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    if (gstAmountEl) gstAmountEl.textContent = item.gstRate > 0
      ? `₹${gstPrice.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (5% GST)`
      : "₹0.00 (Exempt 0%)";
    if (totalAmountEl) totalAmountEl.textContent = `₹${totalPrice.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  varietySelect.addEventListener("change", updateBill);
  weightSlider.addEventListener("input", updateBill);

  // Preset buttons
  document.querySelectorAll(".pos-preset-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      weightSlider.value = btn.getAttribute("data-weight");
      updateBill();
    });
  });

  // WhatsApp Invoice Dispatch Simulation
  if (dispatchBtn) {
    dispatchBtn.addEventListener("click", () => {
      const selectedKey = varietySelect.value;
      const item = catalog[selectedKey] || catalog.vanjaram;
      const weight = parseFloat(weightSlider.value) || 0;
      const total = totalAmountEl ? totalAmountEl.textContent : "₹0.00";

      showToast(
        "📲 Automated WhatsApp Invoice Delivered!",
        `PDF Tax Invoice for ${weight.toFixed(2)} kg of ${item.name} (${total}) compiled via headless Puppeteer and dispatched to client WhatsApp (+91 94949 80123).`,
        "info"
      );
    });
  }

  // Toggle UPI QR Checkout
  if (toggleUpiBtn && upiQrBox) {
    toggleUpiBtn.addEventListener("click", () => {
      const isVisible = upiQrBox.style.display === "block";
      upiQrBox.style.display = isVisible ? "none" : "block";
      toggleUpiBtn.textContent = isVisible ? "💳 Show Dynamic UPI QR" : "✕ Hide UPI QR";
    });
  }

  updateBill();
}

/**
 * 4. Synora'26 - Dynamic Event Ticket & Live QR Pass Verifier
 */
function initSynoraPassDemo() {
  const nameInput = document.getElementById("synora-input-name");
  const trackSelect = document.getElementById("synora-select-track");
  const badgeName = document.getElementById("synora-badge-name");
  const badgeTrack = document.getElementById("synora-badge-track");
  const badgeId = document.getElementById("synora-badge-id");
  const scanBtn = document.getElementById("btn-scan-synora-pass");
  const statusEl = document.getElementById("synora-scan-status");

  if (!nameInput || !badgeName) return;

  function updateBadge() {
    const name = nameInput.value.trim() || "Dev Innovator";
    const track = trackSelect ? trackSelect.value : "AI & Computer Vision";
    badgeName.textContent = name;
    if (badgeTrack) badgeTrack.textContent = `Track: ${track}`;
    if (badgeId) {
      // Deterministic hash based on name
      let hash = 1000;
      for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) % 9000 + 1000;
      badgeId.textContent = `SYN26-${hash}`;
    }
  }

  nameInput.addEventListener("input", updateBadge);
  if (trackSelect) trackSelect.addEventListener("change", updateBadge);

  if (scanBtn && statusEl) {
    scanBtn.addEventListener("click", () => {
      scanBtn.disabled = true;
      scanBtn.innerHTML = `<span>Scanning QR...</span>`;
      statusEl.style.display = "block";
      statusEl.className = "synora-scan-status verifying";
      statusEl.innerHTML = `<span>⏳ Verifying Cryptographic Anti-Tamper Signature...</span>`;

      setTimeout(() => {
        scanBtn.disabled = false;
        scanBtn.innerHTML = `<span>⚡ Scan &amp; Validate Hall Entry</span>`;
        statusEl.className = "synora-scan-status verified";
        statusEl.innerHTML = `<span>✓ ENTRY VALIDATED: Synora'26 Main Hall Check-in Recorded for <strong>${badgeName.textContent}</strong></span>`;
        showToast(
          "🎟️ Synora'26 Hall Entry Recorded!",
          `Dynamic QR verification successful. Attendance synced to Synora'26 Live Dashboard & Headcount Ledger.`,
          "success"
        );
      }, 700);
    });
  }

  updateBadge();
}

/**
 * Reusable Transient Toast Notification
 */
function showToast(title, message, type = "info") {
  let container = document.getElementById("lab-toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "lab-toast-container";
    container.className = "lab-toast-container";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = `lab-toast lab-toast-${type}`;

  const icon = type === "success" ? "✓" : "⚡";
  toast.innerHTML = `
    <div class="toast-indicator">${icon}</div>
    <div class="toast-body">
      <div class="toast-title">${title}</div>
      <div class="toast-msg">${message}</div>
    </div>
    <button type="button" class="toast-close" aria-label="Close notification">&times;</button>
  `;

  container.appendChild(toast);

  toast.querySelector(".toast-close").addEventListener("click", () => {
    toast.remove();
  });

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(-10px) scale(0.95)";
    setTimeout(() => toast.remove(), 300);
  }, 5000);
}
