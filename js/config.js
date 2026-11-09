/**
 * Personal Portfolio Configuration & Data Store
 * Kandukuri Jagan - Full Stack Developer | Python & React Specialist
 */

const PORTFOLIO_CONFIG = {
  // 1. Personal Information
  personal: {
    name: "Kandukuri Jagan",
    shortName: "KJ",
    title: "Full Stack Developer",
    subtitle: "Python & React Specialist | B.E. Computer Science",
    department: "Computer Science and Engineering",
    institution: "Saveetha University",
    location: "Chennai, Tamil Nadu, India",
    year: "3rd Year",
    batch: "2024 - 2028",
    graduationDate: "May 2028",
    cgpa: "9.04",
    phone: "+91 8367047947",
    email: "kandukurijagan99@gmail.com",
    // Google Apps Script Web App Endpoint for real-time email dispatch
    contactWebhookUrl: "https://script.google.com/macros/s/AKfycbzx_r-W-GIwKG_Ey6dkRjxK2A8lrkfYXEWJVM4-JacYdMBKhe8WHviBQNUpXy8wHUjO/exec",
    github: "https://github.com/kandukurijagan1?tab=repositories",
    linkedin: "https://www.linkedin.com/in/jagan-kandukuri-053a0331b/",
    resumeUrl: "assets/resume.pdf",
    profilePicture: "assets/images/profile.jpg",
    statusBadge: "Ready to Innovate • 3rd Year • CGPA 9.04",
    availability: "Targeting Full Stack Developer Roles & Internships",
    bioShort: "3rd Year Computer Science undergraduate at Saveetha University (CGPA 9.04) and Main Tech Lead of Synora'26 Hackathon (80+ teams). Architected the complete 4-system hackathon ecosystem (Registration, Attendance, Evaluation & Certificates).",
    bioLong: "I am a 3rd-year Computer Science undergraduate at Saveetha University, Chennai (CGPA: 9.04, Expected Graduation May 2028). I specialize in full-stack web engineering across the MERN stack (MongoDB, Express.js, React, Node.js), Python development, and applied AI systems. I served as the Main Lead for Synora'26, orchestrating a major hackathon with around 80 competing teams (~350+ innovators). With proven experience managing projects from initial design to production deployment, I have engineered real-world software ranging from retail & seafood GST billing systems and AI desktop assistants to full-stack event portals and automated credential engines."
  },

  // 2. Hero Animated Typing Roles
  typingRoles: [
    "Full Stack Developer",
    "MERN Stack Engineer",
    "Python & AI Developer",
    "React.js Specialist"
  ],

  // 3. Technical Skills (From Resume)
  skills: {
    programming: [
      { name: "Python", level: "Advanced", icon: "python", desc: "Core Python, Automation, Desktop Assistants, APIs" },
      { name: "JavaScript", level: "Advanced", icon: "javascript", desc: "ES6+, Async/Await, DOM, Modern Web Engines" },
      { name: "React.js", level: "Advanced", icon: "react", desc: "Hooks, Redux Toolkit, Component Lifecycle, SPA" },
      { name: "Node.js", level: "Intermediate", icon: "node", desc: "Express.js, REST APIs, Backend Services" },
      { name: "Java", level: "Intermediate", icon: "java", desc: "OOP, Data Structures, Backend Fundamentals" },
      { name: "C++ / C", level: "Intermediate", icon: "cpp", desc: "Algorithms, Memory Optimization, Data Structures" },
      { name: "Swift (iOS)", level: "Familiar", icon: "swift", desc: "iOS App Development, Mobile UI" }
    ],
    frontend: [
      { name: "React.js & Redux", level: "Advanced", icon: "react", desc: "Predictable State Management, Component Architecture" },
      { name: "HTML5 / CSS3", level: "Advanced", icon: "html5", desc: "Semantic Markup, Modern Flexbox & Grid" },
      { name: "Bootstrap & Tailwind", level: "Advanced", icon: "bootstrap", desc: "Responsive Frameworks, Clean Layouts" },
      { name: "Graphics Design", level: "Leadership", icon: "design", desc: "College Graphics Team Lead, UI/UX Prototyping" }
    ],
    database: [
      { name: "MongoDB", level: "Intermediate", icon: "mongodb", desc: "NoSQL Schemas, Aggregations, Mongoose ORM" },
      { name: "SQL / MySQL", level: "Intermediate", icon: "mysql", desc: "Relational Normalization, Indexing, Transactions" },
      { name: "Appwrite", level: "Intermediate", icon: "appwrite", desc: "Cloud Backend-as-a-Service, JWT Auth, Storage" }
    ],
    tools: [
      { name: "Git & GitHub", level: "Advanced", icon: "git", desc: "Version Control, Branching, Team Collaborations" },
      { name: "AWS Cloud", level: "Familiar", icon: "aws", desc: "Cloud Deployment, S3, EC2 Fundamentals" },
      { name: "IDEs & Editors", level: "Advanced", icon: "ide", desc: "VS Code, PyCharm, IntelliJ IDEA, Android Studio, Eclipse" },
      { name: "Spring Boot", level: "Familiar", icon: "spring", desc: "Java Microservices, REST Services" },
      { name: "Agile & Scrum", level: "Practitioner", icon: "agile", desc: "Sprint Cycles, Project Management, Issue Tracking" }
    ]
  },

  // 4. Featured Projects (Combined Real Portfolio + Resume)
  projects: [
    {
      id: "synora26-suite",
      title: "Synora'26 – Complete Hackathon Tech Suite",
      category: "web",
      categoryLabel: "Main Tech Lead • 80+ Teams",
      shortDesc: "End-to-end hackathon technical ecosystem engineered and deployed for Synora'26 as Main Tech Lead and Event Lead. Built and operated the 4 unified platforms: Registration & Team Portal, Live QR Event Attendance, Jury Evaluation & Leaderboard, and Automated Certificate Generation & Verification Engine for 80+ competing teams (~350+ developers).",
      image: "assets/images/synora26.jpg",
      tags: ["Main Tech Lead", "Synora'26", "React.js", "Node.js", "Python & Flask", "MySQL", "Dynamic QR", "Jury Rubric", "PDF Certificates", "80+ Teams Scale"],
      highlights: [
        "Hackathon Registration Portal: Orchestrated team formations, leader invitations, track quotas, and organizer administration for 80+ competing teams (~350+ participants)",
        "Live Event Attendance Platform: High-speed dynamic QR code check-in platform with real-time hall entry validation, headcount sync, and badge verification",
        "Jury Evaluation & Scoring Website: Multi-judge scoring rubrics (Innovation, Tech Architecture, Presentation), score normalization, and synchronized live leaderboard",
        "Certificate Generation & Sharing Engine: Dynamic vector certificate generation, cryptographic QR anti-tamper verification, and 1-click social sharing to LinkedIn"
      ],
      detailedDesc: "Built and deployed as the central technological backbone for Synora'26, a flagship collegiate hackathon where I served as the Main Tech Lead and Main Event Role overseeing 80+ competing teams. Designed and operated four fully integrated platforms covering the entire hackathon lifecycle from initial registration to live QR venue check-ins, multi-judge evaluation matrices, and instant tamper-proof certificate delivery.",
      github: "https://github.com/kandukurijagan1/hackathon-registration-portal",
      demo: "#projects",
      architecture: [
        "Module 1 (Registration): React.js + Flask + MySQL managing 80+ teams, invitations, and tracks",
        "Module 2 (Attendance): Dynamic time-based QR code generation & scanner for hall check-ins",
        "Module 3 (Evaluation): Multi-judge scoring matrix with normalized weights and live leaderboard",
        "Module 4 (Certificates): Python ReportLab vector engine + unique QR verification hashes"
      ]
    },
    {
      id: "fish-billing",
      title: "Aaryan Aqua Needs – Cloud GST Billing & Inventory Hub (v5.4 Pro)",
      category: "billing",
      categoryLabel: "Production Client Project",
      shortDesc: "My first real-world commercial client project deployed live in production: an enterprise cloud GST billing and inventory hub featuring an offline-first architecture, Supabase PostgreSQL, automated WhatsApp PDF invoices, and dynamic UPI payments.",
      image: "assets/images/aaryan-aqua.jpg",
      tags: ["First Client Project", "Node.js", "Express.js", "Supabase", "PostgreSQL", "IndexedDB", "Puppeteer", "WhatsApp API", "UPI QR", "Telegram Bot"],
      highlights: [
        "Automated GST billing engine calculating CGST, SGST, and IGST breakdowns with compliant thermal & PDF receipts",
        "Offline-first cloud architecture utilizing browser IndexedDB seamlessly synchronized with Supabase PostgreSQL",
        "Automated WhatsApp PDF invoice generation and instant delivery using Node.js and headless Puppeteer",
        "Inventory management system with automatic stock updates, low-stock threshold alerts, and Telegram business notifications",
        "Dynamic UPI QR payment checkouts, customer credit khata ledgers, and multi-user role-based access control (RBAC)"
      ],
      detailedDesc: "From classroom theory to deploying software for my first real-world client! Developed and deployed in production to solve actual operational bottlenecks for Aaryan Aqua Needs in Repalle, Andhra Pradesh. Built with an offline-first model so billing never halts during network drops, automatically syncing to Supabase PostgreSQL when back online. Employs headless Puppeteer for high-speed PDF tax invoice generation dispatched directly to buyers via WhatsApp.",
      github: "https://github.com/kandukurijagan1/fish-billing-system",
      demo: "http://localhost:5000",
      architecture: [
        "Offline Layer: Browser IndexedDB caching catalog, rates & draft invoices",
        "Cloud Database: Supabase PostgreSQL managing accounts, products, ledgers & audit logs",
        "Invoice Engine: Node.js + Express.js + Puppeteer generating high-resolution PDF tax invoices",
        "Integration: WhatsApp Business automation, dynamic UPI payment QR, and Telegram alert bot"
      ]
    },
    {
      id: "desktop-assistant",
      title: "AI-Powered Real-Time Desktop Assistant",
      category: "ai",
      categoryLabel: "AI & Desktop Automation",
      shortDesc: "Voice and text-driven AI desktop assistant implementing real-time DuckDuckGo information retrieval, OS automation, PDF report generation, and Telegram bot alerts.",
      image: "assets/images/project-assistant.svg",
      tags: ["Python", "SpeechRecognition", "PyAudio", "pyttsx3", "DuckDuckGo", "Telegram Bot"],
      highlights: [
        "Natural language voice command ingestion using SpeechRecognition & pyttsx3 speech synthesis",
        "Real-time web search and intent-based query parsing via DuckDuckGo API",
        "OS automation executing application launches, media controls, and system functions",
        "Automated interaction summary reports compiled to PDF and dispatched to Telegram"
      ],
      detailedDesc: "A complete AI assistant that controls desktop functions, answers complex questions through web searches, and automates mundane developer workflows. Features real-time voice capture, intent classification, automated browser commands, PDF export of interaction transcripts, and asynchronous notification delivery through a Telegram bot.",
      github: "https://github.com/kandukurijagan1/ai-desktop-assistant",
      demo: "#projects",
      architecture: [
        "Audio Engine: PyAudio microphone capture + Google SpeechRecognition API",
        "Intent Parser: Pattern matching & natural language task dispatcher",
        "Automation Layer: OS subprocess, web browser module & system controls",
        "Notification: Telegram Bot API webhook + ReportLab PDF synthesis"
      ]
    },
    {
      id: "crime-monitoring",
      title: "Facial-Based Crime Monitoring & Alert System",
      category: "ai",
      categoryLabel: "AI Surveillance • WhatsApp & Telegram Alerts",
      shortDesc: "Intelligent real-time CCTV surveillance platform utilizing deep learning facial recognition and a breakthrough Long Age-Gap Biometric Analyzer (matching 80y person with 15y reference photo). Fully integrated with WhatsApp and Telegram for instant emergency message sharing and alert dispatch.",
      image: "assets/images/ibvap-surveillance.jpg",
      tags: ["Computer Vision AI", "WhatsApp API", "Telegram Bot Alert", "Long Age-Gap Biometrics", "Craniofacial Bone Invariance", "ArcFace 512D", "Python", "OpenCV", "Thermal FLIR", "SIH // MHA Defense"],
      highlights: [
        "WhatsApp & Telegram Message Sharing: Automated real-time alert pipeline broadcasting suspect sightings, geotagged snapshots, and match logs to law enforcement channels",
        "Long Age-Gap Face Recognition: Matches elderly suspects (~80 years old) against youth reference records (15–20 years old) across +54 year temporal gaps",
        "Craniofacial Bone Invariance: 68-point facial landmark geometry measuring permanent skull ratios unaffected by aging wrinkles or physical changes",
        "Multi-Spectral Forensic Studio: Live Optical & Digital zoom with Normal RGB, Thermal FLIR Ironbow, NVG Night Vision, and Section 65B legal FIR generation"
      ],
      detailedDesc: "An advanced computer vision security solution engineered for border surveillance and municipal crime monitoring (SIH // MHA). The platform solves cold cases by identifying elderly individuals from youth reference photos across a +54 to +65 year temporal age gap using 68-landmark craniofacial bone invariance and ArcFace 512D deep embeddings. Critically, the platform is integrated with WhatsApp Business API and Telegram bot webhooks to immediately dispatch forensic match alerts, high-resolution snapshots, and court-admissible Section 65B FIR documents directly to duty officers.",
      github: "https://github.com/kandukurijagan1/facial-crime-monitoring-system",
      demo: "#projects",
      architecture: [
        "Detection & Biometrics: 68-landmark craniofacial bone invariance + ArcFace 512D embeddings",
        "Messaging Integration: WhatsApp Business API + Telegram Bot Webhooks for real-time alert dispatch",
        "Spectral Ingestion: OpenCV RTSP video pipelines with Thermal FLIR Ironbow & NVG Night filters",
        "Legal Evidence: Section 65B Indian Evidence Act compliant digital FIR hash verification"
      ]
    },
  ],

  // 5. Education (From Resume)
  education: {
    degree: "Bachelor of Engineering (B.E) in Computer Science (3rd Year)",
    institution: "Saveetha University",
    location: "Chennai, Tamil Nadu, India",
    duration: "Expected Graduation: May 2028",
    currentYear: "3rd Year",
    cgpa: "9.04",
    coursework: [
      "MERN Stack (MongoDB, Express, React, Node)",
      "Data Structures & Algorithms",
      "Object-Oriented Programming (Python & Java)",
      "Database Management Systems (SQL)",
      "Web Technologies & Frontend Engineering",
      "Software Engineering & Agile Methodologies"
    ]
  },

  // 6. Academic Achievements (From Resume & Experience)
  achievements: [
    {
      type: "leadership",
      badge: "Main Lead • 80+ Teams",
      title: "Main Lead & Organizer — Synora'26 Hackathon",
      organization: "Saveetha University",
      date: "2025 - 2026",
      image: "assets/images/synora26.jpg",
      description: "Spearheaded and served as Main Lead for Synora'26, a major collegiate hackathon hosting around 80 competing teams (~350+ innovators). Led the development and deployment of the registration portal, dynamic QR attendance check-in, problem statement distribution, and multi-judge rubric scoring normalization."
    },
    {
      type: "certification",
      badge: "Full Stack Certified",
      title: "Certification in Full Stack Development",
      organization: "Professional Tech Accreditation",
      date: "2024",
      description: "Demonstrated advanced proficiency in MERN stack technologies (MongoDB, Express.js, React, Node.js), scalable architecture, and agile project management."
    },
    {
      type: "leadership",
      badge: "Leadership",
      title: "College Graphics Designing Team Lead",
      organization: "Saveetha University",
      date: "2024 - Present",
      description: "Led the college graphics designing team, organizing and managing design projects, branding for major symposiums and events, enhancing creative output and visibility."
    },
    {
      type: "academic",
      badge: "Academic Distinction",
      title: "Academic Excellence — 9.04 CGPA",
      organization: "Saveetha University",
      date: "2024 - Present",
      description: "Maintained a top-tier 9.04 CGPA across computer science core coursework including Data Structures, Algorithms, Databases, and Web Architectures."
    },
    {
      type: "internship",
      badge: "Targeting Roles",
      title: "Targeting Full Stack Developer Roles & Internships",
      organization: "High-Repute Engineering Organizations",
      date: "Active",
      description: "Seeking opportunities to deploy scalable web architectures, contribute to high-impact production codebases, and drive technological innovation."
    }
  ],

  // 7. Verified Certifications & Technical Honors (All 22 Earned Credentials)
  certifications: [
    {
      id: "cert-fullstack-python",
      title: "Full Stack Python Programming",
      category: "certifications",
      issuer: "Python Life (Kiran Sagar, Founding Member)",
      date: "06 Jan 2026",
      credentialId: "PL-FSP-2026",
      preview: "assets/certificates/thumbnails/cert-fullstack-python.jpg",
      file: "assets/certificates/full stack.png",
      badge: "Professional Certification",
      tags: ["Python", "Full Stack", "Backend", "Web Development"]
    },
    {
      id: "cert-iconstem-conference",
      title: "Research Paper Presentation — ICONSTEM 2025",
      category: "conferences",
      issuer: "Jeppiaar Engineering College (NAAC Sponsored)",
      date: "28–29 Nov 2025",
      credentialId: "ICONSTEM-2025-RP",
      preview: "assets/certificates/thumbnails/cert-iconstem-conference.jpg",
      file: "assets/certificates/international conference jpr college.jpg",
      badge: "International Conference",
      tags: ["Research Paper", "Peer-Reviewed", "ICONSTEM 2025", "NAAC Sponsored"]
    },
    {
      id: "cert-thoughtspark-chipcomm",
      title: "ThoughtSpark — National Level Paper Presentation",
      category: "conferences",
      issuer: "R.M.K. Engineering College (CHIPCOMM'26)",
      date: "09 Feb 2026",
      credentialId: "RMK-CHIPCOMM-26",
      preview: "assets/certificates/thumbnails/cert-thoughtspark.jpg",
      file: "assets/certificates/thought spark(Paper Presentation).pdf",
      badge: "National Symposium",
      tags: ["Paper Presentation", "CHIPCOMM'26", "Autonomous Institution"]
    },
    {
      id: "cert-maths-day-gtu",
      title: "National Mathematics Day Online Quiz Award",
      category: "certifications",
      issuer: "Gujarat Technological University (GTU-ITR)",
      date: "23 Dec 2025",
      credentialId: "GTU-ITR/NMD/2025/1073",
      preview: "assets/certificates/thumbnails/cert-maths-day.jpg",
      file: "assets/certificates/Maths day_.jpg",
      badge: "NAAC A+ University",
      tags: ["Mathematics", "Logical Reasoning", "GTU", "National Competition"]
    },
    {
      id: "cert-win-daily-hackathon-1",
      title: "WINNER — Daily Problem-Solving Challenge (13 Feb)",
      category: "hackathons",
      issuer: "SIMATS Engineering (Team Dream Hackers)",
      date: "13 Feb 2026",
      credentialId: "SIMATS-DPS-13FEB",
      preview: "assets/certificates/thumbnails/cert-win-daily-1.jpg",
      file: "assets/certificates/hackaton college.jpeg",
      badge: "🏆 1st Place Winner",
      tags: ["Winner", "Team Dream Hackers", "Data Structures", "Speed Coding"]
    },
    {
      id: "cert-win-daily-hackathon-2",
      title: "WINNER — Daily Problem-Solving Challenge (14 Feb)",
      category: "hackathons",
      issuer: "SIMATS Engineering (Team Dream Hackers)",
      date: "14 Feb 2026",
      credentialId: "SIMATS-DPS-14FEB",
      preview: "assets/certificates/thumbnails/cert-win-daily-2.jpg",
      file: "assets/certificates/hackaton college1.jpeg",
      badge: "🏆 1st Place Winner",
      tags: ["Winner", "Team Dream Hackers", "Algorithms", "Optimization"]
    },
    {
      id: "cert-win-daily-hackathon-3",
      title: "WINNER — Daily Problem-Solving Challenge (23 Feb)",
      category: "hackathons",
      issuer: "SIMATS Engineering (Team Dream Hackers)",
      date: "23 Feb 2026",
      credentialId: "SIMATS-DPS-23FEB",
      preview: "assets/certificates/thumbnails/cert-win-daily-3.jpg",
      file: "assets/certificates/daily problem statement hackathon 3.jpg",
      badge: "🏆 1st Place Winner",
      tags: ["Winner", "Team Dream Hackers", "Rapid Problem Solving"]
    },
    {
      id: "cert-win-daily-hackathon-4",
      title: "WINNER — Daily Problem-Solving Challenge (12 Mar)",
      category: "hackathons",
      issuer: "SIMATS Engineering (Team Code Coven)",
      date: "12 Mar 2026",
      credentialId: "SIMATS-DPS-12MAR",
      preview: "assets/certificates/thumbnails/cert-win-daily-4.jpg",
      file: "assets/certificates/Daily problem solving.jpg",
      badge: "🏆 1st Place Winner",
      tags: ["Winner", "Team Code Coven", "Algorithmic Precision"]
    },
    {
      id: "cert-win-daily-hackathon-5",
      title: "WINNER — Daily Problem-Solving Challenge (14 Mar)",
      category: "hackathons",
      issuer: "SIMATS Engineering (Team Code Coven)",
      date: "14 Mar 2026",
      credentialId: "SIMATS-DPS-14MAR",
      preview: "assets/certificates/thumbnails/cert-win-daily-5.jpg",
      file: "assets/certificates/Daily problem solving(1).jpg",
      badge: "🏆 1st Place Winner",
      tags: ["Winner", "Team Code Coven", "Collaborative Coding"]
    },
    {
      id: "cert-win-daily-hackathon-6",
      title: "WINNER — Daily Problem-Solving Challenge (16 Mar)",
      category: "hackathons",
      issuer: "SIMATS Engineering (Team Code Coven)",
      date: "16 Mar 2026",
      credentialId: "SIMATS-DPS-16MAR",
      preview: "assets/certificates/thumbnails/cert-win-daily-6.jpg",
      file: "assets/certificates/Daily problem solving(2).jpg",
      badge: "🏆 1st Place Winner",
      tags: ["Winner", "Team Code Coven", "System Logic"]
    },
    {
      id: "cert-win-daily-hackathon-7",
      title: "WINNER — Daily Problem-Solving Challenge (19 Mar)",
      category: "hackathons",
      issuer: "SIMATS Engineering (Team Code Coven)",
      date: "19 Mar 2026",
      credentialId: "SIMATS-DPS-19MAR",
      preview: "assets/certificates/thumbnails/cert-win-daily-7.jpg",
      file: "assets/certificates/daily problem solving_.jpg",
      badge: "🏆 1st Place Winner",
      tags: ["Winner", "Team Code Coven", "Architecture"]
    },
    {
      id: "cert-sdgthon-panimalar",
      title: "SDGthon 2K26 — 24-Hour Online Hackathon",
      category: "hackathons",
      issuer: "IEEE Student Branch & SDG Cell, Panimalar Eng. College",
      date: "06–07 Mar 2026",
      credentialId: "IEEE-SDGTHON-2026",
      preview: "assets/certificates/thumbnails/cert-sdgthon-panimalar.jpg",
      file: "assets/certificates/panimalar hackathon_.pdf",
      badge: "IEEE 24-Hour Hackathon",
      tags: ["IEEE", "UN SDGs", "24h Hackathon", "Full Stack"]
    },
    {
      id: "cert-innobyte-hackathon",
      title: "INNOBYTE — AI Student Hackathon",
      category: "hackathons",
      issuer: "SIMATS Engineering (Dept. of Scientific Computing)",
      date: "26 Feb 2026",
      credentialId: "SIMATS-INNOBYTE-26",
      preview: "assets/certificates/thumbnails/cert-innobyte.jpg",
      file: "assets/certificates/innobytes hackathon.png",
      badge: "AI Hackathon",
      tags: ["AI", "Scientific Computing", "Machine Learning"]
    },
    {
      id: "cert-codevolt-hackathon",
      title: "CODEVOLT Hackathon",
      category: "hackathons",
      issuer: "SIMATS Engineering (Dept. of Nanobiomaterials)",
      date: "18 Mar 2026",
      credentialId: "SIMATS-CODEVOLT-26",
      preview: "assets/certificates/thumbnails/cert-codevolt.jpg",
      file: "assets/certificates/codevolt hackathon.jpg",
      badge: "Engineering Hackathon",
      tags: ["Engineering", "Biomaterials", "Computational Models"]
    },
    {
      id: "cert-ai-evaluator-hackathon",
      title: "AI Coding Assignment Evaluator Hackathon",
      category: "hackathons",
      issuer: "UnsaidTalks Education Pvt. Ltd.",
      date: "14 Feb 2026",
      credentialId: "UNSAID-AICODE-26",
      preview: "assets/certificates/thumbnails/cert-ai-evaluator.jpg",
      file: "assets/certificates/AI_Coding_Assignment_Evaluator_Hackathon.png",
      badge: "Applied AI Track",
      tags: ["AI Evaluation", "Python", "Automated Grading"]
    },
    {
      id: "cert-emotion-encryption-hackathon",
      title: "Emotion-Aware Encryption Hackathon",
      category: "hackathons",
      issuer: "UnsaidTalks Education Pvt. Ltd.",
      date: "07 Mar 2026",
      credentialId: "UNSAID-EMOTION-26",
      preview: "assets/certificates/thumbnails/cert-emotion-encryption.jpg",
      file: "assets/certificates/Emotion-Aware_Encryption_Hackathon.png",
      badge: "Cybersecurity Track",
      tags: ["Cryptography", "Emotion AI", "Security"]
    },
    {
      id: "cert-github-analyzer-hackathon",
      title: "GitHub Portfolio Analyzer & Enhancer Hackathon",
      category: "hackathons",
      issuer: "UnsaidTalks Education Pvt. Ltd.",
      date: "13 Feb 2026",
      credentialId: "UNSAID-GITANALYZE-26",
      preview: "assets/certificates/thumbnails/cert-github-analyzer.jpg",
      file: "assets/certificates/GitHub_Portfolio_Analyzer_&_Enhancer_Hackathon.png",
      badge: "Developer Tools",
      tags: ["GitHub API", "Profile Optimization", "Developer Metrics"]
    },
    {
      id: "cert-collegiate-hackathon",
      title: "Collegiate Hackathon Challenge",
      category: "hackathons",
      issuer: "Saveetha School of Engineering",
      date: "2025–2026",
      credentialId: "SSE-HACK-2026",
      preview: "assets/certificates/thumbnails/cert-collegiate-hackathon.jpg",
      file: "assets/certificates/hackaton.pdf",
      badge: "Collegiate Hackathon",
      tags: ["Software Engineering", "Team Hackathon", "Saveetha"]
    },
    {
      id: "cert-technical-quiz",
      title: "Technical Quiz Competition",
      category: "competitions",
      issuer: "Saveetha School of Engineering",
      date: "2025–2026",
      credentialId: "SSE-QUIZ-2026",
      preview: "assets/certificates/thumbnails/cert-technical-quiz.jpg",
      file: "assets/certificates/Technical Quiz.pdf",
      badge: "Technical Contest",
      tags: ["Computer Science", "Core Concepts", "Algorithms"]
    },
    {
      id: "cert-paper-presentation",
      title: "Collegiate Paper Presentation Competition",
      category: "competitions",
      issuer: "Saveetha School of Engineering",
      date: "2025–2026",
      credentialId: "SSE-PAPER-2026",
      preview: "assets/certificates/thumbnails/cert-paper-presentation.jpg",
      file: "assets/certificates/Paper Presentation.pdf",
      badge: "Technical Symposium",
      tags: ["Research", "Technical Writing", "Presentation"]
    },
    {
      id: "cert-poster-design",
      title: "Technical Poster Design Competition",
      category: "competitions",
      issuer: "Saveetha School of Engineering",
      date: "2025–2026",
      credentialId: "SSE-POSTER-2026",
      preview: "assets/certificates/thumbnails/cert-poster-design.jpg",
      file: "assets/certificates/Poster Design.pdf",
      badge: "Design Competition",
      tags: ["Poster Design", "UI/UX", "Creative Visuals"]
    },
    {
      id: "cert-freefire-esports",
      title: "Free Fire Collegiate Esports Tournament",
      category: "competitions",
      issuer: "Saveetha School of Engineering",
      date: "2025–2026",
      credentialId: "SSE-ESPORTS-2026",
      preview: "assets/certificates/thumbnails/cert-freefire.jpg",
      file: "assets/certificates/free fire.pdf",
      badge: "Esports Tournament",
      tags: ["Strategy", "Team Coordination", "Competitive Gaming"]
    }
  ]
};

// Export to global scope
if (typeof window !== "undefined") {
  window.PORTFOLIO_CONFIG = PORTFOLIO_CONFIG;
}
