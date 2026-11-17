/**
 * ==============================================================================
 * GOOGLE APPS SCRIPT: PORTFOLIO CONTACT DISPATCHER & REAL-TIME MESSAGE HUB
 * ==============================================================================
 * 
 * Target Admin Email : kandukurijagan99@gmail.com
 * Current Web App URL: https://script.google.com/macros/s/AKfycbxb2uoJsZRDcn4kB8_aNXXV9BfwZhdBIJWjMpn9JeNANWMclM6icL-bukdR4IwYq_ds/exec
 * 
 * Capabilities:
 * 1. 📊 Stores messages in Google Sheet with verified sender metadata (Timestamp, Name, Email ID, Subject, Message, Avatar, Status)
 * 2. 🚀 Dispatches full instant email notification to Kandukuri Jagan's inbox
 * 3. ✉️ Sends kind confirmation email to visitor with automated notice
 * 4. 🔍 GET ?action=getHistory&email=... -> Returns visitor's personal message history for persistent re-login
 * 5. 👑 GET ?action=getAllMessages&adminEmail=... -> Returns all visitor messages for kandukurijagan99@gmail.com admin dashboard
 * ==============================================================================
 */

// Primary admin email where Kandukuri Jagan manages all portfolio communications
var ADMIN_EMAIL = "kandukurijagan99@gmail.com";
var RECIPIENT_EMAIL = "kandukurijagan99@gmail.com";

// Security secret for client-server handshake validation (Blocks unauthenticated direct automated tools)
var SECURITY_SECRET = "KJ_PORTFOLIO_SECURE_AUTH_2026";

// OPTIONAL: If this script is NOT created via "Extensions > Apps Script" inside your Google Sheet,
// paste the Google Sheet ID below. You can find it in your Google Sheet URL:
// https://docs.google.com/spreadsheets/d/<COPY_THIS_PART>/edit
// Leave empty ("") if you opened Apps Script directly from Extensions > Apps Script inside the sheet!
var SPREADSHEET_ID = ""; 

/**
 * Robust helper to obtain the active or linked Google Sheet instance
 */
function getSpreadsheetInstance() {
  try {
    var active = SpreadsheetApp.getActiveSpreadsheet();
    if (active) return active;
  } catch (e) {
    Logger.log("getActiveSpreadsheet notice: " + e.toString());
  }

  if (SPREADSHEET_ID && SPREADSHEET_ID.trim().length > 10 && !SPREADSHEET_ID.includes("YOUR_")) {
    try {
      return SpreadsheetApp.openById(SPREADSHEET_ID.trim());
    } catch (e2) {
      Logger.log("openById notice: " + e2.toString());
    }
  }

  return null;
}


/**
 * ==============================================================================
 * 1. GET HANDLER: History retrieval, Admin Inbox & Health Diagnostics
 * ==============================================================================
 */
function doGet(e) {
  try {
    var action = (e && e.parameter && e.parameter.action) ? e.parameter.action.toString().trim() : "";
    
    // --- WORKFLOW A: Visitor Personal Message History ---
    if (action === "getHistory") {
      var email = (e.parameter.email || "").toString().trim().toLowerCase();
      if (!email) {
        return createJsonResponse({
          status: "error",
          message: "Email parameter is required to fetch history."
        });
      }

      var allRows = getSheetRows();
      var userMessages = [];

      for (var i = 0; i < allRows.length; i++) {
        var row = allRows[i];
        if ((row.email || "").toLowerCase() === email) {
          userMessages.push(row);
        }
      }

      // Return newest messages first
      userMessages.reverse();

      return createJsonResponse({
        status: "success",
        email: email,
        count: userMessages.length,
        messages: userMessages
      });
    }

    // --- WORKFLOW B: Admin Master Inbox (kandukurijagan99@gmail.com) ---
    if (action === "getAllMessages") {
      var adminEmail = (e.parameter.adminEmail || "").toString().trim().toLowerCase();
      if (adminEmail !== ADMIN_EMAIL.toLowerCase()) {
        return createJsonResponse({
          status: "error",
          message: "Unauthorized. Admin access restricted to " + ADMIN_EMAIL
        });
      }

      var allMessages = getSheetRows();
      // Reverse to show newest messages at top of admin dashboard
      allMessages.reverse();

      // Compute quick stats
      var uniqueEmails = {};
      for (var j = 0; j < allMessages.length; j++) {
        if (allMessages[j].email) {
          uniqueEmails[allMessages[j].email.toLowerCase()] = true;
        }
      }

      return createJsonResponse({
        status: "success",
        isAdmin: true,
        adminEmail: ADMIN_EMAIL,
        total: allMessages.length,
        uniqueContacts: Object.keys(uniqueEmails).length,
        messages: allMessages
      });
    }

    // --- WORKFLOW D: Admin Delete Message from Sheet ---
    if (action === "deleteMessage") {
      var adminEmail = (e.parameter.adminEmail || "").toString().trim().toLowerCase();
      if (adminEmail !== ADMIN_EMAIL.toLowerCase()) {
        return createJsonResponse({
          status: "error",
          message: "Unauthorized. Admin access restricted to " + ADMIN_EMAIL
        });
      }
      var targetTimestamp = (e.parameter.timestamp || "").toString().trim();
      var targetEmail = (e.parameter.email || "").toString().trim().toLowerCase();
      var targetMessage = (e.parameter.message || "").toString().trim();

      var deleteResult = deleteSheetRow(targetTimestamp, targetEmail, targetMessage);
      return createJsonResponse({
        status: deleteResult.success ? "success" : "error",
        message: deleteResult.message
      });
    }

    // --- WORKFLOW C: System Health Check & Diagnostics ---
    var diag = {
      status: "online",
      service: "Portfolio Contact Dispatcher & Real-Time Message Hub",
      adminEmail: ADMIN_EMAIL,
      sheetConnected: false,
      totalMessages: 0
    };

    try {
      var ss = getSpreadsheetInstance();
      if (ss) {
        diag.sheetConnected = true;
        diag.sheetName = ss.getName();
        diag.totalMessages = getSheetRows().length;
      }
    } catch (sheetErr) {
      diag.sheetError = sheetErr.toString();
    }

    return createJsonResponse(diag);

  } catch (err) {
    return createJsonResponse({
      status: "error",
      message: err.toString()
    });
  }
}


/**
 * ==============================================================================
 * 2. POST HANDLER: Form Submissions with Google Verified Identity
 * ==============================================================================
 */
function doPost(e) {
  try {
    var data = {};

    // Extract form fields
    if (e && e.parameter && (e.parameter.name || e.parameter.email || e.parameter.message)) {
      data = e.parameter;
    } else if (e && e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (err) {
        var raw = e.postData.contents.toString();
        var pairs = raw.split("&");
        for (var i = 0; i < pairs.length; i++) {
          var pair = pairs[i].split("=");
          if (pair.length >= 2) {
            data[decodeURIComponent(pair[0])] = decodeURIComponent(pair.slice(1).join("=").replace(/\+/g, " "));
          }
        }
      }
    } else if (e && e.parameter) {
      data = e.parameter;
    } else {
      data = {
        name: "Test Visitor",
        email: ADMIN_EMAIL,
        subject: "Manual Editor Test",
        message: "This is a test run executed directly from the Apps Script editor."
      };
    }

    var name = (data.name || "Valued Visitor").toString().trim();
    var email = (data.email || "").toString().trim();
    var subject = (data.subject || "Portfolio Inquiry / Collaboration").toString().trim();
    var message = (data.message || "No message content provided.").toString().trim();

    if (!email || !message) {
      return createJsonResponse({
        result: "error",
        status: "missing_fields",
        message: "Email address and message content are required."
      });
    }

    // 🔒 ANTI-BOT & AUTOMATED TOOLS DEFENSE SHIELD
    // Blocks external scripts, scrapers, and tools (e.g. Portfolio Message Submitter)
    var authCheck = validateSubmissionSecurity(data, email);
    if (!authCheck.allowed) {
      Logger.log("BLOCKED AUTOMATED SUBMISSION: " + authCheck.status + " | Reason: " + authCheck.message + " | Email: " + email);
      return createJsonResponse({
        result: "error",
        status: authCheck.status,
        message: authCheck.message
      });
    }

    var avatar = (data.avatar || "").toString().trim();
    var isGoogleVerified = authCheck.isGoogleVerified;
    var timestamp = Utilities.formatDate(new Date(), "Asia/Kolkata", "dd MMM yyyy, hh:mm a") + " IST";

    // 1. Save submission into Google Sheet
    var sheetResult = saveToSheet(name, email, subject, message, timestamp, avatar, isGoogleVerified);

    // 2. Dispatch primary notification to Kandukuri Jagan
    try {
      // Clean subject without spam-triggering emojis or deceptive flags
      var emailSubject = "[Portfolio Inquiry] " + subject + " - " + name;

      var adminPlainText = 
        "NEW PORTFOLIO INQUIRY\n" +
        "========================================\n" +
        "Sender: " + name + " (" + email + ")" + (isGoogleVerified ? " [Google Verified]" : "") + "\n" +
        "Subject: " + subject + "\n" +
        "Time: " + timestamp + "\n" +
        "Status: " + (sheetResult.success ? "Recorded in Sheet" : "Direct Dispatch") + "\n\n" +
        "MESSAGE CONTENT:\n" +
        message + "\n\n" +
        "========================================\n" +
        "Reply directly to: " + email + "\n" +
        "Admin Portal: https://kandukuri-jagan-portfolio.netlify.app/#contact";

      var adminHtml = 
        '<div style="font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0b0f19; color: #f8fafc; border-radius: 16px; overflow: hidden; border: 1px solid #1e293b; box-shadow: 0 15px 35px rgba(0,0,0,0.5);">' +
          '<div style="background: linear-gradient(135deg, #0ea5e9 0%, #6366f1 50%, #a855f7 100%); padding: 26px 24px; text-align: center;">' +
            '<h1 style="margin: 0; font-size: 22px; font-weight: 800; color: #ffffff;">New Portfolio Connection!</h1>' +
            '<p style="margin: 6px 0 0; font-size: 13px; color: #e0e7ff;">A verified visitor reached out via kandukuri-jagan-portfolio.netlify.app</p>' +
          '</div>' +
          '<div style="padding: 24px;">' +
            '<div style="background: rgba(16, 185, 129, 0.12); border: 1px solid rgba(16, 185, 129, 0.35); border-radius: 8px; padding: 10px 14px; margin-bottom: 20px;">' +
              '<span style="color: #10b981; font-size: 13px; font-weight: 700;">' + (sheetResult.success ? "Recorded in Google Sheet" : "Direct Message: " + sheetResult.error) + ' • Verified Email: ' + email + '</span>' +
            '</div>' +
            '<table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">' +
              '<tr><td style="padding: 8px 0; color: #94a3b8; font-size: 13px; width: 90px;"><strong>Sender:</strong></td><td style="padding: 8px 0; color: #ffffff; font-size: 15px; font-weight: 700;">' + name + (isGoogleVerified ? ' <span style="background: #10b981; color: #000; font-size: 10px; padding: 2px 6px; border-radius: 4px; font-weight: 800;">VERIFIED</span>' : '') + '</td></tr>' +
              '<tr><td style="padding: 8px 0; color: #94a3b8; font-size: 13px;"><strong>Email:</strong></td><td style="padding: 8px 0;"><a href="mailto:' + email + '" style="color: #38bdf8; text-decoration: none; font-weight: 600;">' + email + '</a></td></tr>' +
              '<tr><td style="padding: 8px 0; color: #94a3b8; font-size: 13px;"><strong>Subject:</strong></td><td style="padding: 8px 0; color: #f1f5f9; font-size: 14px; font-weight: 600;">' + subject + '</td></tr>' +
              '<tr><td style="padding: 8px 0; color: #94a3b8; font-size: 13px;"><strong>Time:</strong></td><td style="padding: 8px 0; color: #64748b; font-size: 12px; font-family: monospace;">' + timestamp + '</td></tr>' +
            '</table>' +
            '<div style="background-color: #141c2e; border: 1px solid #1e293b; border-left: 4px solid #38bdf8; border-radius: 8px; padding: 16px 18px; margin-bottom: 22px;">' +
              '<div style="color: #94a3b8; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; font-weight: 700; margin-bottom: 8px;">Message Content:</div>' +
              '<div style="color: #e2e8f0; font-size: 14px; line-height: 1.65; white-space: pre-wrap;">' + message + '</div>' +
            '</div>' +
            '<div style="text-align: center; margin: 20px 0 10px;">' +
              '<a href="mailto:' + email + '?subject=Re: ' + encodeURIComponent(subject) + '" style="display: inline-block; background: linear-gradient(135deg, #38bdf8, #6366f1); color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-weight: 700; font-size: 14px;">Reply Directly to ' + name + '</a>' +
            '</div>' +
          '</div>' +
          '<div style="background-color: #07090e; padding: 16px 20px; text-align: center; border-top: 1px solid #1e293b; color: #64748b; font-size: 12px;">' +
            '<strong>Kandukuri Jagan</strong> • Saveetha University (3rd Year • CGPA 9.04)<br/>' +
            'Main Lead, Synora\'26 Hackathon (80+ Teams)' +
          '</div>' +
        '</div>';

      MailApp.sendEmail({
        to: ADMIN_EMAIL,
        subject: emailSubject,
        body: adminPlainText,
        htmlBody: adminHtml,
        replyTo: email,
        name: "KJ Portfolio Inbox"
      });
    } catch (adminErr) {
      Logger.log("Admin email error: " + adminErr.toString());
    }

    // 3. Send kind confirmation email to visitor
    if (email && email.indexOf("@") !== -1 && email.indexOf(".") !== -1) {
      try {
        var firstName = name.split(" ")[0] || name;
        var visitorSubject = "Thank you for reaching out! — Kandukuri Jagan";
        
        var visitorPlainText = 
          "Hi " + firstName + ",\n\n" +
          "Thank you for contacting me through my portfolio. I have received your message regarding \"" + subject + "\" and will get back to you shortly.\n\n" +
          "For urgent inquiries, call/WhatsApp me at +91 8367047947 or connect via LinkedIn: https://www.linkedin.com/in/jagan-kandukuri-053a0331b/\n\n" +
          "Best regards,\n" +
          "Kandukuri Jagan\n" +
          "Full Stack Developer • Synora'26 Main Lead\n" +
          "Saveetha University, Chennai (CGPA 9.04)";

        var visitorHtml = 
          '<div style="font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, Helvetica, Arial, sans-serif; max-width: 580px; margin: 0 auto; background-color: #0d131f; color: #f8fafc; border-radius: 16px; overflow: hidden; border: 1px solid #1e293b; box-shadow: 0 15px 35px rgba(0,0,0,0.5); padding: 32px 28px;">' +
            '<h2 style="margin: 0 0 16px; font-size: 24px; font-weight: 800; color: #38bdf8; letter-spacing: -0.3px;">Message Received!</h2>' +
            '<p style="color: #ffffff; font-size: 15px; font-weight: 600; margin: 0 0 14px;">Hi ' + firstName + ',</p>' +
            '<p style="color: #cbd5e1; font-size: 14px; line-height: 1.65; margin: 0 0 14px;">' +
              'Thank you for contacting me through my portfolio. I have received your message regarding <strong>"' + subject + '"</strong> and will get back to you shortly.' +
            '</p>' +
            '<div style="background: rgba(56, 189, 248, 0.08); border: 1px solid rgba(56, 189, 248, 0.25); border-left: 3px solid #38bdf8; border-radius: 8px; padding: 12px 16px; margin: 18px 0;">' +
              '<p style="color: #94a3b8; font-size: 12.5px; line-height: 1.6; margin: 0;">' +
                'ℹ️ <strong style="color: #38bdf8;">Notice:</strong> This is an automated message set by me for a better and faster way of communication with users. Your message has been safely delivered to my personal inbox, and you can view your full conversation history anytime you log in with your Google account on my portfolio.' +
              '</p>' +
            '</div>' +
            '<p style="color: #cbd5e1; font-size: 14px; line-height: 1.65; margin: 16px 0;">' +
              'For urgent inquiries, call/WhatsApp me at <a href="https://api.whatsapp.com/send?phone=918367047947" style="color: #38bdf8; text-decoration: none; font-weight: 700;">+91 8367047947</a> or connect via <a href="https://www.linkedin.com/in/jagan-kandukuri-053a0331b/" style="color: #38bdf8; text-decoration: none; font-weight: 700;">LinkedIn</a>.' +
            '</p>' +
            '<div style="margin-top: 26px; padding-top: 20px; border-top: 1px solid #1e293b;">' +
              '<p style="color: #94a3b8; font-size: 13px; margin: 0 0 4px;">Best regards,</p>' +
              '<p style="color: #ffffff; font-size: 15px; font-weight: 700; margin: 0 0 2px;">Kandukuri Jagan</p>' +
              '<p style="color: #64748b; font-size: 12.5px; margin: 0;">Full Stack Developer • Synora\'26 Main Lead</p>' +
              '<p style="color: #64748b; font-size: 12px; margin: 4px 0 0;">Saveetha University, Chennai (CGPA 9.04)</p>' +
            '</div>' +
          '</div>';

        MailApp.sendEmail({
          to: email,
          subject: visitorSubject,
          body: visitorPlainText,
          htmlBody: visitorHtml,
          name: "Kandukuri Jagan",
          replyTo: ADMIN_EMAIL
        });
      } catch (visitorErr) {
        Logger.log("Visitor email notice: " + visitorErr.toString());
      }
    }

    return createJsonResponse({
      result: "success",
      message: "Message recorded in Google Sheet and emails dispatched.",
      sheetSaved: sheetResult.success,
      timestamp: timestamp
    });

  } catch (err) {
    return createJsonResponse({
      result: "error",
      error: err.toString()
    });
  }
}


/**
 * ==============================================================================
 * 3. HELPER: Read rows from Google Sheet into objects
 * ==============================================================================
 */
function getSheetRows() {
  try {
    var ss = getSpreadsheetInstance();
    if (!ss) return [];
    var sheet = ss.getSheetByName("Sheet1") || ss.getActiveSheet() || ss.getSheets()[0];
    if (!sheet || sheet.getLastRow() <= 1) return [];

    var data = sheet.getDataRange().getValues();
    if (!data || data.length <= 1) return [];

    var headers = data[0].map(function(h) { 
      return (h || "").toString().trim().toLowerCase(); 
    });

    var rows = [];
    for (var r = 1; r < data.length; r++) {
      var row = data[r];
      var isBlank = true;
      for (var k = 0; k < row.length; k++) {
        if (row[k] !== "" && row[k] !== null && row[k] !== undefined) {
          isBlank = false;
          break;
        }
      }
      if (isBlank) continue;

      var item = { id: r };
      for (var c = 0; c < headers.length; c++) {
        var key = headers[c];
        var val = row[c] !== undefined ? row[c] : "";
        if (val instanceof Date) {
          val = Utilities.formatDate(val, "Asia/Kolkata", "dd MMM yyyy, hh:mm a") + " IST";
        }
        val = val.toString().trim();

        if (key.indexOf("time") !== -1) item.timestamp = val;
        else if (key.indexOf("name") !== -1) item.name = val;
        else if (key.indexOf("mail") !== -1) item.email = val;
        else if (key.indexOf("subject") !== -1) item.subject = val;
        else if (key.indexOf("message") !== -1) item.message = val;
        else if (key.indexOf("avatar") !== -1) item.avatar = val;
        else if (key.indexOf("status") !== -1) item.status = val;
        else item[key] = val;
      }

      // Sensible defaults
      if (!item.timestamp) item.timestamp = "Recent";
      if (!item.name) item.name = "Visitor";
      if (!item.email) item.email = "";
      if (!item.subject) item.subject = "Portfolio Inquiry";
      if (!item.message) item.message = "";
      if (!item.status) item.status = "Delivered";

      rows.push(item);
    }

    return rows;
  } catch (err) {
    Logger.log("getSheetRows error: " + err.toString());
    return [];
  }
}


/**
 * ==============================================================================
 * 4. HELPER: Save Submission to Google Sheet
 * ==============================================================================
 */
function saveToSheet(name, email, subject, message, timestamp, avatar, isGoogleVerified) {
  try {
    var ss = getSpreadsheetInstance();
    if (!ss) {
      Logger.log("⚠️ Google Sheet not connected. Dispatched email alert directly.");
      return { success: false, error: "Google Sheet not configured" };
    }

    var sheet = ss.getSheetByName("Sheet1") || ss.getActiveSheet() || ss.getSheets()[0];
    if (!sheet) {
      throw new Error("Target sheet tab not found.");
    }

    // Auto-create professional header row if empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["Timestamp", "Name", "Email ID", "Subject", "Message", "Avatar", "Verified"]);
      var headerRange = sheet.getRange(1, 1, 1, 7);
      headerRange.setFontWeight("bold");
      headerRange.setBackground("#0d131f");
      headerRange.setFontColor("#38bdf8");
      headerRange.setHorizontalAlignment("center");
      headerRange.setVerticalAlignment("middle");
      sheet.setRowHeight(1, 36);
      sheet.setFrozenRows(1);
    }

    // Check header columns to align properly
    var lastCol = sheet.getLastColumn();
    var firstHeader = (sheet.getRange(1, 1).getValue() || "").toString().toLowerCase();

    if (firstHeader.indexOf("name") !== -1) {
      // 4-column layout: Name, Email ID, Subject, Message
      sheet.appendRow([name, email, subject, message]);
    } else {
      // Standard 5+ column layout
      var rowData = [timestamp, name, email, subject, message];
      if (lastCol >= 6) rowData.push(avatar || "");
      if (lastCol >= 7) rowData.push(isGoogleVerified ? "Google Verified ✓" : "Standard");
      sheet.appendRow(rowData);
    }

    return { success: true };

  } catch (err) {
    Logger.log("⚠️ saveToSheet error: " + err.toString());
    return { success: false, error: err.toString() };
  }
}


/**
 * Helper: Delete a message row from Google Sheet
 */
function deleteSheetRow(timestamp, email, messageSnippet) {
  try {
    var ss = getSpreadsheetInstance();
    if (!ss) return { success: false, message: "No spreadsheet connected" };
    var sheet = ss.getSheetByName("Sheet1") || ss.getActiveSheet() || ss.getSheets()[0];
    if (!sheet || sheet.getLastRow() <= 1) return { success: false, message: "Sheet is empty" };

    var data = sheet.getDataRange().getValues();
    for (var i = data.length - 1; i >= 1; i--) {
      var row = data[i];
      var rowTime = (row[0] || "").toString().trim();
      var rowEmail = (row[2] || "").toString().trim().toLowerCase();
      var rowMsg = (row[4] || "").toString().trim();

      var match = false;
      if (timestamp && rowTime === timestamp) {
        match = true;
      } else if (email && rowEmail === email.toLowerCase()) {
        if (!messageSnippet || rowMsg.indexOf(messageSnippet) !== -1) {
          match = true;
        }
      }

      if (match) {
        sheet.deleteRow(i + 1);
        Logger.log("Deleted row " + (i + 1) + " for " + email);
        return { success: true, message: "Row deleted successfully" };
      }
    }
    return { success: false, message: "Message not found in sheet" };
  } catch (err) {
    Logger.log("deleteSheetRow error: " + err.toString());
    return { success: false, message: err.toString() };
  }
}

/**
 * ==============================================================================
 * 4B. SECURITY SUBSYSTEM: Anti-Bot, Anti-Spam & Google Token Authentication
 * ==============================================================================
 */

/**
 * Validates whether incoming submission has legitimate origin or verified Google auth
 */
function validateSubmissionSecurity(data, email) {
  // 1. Honeypot check (hidden field that automated tools/bots blindly fill)
  var honeypot = (data.hp_trap || data.website_hp || data.honeypot || "").toString().trim();
  if (honeypot.length > 0) {
    return {
      allowed: false,
      status: "bot_trap_triggered",
      message: "Automated submission rejected by honeypot security filter."
    };
  }

  // 2. Rate Limiting via Apps Script CacheService (Blocks rapid bursts like 5 submissions in 10s)
  var cache = CacheService.getScriptCache();
  var cleanEmail = (email || "").toLowerCase().replace(/[^a-z0-9]/g, "");
  var rateKey = "rl_" + cleanEmail;
  if (cache.get(rateKey)) {
    return {
      allowed: false,
      status: "rate_limited",
      message: "Rate limit active: A message was recently submitted from this email. Please wait 45 seconds before sending another."
    };
  }

  // 3. Cryptographic Google Token Verification (Tier 1)
  var googleToken = (data.googleToken || "").toString().trim();
  if (googleToken) {
    var gResult = verifyGoogleToken(googleToken, email);
    if (gResult.valid) {
      cache.put(rateKey, "active", 45);
      return { allowed: true, isGoogleVerified: true };
    }
  }

  // 4. Portfolio Client Handshake Signature Verification (Tier 2)
  var handshake = (data.clientHandshake || "").toString().trim();
  var clientTime = parseInt(data.clientTime || "0", 10);
  if (handshake && clientTime > 0) {
    var now = new Date().getTime();
    // Allow within a 15-minute validity window
    if (Math.abs(now - clientTime) < 15 * 60 * 1000) {
      var expectedHash = computeHandshakeHash(email, clientTime);
      if (handshake === expectedHash) {
        cache.put(rateKey, "active", 45);
        return {
          allowed: true,
          isGoogleVerified: (data.googleVerified === "true" || data.googleVerified === true || Boolean(data.googleSub))
        };
      }
    }
  }

  // 5. If neither valid Google Token nor legitimate Client Handshake signature is present:
  // Reject immediately! (Prevents any external bot, curl, Postman, or tool like Portfolio Message Submitter)
  return {
    allowed: false,
    status: "unauthorized_direct_submission",
    message: "Security Notice: Direct automated submissions are blocked. Inquiries must be submitted through the verified portfolio interface."
  };
}

/**
 * Computes deterministic client-server handshake hash
 */
function computeHandshakeHash(email, timestamp) {
  var str = (email || "").toLowerCase().trim() + "_" + timestamp + "_" + SECURITY_SECRET;
  var hash = 0;
  for (var i = 0; i < str.length; i++) {
    var charCode = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + charCode;
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}

/**
 * Cryptographically verifies Google ID Token or Access Token against Google OAuth APIs
 */
function verifyGoogleToken(token, claimedEmail) {
  if (!token) return { valid: false };

  // A. Check as Google ID Token (JWT)
  try {
    var idRes = UrlFetchApp.fetch("https://oauth2.googleapis.com/tokeninfo?id_token=" + encodeURIComponent(token), { muteHttpExceptions: true });
    if (idRes.getResponseCode() === 200) {
      var idData = JSON.parse(idRes.getContentText());
      if (idData && idData.email && idData.email.toLowerCase() === claimedEmail.toLowerCase()) {
        return { valid: true, email: idData.email };
      }
    }
  } catch (_) {}

  // B. Check as Google OAuth2 Access Token
  try {
    var accRes = UrlFetchApp.fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { "Authorization": "Bearer " + token },
      muteHttpExceptions: true
    });
    if (accRes.getResponseCode() === 200) {
      var accData = JSON.parse(accRes.getContentText());
      if (accData && accData.email && accData.email.toLowerCase() === claimedEmail.toLowerCase()) {
        return { valid: true, email: accData.email };
      }
    }
  } catch (_) {}

  return { valid: false };
}

/**
 * ==============================================================================
 * 5. HELPER: Create JSON Response Output
 * ==============================================================================
 */
function createJsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}


/**
 * ==============================================================================
 * 6. ONE-CLICK TEST FUNCTION FOR APPS SCRIPT EDITOR
 * ==============================================================================
 */
function testAll() {
  var timestamp = Utilities.formatDate(new Date(), "Asia/Kolkata", "dd MMM yyyy, hh:mm a") + " IST";
  
  var sheetResult = saveToSheet(
    "Jagan (Admin Test)",
    ADMIN_EMAIL,
    "Real-Time Auth & History System Test",
    "Testing Google Auth message recording and real-time history retrieval.",
    timestamp,
    "",
    true
  );

  var historyResult = getSheetRows();

  Logger.log("--- TEST SUMMARY ---");
  Logger.log("Save to sheet: " + (sheetResult.success ? "SUCCESS ✅" : "FAILED ❌ " + sheetResult.error));
  Logger.log("Total messages in sheet: " + historyResult.length);
}
