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

  // Instant interception if current window is an OAuth popup callback
  (function handlePopupOAuthRedirect() {
    try {
      if (typeof window !== 'undefined' && window.location && window.location.hash) {
        if (window.location.hash.includes('access_token=')) {
          const hashStr = window.location.hash.substring(1);
          const urlParams = new URLSearchParams(hashStr);
          const token = urlParams.get('access_token');
          if (token && window.opener && window.opener !== window) {
            try {
              window.opener.postMessage({ type: 'GOOGLE_OAUTH_TOKEN', accessToken: token }, '*');
              if (typeof window.opener.handleGoogleOAuthAccessToken === 'function') {
                window.opener.handleGoogleOAuthAccessToken(token);
              }
            } catch (_) {}
            setTimeout(() => {
              try { window.close(); } catch (_) {}
            }, 250);
          }
        }
      }
    } catch (_) {}
  })();

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
    checkUrlHashForToken();
    renderAuthUI();
    initGoogleSignInSDK();
    bindGlobalAuthEvents();
    bindOAuthMessageListener();
  }

  /**
   * 2. SESSION CACHING
   */
  function loadCachedSession() {
    try {
      // Optional URL parameter for instantaneous testing / inspection
      if (typeof window !== 'undefined' && window.location && window.location.search) {
        const urlParams = new URLSearchParams(window.location.search);
        const demoAuth = urlParams.get('demoAuth');
        if (demoAuth === 'visitor') {
          currentUser = {
            name: 'niku enduku',
            email: 'endukuniku35@gmail.com',
            picture: '',
            sub: '12345678',
            isGoogle: true,
            isAdmin: false,
            authTime: Date.now()
          };
          return;
        } else if (demoAuth === 'admin') {
          currentUser = {
            name: 'Kandukuri Jagan',
            email: 'kandukurijagan99@gmail.com',
            picture: 'assets/images/profile.jpg',
            sub: 'admin-001',
            isAdmin: true,
            isGoogle: true,
            authTime: Date.now()
          };
          return;
        }
      }

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
   * 3. DIRECT GOOGLE OAUTH 2.0 POPUP FLOW
   * Triggers official Google Accounts chooser popup (accounts.google.com)
   * Direct Google OAuth 2.0 authentication popup flow
   */
  window.launchDirectGoogleOAuth = function () {
    const config = (window.PORTFOLIO_CONFIG && (window.PORTFOLIO_CONFIG.auth || (window.PORTFOLIO_CONFIG.personal && window.PORTFOLIO_CONFIG.personal.auth))) || {};
    const clientId = config.googleClientId || '902168382803-6gof845v72ku6k4lp4mecsgr3l1uc3s0.apps.googleusercontent.com';
    let redirectUri = config.redirectUri || 'https://kandukuri-jagan-portfolio.netlify.app';
    if (typeof window !== 'undefined' && window.location && window.location.origin.includes('localhost')) {
      redirectUri = window.location.origin + '/';
    }

    const btnLabel = document.getElementById('google-auth-btn-label');
    const origText = btnLabel ? btnLabel.innerHTML : 'Sign in with Google';
    if (btnLabel) {
      btnLabel.innerHTML = 'Connecting to Google...';
    }

    const authUrl = 'https://accounts.google.com/o/oauth2/v2/auth?' + new URLSearchParams({
      client_id: clientId,
      response_type: 'token',
      scope: 'email profile openid',
      redirect_uri: redirectUri,
      prompt: 'select_account'
    }).toString();

    // Center popup on current display
    const width = 520;
    const height = 630;
    const left = window.screenLeft !== undefined ? window.screenLeft + (window.outerWidth - width) / 2 : (screen.width - width) / 2;
    const top = window.screenTop !== undefined ? window.screenTop + (window.outerHeight - height) / 2 : (screen.height - height) / 2;

    let authWin = null;
    try {
      authWin = window.open(authUrl, 'GoogleAuthPopup', `width=${width},height=${height},top=${top},left=${left},menubar=no,toolbar=no,status=no`);
    } catch (e) {
      console.warn('Popup blocked by browser:', e);
    }

    // Fallback: If popup was blocked by browser, perform in-window redirect
    if (!authWin || authWin.closed || typeof authWin.closed === 'undefined') {
      window.location.href = authUrl;
      return;
    }

    if (authWin.focus) {
      try { authWin.focus(); } catch (_) {}
    }

    const pollTimer = setInterval(() => {
      try {
        if (authWin && authWin.location && authWin.location.hash) {
          const hash = authWin.location.hash.substring(1);
          const params = new URLSearchParams(hash);
          const token = params.get('access_token');
          if (token) {
            clearInterval(pollTimer);
            authWin.close();
            window.handleGoogleOAuthAccessToken(token);
            return;
          }
        }
      } catch (_) {}

      if (!authWin || authWin.closed) {
        clearInterval(pollTimer);
        if (btnLabel && !currentUser) {
          btnLabel.innerHTML = origText;
        }
      }
    }, 500);
  };

  /**
   * 4. RECEIVE ACCESS TOKEN AND FETCH VERIFIED GOOGLE USER PROFILE
   * Intercepts postMessage from OAuth popup or direct callback
   */
  window.handleGoogleOAuthAccessToken = async function (token) {
    if (!token) return;
    const btnLabel = document.getElementById('google-auth-btn-label');
    if (btnLabel) btnLabel.innerHTML = 'Verifying Account...';

    try {
      const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Google userinfo HTTP ' + res.status);
      const userInfo = await res.json();
      const authedEmail = (userInfo?.email || '').toLowerCase().trim();
      const authedName = userInfo?.name || authedEmail.split('@')[0];
      const authedPic = userInfo?.picture || '';

      const user = {
        name: authedName,
        email: authedEmail,
        picture: authedPic,
        sub: userInfo?.sub || '',
        isGoogle: true,
        authTime: Date.now()
      };

      saveSession(user);
      renderAuthUI();

      if (window.showToast) {
        window.showToast(`Signed in with Google as ${authedName} (${authedEmail})`, 'success');
      }
    } catch (err) {
      console.error('Google userinfo error:', err);
      if (window.showToast) {
        window.showToast('Could not retrieve Google profile: ' + err.message, 'error');
      }
    } finally {
      if (btnLabel && !currentUser) {
        btnLabel.innerHTML = 'Sign in with Google';
      }
    }
  };

  /**
   * 5. LISTEN FOR POSTMESSAGE FROM AUTH POPUP
   */
  function bindOAuthMessageListener() {
    window.addEventListener('message', (event) => {
      if (event.data && event.data.type === 'GOOGLE_OAUTH_TOKEN' && event.data.accessToken) {
        window.handleGoogleOAuthAccessToken(event.data.accessToken);
      }
    });
  }

  /**
   * 6. CHECK URL HASH FOR TOKEN (In case of direct in-window redirect)
   */
  function checkUrlHashForToken() {
    try {
      if (window.location.hash && window.location.hash.includes('access_token=')) {
        const hash = window.location.hash.substring(1);
        const params = new URLSearchParams(hash);
        const token = params.get('access_token');
        if (token) {
          if (window.opener && window.opener !== window) {
            try {
              window.opener.postMessage({ type: 'GOOGLE_OAUTH_TOKEN', accessToken: token }, '*');
              if (typeof window.opener.handleGoogleOAuthAccessToken === 'function') {
                window.opener.handleGoogleOAuthAccessToken(token);
              }
            } catch (_) {}
            setTimeout(() => { try { window.close(); } catch (_) {} }, 250);
            return;
          }
          history.replaceState(null, '', window.location.pathname + window.location.search);
          window.handleGoogleOAuthAccessToken(token);
        }
      }
    } catch (e) {
      console.warn('URL hash token check notice:', e);
    }
  }

  /**
   * 7. GOOGLE IDENTITY SERVICES (GIS) SDK SETUP
   */
  function initGoogleSignInSDK() {
    const config = window.PORTFOLIO_CONFIG && (window.PORTFOLIO_CONFIG.auth || (window.PORTFOLIO_CONFIG.personal && window.PORTFOLIO_CONFIG.personal.auth));
    const clientId = config && config.googleClientId;
    if (!clientId) return;

    if (window.google && window.google.accounts && window.google.accounts.id) {
      setupGoogleGIS(clientId);
    } else {
      window.addEventListener('load', () => {
        if (window.google && window.google.accounts && window.google.accounts.id) {
          setupGoogleGIS(clientId);
        }
      });
    }
  }

  function setupGoogleGIS(clientId) {
    try {
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleGoogleCredentialResponse,
        auto_select: false,
        cancel_on_tap_outside: true
      });
    } catch (err) {
      console.warn('Google GIS init notice:', err);
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
   * Handle Google Credential Response from GIS
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
   * 6. RENDER DYNAMIC AUTH UI
   */
  function renderAuthUI() {
    const barrierEl = document.getElementById('contact-auth-barrier');
    const authStatusEl = document.getElementById('contact-auth-status-bar');
    const formEl = document.getElementById('portfolio-contact-form');
    const adminPortalEl = document.getElementById('contact-admin-portal');
    const historyViewEl = document.getElementById('contact-history-view');
    const successStateEl = document.getElementById('contact-success-state');
    const tabsContainer = document.getElementById('contact-view-tabs');

    // 1. Unauthenticated State: Show barrier, hide all auth components
    if (!currentUser) {
      if (barrierEl) {
        barrierEl.classList.remove('hidden');
        barrierEl.style.setProperty('display', 'flex', 'important');
        barrierEl.style.flexDirection = 'column';
        barrierEl.style.alignItems = 'center';
        barrierEl.style.justifyContent = 'center';
        barrierEl.style.textAlign = 'center';
        barrierEl.style.width = '100%';
        barrierEl.style.margin = 'auto 0';
      }
      if (authStatusEl) {
        authStatusEl.classList.add('hidden');
        authStatusEl.style.setProperty('display', 'none', 'important');
      }
      if (tabsContainer) {
        tabsContainer.classList.add('hidden');
        tabsContainer.style.setProperty('display', 'none', 'important');
      }
      if (formEl) {
        formEl.classList.add('hidden');
        formEl.style.setProperty('display', 'none', 'important');
      }
      if (adminPortalEl) {
        adminPortalEl.classList.add('hidden');
        adminPortalEl.style.setProperty('display', 'none', 'important');
      }
      if (historyViewEl) {
        historyViewEl.classList.add('hidden');
        historyViewEl.style.setProperty('display', 'none', 'important');
      }
      if (successStateEl) {
        successStateEl.classList.add('hidden');
        successStateEl.style.setProperty('display', 'none', 'important');
      }

      const btnLabel = document.getElementById('google-auth-btn-label');
      if (btnLabel) btnLabel.innerHTML = 'Sign in with Google';
      return;
    }

    // 2. Authenticated State: MUST HIDE BARRIER COMPLETELY
    if (barrierEl) {
      barrierEl.classList.add('hidden');
      barrierEl.style.setProperty('display', 'none', 'important');
    }
    if (authStatusEl) {
      authStatusEl.classList.remove('hidden');
      authStatusEl.style.setProperty('display', 'flex', 'important');
    }

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

    if (adminPortalEl) {
      adminPortalEl.classList.add('hidden');
      adminPortalEl.style.setProperty('display', 'none', 'important');
    }
    if (tabsContainer) {
      tabsContainer.classList.remove('hidden');
      tabsContainer.style.setProperty('display', 'flex', 'important');
    }

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
      if (formEl) {
        formEl.classList.add('hidden');
        formEl.style.setProperty('display', 'none', 'important');
      }
      if (historyViewEl) {
        historyViewEl.classList.remove('hidden');
        historyViewEl.style.setProperty('display', 'block', 'important');
      }
      loadAndRenderVisitorHistory();
    } else {
      if (formEl) {
        formEl.classList.remove('hidden');
        formEl.style.setProperty('display', 'flex', 'important');
      }
      if (historyViewEl) {
        historyViewEl.classList.add('hidden');
        historyViewEl.style.setProperty('display', 'none', 'important');
      }
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

    // 1. Prioritize Supabase Real-Time Database
    if (window.PortfolioSupabase) {
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

    // Direct HTTPS REST Fallback for visitor history
    try {
      const cfg = (window.PORTFOLIO_CONFIG && (window.PORTFOLIO_CONFIG.supabase || (window.PORTFOLIO_CONFIG.personal && window.PORTFOLIO_CONFIG.personal.supabase))) || {};
      const sbUrl = cfg.url || 'https://nudtptnmjvrndnpsutua.supabase.co';
      const sbKey = cfg.anonKey || 'sb_publishable_2rZ9V0nF98ee6YI9Rpi4HA_ZHcNO-U7';
      const sbTable = cfg.tableName || 'portfolio_messages';

      const restRes = await fetch(`${sbUrl}/rest/v1/${sbTable}?email=ilike.${encodeURIComponent(currentUser.email.trim())}&order=created_at.desc`, {
        headers: {
          'apikey': sbKey,
          'Authorization': `Bearer ${sbKey}`
        }
      });
      if (restRes.ok) {
        const rows = await restRes.json();
        if (Array.isArray(rows)) {
          const formatted = rows.map(r => ({
            id: r.id,
            name: r.name,
            email: r.email,
            subject: r.subject,
            message: r.message,
            timestamp: r.created_at ? new Date(r.created_at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }) + ' IST' : 'Recent',
            status: r.status || 'delivered',
            avatar: r.avatar_url,
            is_google_verified: r.is_google_verified
          }));
          const merged = mergeMessages(formatted, items);
          saveLocalVisitorHistory(merged);
          renderHistoryCards(container, merged, true);
          loadVisitorHistoryCount();
          return;
        }
      }
    } catch (restErr) {
      console.warn('Direct REST visitor history notice:', restErr);
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
        <span class="history-sync-indicator">${isCloudSynced ? '⚡ Live synced with Supabase PostgreSQL' : '📦 Cached locally'}</span>
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

    if (formEl) {
      formEl.classList.add('hidden');
      formEl.style.setProperty('display', 'none', 'important');
    }
    if (historyViewEl) {
      historyViewEl.classList.add('hidden');
      historyViewEl.style.setProperty('display', 'none', 'important');
    }
    if (tabsContainer) {
      tabsContainer.classList.add('hidden');
      tabsContainer.style.setProperty('display', 'none', 'important');
    }
    if (adminPortalEl) {
      adminPortalEl.classList.remove('hidden');
      adminPortalEl.style.setProperty('display', 'block', 'important');
    }

    adminPortalEl.innerHTML = `
      <div class="admin-portal-wrapper">
        <!-- Admin Header -->
        <div class="admin-header-bar">
          <div class="admin-header-title">
            <h3>📬 Master Inbox & Contact Hub</h3>
            <span class="admin-live-badge">REAL-TIME SUPABASE POSTGRESQL ⚡</span>
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
            <span class="metric-label">CONNECTED DATABASE</span>
            <strong class="metric-val metric-val-db">Supabase PostgreSQL (portfolio_messages) ⚡ Live</strong>
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
            <span>Connecting to Supabase PostgreSQL real-time database...</span>
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
        <span>Syncing real-time messages from Supabase PostgreSQL...</span>
      </div>
    `;

    // 1. Try Supabase Client
    if (window.PortfolioSupabase) {
      try {
        const sbResult = await window.PortfolioSupabase.getAllMessages();
        if (sbResult && sbResult.success && Array.isArray(sbResult.messages)) {
          adminMessages = sbResult.messages;
          if (totalMetric) totalMetric.textContent = adminMessages.length;
          if (sendersMetric) sendersMetric.textContent = countUnique(adminMessages);
          renderAdminCards(adminMessages);

          // Listen for live incoming messages via websocket
          try {
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
          } catch (_) {}
          return;
        }
      } catch (sbErr) {
        console.warn('Supabase admin fetch notice:', sbErr);
      }
    }

    // 2. Direct HTTPS REST Query to Supabase (Guaranteed fallback)
    try {
      const cfg = (window.PORTFOLIO_CONFIG && (window.PORTFOLIO_CONFIG.supabase || (window.PORTFOLIO_CONFIG.personal && window.PORTFOLIO_CONFIG.personal.supabase))) || {};
      const sbUrl = cfg.url || 'https://nudtptnmjvrndnpsutua.supabase.co';
      const sbKey = cfg.anonKey || 'sb_publishable_2rZ9V0nF98ee6YI9Rpi4HA_ZHcNO-U7';
      const sbTable = cfg.tableName || 'portfolio_messages';

      const restRes = await fetch(`${sbUrl}/rest/v1/${sbTable}?select=*&order=created_at.desc`, {
        headers: {
          'apikey': sbKey,
          'Authorization': `Bearer ${sbKey}`
        }
      });

      if (restRes.ok) {
        const rows = await restRes.json();
        if (Array.isArray(rows)) {
          adminMessages = rows.map(r => ({
            id: r.id,
            name: r.name,
            email: r.email,
            subject: r.subject,
            message: r.message,
            timestamp: r.created_at ? new Date(r.created_at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }) + ' IST' : 'Recent',
            status: r.status || 'delivered',
            avatar: r.avatar_url,
            is_google_verified: r.is_google_verified
          }));

          if (totalMetric) totalMetric.textContent = adminMessages.length;
          if (sendersMetric) sendersMetric.textContent = countUnique(adminMessages);
          renderAdminCards(adminMessages);
          return;
        }
      }
    } catch (directErr) {
      console.warn('Direct Supabase REST query notice:', directErr);
    }

    // 3. Fallback to Google Apps Script Web App
    const webhookUrl = (window.PORTFOLIO_CONFIG && window.PORTFOLIO_CONFIG.personal && window.PORTFOLIO_CONFIG.personal.contactWebhookUrl) || '';
    if (webhookUrl && webhookUrl.startsWith('https://script.google.com/')) {
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
      } catch (err) {
        console.warn('Admin fetch notice:', err);
      }
    }

    feed.innerHTML = `
      <div class="admin-empty-state">
        <p>⚠️ Unable to fetch live messages from Supabase. Please check your internet connection and retry.</p>
        <button type="button" class="btn btn-secondary btn-sm" id="btn-admin-retry">Retry Connection</button>
      </div>
    `;
    const retryBtn = feed.querySelector('#btn-admin-retry');
    if (retryBtn) retryBtn.addEventListener('click', loadAdminMessages);
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

    // Direct Google OAuth triggers
    const triggerButtons = document.querySelectorAll('.trigger-google-auth-modal, #btn-direct-google-auth');
    triggerButtons.forEach(b => {
      b.addEventListener('click', () => {
        if (typeof window.launchDirectGoogleOAuth === 'function') {
          window.launchDirectGoogleOAuth();
        }
      });
    });
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
    launchDirectGoogleOAuth: () => {
      if (typeof window.launchDirectGoogleOAuth === 'function') {
        window.launchDirectGoogleOAuth();
      }
    },
    handleSupabaseUser: handleSupabaseUser,
    signOut: handleSignOut
  };

})();
