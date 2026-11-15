# -*- coding: utf-8 -*-
"""
Script to refine alignment of navbar, hero typography, buttons, and visual cards
to match myportfolio-sepia-xi-37.vercel.app with pixel precision.
"""

def update_index_html():
    with open('index.html', 'r', encoding='utf-8') as f:
        html = f.read()

    # 1. Update navigation links to clean 6 items
    nav_old = """      <!-- Desktop Navigation Links -->
      <nav class="nav-menu" role="navigation" aria-label="Main Navigation">
        <a href="#home" class="nav-link active">Home</a>
        <a href="#about" class="nav-link">About</a>
        <a href="#skills" class="nav-link">Skills</a>
        <a href="#process" class="nav-link">Process</a>
        <a href="#projects" class="nav-link">Projects</a>
        <a href="#education" class="nav-link">Education</a>
        <a href="#achievements" class="nav-link">Achievements</a>
        <a href="#certifications" class="nav-link">Certifications</a>
        <a href="#contact" class="nav-link">Contact</a>
      </nav>"""

    nav_new = """      <!-- Desktop Navigation Links (Clean 6 Core Links) -->
      <nav class="nav-menu" role="navigation" aria-label="Main Navigation">
        <a href="#home" class="nav-link active">Home</a>
        <a href="#about" class="nav-link">About</a>
        <a href="#skills" class="nav-link">Skills</a>
        <a href="#process" class="nav-link">Process</a>
        <a href="#projects" class="nav-link">Projects</a>
        <a href="#contact" class="nav-link">Contact</a>
      </nav>"""

    html = html.replace(nav_old, nav_new)

    # 2. Update Hero Title to remove white box and use clean bold text
    hero_title_old = """          <h1 class="sepia-hero-title">
            Hi, I'm Kandukuri Jagan,<br>
            <span class="highlight-dark">Full Stack Developer</span>
          </h1>"""

    hero_title_new = """          <h1 class="sepia-hero-title">
            Hi, I'm Kandukuri<br>
            Jagan,<br>
            <span class="sepia-role-dark">Full Stack Developer</span>
          </h1>"""

    html = html.replace(hero_title_old, hero_title_new)

    # 3. Update Hero Buttons to match reference
    btn_group_old = """          <div class="sepia-hero-btn-group">
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
          </div>"""

    btn_group_new = """          <div class="sepia-hero-btn-group">
            <a href="#projects" class="sepia-btn-white">
              <span>View My Work</span>
            </a>
            <a href="#contact" class="sepia-btn-frosted">
              <span>Contact Me</span>
            </a>
            <a href="assets/resume.pdf" download="Kandukuri_Jagan_Resume.pdf" class="sepia-btn-outline" title="Download Official Resume PDF">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              <span>Download Resume</span>
            </a>
          </div>"""

    html = html.replace(btn_group_old, btn_group_new)

    # 4. Add Play Reel widget & Bottom Scroll Chevron
    if 'sepia-play-reel-btn' not in html:
        play_widget = """          <!-- Play Reel Interactive Widget -->
          <div class="sepia-play-reel-btn" title="Quick Profile Overview">
            <div class="play-reel-circle">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="6 3 20 12 6 21 6 3"></polygon></svg>
            </div>
            <span class="play-reel-label">PLAY REEL</span>
          </div>"""

        html = html.replace('<!-- Decorative 4-Point Twinkle Stars -->', play_widget + '\n\n          <!-- Decorative 4-Point Twinkle Stars -->')

    if 'sepia-scroll-down-chevron' not in html:
        scroll_down = """      <!-- Bouncing Scroll Down Chevron -->
      <a href="#about" class="sepia-scroll-down-chevron" aria-label="Scroll to About Section">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>
      </a>"""
        html = html.replace('<!-- Organic Seamless SVG Wave Divider transitioning to #about -->', scroll_down + '\n\n      <!-- Organic Seamless SVG Wave Divider transitioning to #about -->')

    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("Updated index.html alignments.")

if __name__ == '__main__':
    update_index_html()
