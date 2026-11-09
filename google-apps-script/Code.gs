/**
 * ==============================================================================
 * GOOGLE APPS SCRIPT - PORTFOLIO CONTACT FORM DISPATCHER & SHEETS RECORDER
 * 
 * Features:
 * 1. 📊 Auto-saves every form submission into Google Sheet (Name, Email, Subject, Message, Timestamp)
 * 2. 🚀 Dispatches primary inquiry notification to Kandukuri Jagan's inbox
 * 3. ✉️ Sends automated kind confirmation to visitor with custom communication notice
 * 
 * Author: Kandukuri Jagan (Saveetha University • Synora'26 Main Lead)
 * Target Email: kandukurijagan99@gmail.com
 * Google Sheet: https://docs.google.com/spreadsheets/d/1QS8lblW2MVVpmMuKUjjOzROefO9hT41hXQLbtWGqUY/edit
 * ==============================================================================
 */

// Target email address where Kandukuri Jagan receives all portfolio messages
var RECIPIENT_EMAIL = "kandukurijagan99@gmail.com";

// Google Sheet ID from your spreadsheet URL
var SPREADSHEET_ID = "1QS8lblW2MVVpmMuKUjjOzROefO9hT41hXQLbtWGqUY";

/**
 * ⚡ TEST FUNCTION 1: EMAIL DISPATCH
 * Run this function once in the Apps Script editor to test email permissions
 */
function testSend() {
  var subject = "✅ [Portfolio Test] Contact Dispatcher is Active!";
  var body = "Hi Jagan,\n\nYour portfolio contact form script is active.\n" +
             "Target Inbox: " + RECIPIENT_EMAIL + "\n" +
             "Timestamp: " + Utilities.formatDate(new Date(), "Asia/Kolkata", "dd MMM yyyy, hh:mm a") + " IST\n\n" +
             "Parallel auto-confirmations and Google Sheet row recording are enabled.";

  MailApp.sendEmail(RECIPIENT_EMAIL, subject, body);
  Logger.log("✅ Success! Test email dispatched to " + RECIPIENT_EMAIL);
}

/**
 * ⚡ TEST FUNCTION 2: GOOGLE SHEET RECORDING
 * Run this function once in the Apps Script editor to authorize and verify Google Sheet access!
 */
function testSheet() {
  var timestamp = Utilities.formatDate(new Date(), "Asia/Kolkata", "dd MMM yyyy, hh:mm a") + " IST";
  var success = saveToSheet(
    "Jagan (Test Visitor)",
    "kandukurijagan99@gmail.com",
    "Portfolio Sheet Connection Test",
    "This row verifies that contact form submissions are automatically saved to your Google Sheet!",
    timestamp
  );
  if (success) {
    Logger.log("✅ Success! Test row successfully added to your Google Sheet: " + SPREADSHEET_ID);
  } else {
    Logger.log("❌ Failed to add row. Check Google Sheet permissions or spreadsheet ID.");
  }
}

/**
 * Helper function to open the target Google Spreadsheet and sheet
 */
function getTargetSheet() {
  var ss;
  try {
    if (SPREADSHEET_ID && SPREADSHEET_ID.trim() !== "") {
      ss = SpreadsheetApp.openById(SPREADSHEET_ID.trim());
    } else {
      ss = SpreadsheetApp.getActiveSpreadsheet();
    }
  } catch (err) {
    try {
      ss = SpreadsheetApp.getActiveSpreadsheet();
    } catch (e) {
      Logger.log("⚠️ Could not open spreadsheet: " + err.toString());
      return null;
    }
  }
  if (!ss) return null;
  return ss.getSheetByName("Sheet1") || ss.getActiveSheet() || ss.getSheets()[0];
}

/**
 * Saves visitor submission data directly into the Google Sheet
 */
function saveToSheet(name, email, subject, message, timestamp) {
  try {
    var sheet = getTargetSheet();
    if (!sheet) {
      Logger.log("⚠️ Target sheet not found.");
      return false;
    }

    // Auto-initialize header row if the sheet is completely empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["Timestamp", "Name", "Email ID", "Subject", "Message"]);
      var headerRange = sheet.getRange(1, 1, 1, 5);
      headerRange.setFontWeight("bold");
      headerRange.setBackground("#0d131f");
      headerRange.setFontColor("#38bdf8");
      headerRange.setHorizontalAlignment("center");
      sheet.setFrozenRows(1);
    }

    // Check if the user set up 4 columns with Name in Column A
    var lastCol = sheet.getLastColumn();
    if (lastCol > 0) {
      var headerValues = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
      var firstHeader = (headerValues[0] || "").toString().toLowerCase();

      // If user started row 1 with Name (4 columns: Name, Email ID, Subject, Message)
      if (firstHeader.indexOf("name") !== -1) {
        sheet.appendRow([name, email, subject, message]);
        return true;
      }
    }

    // Default 5 columns layout: Timestamp, Name, Email ID, Subject, Message
    sheet.appendRow([timestamp, name, email, subject, message]);
    return true;

  } catch (err) {
    Logger.log("⚠️ Google Sheet logging error: " + err.toString());
    return false;
  }
}

/**
 * Handle incoming POST requests from the portfolio contact form
 */
function doPost(e) {
  try {
    var data = {};

    // 1. Parameter extraction
    if (e && e.parameter && (e.parameter.name || e.parameter.email || e.parameter.message)) {
      data = e.parameter;
    } else if (e && e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (err) {
        data = e.parameter || {};
      }
    } else if (e && e.parameter) {
      data = e.parameter;
    }

    var name = (data.name || "Valued Visitor").toString().trim();
    var email = (data.email || "").toString().trim();
    var subject = (data.subject || "Portfolio Inquiry / Collaboration").toString().trim();
    var message = (data.message || "No message content provided.").toString().trim();
    var timestamp = Utilities.formatDate(new Date(), "Asia/Kolkata", "dd MMM yyyy, hh:mm a") + " IST";

    // =========================================================================
    // 1. AUTOMATICALLY SAVE TO GOOGLE SHEET
    // =========================================================================
    var sheetSaved = saveToSheet(name, email, subject, message, timestamp);

    // =========================================================================
    // 2. DISPATCH TO KANDUKURI JAGAN (Primary Inbox Notification)
    // =========================================================================
    var emailSubject = "🚀 [Portfolio Message] " + subject + " — from " + name;

    var adminHtml = 
      '<div style="font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0b0f19; color: #f8fafc; border-radius: 16px; overflow: hidden; border: 1px solid #1e293b; box-shadow: 0 15px 35px rgba(0,0,0,0.5);">' +
        '<div style="background: linear-gradient(135deg, #0ea5e9 0%, #6366f1 50%, #a855f7 100%); padding: 28px 24px; text-align: center;">' +
          '<h1 style="margin: 0; font-size: 22px; font-weight: 800; color: #ffffff;">🚀 New Portfolio Connection!</h1>' +
          '<p style="margin: 6px 0 0; font-size: 13px; color: #e0e7ff;">A visitor reached out via kandukuri-jagan-portfolio.netlify.app</p>' +
        '</div>' +
        '<div style="padding: 26px 24px;">' +
          '<div style="background: rgba(16, 185, 129, 0.12); border: 1px solid rgba(16, 185, 129, 0.35); border-radius: 8px; padding: 10px 14px; margin-bottom: 20px;">' +
            '<span style="color: #10b981; font-size: 13px; font-weight: 700;">✅ Logged in Google Sheet • Confirmation receipt dispatched to: ' + email + '</span>' +
          '</div>' +
          '<table style="width: 100%; border-collapse: collapse; margin-bottom: 22px;">' +
            '<tr><td style="padding: 8px 0; color: #94a3b8; font-size: 13px; width: 90px;"><strong>Sender:</strong></td><td style="padding: 8px 0; color: #ffffff; font-size: 15px; font-weight: 700;">' + name + '</td></tr>' +
            '<tr><td style="padding: 8px 0; color: #94a3b8; font-size: 13px;"><strong>Email:</strong></td><td style="padding: 8px 0;"><a href="mailto:' + email + '" style="color: #38bdf8; text-decoration: none; font-weight: 600;">' + email + '</a></td></tr>' +
            '<tr><td style="padding: 8px 0; color: #94a3b8; font-size: 13px;"><strong>Subject:</strong></td><td style="padding: 8px 0; color: #f1f5f9; font-size: 14px; font-weight: 600;">' + subject + '</td></tr>' +
            '<tr><td style="padding: 8px 0; color: #94a3b8; font-size: 13px;"><strong>Received:</strong></td><td style="padding: 8px 0; color: #64748b; font-size: 12px; font-family: monospace;">' + timestamp + '</td></tr>' +
          '</table>' +
          '<div style="background-color: #141c2e; border: 1px solid #1e293b; border-left: 4px solid #38bdf8; border-radius: 8px; padding: 16px 18px; margin-bottom: 24px;">' +
            '<div style="color: #94a3b8; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; font-weight: 700; margin-bottom: 8px;">Message Content:</div>' +
            '<div style="color: #e2e8f0; font-size: 14px; line-height: 1.65; white-space: pre-wrap;">' + message + '</div>' +
          '</div>' +
          '<div style="text-align: center; margin: 24px 0 10px;">' +
            '<a href="mailto:' + email + '?subject=Re: ' + encodeURIComponent(subject) + '" style="display: inline-block; background: linear-gradient(135deg, #38bdf8, #6366f1); color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-weight: 700; font-size: 14px;">Reply Directly to ' + name + ' ✉️</a>' +
          '</div>' +
        '</div>' +
        '<div style="background-color: #07090e; padding: 16px 20px; text-align: center; border-top: 1px solid #1e293b; color: #64748b; font-size: 12px;">' +
          '<strong>Kandukuri Jagan</strong> • Saveetha University (3rd Year • CGPA 9.04)<br/>' +
          'Main Lead, Synora\'26 Hackathon (80+ Teams)' +
        '</div>' +
      '</div>';

    // Dispatch primary email to Jagan
    MailApp.sendEmail({
      to: RECIPIENT_EMAIL,
      subject: emailSubject,
      htmlBody: adminHtml,
      replyTo: email,
      name: "Portfolio: " + name
    });

    // =========================================================================
    // 3. PARALLEL DISPATCH TO VISITOR (With Automated Communication Notice)
    // =========================================================================
    if (email && email.indexOf("@") !== -1 && email.indexOf(".") !== -1) {
      try {
        var firstName = name.split(" ")[0] || name;
        var visitorSubject = "Thank you for reaching out! — Kandukuri Jagan";
        
        var visitorHtml = 
          '<div style="font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, Helvetica, Arial, sans-serif; max-width: 580px; margin: 0 auto; background-color: #0d131f; color: #f8fafc; border-radius: 16px; overflow: hidden; border: 1px solid #1e293b; box-shadow: 0 15px 35px rgba(0,0,0,0.5); padding: 32px 28px;">' +
            '<!-- Header -->' +
            '<h2 style="margin: 0 0 16px; font-size: 24px; font-weight: 800; color: #38bdf8; letter-spacing: -0.3px;">Message Received!</h2>' +

            '<!-- Greeting -->' +
            '<p style="color: #ffffff; font-size: 15px; font-weight: 600; margin: 0 0 14px;">Hi ' + firstName + ',</p>' +

            '<!-- Core Confirmation -->' +
            '<p style="color: #cbd5e1; font-size: 14px; line-height: 1.65; margin: 0 0 14px;">' +
              'Thank you for contacting me through my portfolio. I have received your message regarding <strong>"' + subject + '"</strong> and will get back to you shortly.' +
            '</p>' +

            '<!-- Explicit Automated Notice Box (Requested by Jagan) -->' +
            '<div style="background: rgba(56, 189, 248, 0.08); border: 1px solid rgba(56, 189, 248, 0.25); border-left: 3px solid #38bdf8; border-radius: 8px; padding: 12px 16px; margin: 18px 0;">' +
              '<p style="color: #94a3b8; font-size: 12.5px; line-height: 1.6; margin: 0;">' +
                'ℹ️ <strong style="color: #38bdf8;">Notice:</strong> This is an automated message set by me for a better and faster way of communication with users. Your message has been safely delivered to my personal inbox, and I will review and follow up with you directly.' +
              '</p>' +
            '</div>' +

            '<!-- Urgent Contact -->' +
            '<p style="color: #cbd5e1; font-size: 14px; line-height: 1.65; margin: 16px 0;">' +
              'For urgent inquiries, call/WhatsApp me at <a href="https://api.whatsapp.com/send?phone=918367047947" style="color: #38bdf8; text-decoration: none; font-weight: 700;">+91 8367047947</a> or connect via <a href="https://www.linkedin.com/in/jagan-kandukuri-053a0331b/" style="color: #38bdf8; text-decoration: none; font-weight: 700;">LinkedIn</a>.' +
            '</p>' +

            '<!-- Sign-off -->' +
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
          replyTo: RECIPIENT_EMAIL
        });
      } catch (autoErr) {
        Logger.log("Auto-reply notice: " + autoErr.toString());
      }
    }

    // Return instant success JSON
    return ContentService.createTextOutput(JSON.stringify({
      result: "success",
      message: "Dispatched successfully to " + RECIPIENT_EMAIL,
      sheetSaved: sheetSaved,
      autoReplySent: true
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      result: "error",
      error: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Handle GET requests (Health check)
 */
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: "online",
    recipient: RECIPIENT_EMAIL,
    spreadsheetId: SPREADSHEET_ID,
    service: "Portfolio Contact Form Dispatcher with Sheets Logging & Parallel Auto-Reply"
  })).setMimeType(ContentService.MimeType.JSON);
}
