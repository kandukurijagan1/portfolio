/**
 * Portfolio Projects & Verified Certificates Module
 * Author: Kandukuri Jagan
 * Handles category filtering, interactive credential folders, and lightbox inspection
 */

document.addEventListener("DOMContentLoaded", () => {
  initProjectFilters();
  initCertificates();
});

/**
 * 1. Project Filtering by Category
 */
function initProjectFilters() {
  const filterButtons = document.querySelectorAll(".projects-filter-bar .filter-btn, .skills-filter-nav:not(.certs-filter-bar) .filter-btn");
  const projectCards = document.querySelectorAll(".project-card");

  if (!filterButtons.length || !projectCards.length) return;

  filterButtons.forEach(button => {
    button.addEventListener("click", () => {
      // Toggle active states
      filterButtons.forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");

      const filterValue = button.getAttribute("data-filter");

      projectCards.forEach(card => {
        const category = card.getAttribute("data-category");

        if (filterValue === "all" || category === filterValue) {
          card.classList.remove("hide");
          card.style.display = "";
          setTimeout(() => {
            card.style.opacity = "1";
            card.style.transform = "translateY(0) scale(1)";
          }, 10);
        } else {
          card.style.opacity = "0";
          card.style.transform = "translateY(20px) scale(0.95)";
          setTimeout(() => {
            card.classList.add("hide");
            card.style.display = "none";
          }, 250);
        }
      });
    });
  });
}


/**
 * 3. Interactive Credential Vault (Folder-Based Explorer System)
 * Displays 4 compact interactive folders on page load.
 * Clicking any folder opens the folder explorer to view certificates inside.
 */
function initCertificates() {
  const foldersView = document.getElementById("cert-folders-view");
  const contentView = document.getElementById("cert-folder-content-view");
  const container = document.getElementById("certifications-grid-container");
  const backBtn = document.getElementById("btn-back-to-folders");
  const crumbRoot = document.getElementById("crumb-root-btn");
  const currentFolderNameEl = document.getElementById("explorer-current-folder-name");
  const folderCards = document.querySelectorAll(".cert-folder-card");
  const expTabs = document.querySelectorAll(".exp-tab-btn");
  const modal = document.getElementById("cert-lightbox-modal");
  const closeBtn = document.getElementById("cert-modal-close-btn");

  if (!container || !foldersView || !contentView) return;

  const certs = (window.PORTFOLIO_CONFIG && window.PORTFOLIO_CONFIG.certifications) || [];

  const folderMeta = {
    hackathons: {
      name: "🏆 Hackathons & Wins",
      count: 14,
      label: "🏆 Hackathons & Wins (14 Files)"
    },
    conferences: {
      name: "📜 Research & Conference Papers",
      count: 2,
      label: "📜 Research & Papers (2 Files)"
    },
    certifications: {
      name: "⚡ Professional Accreditations",
      count: 2,
      label: "⚡ Professional Certs (2 Files)"
    },
    competitions: {
      name: "🎯 Technical Contests & Sports",
      count: 4,
      label: "🎯 Technical Contests (4 Files)"
    },
    all: {
      name: "📁 Master Archive — All Verified Credentials",
      count: 22,
      label: "📁 All Verified Credentials (22 Files)"
    }
  };

  function renderFolderFiles(category) {
    const meta = folderMeta[category] || { name: category, count: certs.length, label: category };
    const filtered = category === "all" ? certs : certs.filter(c => c.category === category);

    if (currentFolderNameEl) {
      currentFolderNameEl.textContent = `${meta.name} (${filtered.length} Files)`;
    }

    // Update active tab in explorer
    expTabs.forEach(tab => {
      if (tab.getAttribute("data-filter") === category) {
        tab.classList.add("active");
      } else {
        tab.classList.remove("active");
      }
    });

    container.innerHTML = filtered.map(c => `
      <div class="cert-card" data-category="${c.category}">
        <div class="cert-preview-box is-loading" data-cert-id="${c.id}" title="Click to view full certificate">
          <img src="${encodeURI(c.preview)}" alt="${c.title}" class="cert-preview-img" loading="lazy"
               onload="this.classList.add('loaded'); this.parentElement.classList.remove('is-loading');"
               onerror="this.classList.add('error'); this.parentElement.classList.remove('is-loading'); if (this.src !== '${encodeURI(c.file)}') { this.src = '${encodeURI(c.file)}'; }">
          <div class="cert-preview-overlay">
            <span class="cert-zoom-btn">🔍 View Certificate</span>
          </div>
        </div>
        <div class="cert-header">
          <div class="cert-icon-badge">
            <span style="font-size: 1.15rem;">${c.category === 'hackathons' ? '🏆' : c.category === 'conferences' ? '📜' : c.category === 'certifications' ? '⚡' : '🎯'}</span>
          </div>
          <span class="timeline-badge" style="${c.badge.includes('Winner') ? 'background: rgba(16, 185, 129, 0.15); color: #10b981; border-color: rgba(16, 185, 129, 0.4);' : ''}">${c.badge}</span>
        </div>
        <h3 class="cert-title">${c.title}</h3>
        <div class="cert-issuer">${c.issuer}</div>
        <div class="cert-meta">
          <span>📅 ${c.date}</span>
          <span>•</span>
          <span>ID: ${c.credentialId}</span>
        </div>
        <div class="cert-tags">
          ${c.tags.map(t => `<span class="tech-tag">${t}</span>`).join('')}
        </div>
        <div style="display: flex; gap: 10px; margin-top: auto; padding-top: 10px;">
          <button type="button" class="btn btn-secondary btn-sm btn-open-cert" data-cert-id="${c.id}" style="flex: 1;">
            <span>View Full</span>
            <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
          </button>
          <a href="${c.file}" target="_blank" download class="btn btn-secondary btn-sm" title="Download Original Document" style="padding: 8px 14px;">
            <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
          </a>
        </div>
      </div>
    `).join('');

    container.querySelectorAll(".cert-preview-box, .btn-open-cert").forEach(el => {
      el.addEventListener("click", e => {
        e.preventDefault();
        const certId = el.getAttribute("data-cert-id");
        openCertModal(certId);
      });
    });
  }

  function openFolder(category) {
    renderFolderFiles(category);
    foldersView.style.display = "none";
    contentView.style.display = "block";
    const certSection = document.getElementById("certifications");
    if (certSection) {
      certSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function closeFolder() {
    contentView.style.display = "none";
    foldersView.style.display = "grid";
    const certSection = document.getElementById("certifications");
    if (certSection) {
      certSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  // Folder cards click & key triggers
  folderCards.forEach(card => {
    card.addEventListener("click", () => {
      const cat = card.getAttribute("data-category");
      openFolder(cat);
    });

    card.addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        const cat = card.getAttribute("data-category");
        openFolder(cat);
      }
    });
  });

  // Back button triggers
  if (backBtn) backBtn.addEventListener("click", closeFolder);
  if (crumbRoot) crumbRoot.addEventListener("click", closeFolder);

  // Explorer tab switching
  expTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      const cat = tab.getAttribute("data-filter");
      renderFolderFiles(cat);
    });
  });

  // Modal handlers
  function openCertModal(certId) {
    const cert = certs.find(c => c.id === certId);
    if (!cert || !modal) return;

    const titleEl = document.getElementById("cert-modal-title");
    const issuerEl = document.getElementById("cert-modal-issuer");
    const imgEl = document.getElementById("cert-modal-img");
    const metaEl = document.getElementById("cert-modal-meta");
    const dlBtn = document.getElementById("cert-modal-download-link");

    if (titleEl) titleEl.textContent = cert.title;
    if (issuerEl) issuerEl.textContent = `${cert.issuer} • ${cert.badge}`;
    if (imgEl) {
      const isPdf = cert.file.toLowerCase().endsWith('.pdf');
      const modalSrc = isPdf ? cert.preview : cert.file;
      imgEl.src = encodeURI(modalSrc);
      imgEl.alt = cert.title;
    }
    if (metaEl) metaEl.textContent = `Issued: ${cert.date} | Credential Ref: ${cert.credentialId}`;
    if (dlBtn) {
      dlBtn.href = encodeURI(cert.file);
      dlBtn.setAttribute("download", cert.file.split("/").pop());
    }

    modal.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeCertModal() {
    if (modal) {
      modal.classList.remove("open");
      document.body.style.overflow = "";
    }
  }

  if (closeBtn) closeBtn.addEventListener("click", closeCertModal);
  if (modal) {
    modal.addEventListener("click", e => {
      if (e.target === modal) closeCertModal();
    });
  }
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && modal && modal.classList.contains("open")) {
      closeCertModal();
    }
  });
}
