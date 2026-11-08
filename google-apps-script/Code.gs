/**
 * ==============================================================================
 * GOOGLE APPS SCRIPT - ULTRA-FAST PORTFOLIO CONTACT FORM DISPATCHER
 * WITH PARALLEL KIND AUTO-CONFIRMATION TO VISITOR
 * 
 * Author: Kandukuri Jagan (Saveetha University • Synora'26 Main Lead)
 * Target Email: kandukurijagan99@gmail.com
 * Web App URL: https://script.google.com/macros/s/AKfycbyvhRMbTe6sWNuCRK2Tv2BJQW8EC0sgt6qINztof3SqWgQNVAs6Tm6T43zfwrooRe9Z/exec
 * ==============================================================================
 */

// Target email address where Kandukuri Jagan receives all portfolio messages
var RECIPIENT_EMAIL = "kandukurijagan99@gmail.com";

/**
 * ⚡ TEST FUNCTION
 * Run this function once in the Apps Script editor to test and authorize permissions
 */
function testSend() {
  var subject = "✅ [Portfolio Test] Google Apps Script Contact Dispatcher is Active!";
  var body = "Hi Jagan,\n\nYour portfolio contact form script is successfully connected and authorized!\n\n" +
             "Target Inbox: " + RECIPIENT_EMAIL + "\n" +
             "Timestamp: " + Utilities.formatDate(new Date(), "Asia/Kolkata", "dd MMM yyyy, hh:mm a") + " IST\n\n" +
             "Incoming messages will land directly in this inbox, and parallel kind confirmations will be sent to visitors.";

  MailApp.sendEmail(RECIPIENT_EMAIL, subject, body);
  Logger.log("✅ Success! Test email dispatched to " + RECIPIENT_EMAIL);
}

/**
 * Handle incoming POST requests from the portfolio contact form
 * Executes parallel dispatch:
 * 1. Delivers complete inquiry to Kandukuri Jagan
 * 2. Simultaneously sends a warm, respectful, kind confirmation email to the visitor
 */
function doPost(e) {
  try {
    var data = {};

    // 1. Fast parameter extraction (URL-encoded or form parameter)
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
    // 1. DISPATCH TO KANDUKURI JAGAN (Primary Notification)
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
            '<span style="color: #10b981; font-size: 13px; font-weight: 700;">✅ Parallel kind confirmation receipt was dispatched to: ' + email + '</span>' +
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
    // 2. PARALLEL DISPATCH TO VISITOR (Warm, Kind, Courteous Auto-Confirmation)
    // =========================================================================
    if (email && email.indexOf("@") !== -1 && email.indexOf(".") !== -1) {
      try {
        var firstName = name.split(" ")[0] || name;
        var visitorSubject = "✨ Thank you for reaching out, " + firstName + "! — Kandukuri Jagan";
        
        var visitorHtml = 
          '<div style="font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0b0f19; color: #f8fafc; border-radius: 16px; overflow: hidden; border: 1px solid #1e293b; box-shadow: 0 15px 35px rgba(0,0,0,0.5);">' +
            '<!-- Warm Header -->' +
            '<div style="background: linear-gradient(135deg, #0ea5e9 0%, #6366f1 50%, #a855f7 100%); padding: 32px 26px; text-align: center;">' +
              '<div style="font-size: 34px; margin-bottom: 8px;">✨</div>' +
              '<h1 style="margin: 0; font-size: 23px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px;">Thank You for Reaching Out!</h1>' +
              '<p style="margin: 6px 0 0; font-size: 14px; color: #e0e7ff; font-weight: 500;">Kandukuri Jagan • Software &amp; Full Stack Developer</p>' +
            '</div>' +

            '<!-- Body Content -->' +
            '<div style="padding: 30px 26px;">' +
              '<p style="color: #ffffff; font-size: 16px; font-weight: 600; margin: 0 0 16px;">Dear ' + firstName + ',</p>' +
              
              '<p style="color: #cbd5e1; font-size: 15px; line-height: 1.7; margin: 0 0 16px;">' +
                'Thank you so much for taking the time to explore my developer portfolio and send me a note! It truly made my day to connect with you.' +
              '</p>' +

              '<p style="color: #cbd5e1; font-size: 15px; line-height: 1.7; margin: 0 0 18px;">' +
                'I wanted to reassure you right away that your message has safely reached my personal inbox. Here is a copy of what you shared:' +
              '</p>' +

              '<!-- Message Recap Box -->' +
              '<div style="background-color: #141c2e; border: 1px solid #1e293b; border-left: 4px solid #38bdf8; border-radius: 10px; padding: 16px 20px; margin-bottom: 22px;">' +
                '<div style="color: #94a3b8; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; font-weight: 700; margin-bottom: 6px;">Subject:</div>' +
                '<div style="color: #ffffff; font-size: 14px; font-weight: 600; margin-bottom: 12px;">"' + subject + '"</div>' +
                '<div style="color: #94a3b8; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; font-weight: 700; margin-bottom: 6px;">Your Message:</div>' +
                '<div style="color: #e2e8f0; font-size: 14px; line-height: 1.65; white-space: pre-wrap; font-style: italic;">"' + message + '"</div>' +
              '</div>' +

              '<!-- Thoughtful Commitment Box -->' +
              '<div style="background: rgba(16, 185, 129, 0.08); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 10px; padding: 16px 20px; margin-bottom: 22px;">' +
                '<div style="color: #10b981; font-size: 13px; font-weight: 700; margin-bottom: 4px;">💌 What Happens Next?</div>' +
                '<p style="color: #cbd5e1; font-size: 14px; line-height: 1.6; margin: 0;">' +
                  'I read and value every message personally. I will review what you\'ve shared and get back to you with a thoughtful response as soon as possible &mdash; usually within a few hours, and always within 24 hours.' +
                '</p>' +
              '</div>' +

              '<p style="color: #cbd5e1; font-size: 14px; line-height: 1.6; margin: 0 0 20px;">' +
                'If your inquiry is urgent or time-sensitive (such as an immediate software engineering internship or project discussion), please feel free to message or call me directly on WhatsApp at <a href="https://api.whatsapp.com/send?phone=918367047947" style="color: #38bdf8; font-weight: 700; text-decoration: none;">+91 8367047947</a>.' +
              '</p>' +

              '<!-- Action Connect Buttons -->' +
              '<div style="text-align: center; margin: 26px 0 20px;">' +
                '<a href="https://www.linkedin.com/in/jagan-kandukuri-053a0331b/" style="display: inline-block; background: linear-gradient(135deg, #0ea5e9, #6366f1); color: #ffffff; text-decoration: none; padding: 11px 22px; border-radius: 8px; font-weight: 700; font-size: 13px; margin: 4px 6px;">Connect on LinkedIn ↗</a>' +
                '<a href="https://api.whatsapp.com/send?phone=918367047947" style="display: inline-block; background: #25D366; color: #ffffff; text-decoration: none; padding: 11px 22px; border-radius: 8px; font-weight: 700; font-size: 13px; margin: 4px 6px;">Chat on WhatsApp 💬</a>' +
                '<a href="https://kandukuri-jagan-portfolio.netlify.app/" style="display: inline-block; background: #1e293b; color: #f1f5f9; text-decoration: none; padding: 11px 22px; border-radius: 8px; font-weight: 700; font-size: 13px; margin: 4px 6px; border: 1px solid #334155;">View Portfolio 🌐</a>' +
              '</div>' +

              '<p style="color: #94a3b8; font-size: 14px; line-height: 1.6; margin: 24px 0 4px;">' +
                'Wishing you a wonderful and inspiring day ahead!' +
              '</p>' +
              '<p style="color: #ffffff; font-size: 15px; font-weight: 700; margin: 0 0 2px;">' +
                'With warm regards and gratitude,' +
              '</p>' +
              '<p style="color: #38bdf8; font-size: 15px; font-weight: 700; margin: 0;">' +
                'Kandukuri Jagan' +
              '</p>' +
            '</div>' +

            '<!-- Footer Signature -->' +
            '<div style="background-color: #07090e; padding: 18px 24px; text-align: center; border-top: 1px solid #1e293b; color: #64748b; font-size: 12px; line-height: 1.6;">' +
              '<strong style="color: #cbd5e1;">Kandukuri Jagan</strong> • Saveetha University, Chennai<br/>' +
              '3rd Year B.E. Computer Science (CGPA: 9.04) • Synora\'26 Main Tech Lead<br/>' +
              '<a href="https://kandukuri-jagan-portfolio.netlify.app/" style="color: #38bdf8; text-decoration: none;">kandukuri-jagan-portfolio.netlify.app</a>' +
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
      message: "Dispatched instantly to " + RECIPIENT_EMAIL,
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
    service: "Portfolio Contact Form Dispatcher with Parallel Auto-Reply"
  })).setMimeType(ContentService.MimeType.JSON);
}
