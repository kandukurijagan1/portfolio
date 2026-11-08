/**
 * ==============================================================================
 * GOOGLE APPS SCRIPT - ULTRA-FAST PORTFOLIO CONTACT FORM DISPATCHER
 * Author: Kandukuri Jagan (Saveetha University • Synora'26 Main Lead)
 * Target Email: kandukurijagan99@gmail.com
 * Web App URL: https://script.google.com/macros/s/AKfycbyvhRMbTe6sWNuCRK2Tv2BJQW8EC0sgt6qINztof3SqWgQNVAs6Tm6T43zfwrooRe9Z/exec
 * ==============================================================================
 */

// Target email address where you receive all portfolio messages
var RECIPIENT_EMAIL = "kandukurijagan99@gmail.com";

/**
 * ⚡ TEST FUNCTION
 * Run this function once in the editor to grant/verify permissions
 */
function testSend() {
  var subject = "✅ [Portfolio Test] Google Apps Script Contact Dispatcher is Active!";
  var body = "Hi Jagan,\n\nYour portfolio contact form script is successfully connected and authorized!\n\n" +
             "Target Inbox: " + RECIPIENT_EMAIL + "\n" +
             "Timestamp: " + Utilities.formatDate(new Date(), "Asia/Kolkata", "dd MMM yyyy, hh:mm a") + " IST\n\n" +
             "Incoming messages will land directly in this inbox.";

  MailApp.sendEmail(RECIPIENT_EMAIL, subject, body);
  Logger.log("✅ Success! Test email dispatched to " + RECIPIENT_EMAIL);
}

/**
 * Handle incoming POST requests from the portfolio contact form
 * Highly optimized for sub-second execution without unnecessary locks
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

    var name = (data.name || "Anonymous Visitor").toString().trim();
    var email = (data.email || "No Email Provided").toString().trim();
    var subject = (data.subject || "New Inquiry from Portfolio").toString().trim();
    var message = (data.message || "No message content provided.").toString().trim();
    var timestamp = Utilities.formatDate(new Date(), "Asia/Kolkata", "dd MMM yyyy, hh:mm a") + " IST";

    var emailSubject = "🚀 [Portfolio Message] " + subject + " — from " + name;

    var htmlTemplate = 
      '<div style="font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0b0f19; color: #f8fafc; border-radius: 14px; overflow: hidden; border: 1px solid #1e293b; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">' +
        '<div style="background: linear-gradient(135deg, #0ea5e9 0%, #6366f1 50%, #a855f7 100%); padding: 26px 28px; text-align: center;">' +
          '<h1 style="margin: 0; font-size: 22px; font-weight: 800; color: #ffffff;">New Portfolio Inquiry</h1>' +
          '<p style="margin: 6px 0 0; font-size: 13px; color: #e0e7ff;">Sent via kandukurijagan1.github.io</p>' +
        '</div>' +
        '<div style="padding: 28px 24px;">' +
          '<table style="width: 100%; border-collapse: collapse; margin-bottom: 22px;">' +
            '<tr><td style="padding: 9px 0; color: #94a3b8; font-size: 13px; width: 90px;"><strong>Sender:</strong></td><td style="padding: 9px 0; color: #ffffff; font-size: 15px; font-weight: 600;">' + name + '</td></tr>' +
            '<tr><td style="padding: 9px 0; color: #94a3b8; font-size: 13px;"><strong>Email:</strong></td><td style="padding: 9px 0;"><a href="mailto:' + email + '" style="color: #38bdf8; text-decoration: none;">' + email + '</a></td></tr>' +
            '<tr><td style="padding: 9px 0; color: #94a3b8; font-size: 13px;"><strong>Subject:</strong></td><td style="padding: 9px 0; color: #f1f5f9; font-size: 14px; font-weight: 600;">' + subject + '</td></tr>' +
            '<tr><td style="padding: 9px 0; color: #94a3b8; font-size: 13px;"><strong>Received:</strong></td><td style="padding: 9px 0; color: #64748b; font-size: 12px; font-family: monospace;">' + timestamp + '</td></tr>' +
          '</table>' +
          '<div style="background-color: #141c2e; border: 1px solid #1e293b; border-left: 4px solid #38bdf8; border-radius: 8px; padding: 18px 20px; margin-bottom: 24px;">' +
            '<div style="color: #94a3b8; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; font-weight: 700; margin-bottom: 8px;">Message Content:</div>' +
            '<div style="color: #e2e8f0; font-size: 14px; line-height: 1.65; white-space: pre-wrap;">' + message + '</div>' +
          '</div>' +
          '<div style="text-align: center; margin: 26px 0 10px;">' +
            '<a href="mailto:' + email + '?subject=Re: ' + encodeURIComponent(subject) + '" style="display: inline-block; background: linear-gradient(135deg, #38bdf8, #6366f1); color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-weight: 700; font-size: 14px;">Reply Directly to ' + name + ' ✉️</a>' +
          '</div>' +
        '</div>' +
        '<div style="background-color: #07090e; padding: 16px 20px; text-align: center; border-top: 1px solid #1e293b; color: #64748b; font-size: 12px;">' +
          '<strong>Kandukuri Jagan</strong> • Saveetha University (3rd Year • CGPA 9.04)<br/>' +
          'Main Lead, Synora\'26 Hackathon (80+ Teams)' +
        '</div>' +
      '</div>';

    // 1. Dispatch email immediately to Kandukuri Jagan
    MailApp.sendEmail({
      to: RECIPIENT_EMAIL,
      subject: emailSubject,
      htmlBody: htmlTemplate,
      replyTo: email,
      name: "Portfolio: " + name
    });

    // 2. Dispatch executive auto-reply receipt to visitor if valid email is provided
    if (email && email.indexOf("@") !== -1 && email.indexOf(".") !== -1) {
      try {
        var autoReplySubject = "Received: " + subject + " — Kandukuri Jagan";
        var autoReplyHtml = 
          '<div style="font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, Helvetica, Arial, sans-serif; max-width: 580px; margin: 0 auto; background-color: #0b0f19; color: #f8fafc; border-radius: 14px; overflow: hidden; border: 1px solid #1e293b; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">' +
            '<div style="background: linear-gradient(135deg, #0ea5e9 0%, #6366f1 50%, #a855f7 100%); padding: 24px 28px; text-align: center;">' +
              '<h1 style="margin: 0; font-size: 20px; font-weight: 800; color: #ffffff;">Thank You for Reaching Out</h1>' +
              '<p style="margin: 5px 0 0; font-size: 13px; color: #e0e7ff;">Kandukuri Jagan • Software &amp; Full Stack Developer</p>' +
            '</div>' +
            '<div style="padding: 26px 24px;">' +
              '<p style="color: #cbd5e1; font-size: 15px; line-height: 1.6; margin: 0 0 14px;">Hi <strong>' + name + '</strong>,</p>' +
              '<p style="color: #cbd5e1; font-size: 14px; line-height: 1.6; margin: 0 0 18px;">Thank you for getting in touch through my developer portfolio! I have successfully received your inquiry regarding <strong>"' + subject + '"</strong>.</p>' +
              '<div style="background-color: #141c2e; border: 1px solid #1e293b; border-left: 4px solid #10b981; border-radius: 8px; padding: 14px 18px; margin-bottom: 20px;">' +
                '<div style="color: #10b981; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Status: Logged to Personal Inbox ✓</div>' +
                '<div style="color: #94a3b8; font-size: 13px;">Estimated response time: <strong>Typically within a few hours (Max 24h)</strong></div>' +
              '</div>' +
              '<p style="color: #cbd5e1; font-size: 14px; line-height: 1.6; margin: 0 0 22px;">If your inquiry is urgent or related to an immediate software engineering internship / project, feel free to reach me directly via WhatsApp / Call at <a href="tel:+918367047947" style="color: #38bdf8; font-weight: 600; text-decoration: none;">+91 8367047947</a>.</p>' +
              '<div style="text-align: center; margin: 20px 0;">' +
                '<a href="https://linkedin.com/in/kandukurijagan1" style="display: inline-block; background: linear-gradient(135deg, #38bdf8, #6366f1); color: #ffffff; text-decoration: none; padding: 10px 24px; border-radius: 6px; font-weight: 700; font-size: 13px; margin: 0 6px;">Connect on LinkedIn ↗</a>' +
                '<a href="https://github.com/kandukurijagan1" style="display: inline-block; background: #1e293b; color: #f1f5f9; text-decoration: none; padding: 10px 24px; border-radius: 6px; font-weight: 700; font-size: 13px; margin: 0 6px; border: 1px solid #334155;">View GitHub ↗</a>' +
              '</div>' +
            '</div>' +
            '<div style="background-color: #07090e; padding: 16px 20px; text-align: center; border-top: 1px solid #1e293b; color: #64748b; font-size: 12px;">' +
              '<strong style="color: #cbd5e1;">Kandukuri Jagan</strong><br/>' +
              'B.E. Computer Science (3rd Year • CGPA 9.04) • Saveetha University<br/>' +
              'Main Lead, Synora\'26 Hackathon (80+ Teams)' +
            '</div>' +
          '</div>';

        MailApp.sendEmail({
          to: email,
          subject: autoReplySubject,
          htmlBody: autoReplyHtml,
          name: "Kandukuri Jagan"
        });
      } catch (autoErr) {}
    }

    // Return instant success JSON
    return ContentService.createTextOutput(JSON.stringify({
      result: "success",
      message: "Dispatched instantly to " + RECIPIENT_EMAIL
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
    service: "Portfolio Contact Form Dispatcher"
  })).setMimeType(ContentService.MimeType.JSON);
}
