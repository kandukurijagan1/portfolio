# -*- coding: utf-8 -*-
"""
Apply Sepia Theme to index.html
Replicating the exact visual design, animation feel, and professional polish of
https://myportfolio-sepia-xi-37.vercel.app for Kandukuri Jagan's portfolio.
"""

import re

def main():
    with open('index.html', 'r', encoding='utf-8') as f:
        html = f.read()

    # 1. Update <head> with Google Fonts and css/sepia-theme.css
    font_and_css = """  <!-- Google Fonts: Inter & Caveat (From myportfolio-sepia-xi-37.vercel.app) -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;600;700&family=Inter:ital,opsz,wght@0,14..32,300..900;1,14..32,300..900&display=swap">
  <link rel="stylesheet" href="css/sepia-theme.css?v=8.0">
"""
    if 'css/sepia-theme.css' not in html:
        html = html.replace('<link rel="stylesheet" href="css/cinematic.css?v=7.0">',
                            '<link rel="stylesheet" href="css/cinematic.css?v=7.0">\n' + font_and_css)

    # 2. Add Fixed Left Floating Social Bar right after <body ...>
    social_bar = """
  <!-- ==========================================================================
       FIXED LEFT FLOATING SOCIAL BAR (Inspired by Sepia Portfolio)
       ========================================================================== -->
  <aside class="sepia-social-bar" aria-label="Social Profiles">
    <a href="https://github.com/kandukurijagan1?tab=repositories" target="_blank" rel="noopener noreferrer" class="sepia-social-link" aria-label="GitHub">
      <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
      <span class="sepia-social-tooltip">GitHub Profile</span>
    </a>
    <a href="https://www.linkedin.com/in/jagan-kandukuri-053a0331b/" target="_blank" rel="noopener noreferrer" class="sepia-social-link" aria-label="LinkedIn">
      <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
      <span class="sepia-social-tooltip">LinkedIn Network</span>
    </a>
    <a href="https://api.whatsapp.com/send?phone=918367047947&text=Hi%20Jagan%2C%20I%20saw%20your%20portfolio%20and%20would%20like%20to%20connect!" target="_blank" rel="noopener noreferrer" class="sepia-social-link" aria-label="WhatsApp">
      <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.669-.699c.969.529 1.771.814 2.791.814 3.18 0 5.766-2.587 5.767-5.767.001-3.18-2.585-5.767-5.767-5.767zm3.385 8.169c-.141.396-.723.76-1.02.802-.27.039-.623.064-1.782-.416-.992-.41-1.637-1.423-1.687-1.489-.049-.066-.396-.528-.396-1.008s.251-.716.34-.814c.088-.099.193-.124.257-.124.065 0 .13.001.186.003.06.002.139-.022.217.165.08.193.272.663.296.712.024.049.04.107.008.173-.032.066-.048.107-.097.165-.049.057-.103.128-.147.172-.049.049-.1.103-.043.202.057.099.254.419.546.678.375.334.69.438.789.487.099.049.157.041.215-.025.058-.066.248-.289.314-.388.066-.099.132-.082.223-.049.091.033.578.272.677.322.099.049.165.074.19.115.025.041.025.239-.116.635z"/><path d="M12 2C6.477 2 2 6.477 2 12c0 1.891.526 3.661 1.442 5.176L2 22l4.981-1.306A9.957 9.957 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.062c-1.602 0-3.1-.476-4.364-1.295l-.313-.203-2.955.775.789-2.88-.223-.355A7.994 7.994 0 0 1 4 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8.062-8 8.062z"/></svg>
      <span class="sepia-social-tooltip">WhatsApp Direct</span>
    </a>
    <a href="mailto:kandukurijagan99@gmail.com" class="sepia-social-link" aria-label="Email">
      <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
      <span class="sepia-social-tooltip">Email Jagan</span>
    </a>
  </aside>
"""
    if 'sepia-social-bar' not in html:
        html = re.sub(r'(<body[^>]*>)', r'\1\n' + social_bar, html, count=1)

    # 3. New Hero Section Replacement
    new_hero = """    <!-- ==========================================================================
         2. CRIMSON RED HERO SECTION (Signature Style from Sepia Portfolio)
         ========================================================================== -->
    <section id="home" class="sepia-hero-section" aria-label="Hero Section">
      <!-- Interactive Fluid Dynamics Particle Canvas -->
      <canvas id="sepia-fluid-canvas" class="sepia-hero-canvas"></canvas>

      <div class="sepia-hero-container">
        <!-- Hero Left: Content -->
        <div class="sepia-hero-content">
          <div class="sepia-hero-badge">
            <span class="sepia-hero-badge-pulse"></span>
            FULL STACK DEVELOPER &bull; MERN &bull; AI &bull; PYTHON
          </div>

          <h1 class="sepia-hero-title">
            Hi, I'm Kandukuri Jagan,<br>
            <span class="highlight-dark">Full Stack Developer</span>
          </h1>

          <p class="sepia-hero-subtitle">
            Passionate about building scalable web applications with MERN stack, Python, and modern cloud technologies to solve real-world problems. Main Tech Lead of Synora'26 Hackathon (80+ Teams).
          </p>

          <div class="sepia-hero-btn-group">
            <a href="#projects" class="sepia-btn-solid-dark">
              <span>View My Work</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </a>
            <a href="#contact" class="sepia-btn-frosted">
              <span>Contact Me</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
            </a>
            <a href="assets/resume.pdf" download="Kandukuri_Jagan_Resume.pdf" class="sepia-btn-outline" title="Download Official Resume PDF">
              <span>Download Resume</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            </a>
          </div>
        </div>

        <!-- Hero Right: 3D Developer Portrait at Reflective Glass Desk -->
        <div class="sepia-hero-visual-wrapper">
          <!-- Floating Holographic Badges -->
          <div class="sepia-float-badge badge-top-left">
            <span>🚀</span> Synora'26 Tech Lead
          </div>
          <div class="sepia-float-badge badge-bottom-right">
            <span>🎓</span> 9.04 CGPA &bull; Saveetha
          </div>

          <!-- Decorative 4-Point Twinkle Stars -->
          <svg class="sepia-star" style="top: -15px; right: 25px; width: 26px; height: 26px;" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/></svg>
          <svg class="sepia-star" style="bottom: 45px; left: -25px; width: 20px; height: 20px;" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/></svg>

          <!-- Main Portrait Card with Realistic Desk Reflection -->
          <div class="sepia-hero-card-desk">
            <img src="assets/images/profile.jpg" alt="Kandukuri Jagan - Full Stack Developer" class="sepia-hero-portrait-img">
            <div class="sepia-desk-reflection">
              <div class="sepia-hero-desk-status">
                <span style="font-size: 0.8rem; font-weight: 700; color: #a1a1aa;">&bull; ONLINE &bull; READY TO BUILD</span>
                <span style="font-size: 0.75rem; background: rgba(255,42,42,0.25); color: #ff8080; padding: 2px 10px; border-radius: 9999px; font-weight: 700;">CHENNAI, IN</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Organic Seamless SVG Wave Divider transitioning to #about -->
      <div class="sepia-wave-divider wave-bottom">
        <svg class="sepia-wave-svg" viewBox="0 0 1440 85" fill="none" preserveAspectRatio="none">
          <path d="M0,32L60,42.7C120,53,240,75,360,74.7C480,75,600,53,720,48C840,43,960,53,1080,58.7C1200,64,1320,64,1380,64L1440,64L1440,85L1380,85C1320,85,1200,85,1080,85C960,85,840,85,720,85C600,85,480,85,360,85C240,85,120,85,60,85L0,85Z" fill="#0a0a0a"></path>
        </svg>
      </div>
    </section>"""

    # Replace <section id="home" ... </section>
    html = re.sub(r'<section id="home".*?</section>', new_hero, html, flags=re.DOTALL)

    # 4. New About Section Replacement (with 3D Flip Card)
    new_about = """    <!-- ==========================================================================
         3. ABOUT SECTION WITH 3D FLIP ID BADGE CARD
         ========================================================================== -->
    <section id="about" class="sepia-about-section" aria-label="About Kandukuri Jagan">
      <div class="sepia-about-container">
        <!-- Left: 3D Flip Card Container -->
        <div class="sepia-flip-wrapper">
          <div class="sepia-card-annotation">
            Tap the card to flip &#8635;
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M14 9l6 6-6 6"></path><path d="M4 4v7a4 4 0 0 0 4 4h11"></path></svg>
          </div>
          <div class="sepia-flip-card" id="sepia-flip-id-card">
            <!-- Front Face -->
            <div class="sepia-card-face card-front">
              <div class="sepia-badge-lanyard-hole"></div>
              <img src="assets/images/profile.jpg" alt="Kandukuri Jagan" class="sepia-badge-avatar">
              <h3 class="sepia-badge-name">Kandukuri Jagan</h3>
              <span class="sepia-badge-role">Full Stack Developer</span>
              <p class="sepia-badge-institution">Saveetha University &bull; Chennai<br><strong style="color: #ffffff;">CGPA: 9.04 &bull; 3rd Year</strong></p>
              <div class="sepia-badge-footer">
                <span>ID: KJ-2026-CS</span>
                <span style="color: #22c55e; font-weight: 700;">&#9679; VERIFIED LEAD</span>
              </div>
            </div>

            <!-- Back Face -->
            <div class="sepia-card-face card-back">
              <div class="sepia-badge-lanyard-hole"></div>
              <span style="font-size: 0.75rem; font-weight: 700; color: var(--sepia-red); letter-spacing: 0.1em; text-transform: uppercase;">Scan for Digital Portfolio</span>
              <div class="sepia-qr-box">
                <svg viewBox="0 0 100 100" fill="#0a0a0a">
                  <rect x="0" y="0" width="30" height="30" fill="#0a0a0a" rx="4"/>
                  <rect x="5" y="5" width="20" height="20" fill="#ffffff" rx="2"/>
                  <rect x="10" y="10" width="10" height="10" fill="#0a0a0a"/>
                  <rect x="70" y="0" width="30" height="30" fill="#0a0a0a" rx="4"/>
                  <rect x="75" y="5" width="20" height="20" fill="#ffffff" rx="2"/>
                  <rect x="80" y="10" width="10" height="10" fill="#0a0a0a"/>
                  <rect x="0" y="70" width="30" height="30" fill="#0a0a0a" rx="4"/>
                  <rect x="5" y="75" width="20" height="20" fill="#ffffff" rx="2"/>
                  <rect x="10" y="80" width="10" height="10" fill="#0a0a0a"/>
                  <rect x="36" y="10" width="8" height="8"/>
                  <rect x="48" y="10" width="8" height="8"/>
                  <rect x="36" y="24" width="8" height="8"/>
                  <rect x="48" y="36" width="12" height="12"/>
                  <rect x="10" y="44" width="12" height="12"/>
                  <rect x="70" y="44" width="8" height="8"/>
                  <rect x="84" y="44" width="8" height="8"/>
                  <rect x="36" y="70" width="8" height="8"/>
                  <rect x="48" y="80" width="12" height="8"/>
                  <rect x="70" y="70" width="10" height="10"/>
                  <rect x="85" y="82" width="8" height="8"/>
                </svg>
              </div>
              <div class="sepia-card-contact-list">
                <a href="tel:+918367047947" class="sepia-contact-item">
                  <span>&#128222;</span> +91 8367047947
                </a>
                <a href="mailto:kandukurijagan99@gmail.com" class="sepia-contact-item">
                  <span>&#9993;</span> kandukurijagan99@gmail.com
                </a>
                <div class="sepia-contact-item" style="color: #a1a1aa;">
                  <span>&#128205;</span> Chennai, Tamil Nadu, India
                </div>
              </div>
              <div style="font-size: 0.7rem; color: #71717a; margin-top: 4px;">Tap anywhere to flip back &#8634;</div>
            </div>
          </div>
        </div>

        <!-- Right: Executive Story & Metric Grid -->
        <div class="sepia-about-content">
          <span class="sepia-eyebrow">ABOUT ME</span>
          <h2 class="sepia-section-heading">Hello!</h2>
          <p class="sepia-about-narrative">
            Hi, my name is <strong>Kandukuri Jagan</strong>, an aspiring Full Stack Developer based in Chennai, India, pursuing Computer Science Engineering at <strong>Saveetha University (CGPA: 9.04)</strong>. As the <strong>Main Tech Lead of Synora'26 Hackathon</strong>, I architected and deployed the complete 4-system hackathon platform powering 80+ participating teams.
          </p>
          <p class="sepia-about-narrative">
            My core strengths are quick learning, logical thinking, problem-solving, and adaptability, with a genuine enthusiasm for creating clean, scalable code. Dedicated and self-motivated, I am eager to embrace cutting-edge technologies and contribute effectively to real-world engineering teams.
          </p>

          <!-- Metric Cards Grid -->
          <div class="sepia-metric-grid">
            <div class="sepia-metric-card">
              <div class="sepia-metric-num">9.04<span class="metric-red">/10</span></div>
              <div class="sepia-metric-label">CGPA &bull; Saveetha University</div>
            </div>
            <div class="sepia-metric-card">
              <div class="sepia-metric-num">80<span class="metric-red">+</span></div>
              <div class="sepia-metric-label">Hackathon Teams Lead (Synora'26)</div>
            </div>
            <div class="sepia-metric-card">
              <div class="sepia-metric-num">22<span class="metric-red">+</span></div>
              <div class="sepia-metric-label">Verified Credentials Vault</div>
            </div>
            <div class="sepia-metric-card">
              <div class="sepia-metric-num">15<span class="metric-red">+</span></div>
              <div class="sepia-metric-label">Production Repositories Built</div>
            </div>
          </div>
        </div>
      </div>
    </section>"""

    # Replace <section id="about" ... </section>
    html = re.sub(r'<section id="about".*?</section>', new_about, html, flags=re.DOTALL)

    # 5. Insert "My Process" Luggage-Tag Section (#process) - PURE WHITE
    process_section = """
    <!-- ==========================================================================
         4. "MY PROCESS" LUGGAGE-TAG SECTION (Pure Crisp White from Sepia Portfolio)
         ========================================================================== -->
    <section id="process" class="sepia-process-section" aria-label="Engineering Process">
      <div class="sepia-process-container">
        <div class="sepia-process-header">
          <span class="sepia-eyebrow">MY PROCESS</span>
          <h2 class="sepia-section-heading">Here's how I turn ideas into real-world products</h2>
        </div>

        <div class="sepia-process-grid">
          <div class="sepia-process-line" aria-hidden="true"></div>

          <!-- Tag 01: Research -->
          <div class="sepia-tag-card">
            <div class="sepia-punch-hole"></div>
            <span class="sepia-tag-step">Step 01</span>
            <h3 class="sepia-tag-title">Research &amp; Discovery</h3>
            <p class="sepia-tag-desc">
              Analyzing core problem statements, user requirements, technical constraints, and choosing optimal full-stack architecture.
            </p>
          </div>

          <!-- Tag 02: Design -->
          <div class="sepia-tag-card">
            <div class="sepia-punch-hole"></div>
            <span class="sepia-tag-step">Step 02</span>
            <h3 class="sepia-tag-title">System Architecture</h3>
            <p class="sepia-tag-desc">
              Designing relational &amp; NoSQL database schemas, clean RESTful API contracts, and high-fidelity responsive UI components.
            </p>
          </div>

          <!-- Tag 03: Develop -->
          <div class="sepia-tag-card">
            <div class="sepia-punch-hole"></div>
            <span class="sepia-tag-step">Step 03</span>
            <h3 class="sepia-tag-title">Full-Stack Development</h3>
            <p class="sepia-tag-desc">
              Writing clean, modular code with React, Node.js, Express, MongoDB, and Python with rigorous error handling and state management.
            </p>
          </div>

          <!-- Tag 04: Deploy -->
          <div class="sepia-tag-card">
            <div class="sepia-punch-hole"></div>
            <span class="sepia-tag-step">Step 04</span>
            <h3 class="sepia-tag-title">Testing &amp; Deployment</h3>
            <p class="sepia-tag-desc">
              Comprehensive end-to-end testing, performance optimization, CI/CD automated builds, and cloud deployment on Netlify.
            </p>
          </div>
        </div>

        <!-- Handwritten Accent Note -->
        <div class="sepia-ready-note">
          <span>Ready to ship!</span>
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14"></path><path d="M12 5l7 7-7 7"></path></svg>
        </div>
      </div>

      <!-- Organic Wave Divider from White into Dark Projects -->
      <div class="sepia-wave-divider wave-bottom">
        <svg class="sepia-wave-svg" viewBox="0 0 1440 85" fill="none" preserveAspectRatio="none">
          <path d="M0,32L60,42.7C120,53,240,75,360,74.7C480,75,600,53,720,48C840,43,960,53,1080,58.7C1200,64,1320,64,1380,64L1440,64L1440,85L1380,85C1320,85,1200,85,1080,85C960,85,840,85,720,85C600,85,480,85,360,85C240,85,120,85,60,85L0,85Z" fill="#0a0a0a"></path>
        </svg>
      </div>
    </section>
"""
    if 'id="process"' not in html:
        # Place #process right before #projects
        html = html.replace('<section id="projects"', process_section + '\n    <section id="projects"')

    # 6. Add Experience Banner right before #contact
    experience_banner = """
    <!-- ==========================================================================
         CRIMSON RED EXPERIENCE & LEADERSHIP BANNER
         ========================================================================== -->
    <section class="sepia-experience-banner" aria-label="Leadership &amp; Experience">
      <div class="sepia-experience-container">
        <div class="sepia-lead-card">
          <div class="sepia-lead-header">
            <div>
              <h3 class="sepia-lead-role">Main Tech Lead &bull; Synora'26 Hackathon</h3>
              <p class="sepia-lead-org">Saveetha University &bull; National Level Technical Symposium</p>
            </div>
            <span class="sepia-lead-badge">Leadership &bull; 80+ Teams</span>
          </div>
          <p class="sepia-lead-desc">
            Orchestrated the complete 4-system software infrastructure (Registration Portal, Live Biometric &amp; QR Attendance, Real-Time Judging System, and Automated Certificate Generator) powering over 80+ participating collegiate teams with 99.9% uptime.
          </p>
        </div>

        <!-- Core Competencies / Soft Skills -->
        <div class="sepia-competencies-grid">
          <div class="sepia-comp-card">
            <span style="font-size: 1.5rem;">🤝</span>
            <span>Team Leadership &amp; Mentorship</span>
          </div>
          <div class="sepia-comp-card">
            <span style="font-size: 1.5rem;">🧩</span>
            <span>Full-Stack Problem Solving</span>
          </div>
          <div class="sepia-comp-card">
            <span style="font-size: 1.5rem;">📈</span>
            <span>High-Throughput Architecture</span>
          </div>
          <div class="sepia-comp-card">
            <span style="font-size: 1.5rem;">💬</span>
            <span>Clear Technical Communication</span>
          </div>
        </div>
      </div>
    </section>
"""
    if 'sepia-experience-banner' not in html:
        html = html.replace('<section id="contact"', experience_banner + '\n    <section id="contact"')

    # 7. Update Footer with Gigantic Typographic Watermark
    new_footer = """  <!-- ==========================================================================
       GIGANTIC TYPOGRAPHIC WATERMARK FOOTER (Signature from Sepia Portfolio)
       ========================================================================== -->
  <footer class="sepia-footer" role="contentinfo">
    <div class="sepia-footer-container">
      <div class="sepia-footer-top">
        <div class="sepia-footer-brand">
          <a href="#home" class="sepia-logo">
            Kandukuri Jagan<span class="sepia-logo-dot">.</span>
          </a>
          <p>
            Computer Science undergraduate at Saveetha University, Chennai (3rd Year &bull; CGPA: 9.04). Main Lead of Synora'26 Hackathon. Full Stack Developer specialized in MERN stack, Python, and scalable web architectures.
          </p>
        </div>

        <nav class="sepia-footer-nav" aria-label="Footer Navigation">
          <div style="display: flex; gap: 1.5rem; flex-wrap: wrap;">
            <a href="#home" style="color: #a1a1aa; text-decoration: none; font-weight: 500;">Home</a>
            <a href="#about" style="color: #a1a1aa; text-decoration: none; font-weight: 500;">About</a>
            <a href="#skills" style="color: #a1a1aa; text-decoration: none; font-weight: 500;">Skills</a>
            <a href="#process" style="color: #a1a1aa; text-decoration: none; font-weight: 500;">Process</a>
            <a href="#projects" style="color: #a1a1aa; text-decoration: none; font-weight: 500;">Projects</a>
            <a href="#contact" style="color: #a1a1aa; text-decoration: none; font-weight: 500;">Contact</a>
          </div>
        </nav>
      </div>

      <!-- Gigantic Watermark Typography -->
      <div class="sepia-giant-watermark" aria-hidden="true">
        kandukuri jagan
      </div>

      <div class="sepia-footer-bottom">
        <div>
          &copy; 2026 Kandukuri Jagan | Built with Precision
        </div>
        <div>
          Saveetha University, Chennai &bull; B.E. Computer Science (CGPA: 9.04) &bull; Available for Opportunities
        </div>
      </div>
    </div>
  </footer>"""

    html = re.sub(r'<footer class="site-footer".*?</footer>', new_footer, html, flags=re.DOTALL)

    # 8. Add js/sepia-interactions.js right before </body>
    if 'js/sepia-interactions.js' not in html:
        html = html.replace('</body>', '  <script src="js/sepia-interactions.js?v=8.0"></script>\n</body>')

    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("Successfully transformed index.html to Sepia Theme!")

if __name__ == '__main__':
    main()
