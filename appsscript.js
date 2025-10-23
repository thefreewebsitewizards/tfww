const SHEET_ID = "1batVITcT526zxkc8Qdf0_AKbORnrLRB7-wHdDKhcm9M";
const SHEET_NAME = "Leads";
const NOTIFY_EMAIL = "dylan@thefreewebsitewizards.com";

function clean(v) {
  v = (v || "").toString().trim();
  return /^[=+\-@]/.test(v) ? "'" + v : v;
}

function doPost(e) {
  try {
    if (!e) return respond({ success: false, error: "No event" }, 400);

    // Google Apps Script automatically parses form data into e.parameter
    let data = e.parameter || {};
    
    // If e.parameter is empty, try parsing JSON from postData
    if (Object.keys(data).length === 0 && e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (err) {
        // If JSON parsing fails, return the error but don't crash
        return respond({ success: false, error: "Could not parse request data" }, 400);
      }
    }

    const ss = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
    if (!ss)
      return respond({ success: false, error: "Sheet tab not found" }, 500);

    const ts = data.timestamp ? new Date(data.timestamp) : new Date();

    const row = [
      ts,
      clean(data.firstName),
      clean(data.email),
      clean(data.phoneNumber),
      clean(data.countryCode),
      clean(data.countryName),
      clean(data.hasWebHosting),
      "", // websiteName placeholder
      clean(data.websiteDescription),
      clean(data.source)
    ];
    ss.appendRow(row);

    const subject = `New Website Application from ${clean(data.firstName) || "Unknown"}`;
    const body =
      "New application\n\n" +
      `Name: ${clean(data.firstName)}\n` +
      `Email: ${clean(data.email)}\n` +
      `Phone: ${clean(data.countryCode)} ${clean(data.phoneNumber)}\n` +
      `Country: ${clean(data.countryName)}\n` +
      `Has Website: ${clean(data.hasWebHosting)}\n` +
      `Source: ${clean(data.source)}\n` +
      `Description: ${clean(data.websiteDescription)}\n` +
      `Submitted: ${ts.toLocaleString()}\n`;
    MailApp.sendEmail(NOTIFY_EMAIL, subject, body);

    const cSubj = `Thanks ${clean(data.firstName)}! Your Free Website Application is Received`;
    const cHtml = `
      <html><body style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
        <div style="background:linear-gradient(135deg,#9333EA,#7C3AED);padding:30px;text-align:center;color:#fff">
          <h1 style="margin:0;font-size:28px">🪄 The Free Website Wizards</h1>
          <p style="margin:10px 0 0;font-size:16px">Your magical website journey begins</p>
        </div>
        <div style="padding:30px;background:#f9f9f9">
          <h2 style="color:#9333EA;margin-top:0">Hi ${clean(data.firstName)}!</h2>
          <p>We received your application.</p>
          <div style="background:#fff;padding:20px;border-radius:8px;border-left:4px solid #9333EA;margin:20px 0">
            <h3 style="margin-top:0;color:#9333EA">Your details</h3>
            <p><strong>Phone:</strong> ${clean(data.countryCode)} ${clean(data.phoneNumber)}</p>
            <p><strong>Description:</strong> ${clean(data.websiteDescription)}</p>
            <p><strong>Submitted:</strong> ${ts.toLocaleDateString()}</p>
          </div>
          <p><strong>Next</strong></p>
          <ul>
            <li>Review within 24 hours</li>
            <li>We will contact you</li>
            <li>Typical turnaround 3 to 5 business days</li>
          </ul>
          <div style="text-align:center;margin:30px 0">
            <a href="https://thefreewebsitewizards.com" style="background:#9333EA;color:#fff;padding:12px 24px;text-decoration:none;border-radius:6px;display:inline-block">Visit our website</a>
          </div>
          <p style="color:#666;font-size:14px">Questions? Reply to this email or contact support@thefreewebsitewizards.com</p>
        </div>
      </body></html>`;
    if (data.email) {
      MailApp.sendEmail({ to: clean(data.email), subject: cSubj, htmlBody: cHtml });
    }

    return respond({ success: true, message: "OK" });
  } catch (err) {
    console.error(err);
    return respond({ success: false, error: String(err) }, 500);
  }
}

function doGet() {
  return respond({ ok: true });
}

function respond(obj, code) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON)
    .setResponseCode(code || 200);
}
