# 📘 Portfolio Customization & Deployment Guide

This guide makes it simple to personalize every section of your portfolio, update projects, connect your live email service, and deploy the website to the web (free on GitHub Pages or Netlify).

---

## 🚀 Quick Start (Testing Locally)

1. Simply double-click `index.html` to open it in any modern browser (Chrome, Edge, Firefox, Safari).
2. Alternatively, if you have VS Code installed with the **Live Server** extension, right-click `index.html` and choose **"Open with Live Server"**.
3. Or launch a local Python server:
   ```bash
   python -m http.server 8000
   ```
   Then visit `http://localhost:8000`.

---

## ✏️ 1. How to Update Personal Information

All personal details can be updated in **two places**:

### A. Centralized JavaScript Config (`js/config.js`)
Open `js/config.js`. Update the top `personal` object:
```javascript
personal: {
  name: "Kandukuri Jagan",
  shortName: "KJ",
  title: "Full Stack Developer",
  subtitle: "Python & React Specialist | B.E. Computer Science",
  department: "Computer Science and Engineering",
  institution: "Saveetha University",
  year: "3rd Year",
  batch: "2024 - 2028",
  cgpa: "9.04",
  location: "Chennai, Tamil Nadu, India",
  email: "kandukurijagan99@gmail.com",
  github: "https://github.com/kandukurijagan1",
  linkedin: "https://linkedin.com/in/kandukurijagan1",
  resumeUrl: "assets/resume.pdf"
}
```

### B. In `index.html`
Search for comments tagged with `<!-- EDITABLE: ... -->` to quickly update:
- Your name in the Hero heading (`<h1>Anthony<br>Rovira</h1>`)
- Your social media links in the `.hero-socials` row
- Your email in the `.contact-info-panel`
- Your resume download filename in `<a href="assets/resume.pdf" download="Your_Name_Resume.pdf">`

---

## 📄 2. Updating Your Downloadable Resume

A professional PDF resume is already included at `assets/resume.pdf`.

To update the resume with your own content:
- Simply replace `assets/resume.pdf` with your own PDF file named `resume.pdf`.
- Or edit `create_resume.py` with your personal details and run:
  ```bash
  python create_resume.py
  ```
  It will automatically recompile a clean, formatted PDF to `assets/resume.pdf`.

---

## 🛠️ 3. Adding or Modifying Projects

To add or modify projects:
1. Open `js/config.js` and locate `PORTFOLIO_CONFIG.projects`.
2. Add a new object following this pattern:
```javascript
{
  id: "my-new-project",
  title: "Project Title",
  category: "ai", // 'ai', 'web', or 'systems'
  categoryLabel: "AI & Machine Learning",
  shortDesc: "Brief summary of what this project does.",
  image: "assets/images/project-banner.svg", // Or .jpg/.png
  tags: ["Python", "Flask", "OpenCV"],
  highlights: [
    "Key capability 1",
    "Key capability 2",
    "Key capability 3"
  ],
  detailedDesc: "In-depth architecture description shown in the details modal dialog.",
  github: "https://github.com/your-username/project-repo",
  demo: "https://your-demo-link.com",
  architecture: [
    "Input Layer: Video Stream / REST API",
    "Processing: Frame Preprocessing",
    "Database: MySQL ACID Transaction Tables"
  ]
}
```
3. Add corresponding card markup in `index.html` under the `<section id="projects">` section, or duplicate an existing project card.

---

## 📬 4. Connecting the Live Contact Form

The contact form includes built-in client validation, a submission spinner, and a feedback toast notification.

To connect it to send real emails directly to your inbox for free:

### Option A: Using Formspree (Recommended)
1. Sign up for free at [formspree.io](https://formspree.io).
2. Create a new form and copy your Form ID (e.g. `https://formspree.io/f/mqkenvba`).
3. In `index.html`, add the `action` attribute to the `<form>` tag:
   ```html
   <form id="portfolio-contact-form" class="contact-form" action="https://formspree.io/f/YOUR_FORM_ID" method="POST" novalidate>
   ```
4. That's it! Every message sent will go directly to your personal email.

---

## 🌐 5. Free 1-Click Deployment

### Method 1: GitHub Pages
1. Create a new repository on GitHub named `portfolio` or `<your-username>.github.io`.
2. Push your project files:
   ```bash
   git init
   git add .
   git commit -m "Initial portfolio release"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-username>.github.io.git
   git push -u origin main
   ```
3. In your GitHub repository, go to **Settings > Pages**.
4. Under **Source**, select `Deploy from a branch` and choose `main` / `root`.
5. Your portfolio will be live at `https://<your-username>.github.io`!

### Method 2: Netlify (Drag and Drop)
1. Go to [netlify.com](https://netlify.com) and log in.
2. Drag and drop your `portfolio` folder directly into the Netlify Drop area.
3. Your website is instantly live with free SSL!
