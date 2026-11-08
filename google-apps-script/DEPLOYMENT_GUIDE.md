# 📬 Google Apps Script Contact Dispatcher & Parallel Auto-Reply Guide
**Target Inbox:** `kandukurijagan99@gmail.com`  
**Web App URL:** `https://script.google.com/macros/s/AKfycbyvhRMbTe6sWNuCRK2Tv2BJQW8EC0sgt6qINztof3SqWgQNVAs6Tm6T43zfwrooRe9Z/exec`

---

## 🌟 How the Parallel Email System Works
When a visitor fills out the contact form on your portfolio:
1. **Email #1 (To You - Kandukuri Jagan):**
   - Delivered immediately to `kandukurijagan99@gmail.com`.
   - Contains sender's name, email, subject, timestamp, full message, and a 1-click "Reply" button.
2. **Email #2 (Parallely to the Visitor):**
   - Delivered immediately to the visitor's email address.
   - A warm, respectful, executive confirmation thanking them for reaching out.
   - Includes a copy of the message they submitted, an estimated response time (within 24 hours), direct links to your LinkedIn, WhatsApp, and Portfolio.

---

## ⚡ How to Update in Google Apps Script (Takes 60 Seconds)

### Step 1: Open Your Script Editor
1. Go to **[https://script.google.com](https://script.google.com)**.
2. Sign in with **`kandukurijagan99@gmail.com`**.
3. Open your existing project (e.g. `Portfolio Contact Dispatcher`).

### Step 2: Paste the Updated Code
1. Open [`Code.gs`](file:///c:/Users/ADMIN/Pictures/portfolio/google-apps-script/Code.gs).
2. Select all (`Ctrl + A`) and replace with the code from `google-apps-script/Code.gs`.
3. Press **`Ctrl + S`** (or click the 💾 Save icon).

### Step 3: Authorize Email Sending
1. At the top toolbar, select **`testSend`** from the function dropdown.
2. Click **Run** (▶️).
3. If prompted with *"Authorization required"*:
   - Click **Review permissions** $\rightarrow$ select `kandukurijagan99@gmail.com`.
   - Click **Advanced** (bottom left) $\rightarrow$ **Go to Portfolio Contact Dispatcher (unsafe)** $\rightarrow$ **Allow**.
4. Check your Gmail: you will receive a test confirmation!

### Step 4: Publish New Version
1. Click the blue **"Deploy"** button (top right) $\rightarrow$ **"Manage deployments"**.
2. Click the **Pencil (Edit)** icon next to your active deployment.
3. In the **Version** dropdown, select **"New version"**.
4. Ensure:
   - **Execute as:** `Me (kandukurijagan99@gmail.com)`
   - **Who has access:** `Anyone`
5. Click **"Deploy"** $\rightarrow$ **"Done"**.

---

## 🧪 Testing Live
1. Open your live portfolio: [https://kandujuri-jagan-portfolio.netlify.app/#contact](https://kandujuri-jagan-portfolio.netlify.app/#contact).
2. Enter your name, an alternate email address, subject, and message.
3. Click **"Send Message"**.
4. Both inboxes will receive their emails simultaneously!
