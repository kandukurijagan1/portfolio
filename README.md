# 🚀 Kandukuri Jagan – Professional Developer Portfolio Website

[![Live Portfolio](https://img.shields.io/badge/Live_Portfolio-kandukuri--jagan--portfolio.netlify.app-00DC82?style=for-the-badge&logo=netlify&logoColor=white)](https://kandukuri-jagan-portfolio.netlify.app/)
[![GitHub](https://img.shields.io/badge/GitHub-kandukurijagan1-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/kandukurijagan1)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Jagan_Kandukuri-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/jagan-kandukuri-053a0331b/)

> **🌐 Live Production Website**: [https://kandukuri-jagan-portfolio.netlify.app/](https://kandukuri-jagan-portfolio.netlify.app/)

A modern, premium, fully responsive personal portfolio website engineered for **Kandukuri Jagan** (`kandukurijagan`), **3rd Year** Computer Science undergraduate at **Saveetha University, Chennai (CGPA: 9.04, Expected Graduation May 2028)**, and **Main Lead of Synora'26 Hackathon (80+ Teams)**, specializing in **Full Stack Development (MERN Stack)**, **Python engineering**, and **applied AI systems**.

Built with clean semantic HTML5, modern CSS3 (custom properties, CSS grid, glassmorphism, responsive media queries), and modular vanilla JavaScript ES6+. Zero build tools or bloated dependencies required.

---

## 🌟 Key Features

- **Dark & Light Theme Switcher**: Modern dark mode (inspired by the sleek dark purple/navy aesthetic with neon cyan and violet accents) with an optional light theme, persisted via `localStorage` and system `prefers-color-scheme` support.
- **Hero Section**: Dynamic animated typewriter effect showing technical roles (*Full Stack Developer, MERN Stack Engineer, Python & AI Developer, React.js Specialist*), status pill indicator ("🟢 Ready to Innovate • 3rd Year • CGPA 9.04"), dual CTA buttons ("View My Work", "Download Resume"), social links (GitHub, LinkedIn, Phone, Email), and a high-tech framed developer workstation showcase.
- **About Me**: Academic narrative (3rd Year B.E. Computer Science at Saveetha University, Chennai, CGPA 9.04, Batch 2024–2028), leadership highlights as Main Lead of Synora'26 Hackathon (80+ teams), core engineering pillars, and quantitative metrics.
- **Technical Skills**: Categorized competencies across:
  - **Languages & Core**: Python, JavaScript, React.js, Node.js, Java, C++/C, Swift (iOS)
  - **Frontend**: React.js & Redux Toolkit, HTML5, CSS3, Bootstrap, Tailwind CSS, Graphics Design
  - **Database & Cloud**: MongoDB, MySQL, Appwrite BaaS, AWS Cloud Fundamentals
  - **Tools & Methodologies**: Git, GitHub, VS Code, PyCharm, IntelliJ IDEA, Spring Boot, Agile & Scrum
- **Featured Projects (All 8 Projects Included)**:
  1. **FishBilling – Seafood & GST Billing System** (Hardware digital weigh-scale RS-232 interface, live weight-rate calculation, CGST/SGST breakdown, harbor catch ledger, and customer Khata tracking)
  2. **AI-Powered Real-Time Desktop Assistant** (Voice and text-driven AI assistant using SpeechRecognition, pyttsx3, DuckDuckGo search API, OS automation, PDF report generation, and Telegram bot alerts)
  3. **Facial-Based Crime Monitoring & Alert System** (OpenCV & TensorFlow video surveillance, real-time facial recognition against watchlists with <150ms latency, and automated alert dispatch)
  4. **Full-Stack Blog Application with Appwrite** (Modern blogging platform featuring React.js, Appwrite BaaS authentication, Redux Toolkit state management, and CRUD article handling)
  5. **Synora'26 – Hackathon Registration & Event Portal** (Official management ecosystem for Synora'26 where Jagan served as Main Lead, managing registration, challenge tracks, and submissions across ~80 competing teams)
  6. **Attendance Marking & Evaluation Platform** (Paperless dynamic QR attendance check-in, multi-judge weighted rubric scoring matrix, and real-time leaderboard sync)
  7. **Certificate Generation & Sharing Website** (Bulk credential generation engine with anti-tamper QR code verification, high-resolution PDF rendering, and 1-click LinkedIn sharing)
  8. **Real-Time Global Currency Converter** (Sleek React exchange application supporting 160+ currencies with real-time rate API integration, instant swap functionality, and responsive UI)
- **Interactive Project Architecture Modal**: Click "Architecture →" on any project to open an in-depth breakdown of system architecture, data pipelines, key features, and source links.
- **Education & Experience**: Saveetha University B.E timeline (3rd Year • CGPA 9.04), **Main Lead of Synora'26 Hackathon (80+ Teams)**, Full Stack Development Certification, College Graphics Designing Team Lead, and coursework tags.
- **Certifications**: Industry-recognized credentials with direct verification links.
- **Contact Section**: Info cards with one-click "Copy Email" and "Copy Phone" features, live validated contact form, and real-time **Google Apps Script email dispatcher** sending inquiries directly to `kandukurijagan99@gmail.com` with automatic visitor confirmation emails.
- **Back-to-Top**: Floating button with circular SVG scroll-progress ring.
- **Downloadable Resume**: Authentic, formatted PDF resume generated and linked at `assets/resume.pdf`.
- **Custom 404 Page**: Themed `404.html` error page with instant return navigation.
- **Accessible & SEO Optimized**: Semantic HTML5, ARIA labels, skip-link navigation, and OpenGraph/JSON-LD Person structured data.

---

## 📁 Project Architecture

```
portfolio/
├── index.html                   # Main portfolio webpage
├── 404.html                     # Custom 404 error page
├── create_resume.py             # Python script generating the PDF resume
├── google-apps-script/
│   ├── Code.gs                  # Serverless Google Apps Script email dispatcher
│   └── DEPLOYMENT_GUIDE.md      # 2-minute step-by-step setup guide
├── css/
│   ├── style.css                # Base variables, reset, light/dark themes, typography
│   ├── components.css           # Navigation, hero, cards, modals, buttons, forms, footer
│   └── animations.css           # Keyframes, scroll reveals, glow pulses, accessibility
├── js/
│   ├── config.js                # Centralized data store (Name, bio, skills, 8 projects)
│   ├── main.js                  # Theme toggle, sticky header, scroll spy, back-to-top
│   ├── animations.js            # Typewriter effect, scroll reveals, 3D card tilt
│   ├── projects.js              # Project category filtering & modal architecture dialog
│   └── contact.js               # Form validation, toast notifications, copy-email tool
├── assets/
│   ├── resume.pdf               # Downloadable professional PDF resume
│   └── images/
│       ├── profile.jpg          # Kandukuri Jagan's official portrait
│       ├── synora26.jpg         # Synora'26 official hackathon logo emblem
│       ├── avatar.svg           # High-tech developer avatar illustration
│       ├── project-fishbilling.svg   # FishBilling Seafood & GST Billing visual banner
│       ├── project-assistant.svg     # AI Desktop Assistant visual banner
│       ├── project-crime.svg         # Facial Crime Monitoring System visual banner
│       ├── project-blog.svg          # Blog Application with Appwrite visual banner
│       ├── project-hackathon.svg     # Hackathon Registration Portal visual banner
│       ├── project-attendance.svg    # Attendance Marking & Evaluation visual banner
│       ├── project-certificate.svg   # Certificate Generation & Sharing visual banner
│       ├── project-currency.svg      # Real-Time Currency Converter visual banner
│       └── favicon.svg               # KJ Monogram favicon
└── README.md                    # Project documentation
```

---

## ⚡ Running Locally

No installation or build steps are required.

Simply double click `index.html` or start a local server:
```bash
python -m http.server 8000
```
Open [http://localhost:8000](http://localhost:8000) in your browser.

---

## 📄 License & Attribution

Designed and engineered for Kandukuri Jagan / Saveetha University (Batch of 2028).
