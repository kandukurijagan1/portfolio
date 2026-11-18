# 📬 Google Apps Script Contact Dispatcher & Parallel Auto-Reply Guide
**Target Inbox:** `kandukurijagan99@gmail.com`  
**Web App URL:** `https://script.google.com/macros/s/AKfycbwpv5exe2OE-op9KhqQCO0fJScB8nEkyOjfKvr2H-5k85nIfpAnqehRXemZnqQ-oY0/exec`

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

## 🛡️ How to Stop Notification Emails from Going to the Spam Folder (Guaranteed 30-Second Gmail Fix)

Because the automated email notification is sent by Google Apps Script from your own account (`kandukurijagan99@gmail.com`) to yourself with an external visitor `replyTo`, Gmail's automated spam filter flags self-sent automated messages unless you set a Gmail Filter.

### Simple 4-Step Gmail Rule (Never Goes to Spam Again):
1. Open **[Gmail](https://mail.google.com)** on your computer while signed into `kandukurijagan99@gmail.com`.
2. In the top Gmail search bar, click the **"Show search options"** sliders icon on the right end of the search bar.
3. In the search filter modal:
   - In the **Subject** field, enter: `[Portfolio Inquiry] OR [Portfolio Message]`
   - Or in the **Includes the words** field, enter: `kandukuri-jagan-portfolio.netlify.app`
4. Click **"Create filter"** (bottom right of the filter box).
5. On the options screen:
   - ✅ Check **"Never send it to Spam"**
   - ✅ Check **"Always mark it as important"**
   - ✅ Check **"Categorize as: Primary"**
   - *(Optional)* Check **"Also apply filter to matching conversations"** so existing messages in Spam move directly to your Inbox!
6. Click **"Create filter"**.

From that moment on, every contact form message submitted through your portfolio will land straight in your **Primary Inbox**, 100% spam-free!

---

## 🗑️ Admin Message Deletion Feature
In your portfolio's Admin Portal (signed in as `kandukurijagan99@gmail.com`):
- Each message card now includes a **Delete** button next to *Reply in Gmail* and *WhatsApp*.
- Clicking **Delete** prompts for confirmation, then permanently deletes the record from Supabase PostgreSQL and removes it from your live inbox feed immediately.

---

## 🧪 Testing Live
1. Open your live portfolio: [https://kandukuri-jagan-portfolio.netlify.app/#contact](https://kandukuri-jagan-portfolio.netlify.app/#contact).
2. Enter your name, an alternate email address, subject, and message.
3. Click **"Send Message"**.
4. Both inboxes will receive their emails simultaneously!
