/**
 * ==============================================================================
 * GOOGLE APPS SCRIPT: PORTFOLIO CONTACT DISPATCHER & GOOGLE SHEETS LOGGER
 * ==============================================================================
 * 
 * Target Email : kandukurijagan99@gmail.com
 * Google Sheet : https://docs.google.com/spreadsheets/d/1QS8lblW2MVVpmMuKUjjOzROefO9hT41hXQLbtWGqUY/edit
 * 
 * Workflows handled automatically upon visitor submission:
 * 1. 📊 Saves visitor data into Google Sheet (Timestamp, Name, Email, Subject, Message)
 * 2. 🚀 Delivers full inquiry notification to Kandukuri Jagan's inbox
 * 3. ✉️ Sends kind confirmation email to the visitor with custom automated notice
 * ==============================================================================
 */

// 1. Your Email Address for receiving notifications
var RECIPIENT_EMAIL = "kandukurijagan99@gmail.com";

// 2. Your Google Sheet ID (from your spreadsheet URL)
var SPREADSHEET_ID = "1QS8lblW2MVVpmMuKUjjOzROefO9hT41hXQLbtWGqUY";


/**
 * ==============================================================================
 * ⚡ ONE-CLICK TEST & AUTHORIZATION FUNCTION
 * ==============================================================================
 * Select "testAll" in the top dropdown menu and click "Run" to:
 * 1. Authorize Google Sheets and Gmail permissions in one step.
 * 2. Write a test row into your "portfolio" Google Sheet.
 * 3. Send a test confirmation email to kandukurijagan99@gmail.com.
 */
function testAll() {
  var timestamp = Utilities.formatDate(new Date(), "Asia/Kolkata", "dd MMM yyyy, hh:mm a") + " IST";
  
  // Test Sheet Recording
  var sheetSuccess = saveToSheet(
    "Jagan (Test Visitor)",
    "kandukurijagan99@gmail.com",
    "Portfolio System Test",
    "This is a test message to verify that submissions are properly saved into your Google Sheet.",
    timestamp
  );

  // Test Email Notification
  var emailSuccess = false;
  try {
    MailApp.sendEmail({
      to: RECIPIENT_EMAIL,
      subject: "✅ [Portfolio Test] Contact Dispatcher & Sheets Logger is Active!",
      htmlBody: "<div style='font-family: sans-serif; padding: 20px; background: #0d131f; color: #fff; border-radius: 10px;'>" +
                "<h2 style='color: #38bdf8;'>Portfolio System is Working!</h2>" +
                "<p>Google Sheet connected: <strong>" + (sheetSuccess ? "YES ✅" : "NO ❌") + "</strong></p>" +
                "<p>Timestamp: " + timestamp + "</p>" +
                "</div>"
    });
    emailSuccess = true;
  } catch (err) {
    Logger.log("Email test error: " + err.toString());
  }

  Logger.log("--- TEST RESULTS ---");
  Logger.log("Google Sheet row added: " + (sheetSuccess ? "SUCCESS ✅" : "FAILED ❌"));
  Logger.log("Test Email sent: " + (emailSuccess ? "SUCCESS ✅" : "FAILED ❌"));
}


/**
 * ==============================================================================
 * HELPER: Save Submission to Google Sheet
 * ==============================================================================
 */
function saveToSheet(name, email, subject, message, timestamp) {
  try {
    var ss;
    if (SPREADSHEET_ID && SPREADSHEET_ID.trim() !== "") {
      ss = SpreadsheetApp.openById(SPREADSHEET_ID.trim());
    } else {
      ss = SpreadsheetApp.getActiveSpreadsheet();
    }

    if (!ss) {
      Logger.log("⚠️ Could not open spreadsheet with ID: " + SPREADSHEET_ID);
      return false;
    }

    // Use "Sheet1" or the first available sheet tab
    var sheet = ss.getSheetByName("Sheet1") || ss.getSheets()[0];
    if (!sheet) {
      Logger.log("⚠️ No sheet tab found.");
      return false;
    }

    // Auto-create professional header row if sheet is currently empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["Timestamp", "Name", "Email ID", "Subject", "Message"]);
      var headerRange = sheet.getRange(1, 1, 1, 5);
      headerRange.setFontWeight("bold");
      headerRange.setBackground("#0d131f");
      headerRange.setFontColor("#38bdf8");
      headerRange.setHorizontalAlignment("center");
      headerRange.setVerticalAlignment("middle");
      sheet.setRowHeight(1, 36);
      sheet.setFrozenRows(1);
    }

    // Check if the user already configured 4 custom columns starting with Name
    var lastCol = sheet.getLastColumn();
    if (lastCol > 0) {
      var firstHeader = (sheet.getRange(1, 1).getValue() || "").toString().toLowerCase();
      if (firstHeader.indexOf("name") !== -1) {
        // User has 4 columns: Name, Email ID, Subject, Message
        sheet.appendRow([name, email, subject, message]);
        return true;
      }
    }

    // Default 5 columns: Timestamp, Name, Email ID, Subject, Message
    sheet.appendRow([timestamp, name, email, subject, message]);
    return true;

  } catch (err) {
    Logger.log("⚠️ saveToSheet error: " + err.toString());
    return false;
  }
}


/**
 * ==============================================================================
 * MAIN POST HANDLER: Called whenever a visitor submits the portfolio form
 * ==============================================================================
 */
function doPost(e) {
  try {
    var data = {};

    // 1. Extract form fields
    if (e && e.parameter && (e.parameter.name || e.parameter.email || e.parameter.message)) {
      data = e.parameter;
    } else if (e && e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (err) {
        // Fallback for url-encoded string inside postData
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
    }

    var name = (data.name || "Valued Visitor").toString().trim();
    var email = (data.email || "").toString().trim();
    var subject = (data.subject || "Portfolio Inquiry / Collaboration").toString().trim();
    var message = (data.message || "No message content provided.").toString().trim();
    var timestamp = Utilities.formatDate(new Date(), "Asia/Kolkata", "dd MMM yyyy, hh:mm a") + " IST";

    // -------------------------------------------------------------------------
    // STEP 1: SAVE INTO GOOGLE SHEET AUTOMATICALLY
    // -------------------------------------------------------------------------
    var sheetSaved = saveToSheet(name, email, subject, message, timestamp);

    // -------------------------------------------------------------------------
    // STEP 2: SEND NOTIFICATION EMAIL TO KANDUKURI JAGAN
    // -------------------------------------------------------------------------
    try {
      var emailSubject = "🚀 [Portfolio Message] " + subject + " — from " + name;
      var adminHtml = 
        '<div style="font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0b0f19; color: #f8fafc; border-radius: 16px; overflow: hidden; border: 1px solid #1e293b; box-shadow: 0 15px 35px rgba(0,0,0,0.5);">' +
          '<div style="background: linear-gradient(135deg, #0ea5e9 0%, #6366f1 50%, #a855f7 100%); padding: 26px 24px; text-align: center;">' +
            '<h1 style="margin: 0; font-size: 22px; font-weight: 800; color: #ffffff;">🚀 New Portfolio Connection!</h1>' +
            '<p style="margin: 6px 0 0; font-size: 13px; color: #e0e7ff;">A visitor reached out via kandukuri-jagan-portfolio.netlify.app</p>' +
          '</div>' +
          '<div style="padding: 24px;">' +
            '<div style="background: rgba(16, 185, 129, 0.12); border: 1px solid rgba(16, 185, 129, 0.35); border-radius: 8px; padding: 10px 14px; margin-bottom: 20px;">' +
              '<span style="color: #10b981; font-size: 13px; font-weight: 700;">✅ Saved to Google Sheet • Confirmation email dispatched to: ' + email + '</span>' +
            '</div>' +
            '<table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">' +
              '<tr><td style="padding: 8px 0; color: #94a3b8; font-size: 13px; width: 90px;"><strong>Sender:</strong></td><td style="padding: 8px 0; color: #ffffff; font-size: 15px; font-weight: 700;">' + name + '</td></tr>' +
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
        to: RECIPIENT_EMAIL,
        subject: emailSubject,
        htmlBody: adminHtml,
        replyTo: email,
        name: "Portfolio: " + name
      });
    } catch (adminErr) {
      Logger.log("Admin email error: " + adminErr.toString());
    }

    // -------------------------------------------------------------------------
    // STEP 3: SEND KIND CONFIRMATION TO VISITOR WITH AUTOMATED NOTICE
    // -------------------------------------------------------------------------
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

            '<!-- Automated Notice Box -->' +
            '<div style="background: rgba(56, 189, 248, 0.08); border: 1px solid rgba(56, 189, 248, 0.25); border-left: 3px solid #38bdf8; border-radius: 8px; padding: 12px 16px; margin: 18px 0;">' +
              '<p style="color: #94a3b8; font-size: 12.5px; line-height: 1.6; margin: 0;">' +
                'ℹ️ <strong style="color: #38bdf8;">Notice:</strong> This is an automated message set by me for a better and faster way of communication with users. Your message has been safely delivered to my personal inbox, and I will review and follow up with you directly.' +
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
          replyTo: RECIPIENT_EMAIL
        });
      } catch (visitorErr) {
        Logger.log("Visitor email notice: " + visitorErr.toString());
      }
    }

    // Return instant success response
    return ContentService.createTextOutput(JSON.stringify({
      result: "success",
      message: "Submission saved to Google Sheet & email dispatched.",
      sheetSaved: sheetSaved
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      result: "error",
      error: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}


/**
 * ==============================================================================
 * GET HEALTH CHECK
 * ==============================================================================
 */
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: "online",
    recipient: RECIPIENT_EMAIL,
    spreadsheetId: SPREADSHEET_ID,
    service: "Portfolio Contact Dispatcher & Sheets Logger"
  })).setMimeType(ContentService.MimeType.JSON);
}
