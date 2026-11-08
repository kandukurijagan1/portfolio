# 📬 Google Apps Script Contact Form Dispatcher Guide
**Developer:** Kandukuri Jagan | **Target Inbox:** `kandukurijagan99@gmail.com`  
**Web App URL:** `https://script.google.com/macros/s/AKfycbyvhRMbTe6sWNuCRK2Tv2BJQW8EC0sgt6qINztof3SqWgQNVAs6Tm6T43zfwrooRe9Z/exec`

---

## ⚡ How to Authorize & Activate Email Sending (Takes 30 seconds)

Google requires the script owner to grant one-time email sending permissions before the Web App can dispatch emails. Follow these simple steps:

### Step 1: Open Google Apps Script
1. Go to [https://script.google.com](https://script.google.com) and open your project.
2. Ensure you are signed in with **`kandukurijagan99@gmail.com`**.

### Step 2: Paste the Updated Code
1. Select all and delete any existing code inside `Code.gs`.
2. Copy and paste the entire contents of [`google-apps-script/Code.gs`](file:///C:/Users/ADMIN/Pictures/portfolio/google-apps-script/Code.gs) into the editor.
3. Press **`Ctrl + S`** (or click the 💾 Save icon).

### Step 3: Run `testSend` to Authorize Permissions (Crucial Step!)
1. At the top toolbar of the Google Apps Script editor, locate the function dropdown (it might say `doPost` or `testSend`).
2. Select **`testSend`** from the dropdown.
3. Click the **Run** button (▶️).
4. Google will display a popup: **"Authorization required"**.
5. Click **"Review permissions"**.
6. Select your Google account (**`kandukurijagan99@gmail.com`**).
7. If you see *"Google hasn’t verified this app"*:
   - Click **"Advanced"** (small text at the bottom left of the modal).
   - Click **"Go to Portfolio Contact Dispatcher (unsafe)"**.
   - Click **"Allow"**.
8. In the Execution log at the bottom, you will see:
   `✅ Success! Test email dispatched to kandukurijagan99@gmail.com`
9. Check your Gmail inbox — you will see the test email confirming the connection!

### Step 4: Update the Web App Deployment
1. Click the blue **"Deploy"** button (top right).
2. Click **"Manage deployments"**.
3. Click the **Pencil (Edit)** icon next to your active deployment.
4. Under **Version**, click the dropdown and choose **"New version"**.
5. Ensure:
   - **Execute as:** `Me (kandukurijagan99@gmail.com)`
   - **Who has access:** `Anyone` *(Must be "Anyone")*
6. Click **"Deploy"** and then **"Done"**.

---

## 🧪 Testing From the Website
1. Open your portfolio at `http://localhost:8000/#contact`.
2. Fill out the contact form:
   - **Your Name:** Test Visitor
   - **Email Address:** visitor@example.com
   - **Subject:** Project Inquiry
   - **Message:** Hello Jagan, testing the live contact form.
3. Click **"Send Message"**.
4. You will see a green success notification: *"Message sent successfully! Jagan will get back to you soon."*
5. Check your Gmail inbox at **`kandukurijagan99@gmail.com`** — the message is delivered immediately with sender details, formatted HTML, and a 1-click reply button!
