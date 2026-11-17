/**
 * ==============================================================================
 * SUPABASE REAL-TIME DATABASE & APPS SCRIPT AUTOMATION HYBRID CLIENT
 * ==============================================================================
 * Author: Kandukuri Jagan
 * Description:
 * 1. Supabase PostgreSQL handles persistent storage, fast queries, and real-time feeds.
 * 2. Includes dual-layer querying: Supabase JS SDK + Direct HTTPS REST API fallback.
 * 3. Gracefully falls back to Apps Script + LocalStorage when needed.
 * ==============================================================================
 */

(function () {
  'use strict';

  let supabaseClient = null;
  let isSupabaseActive = false;
  let activeChannel = null;

  // Initialize immediately
  initSupabase();
  if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', initSupabase);
    window.addEventListener('load', initSupabase);
  }

  function getSupabaseCredentials() {
    const config = (window.PORTFOLIO_CONFIG && (window.PORTFOLIO_CONFIG.supabase || (window.PORTFOLIO_CONFIG.personal && window.PORTFOLIO_CONFIG.personal.supabase))) || {};
    const url = (config.url || 'https://nudtptnmjvrndnpsutua.supabase.co').trim();
    const key = (config.anonKey || 'sb_publishable_2rZ9V0nF98ee6YI9Rpi4HA_ZHcNO-U7').trim();
    const tableName = config.tableName || 'portfolio_messages';
    return { url, key, tableName };
  }

  function initSupabase() {
    if (supabaseClient && isSupabaseActive) return supabaseClient;

    const { url, key } = getSupabaseCredentials();

    if (window.supabase && typeof window.supabase.createClient === 'function' && url && key && !url.includes('YOUR_SUPABASE_PROJECT_URL')) {
      try {
        supabaseClient = window.supabase.createClient(url, key);
        isSupabaseActive = true;
        console.log('⚡ Supabase Real-Time Client connected to', url);

        supabaseClient.auth.onAuthStateChange((event, session) => {
          if (session && session.user && window.PortfolioAuth && window.PortfolioAuth.handleSupabaseUser) {
            window.PortfolioAuth.handleSupabaseUser(session.user);
          }
        });
        return supabaseClient;
      } catch (err) {
        console.warn('Supabase SDK init notice:', err);
      }
    }

    // Direct REST API is ready even if SDK script is still loading
    if (url && key && !url.includes('YOUR_SUPABASE_PROJECT_URL')) {
      isSupabaseActive = true;
    }

    return supabaseClient;
  }

  function isConfigured() {
    initSupabase();
    const { url, key } = getSupabaseCredentials();
    return Boolean(url && key && !url.includes('YOUR_SUPABASE_PROJECT_URL'));
  }

  /**
   * Save message to Supabase (SDK with Direct HTTPS REST Fallback)
   */
  async function saveMessage(data) {
    initSupabase();
    const { url, key, tableName } = getSupabaseCredentials();

    const payload = {
      name: data.name || 'Anonymous Visitor',
      email: (data.email || '').toLowerCase().trim(),
      subject: data.subject || 'Portfolio Inquiry',
      message: data.message || '',
      avatar_url: data.avatar || '',
      is_google_verified: Boolean(data.googleVerified),
      status: 'delivered'
    };

    // 1. Try Supabase SDK
    if (supabaseClient) {
      try {
        const { data: inserted, error } = await supabaseClient
          .from(tableName)
          .insert([payload])
          .select();

        if (!error && inserted && inserted.length > 0) {
          return { success: true, record: inserted[0] };
        }
      } catch (e) {
        console.warn('Supabase SDK insert notice:', e);
      }
    }

    // 2. Direct HTTPS REST API Fallback
    try {
      const restEndpoint = `${url}/rest/v1/${tableName}`;
      const res = await fetch(restEndpoint, {
        method: 'POST',
        headers: {
          'apikey': key,
          'Authorization': `Bearer ${key}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const inserted = await res.json();
        return { success: true, record: inserted && inserted[0] };
      }
    } catch (err) {
      console.warn('Direct REST insert error:', err);
    }

    return { success: false, fallback: true, message: 'Could not write to Supabase' };
  }

  /**
   * Fetch visitor message history by email (SDK with Direct HTTPS REST Fallback)
   */
  async function getMessageHistory(email) {
    if (!email) return { success: false, messages: [] };
    initSupabase();
    const { url, key, tableName } = getSupabaseCredentials();

    // 1. Try Supabase SDK
    if (supabaseClient) {
      try {
        const { data, error } = await supabaseClient
          .from(tableName)
          .select('*')
          .ilike('email', email.trim())
          .order('created_at', { ascending: false });

        if (!error && Array.isArray(data)) {
          return { success: true, messages: data.map(formatMessageRow) };
        }
      } catch (e) {
        console.warn('Supabase SDK history notice:', e);
      }
    }

    // 2. Direct HTTPS REST API Fallback
    try {
      const restEndpoint = `${url}/rest/v1/${tableName}?email=ilike.${encodeURIComponent(email.trim())}&order=created_at.desc`;
      const res = await fetch(restEndpoint, {
        headers: {
          'apikey': key,
          'Authorization': `Bearer ${key}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          return { success: true, messages: data.map(formatMessageRow) };
        }
      }
    } catch (err) {
      console.warn('Direct REST history error:', err);
    }

    return { success: false, fallback: true, messages: [] };
  }

  /**
   * Fetch all messages for Admin (kandukurijagan99@gmail.com)
   * SDK with Direct HTTPS REST Fallback
   */
  async function getAllMessages() {
    initSupabase();
    const { url, key, tableName } = getSupabaseCredentials();

    // 1. Try Supabase SDK
    if (supabaseClient) {
      try {
        const { data, error } = await supabaseClient
          .from(tableName)
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && Array.isArray(data)) {
          return { success: true, messages: data.map(formatMessageRow) };
        }
      } catch (e) {
        console.warn('Supabase SDK admin query notice:', e);
      }
    }

    // 2. Direct HTTPS REST API Fallback
    try {
      const restEndpoint = `${url}/rest/v1/${tableName}?select=*&order=created_at.desc`;
      const res = await fetch(restEndpoint, {
        headers: {
          'apikey': key,
          'Authorization': `Bearer ${key}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          return { success: true, messages: data.map(formatMessageRow) };
        }
      }
    } catch (err) {
      console.warn('Direct REST admin query error:', err);
    }

    return { success: false, fallback: true, messages: [] };
  }

  function formatMessageRow(row) {
    return {
      id: row.id,
      name: row.name,
      email: row.email,
      subject: row.subject,
      message: row.message,
      timestamp: formatTimestamp(row.created_at),
      status: row.status || 'delivered',
      avatar: row.avatar_url,
      is_google_verified: row.is_google_verified
    };
  }

  /**
   * Listen to real-time incoming messages
   */
  function subscribeToRealtimeMessages(callback) {
    initSupabase();
    if (!supabaseClient) return null;

    try {
      if (activeChannel) {
        supabaseClient.removeChannel(activeChannel);
      }

      const { tableName } = getSupabaseCredentials();
      activeChannel = supabaseClient
        .channel('realtime_portfolio_messages')
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: tableName },
          payload => {
            if (payload && payload.new && typeof callback === 'function') {
              callback(formatMessageRow(payload.new));
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
    isConfigured: isConfigured,
    saveMessage: saveMessage,
    getMessageHistory: getMessageHistory,
    getAllMessages: getAllMessages,
    subscribeToRealtimeMessages: subscribeToRealtimeMessages
  };
})();
