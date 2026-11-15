/**
 * ==============================================================================
 * SUPABASE REAL-TIME DATABASE & APPS SCRIPT AUTOMATION HYBRID CLIENT
 * ==============================================================================
 * Author: Kandukuri Jagan
 * Description:
 * 1. Supabase PostgreSQL handles persistent storage, fast queries, and real-time feeds.
 * 2. Google Apps Script handles automated email delivery & Google Sheets mirror backup.
 * 3. Gracefully falls back to Apps Script + LocalStorage when credentials are being set up.
 * ==============================================================================
 */

(function () {
  'use strict';

  let supabaseClient = null;
  let isSupabaseActive = false;
  let activeChannel = null;

  document.addEventListener('DOMContentLoaded', initSupabase);

  function initSupabase() {
    const config = window.PORTFOLIO_CONFIG && (window.PORTFOLIO_CONFIG.supabase || (window.PORTFOLIO_CONFIG.personal && window.PORTFOLIO_CONFIG.personal.supabase));
    if (!config) return;

    const url = config.url && config.url.trim();
    const key = config.anonKey && config.anonKey.trim();

    // Check if Supabase JS SDK is loaded and credentials are set
    if (window.supabase && url && key && !url.includes('YOUR_SUPABASE_PROJECT_URL')) {
      try {
        supabaseClient = window.supabase.createClient(url, key);
        isSupabaseActive = true;
        console.log('⚡ Supabase Real-Time Client connected successfully.');

        // Listen for OAuth sign-in completion (when returning from Google login)
        supabaseClient.auth.onAuthStateChange((event, session) => {
          if (session && session.user && window.PortfolioAuth && window.PortfolioAuth.handleSupabaseUser) {
            window.PortfolioAuth.handleSupabaseUser(session.user);
          }
        });
      } catch (err) {
        console.warn('Supabase initialization notice:', err);
        isSupabaseActive = false;
      }
    }
  }

  /**
   * Launch direct Google OAuth redirect via Supabase
   */
  async function signInWithGoogle() {
    if (!isSupabaseActive || !supabaseClient) {
      if (window.showToast) {
        window.showToast("To use direct Google sign-in, add your Google Client ID or Supabase credentials in js/config.js", "info");
      }
      return { success: false, message: 'Supabase client not initialized' };
    }

    try {
      const redirectUrl = window.location.origin + window.location.pathname;
      const { data, error } = await supabaseClient.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl
        }
      });
      if (error) throw error;
      return { success: true, data };
    } catch (err) {
      console.warn('Supabase Google OAuth notice:', err);
      if (window.showToast) {
        window.showToast('Google OAuth error: ' + (err.message || err.toString()), 'error');
      }
      return { success: false, error: err.message || err.toString() };
    }
  }

  /**
   * Save message to Supabase
   */
  async function saveMessage(data) {
    if (!isSupabaseActive || !supabaseClient) {
      return { success: false, fallback: true, message: 'Supabase client not initialized' };
    }

    try {
      const payload = {
        name: data.name || 'Anonymous Visitor',
        email: (data.email || '').toLowerCase().trim(),
        subject: data.subject || 'Portfolio Inquiry',
        message: data.message || '',
        avatar_url: data.avatar || '',
        is_google_verified: Boolean(data.googleVerified),
        status: 'delivered'
      };

      const tableName = (window.PORTFOLIO_CONFIG && window.PORTFOLIO_CONFIG.supabase && window.PORTFOLIO_CONFIG.supabase.tableName) || 'portfolio_messages';
      const { data: inserted, error } = await supabaseClient
        .from(tableName)
        .insert([payload])
        .select();

      if (error) {
        console.warn('Supabase insert error:', error);
        return { success: false, error: error.message };
      }

      return { success: true, record: inserted && inserted[0] };
    } catch (err) {
      console.warn('Supabase save exception:', err);
      return { success: false, error: err.toString() };
    }
  }

  /**
   * Fetch visitor message history by email
   */
  async function getMessageHistory(email) {
    if (!isSupabaseActive || !supabaseClient || !email) {
      return { success: false, fallback: true, messages: [] };
    }

    try {
      const tableName = (window.PORTFOLIO_CONFIG && window.PORTFOLIO_CONFIG.supabase && window.PORTFOLIO_CONFIG.supabase.tableName) || 'portfolio_messages';
      const { data, error } = await supabaseClient
        .from(tableName)
        .select('*')
        .ilike('email', email.trim())
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Supabase query error:', error);
        return { success: false, error: error.message, messages: [] };
      }

      // Format for UI consumption
      const formatted = (data || []).map(row => ({
        id: row.id,
        name: row.name,
        email: row.email,
        subject: row.subject,
        message: row.message,
        timestamp: formatTimestamp(row.created_at),
        status: row.status || 'delivered',
        is_google_verified: row.is_google_verified
      }));

      return { success: true, messages: formatted };
    } catch (err) {
      return { success: false, error: err.toString(), messages: [] };
    }
  }

  /**
   * Fetch all messages for Admin (kandukurijagan99@gmail.com)
   */
  async function getAllMessages() {
    if (!isSupabaseActive || !supabaseClient) {
      return { success: false, fallback: true, messages: [] };
    }

    try {
      const tableName = (window.PORTFOLIO_CONFIG && window.PORTFOLIO_CONFIG.supabase && window.PORTFOLIO_CONFIG.supabase.tableName) || 'portfolio_messages';
      const { data, error } = await supabaseClient
        .from(tableName)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        return { success: false, error: error.message, messages: [] };
      }

      const formatted = (data || []).map(row => ({
        id: row.id,
        name: row.name,
        email: row.email,
        subject: row.subject,
        message: row.message,
        timestamp: formatTimestamp(row.created_at),
        status: row.status || 'delivered',
        avatar: row.avatar_url,
        is_google_verified: row.is_google_verified
      }));

      return { success: true, messages: formatted };
    } catch (err) {
      return { success: false, error: err.toString(), messages: [] };
    }
  }

  /**
   * Listen to real-time incoming messages (for Admin Inbox Live Feed)
   */
  function subscribeToRealtimeMessages(callback) {
    if (!isSupabaseActive || !supabaseClient) return null;

    try {
      if (activeChannel) {
        supabaseClient.removeChannel(activeChannel);
      }

      const tableName = (window.PORTFOLIO_CONFIG && window.PORTFOLIO_CONFIG.supabase && window.PORTFOLIO_CONFIG.supabase.tableName) || 'portfolio_messages';
      activeChannel = supabaseClient
        .channel('realtime_portfolio_messages')
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: tableName },
          payload => {
            if (payload && payload.new && typeof callback === 'function') {
              const formatted = {
                id: payload.new.id,
                name: payload.new.name,
                email: payload.new.email,
                subject: payload.new.subject,
                message: payload.new.message,
                timestamp: formatTimestamp(payload.new.created_at),
                status: payload.new.status || 'delivered',
                avatar: payload.new.avatar_url,
                is_google_verified: payload.new.is_google_verified
              };
              callback(formatted);
            }
          }
        )
        .subscribe();

      return activeChannel;
    } catch (e) {
      console.warn('Realtime subscription notice:', e);
      return null;
    }
  }

  function formatTimestamp(isoString) {
    if (!isoString) return 'Just now';
    try {
      const d = new Date(isoString);
      return d.toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }) + ' IST';
    } catch (e) {
      return isoString;
    }
  }

  // Export globally
  window.PortfolioSupabase = {
    isConfigured: () => isSupabaseActive,
    signInWithGoogle: signInWithGoogle,
    saveMessage: saveMessage,
    getMessageHistory: getMessageHistory,
    getAllMessages: getAllMessages,
    subscribeToRealtimeMessages: subscribeToRealtimeMessages
  };

})();
