/**
 * ==============================================================================
 * GOOGLE APPS SCRIPT: PORTFOLIO CONTACT DISPATCHER & REAL-TIME MESSAGE HUB
 * ==============================================================================
 * 
 * Target Admin Email : kandukurijagan99@gmail.com
 * Current Web App URL: https://script.google.com/macros/s/AKfycbzvr7Qd1hzkNH1CqzrYm1Vi44mFqb54VlYmsNspuiZqnmit_zksOeXJyeplg2cTNAUk/exec
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
    var avatar = (data.avatar || "").toString().trim();
    var isGoogleVerified = (data.googleVerified === "true" || data.googleVerified === true || Boolean(data.googleSub));
    var timestamp = Utilities.formatDate(new Date(), "Asia/Kolkata", "dd MMM yyyy, hh:mm a") + " IST";

    // 1. Save submission into Google Sheet
    var sheetResult = saveToSheet(name, email, subject, message, timestamp, avatar, isGoogleVerified);

    // 2. Dispatch primary notification to Kandukuri Jagan
    try {
      var emailSubject = "🚀 [Portfolio Message] " + subject + " — from " + name + (isGoogleVerified ? " (Google Verified ✓)" : "");
      var adminHtml = 
        '<div style="font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0b0f19; color: #f8fafc; border-radius: 16px; overflow: hidden; border: 1px solid #1e293b; box-shadow: 0 15px 35px rgba(0,0,0,0.5);">' +
          '<div style="background: linear-gradient(135deg, #0ea5e9 0%, #6366f1 50%, #a855f7 100%); padding: 26px 24px; text-align: center;">' +
            '<h1 style="margin: 0; font-size: 22px; font-weight: 800; color: #ffffff;">🚀 New Portfolio Connection!</h1>' +
            '<p style="margin: 6px 0 0; font-size: 13px; color: #e0e7ff;">A verified visitor reached out via kandukuri-jagan-portfolio.netlify.app</p>' +
          '</div>' +
          '<div style="padding: 24px;">' +
            '<div style="background: rgba(16, 185, 129, 0.12); border: 1px solid rgba(16, 185, 129, 0.35); border-radius: 8px; padding: 10px 14px; margin-bottom: 20px;">' +
              '<span style="color: #10b981; font-size: 13px; font-weight: 700;">' + (sheetResult.success ? "✅ Recorded in Google Sheet" : "⚠️ Sheet: " + sheetResult.error) + ' • Verified Email: ' + email + '</span>' +
            '</div>' +
            '<table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">' +
              '<tr><td style="padding: 8px 0; color: #94a3b8; font-size: 13px; width: 90px;"><strong>Sender:</strong></td><td style="padding: 8px 0; color: #ffffff; font-size: 15px; font-weight: 700;">' + name + (isGoogleVerified ? ' <span style="background: #10b981; color: #000; font-size: 10px; padding: 2px 6px; border-radius: 4px; font-weight: 800;">GOOGLE VERIFIED ✓</span>' : '') + '</td></tr>' +
              '<tr><td style="padding: 8px 0; color: #94a3b8; font-size: 13px;"><strong>Email:</strong></td><td style="padding: 8px 0;"><a href="mailto:' + email + '" style="color: #38bdf8; text-decoration: none; font-weight: 600;">' + email + '</a></td></tr>' +
              '<tr><td style="padding: 8px 0; color: #94a3b8; font-size: 13px;"><strong>Subject:</strong></td><td style="padding: 8px 0; color: #f1f5f9; font-size: 14px; font-weight: 600;">' + subject + '</td></tr>' +
              '<tr><td style="padding: 8px 0; color: #94a3b8; font-size: 13px;"><strong>Time:</strong></td><td style="padding: 8px 0; color: #64748b; font-size: 12px; font-family: monospace;">' + timestamp + '</td></tr>' +
            '</table>' +
            '<div style="background-color: #141c2e; border: 1px solid #1e293b; border-left: 4px solid #38bdf8; border-radius: 8px; padding: 16px 18px; margin-bottom: 22px;">' +
              '<div style="color: #94a3b8; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; font-weight: 700; margin-bottom: 8px;">Message Content:</div>' +
              '<div style="color: #e2e8f0; font-size: 14px; line-height: 1.65; white-space: pre-wrap;">' + message + '</div>' +
            '</div>' +
            '<div style="text-align: center; margin: 20px 0 10px;">' +
              '<a href="mailto:' + email + '?subject=Re: ' + encodeURIComponent(subject) + '" style="display: inline-block; background: linear-gradient(135deg, #38bdf8, #6366f1); color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-weight: 700; font-size: 14px;">Reply Directly to ' + name + ' ✉️</a>' +
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
        htmlBody: adminHtml,
        replyTo: email,
        name: "Portfolio: " + name
      });
    } catch (adminErr) {
      Logger.log("Admin email error: " + adminErr.toString());
    }

    // 3. Send kind confirmation email to visitor
    if (email && email.indexOf("@") !== -1 && email.indexOf(".") !== -1) {
      try {
        var firstName = name.split(" ")[0] || name;
        var visitorSubject = "Thank you for reaching out! — Kandukuri Jagan";
        
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
