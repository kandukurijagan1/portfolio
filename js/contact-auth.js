/**
 * ==============================================================================
 * PORTFOLIO GOOGLE AUTHENTICATION, MESSAGE HISTORY & ADMIN INBOX PORTAL
 * ==============================================================================
 * Author: Kandukuri Jagan
 * Description: 
 * 1. Requires verified Google Sign-In before sending contact inquiries.
 * 2. Locks the email field to the authenticated Google email (anti-spoofing).
 * 3. Restores and displays visitor conversation history across re-logins.
 * 4. Unlocks the Master Admin Inbox Portal for kandukurijagan99@gmail.com.
 * ==============================================================================
 */

(function () {
  'use strict';

  // State
  let currentUser = null;
  let userHistory = [];
  let adminMessages = [];
  let currentActiveTab = 'compose'; // 'compose' | 'history' | 'admin-inbox'

  const ADMIN_EMAIL = (window.PORTFOLIO_CONFIG && (
    (window.PORTFOLIO_CONFIG.auth && window.PORTFOLIO_CONFIG.auth.adminEmail) || 
    (window.PORTFOLIO_CONFIG.personal && window.PORTFOLIO_CONFIG.personal.auth && window.PORTFOLIO_CONFIG.personal.auth.adminEmail)
  )) || 'kandukurijagan99@gmail.com';

  const STORAGE_KEY_USER = 'portfolio_auth_user_v1';
  const STORAGE_KEY_HISTORY_PREFIX = 'portfolio_thread_';

  document.addEventListener('DOMContentLoaded', initAuthSystem);

  /**
   * 1. INITIALIZE SYSTEM
   */
  function initAuthSystem() {
    loadCachedSession();
    renderAuthUI();
    initGoogleSignInSDK();
    initSignInModalEvents();
    bindGlobalAuthEvents();
  }

  /**
   * 2. SESSION CACHING
   */
  function loadCachedSession() {
    try {
      const cached = localStorage.getItem(STORAGE_KEY_USER);
      if (cached) {
        currentUser = JSON.parse(cached);
        // Verify admin flag
        if (currentUser && currentUser.email) {
          currentUser.isAdmin = currentUser.email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
        }
      }
    } catch (e) {
      console.warn('Failed to parse cached session:', e);
      currentUser = null;
    }
  }

  function saveSession(user) {
    currentUser = user;
    if (currentUser) {
      currentUser.isAdmin = currentUser.email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEY_USER);
    }
  }

  /**
   * 3. GOOGLE IDENTITY SERVICES (GIS) SDK SETUP
   */
  function initGoogleSignInSDK() {
    const config = window.PORTFOLIO_CONFIG && (window.PORTFOLIO_CONFIG.auth || (window.PORTFOLIO_CONFIG.personal && window.PORTFOLIO_CONFIG.personal.auth));
    const clientId = config && config.googleClientId;

    // Check if Google GIS is already loaded
    if (window.google && window.google.accounts && window.google.accounts.id) {
      setupGoogleButton(clientId);
    } else {
      // Wait for script to load
      window.addEventListener('load', () => {
        if (window.google && window.google.accounts && window.google.accounts.id) {
          setupGoogleButton(clientId);
        }
      });
    }
  }

  function setupGoogleButton(clientId) {
    const btnContainer = document.getElementById('google-signin-btn-container');
    if (!btnContainer) return;

    // If client ID is the placeholder, Google GIS won't render button without valid client ID
    if (!clientId || clientId.includes('YOUR_GOOGLE_CLIENT_ID')) {
      renderDevLoginHelper(btnContainer);
      return;
    }

    try {
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleGoogleCredentialResponse,
        auto_select: false,
        cancel_on_tap_outside: true
      });

      window.google.accounts.id.renderButton(btnContainer, {
        theme: 'filled_black',
        size: 'large',
        shape: 'pill',
        text: 'continue_with',
        width: 280,
        logo_alignment: 'left'
      });
    } catch (err) {
      console.warn('Google Sign-In button render notice:', err);
      renderDevLoginHelper(btnContainer);
    }
  }

  /**
   * Fallback & instant simulator for localhost & quick testing
   */
  function renderDevLoginHelper(container) {
    container.innerHTML = `
      <div class="google-gis-fallback">
        <button type="button" id="btn-google-real-or-modal" class="btn-google-auth">
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
          </svg>
          <span>Sign in with Google</span>
        </button>
      </div>
    `;

    const btn = container.querySelector('#btn-google-real-or-modal');
    if (btn) {
      btn.addEventListener('click', () => {
        // 1. Direct Supabase Google OAuth (if configured)
        if (window.PortfolioSupabase && window.PortfolioSupabase.isConfigured()) {
          window.PortfolioSupabase.signInWithGoogle();
          return;
        }

        // 2. Direct Google One-Tap / GIS Prompt (if Google client ID is configured)
        const config = window.PORTFOLIO_CONFIG && (window.PORTFOLIO_CONFIG.auth || (window.PORTFOLIO_CONFIG.personal && window.PORTFOLIO_CONFIG.personal.auth));
        const clientId = config && config.googleClientId;
        if (clientId && !clientId.includes('YOUR_GOOGLE_CLIENT_ID') && window.google && window.google.accounts && window.google.accounts.id) {
          try {
            window.google.accounts.id.prompt();
            return;
          } catch(e) {}
        }

        // 3. Open OAuth instructions / preset test credentials modal
        openSignInModal();
      });
    }
  }

  /**
   * Handle session received from Supabase Google OAuth
   */
  function handleSupabaseUser(sbUser) {
    if (!sbUser || !sbUser.email) return;
    const user = {
      name: (sbUser.user_metadata && sbUser.user_metadata.full_name) || sbUser.email.split('@')[0],
      email: sbUser.email,
      picture: (sbUser.user_metadata && sbUser.user_metadata.avatar_url) || '',
      sub: sbUser.id,
      isGoogle: true,
      authTime: Date.now()
    };

    saveSession(user);
    renderAuthUI();

    if (window.showToast) {
      window.showToast(`Signed in via Google as ${user.name} (${user.email})`, 'success');
    }
  }

  /**
   * 4. PARSE GOOGLE JWT CREDENTIAL
   */
  function handleGoogleCredentialResponse(response) {
    if (!response || !response.credential) return;

    try {
      const payload = parseJwt(response.credential);
      const user = {
        name: payload.name || payload.given_name || 'Google User',
        email: payload.email,
        picture: payload.picture || '',
        sub: payload.sub,
        isGoogle: true,
        authTime: Date.now()
      };

      saveSession(user);
      renderAuthUI();

      if (window.showToast) {
        window.showToast(`Signed in as ${user.name} (${user.email})`, 'success');
      }
    } catch (err) {
      console.error('Failed to parse Google JWT:', err);
      if (window.showToast) {
        window.showToast('Could not complete Google authentication.', 'error');
      }
    }
  }

  function parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  }

  /**
   * 5. MANUAL / DEV SIGN-IN MODAL (For instant testing of Visitor & Admin)
   */
  function initSignInModalEvents() {
    const modal = document.getElementById('auth-signin-modal');
    if (!modal) return;

    // Close button
    const closeBtn = modal.querySelector('.auth-modal-close') || modal.querySelector('#auth-modal-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', closeSignInModal);
    }

    // Backdrop click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeSignInModal();
    });

    // Preset Quick Auth Buttons (Admin & Visitor)
    modal.querySelectorAll('.btn-select-auth').forEach(btn => {
      btn.addEventListener('click', () => {
        const email = btn.getAttribute('data-email');
        const name = btn.getAttribute('data-name');
        if (email && name) {
          completeAuth(name, email);
          closeSignInModal();
        }
      });
    });

    // Custom Google Email Form Submit
    const customForm = modal.querySelector('#custom-auth-form');
    if (customForm) {
      customForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const nameInput = modal.querySelector('#modal-custom-name');
        const emailInput = modal.querySelector('#modal-custom-email');
        const name = nameInput ? nameInput.value.trim() : '';
        const email = emailInput ? emailInput.value.trim() : '';
        if (name && email) {
          completeAuth(name, email);
          closeSignInModal();
        }
      });
    }
  }

  function openSignInModal() {
    const modal = document.getElementById('auth-signin-modal');
    if (modal) {
      modal.classList.add('active');
    }
  }

  function closeSignInModal() {
    const modal = document.getElementById('auth-signin-modal');
    if (modal) {
      modal.classList.remove('active');
    }
  }

  function completeAuth(name, email) {
    const user = {
      name: name,
      email: email,
      picture: '',
      isGoogle: true,
      authTime: Date.now()
    };
    saveSession(user);
    renderAuthUI();
    if (window.showToast) {
      window.showToast(`Logged in as ${name} (${email})`, 'success');
    }
  }

  /**
   * 6. RENDER DYNAMIC AUTH UI
   */
  function renderAuthUI() {
    const barrierEl = document.getElementById('contact-auth-barrier');
    const authStatusEl = document.getElementById('contact-auth-status-bar');
    const formEl = document.getElementById('portfolio-contact-form');
    const adminPortalEl = document.getElementById('contact-admin-portal');
    const historyViewEl = document.getElementById('contact-history-view');
    const successStateEl = document.getElementById('contact-success-state');

    // 1. Unauthenticated State
    if (!currentUser) {
      if (barrierEl) barrierEl.style.display = 'flex';
      if (authStatusEl) authStatusEl.style.display = 'none';
      if (formEl) formEl.style.display = 'none';
      if (adminPortalEl) adminPortalEl.style.display = 'none';
      if (historyViewEl) historyViewEl.style.display = 'none';
      if (successStateEl) successStateEl.style.display = 'none';
      return;
    }

    // 2. Authenticated State: Hide barrier
    if (barrierEl) barrierEl.style.display = 'none';
    if (authStatusEl) authStatusEl.style.display = 'flex';

    // Populate user profile info in status bar
    updateAuthStatusBar();

    // Check if Admin
    if (currentUser.isAdmin) {
      renderAdminView();
    } else {
      renderVisitorView();
    }
  }

  /**
   * 7. STATUS BAR (Shows Logged-in Account, Verified Pill & Sign-Out)
   */
  function updateAuthStatusBar() {
    const bar = document.getElementById('contact-auth-status-bar');
    if (!bar || !currentUser) return;

    const initials = (currentUser.name || 'User')
      .split(' ')
      .map(n => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();

    const avatarHtml = currentUser.picture 
      ? `<img src="${currentUser.picture}" alt="${currentUser.name}" class="auth-user-avatar-img">`
      : `<div class="auth-user-avatar-initials">${initials}</div>`;

    const roleBadgeHtml = currentUser.isAdmin
      ? `<span class="auth-role-pill admin-pill">👑 Admin Portal</span>`
      : `<span class="auth-role-pill verified-pill">🔒 Verified Google Account</span>`;

    bar.innerHTML = `
      <div class="auth-status-left">
        <div class="auth-avatar-box">
          ${avatarHtml}
          <span class="auth-online-dot"></span>
        </div>
        <div class="auth-user-meta">
          <div class="auth-name-row">
            <strong class="auth-user-name">${currentUser.name}</strong>
            ${roleBadgeHtml}
          </div>
          <span class="auth-user-email">${currentUser.email}</span>
        </div>
      </div>

      <div class="auth-status-right">
        ${currentUser.isAdmin ? `
          <button type="button" id="btn-toggle-admin-view" class="btn-auth-switch">
            ${currentActiveTab === 'admin-inbox' ? '✍️ Switch to Compose' : '📬 Master Inbox'}
          </button>
        ` : ''}
        <button type="button" id="btn-auth-signout" class="btn-auth-signout" title="Sign out of this account">
          <span>Sign Out</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
        </button>
      </div>
    `;

    // Bind sign out
    bar.querySelector('#btn-auth-signout').addEventListener('click', handleSignOut);

    // Bind toggle for admin
    const switchBtn = bar.querySelector('#btn-toggle-admin-view');
    if (switchBtn) {
      switchBtn.addEventListener('click', () => {
        if (currentActiveTab === 'admin-inbox') {
          currentActiveTab = 'compose';
          renderVisitorView();
        } else {
          currentActiveTab = 'admin-inbox';
          renderAdminView();
        }
        updateAuthStatusBar();
      });
    }
  }

  function handleSignOut() {
    saveSession(null);
    currentActiveTab = 'compose';
    renderAuthUI();
    if (window.showToast) {
      window.showToast('You have signed out.', 'info');
    }
  }

  /**
   * 8. VISITOR VIEW (Locked Email Form + Message History)
   */
  function renderVisitorView() {
    const formEl = document.getElementById('portfolio-contact-form');
    const adminPortalEl = document.getElementById('contact-admin-portal');
    const historyViewEl = document.getElementById('contact-history-view');
    const tabsContainer = document.getElementById('contact-view-tabs');

    if (adminPortalEl) adminPortalEl.style.display = 'none';
    if (tabsContainer) tabsContainer.style.display = 'flex';

    // Lock and pre-fill form fields
    const nameInput = document.getElementById('contact-name');
    const emailInput = document.getElementById('contact-email');

    if (nameInput && !nameInput.value.trim()) {
      nameInput.value = currentUser.name || '';
    }

    if (emailInput) {
      emailInput.value = currentUser.email || '';
      emailInput.readOnly = true;
      emailInput.classList.add('input-locked');

      // Inject or ensure locked badge
      let badge = document.getElementById('email-locked-badge');
      if (!badge) {
        badge = document.createElement('div');
        badge.id = 'email-locked-badge';
        badge.className = 'email-locked-badge';
        badge.innerHTML = `
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
          <span>Locked to your Google Account</span>
        `;
        emailInput.parentNode.appendChild(badge);
      }
    }

    // Switch between Compose Form and History View based on tab
    if (currentActiveTab === 'history') {
      if (formEl) formEl.style.display = 'none';
      if (historyViewEl) historyViewEl.style.display = 'block';
      loadAndRenderVisitorHistory();
    } else {
      if (formEl) formEl.style.display = 'flex';
      if (historyViewEl) historyViewEl.style.display = 'none';
      // Load history count in background
      loadVisitorHistoryCount();
    }

    updateTabButtons();
  }

  function updateTabButtons() {
    const tabCompose = document.getElementById('tab-btn-compose');
    const tabHistory = document.getElementById('tab-btn-history');

    if (tabCompose) {
      if (currentActiveTab === 'compose') tabCompose.classList.add('active');
      else tabCompose.classList.remove('active');
    }

    if (tabHistory) {
      if (currentActiveTab === 'history') tabHistory.classList.add('active');
      else tabHistory.classList.remove('active');
    }
  }

  /**
   * 9. VISITOR HISTORY RETRIEVAL & DISPLAY
   */
  function getVisitorHistoryKey() {
    return STORAGE_KEY_HISTORY_PREFIX + (currentUser ? currentUser.email.toLowerCase() : 'guest');
  }

  function getLocalVisitorHistory() {
    try {
      const data = localStorage.getItem(getVisitorHistoryKey());
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  function saveLocalVisitorHistory(items) {
    try {
      localStorage.setItem(getVisitorHistoryKey(), JSON.stringify(items));
    } catch (e) {}
  }

  function loadVisitorHistoryCount() {
    const local = getLocalVisitorHistory();
    const badge = document.getElementById('history-count-badge');
    if (badge) {
      badge.textContent = local.length;
    }
  }

  async function loadAndRenderVisitorHistory() {
    const container = document.getElementById('history-messages-list');
    if (!container || !currentUser) return;

    // First render from local storage instantly
    let items = getLocalVisitorHistory();
    renderHistoryCards(container, items, false);

    // 1. Prioritize Supabase Real-Time Database if configured
    if (window.PortfolioSupabase && window.PortfolioSupabase.isConfigured()) {
      try {
        const sbResult = await window.PortfolioSupabase.getMessageHistory(currentUser.email);
        if (sbResult && sbResult.success && Array.isArray(sbResult.messages)) {
          const merged = mergeMessages(sbResult.messages, items);
          saveLocalVisitorHistory(merged);
          renderHistoryCards(container, merged, true);
          loadVisitorHistoryCount();
          return;
        }
      } catch (sbErr) {
        console.warn('Supabase visitor history fetch notice:', sbErr);
      }
    }

    // 2. Fallback to Google Apps Script Web App
    const webhookUrl = (window.PORTFOLIO_CONFIG && window.PORTFOLIO_CONFIG.personal && window.PORTFOLIO_CONFIG.personal.contactWebhookUrl) || '';
    if (webhookUrl && webhookUrl.startsWith('https://script.google.com/')) {
      try {
        const queryUrl = `${webhookUrl}?action=getHistory&email=${encodeURIComponent(currentUser.email)}`;
        const resp = await fetch(queryUrl);
        if (resp.ok) {
          const res = await resp.json();
          if (res.status === 'success' && Array.isArray(res.messages)) {
            // Merge with local (avoid duplicates by matching timestamp & message)
            const merged = mergeMessages(res.messages, items);
            saveLocalVisitorHistory(merged);
            renderHistoryCards(container, merged, true);
            loadVisitorHistoryCount();
          }
        }
      } catch (err) {
        console.warn('History cloud sync notice:', err);
      }
    }
  }

  function mergeMessages(cloud, local) {
    const map = {};
    const result = [];

    // Add cloud messages
    cloud.forEach(m => {
      const key = `${m.timestamp}_${m.subject}_${(m.message || '').substring(0, 30)}`;
      map[key] = true;
      result.push(m);
    });

    // Add local messages not in cloud
    local.forEach(m => {
      const key = `${m.timestamp}_${m.subject}_${(m.message || '').substring(0, 30)}`;
      if (!map[key]) {
        result.push(m);
      }
    });

    return result;
  }

  function renderHistoryCards(container, items, isCloudSynced) {
    if (!items || items.length === 0) {
      container.innerHTML = `
        <div class="history-empty-state">
          <div class="history-empty-icon">💬</div>
          <h4>No Message History Yet</h4>
          <p>You haven't sent any messages to Kandukuri Jagan from <strong>${currentUser.email}</strong>.</p>
          <button type="button" id="btn-history-compose-now" class="btn btn-primary btn-sm" style="margin-top: 12px;">
            <span>Compose Your First Message</span>
          </button>
        </div>
      `;

      const composeNowBtn = container.querySelector('#btn-history-compose-now');
      if (composeNowBtn) {
        composeNowBtn.addEventListener('click', () => {
          currentActiveTab = 'compose';
          renderVisitorView();
        });
      }
      return;
    }

    let cardsHtml = items.map((m, idx) => `
      <div class="history-card" style="animation-delay: ${idx * 0.05}s">
        <div class="history-card-header">
          <div class="history-subject-line">
            <span class="history-subject-text">${escapeHtml(m.subject || 'Portfolio Inquiry')}</span>
            <span class="history-status-chip">✓ Delivered to Inbox</span>
          </div>
          <span class="history-timestamp">${m.timestamp || 'Recent'}</span>
        </div>
        <div class="history-body">
          <p>${escapeHtml(m.message || '')}</p>
        </div>
        <div class="history-card-footer">
          <span class="history-sender-tag">Sent by: <strong>${escapeHtml(m.name || currentUser.name)}</strong> (${escapeHtml(m.email || currentUser.email)})</span>
          <span class="history-reply-status">Awaiting Jagan's direct review</span>
        </div>
      </div>
    `).join('');

    container.innerHTML = `
      <div class="history-list-header">
        <span class="history-list-count">Showing <strong>${items.length}</strong> past inquiry${items.length > 1 ? 'ies' : ''} from this account</span>
        <span class="history-sync-indicator">${isCloudSynced ? '⚡ Live synced with Google Sheets' : '📦 Cached locally'}</span>
      </div>
      <div class="history-cards-scroll">
        ${cardsHtml}
      </div>
    `;
  }

  /**
   * 10. ADMIN VIEW (kandukurijagan99@gmail.com Master Inbox)
   */
  async function renderAdminView() {
    const formEl = document.getElementById('portfolio-contact-form');
    const adminPortalEl = document.getElementById('contact-admin-portal');
    const historyViewEl = document.getElementById('contact-history-view');
    const tabsContainer = document.getElementById('contact-view-tabs');

    if (formEl) formEl.style.display = 'none';
    if (historyViewEl) historyViewEl.style.display = 'none';
    if (tabsContainer) tabsContainer.style.display = 'none';
    if (adminPortalEl) adminPortalEl.style.display = 'block';

    adminPortalEl.innerHTML = `
      <div class="admin-portal-wrapper">
        <!-- Admin Header -->
        <div class="admin-header-bar">
          <div class="admin-header-title">
            <h3>📬 Master Inbox & Contact Hub</h3>
            <span class="admin-live-badge">REAL-TIME GOOGLE SHEETS SYNC</span>
          </div>
          <button type="button" id="btn-refresh-admin-inbox" class="btn-refresh-inbox">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="23 4 23 10 17 10"></polyline>
              <polyline points="1 20 1 14 7 14"></polyline>
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
            </svg>
            <span>Refresh</span>
          </button>
        </div>

        <!-- Metrics Cards -->
        <div class="admin-metrics-row">
          <div class="admin-metric-card">
            <span class="metric-label">TOTAL INQUIRIES</span>
            <strong id="admin-metric-total" class="metric-val">-</strong>
          </div>
          <div class="admin-metric-card">
            <span class="metric-label">UNIQUE SENDER CONTACTS</span>
            <strong id="admin-metric-senders" class="metric-val">-</strong>
          </div>
          <div class="admin-metric-card">
            <span class="metric-label">CONNECTED SPREADSHEET</span>
            <strong class="metric-val" style="font-size: 1rem; color: #10b981;">portfolio (Sheet1) ✓</strong>
          </div>
        </div>

        <!-- Search & Filter Bar -->
        <div class="admin-filter-bar">
          <div class="admin-search-box">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input type="text" id="admin-search-input" placeholder="Search by name, email, subject, or message content..." class="admin-search-input">
          </div>
        </div>

        <!-- Messages Feed Container -->
        <div id="admin-messages-feed" class="admin-messages-feed">
          <div class="admin-loading-state">
            <div class="spinner"></div>
            <span>Fetching real-time messages from Google Sheet...</span>
          </div>
        </div>
      </div>
    `;

    // Bind refresh
    adminPortalEl.querySelector('#btn-refresh-admin-inbox').addEventListener('click', loadAdminMessages);

    // Bind live search
    const searchInput = adminPortalEl.querySelector('#admin-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        filterAdminMessages(e.target.value.trim().toLowerCase());
      });
    }

    // Load data
    await loadAdminMessages();
  }

  async function loadAdminMessages() {
    const feed = document.getElementById('admin-messages-feed');
    const totalMetric = document.getElementById('admin-metric-total');
    const sendersMetric = document.getElementById('admin-metric-senders');
    if (!feed) return;

    feed.innerHTML = `
      <div class="admin-loading-state">
        <div class="spinner"></div>
        <span>Syncing with portfolio real-time hub...</span>
      </div>
    `;

    // 1. Prioritize Supabase Real-Time Database if configured
    if (window.PortfolioSupabase && window.PortfolioSupabase.isConfigured()) {
      try {
        const sbResult = await window.PortfolioSupabase.getAllMessages();
        if (sbResult && sbResult.success && Array.isArray(sbResult.messages)) {
          adminMessages = sbResult.messages;
          if (totalMetric) totalMetric.textContent = adminMessages.length;
          if (sendersMetric) sendersMetric.textContent = countUnique(adminMessages);
          renderAdminCards(adminMessages);

          // Listen for live incoming messages via websocket
          window.PortfolioSupabase.subscribeToRealtimeMessages(newMsg => {
            if (!adminMessages.some(m => m.id === newMsg.id || (m.timestamp === newMsg.timestamp && m.message === newMsg.message))) {
              adminMessages.unshift(newMsg);
              if (totalMetric) totalMetric.textContent = adminMessages.length;
              if (sendersMetric) sendersMetric.textContent = countUnique(adminMessages);
              renderAdminCards(adminMessages);
              if (window.showToast) {
                window.showToast(`🔔 New message from ${newMsg.name}`, 'info');
              }
            }
          });
          return;
        }
      } catch (sbErr) {
        console.warn('Supabase admin fetch notice:', sbErr);
      }
    }

    // 2. Fallback to Google Apps Script Web App
    const webhookUrl = (window.PORTFOLIO_CONFIG && window.PORTFOLIO_CONFIG.personal && window.PORTFOLIO_CONFIG.personal.contactWebhookUrl) || '';
    if (!webhookUrl || !webhookUrl.startsWith('https://script.google.com/')) {
      feed.innerHTML = `<div class="admin-empty-state">Webhook URL or Supabase credentials not configured in PORTFOLIO_CONFIG.</div>`;
      return;
    }

    try {
      const url = `${webhookUrl}?action=getAllMessages&adminEmail=${encodeURIComponent(ADMIN_EMAIL)}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (data.status === 'success' && Array.isArray(data.messages)) {
          adminMessages = data.messages;
          if (totalMetric) totalMetric.textContent = data.total || adminMessages.length;
          if (sendersMetric) sendersMetric.textContent = data.uniqueContacts || countUnique(adminMessages);
          renderAdminCards(adminMessages);
          return;
        }
      }
      throw new Error('Could not retrieve messages');
    } catch (err) {
      console.warn('Admin fetch notice:', err);
      feed.innerHTML = `
        <div class="admin-empty-state">
          <p>⚠️ Unable to fetch live messages from Google Sheets. Ensure your Web App is deployed with "Anyone" access, or configure Supabase keys in js/config.js.</p>
          <button type="button" class="btn btn-secondary btn-sm" id="btn-admin-retry">Retry Connection</button>
        </div>
      `;
      const retryBtn = feed.querySelector('#btn-admin-retry');
      if (retryBtn) retryBtn.addEventListener('click', loadAdminMessages);
    }
  }

  function countUnique(list) {
    const set = new Set();
    list.forEach(m => { if (m.email) set.add(m.email.toLowerCase()); });
    return set.size;
  }

  function filterAdminMessages(query) {
    if (!query) {
      renderAdminCards(adminMessages);
      return;
    }
    const filtered = adminMessages.filter(m => {
      const n = (m.name || '').toLowerCase();
      const e = (m.email || '').toLowerCase();
      const s = (m.subject || '').toLowerCase();
      const msg = (m.message || '').toLowerCase();
      return n.includes(query) || e.includes(query) || s.includes(query) || msg.includes(query);
    });
    renderAdminCards(filtered);
  }

  function renderAdminCards(items) {
    const feed = document.getElementById('admin-messages-feed');
    if (!feed) return;

    if (!items || items.length === 0) {
      feed.innerHTML = `
        <div class="admin-empty-state">
          <div style="font-size: 2.2rem; margin-bottom: 8px;">📭</div>
          <h4>No Messages Found</h4>
          <p>No contact inquiries match your search criteria or the sheet is currently empty.</p>
        </div>
      `;
      return;
    }

    const cardsHtml = items.map((m, idx) => {
      const initials = (m.name || 'V').substring(0, 2).toUpperCase();
      const replySubject = encodeURIComponent('Re: ' + (m.subject || 'Portfolio Inquiry'));
      const replyBody = encodeURIComponent(`Hi ${m.name},\n\nThank you for reaching out through my portfolio regarding "${m.subject}".\n\n`);
      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(m.email)}&su=${replySubject}&body=${replyBody}`;
      
      // WhatsApp link if phone in message
      const phoneMatch = (m.message || '').match(/(?:\+?\d{1,3}[- ]?)?\(?\d{3}\)?[- ]?\d{3}[- ]?\d{4}/);
      const whatsappBtn = phoneMatch ? `
        <a href="https://api.whatsapp.com/send?phone=${phoneMatch[0].replace(/\D/g, '')}" target="_blank" class="btn-admin-action btn-wa">
          <span>WhatsApp</span>
        </a>
      ` : '';

      return `
        <div class="admin-msg-card" style="animation-delay: ${idx * 0.04}s">
          <div class="admin-msg-header">
            <div class="admin-msg-sender">
              <div class="admin-msg-avatar">${initials}</div>
              <div>
                <div class="admin-sender-name">
                  <strong>${escapeHtml(m.name || 'Anonymous Visitor')}</strong>
                  <span class="admin-email-tag">&lt;${escapeHtml(m.email || 'No email')}&gt;</span>
                </div>
                <div class="admin-msg-time">${escapeHtml(m.timestamp || 'Unknown Time')}</div>
              </div>
            </div>
            <div class="admin-msg-actions">
              <a href="${gmailUrl}" target="_blank" rel="noopener noreferrer" class="btn-admin-action btn-reply" title="Open Gmail Compose">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                <span>Reply in Gmail</span>
              </a>
              ${whatsappBtn}
            </div>
          </div>

          <div class="admin-msg-subject">
            <span>Subject:</span>
            <strong>${escapeHtml(m.subject || 'No Subject')}</strong>
          </div>

          <div class="admin-msg-content">
            <p>${escapeHtml(m.message || '')}</p>
          </div>
        </div>
      `;
    }).join('');

    feed.innerHTML = `
      <div class="admin-inbox-stats-sub">Showing <strong>${items.length}</strong> recorded submission${items.length > 1 ? 's' : ''}</div>
      ${cardsHtml}
    `;
  }

  /**
   * 11. RECORD SUBMITTED MESSAGE TO LOCAL THREAD INSTANTLY
   */
  window.recordSubmittedMessage = function (msgData) {
    if (!currentUser) return;

    const key = getVisitorHistoryKey();
    let current = [];
    try {
      current = JSON.parse(localStorage.getItem(key) || '[]');
    } catch (e) {
      current = [];
    }

    const timestamp = new Date().toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }) + ' IST';

    const newRecord = {
      name: msgData.name || currentUser.name,
      email: currentUser.email,
      subject: msgData.subject,
      message: msgData.message,
      timestamp: timestamp,
      status: 'Delivered'
    };

    current.unshift(newRecord);
    localStorage.setItem(key, JSON.stringify(current));
    loadVisitorHistoryCount();
  };

  /**
   * 12. BIND GLOBAL BUTTONS & TABS
   */
  function bindGlobalAuthEvents() {
    // Tab switching
    const tabCompose = document.getElementById('tab-btn-compose');
    const tabHistory = document.getElementById('tab-btn-history');

    if (tabCompose) {
      tabCompose.addEventListener('click', () => {
        currentActiveTab = 'compose';
        renderVisitorView();
      });
    }

    if (tabHistory) {
      tabHistory.addEventListener('click', () => {
        currentActiveTab = 'history';
        renderVisitorView();
      });
    }

    // Modal triggers
    const triggerButtons = document.querySelectorAll('.trigger-google-auth-modal');
    triggerButtons.forEach(b => b.addEventListener('click', openSignInModal));
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Export module globally
  window.PortfolioAuth = {
    getCurrentUser: () => currentUser,
    isAdmin: () => Boolean(currentUser && currentUser.isAdmin),
    openSignInModal: openSignInModal,
    handleSupabaseUser: handleSupabaseUser,
    signOut: handleSignOut
  };

})();
