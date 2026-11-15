# -*- coding: utf-8 -*-
"""
Update css/sepia-theme.css with pixel-perfect alignment rules.
"""

def update_css():
    with open('css/sepia-theme.css', 'r', encoding='utf-8') as f:
        css = f.read()

    alignment_rules = """
/* ==============================================================================
   REFINED ALIGNMENT & POLISH (Signature Sepia Portfolio Mirroring)
   ============================================================================== */

/* 1. Header: Transparent at top, frosted obsidian on scroll */
.site-header {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  width: 100% !important;
  height: 76px !important;
  background: transparent !important;
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08) !important;
  transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1) !important;
  z-index: 100 !important;
}

.site-header.scrolled {
  background: rgba(10, 10, 10, 0.88) !important;
  backdrop-filter: blur(16px) !important;
  -webkit-backdrop-filter: blur(16px) !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.12) !important;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.4) !important;
}

.nav-container {
  max-width: 1360px !important;
  margin: 0 auto !important;
  padding: 0 clamp(1.5rem, 4vw, 3rem) !important;
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
  height: 100% !important;
}

.brand-logo {
  display: flex !important;
  align-items: center !important;
  flex-shrink: 0 !important;
  white-space: nowrap !important;
  text-decoration: none !important;
}

.brand-logo .brand-monogram {
  display: none !important;
}

.brand-logo .sepia-text-logo {
  display: inline-flex !important;
  align-items: center !important;
  font-size: 1.35rem !important;
  font-weight: 900 !important;
  color: #ffffff !important;
  letter-spacing: -0.03em !important;
  white-space: nowrap !important;
}

.brand-logo .sepia-text-logo .sepia-logo-dot {
  color: #0a0a0a !important;
}

.nav-menu {
  display: flex !important;
  align-items: center !important;
  gap: clamp(1.2rem, 2vw, 2.2rem) !important;
  list-style: none !important;
  margin: 0 !important;
  padding: 0 !important;
}

.nav-link {
  font-size: 0.92rem !important;
  font-weight: 500 !important;
  color: rgba(255, 255, 255, 0.85) !important;
  text-decoration: none !important;
  white-space: nowrap !important;
  position: relative !important;
  padding: 0.4rem 0 !important;
  transition: color 0.2s ease !important;
}

.nav-link:hover,
.nav-link.active {
  color: #ffffff !important;
  font-weight: 600 !important;
}

.nav-link.active::after {
  content: "" !important;
  position: absolute !important;
  bottom: 0 !important;
  left: 0 !important;
  width: 100% !important;
  height: 2px !important;
  background: #ffffff !important;
  border-radius: 9999px !important;
}

.header-actions {
  display: flex !important;
  align-items: center !important;
  gap: 0.85rem !important;
  flex-shrink: 0 !important;
}

/* Hide theme toggle and duplicate resume button on desktop to prevent header crowding */
.header-actions .theme-toggle-btn,
.header-actions .btn-sm {
  display: none !important;
}

.btn-hire-me {
  display: inline-flex !important;
  align-items: center !important;
  gap: 0.35rem !important;
  white-space: nowrap !important;
  background: rgba(255, 255, 255, 0.15) !important;
  color: #ffffff !important;
  border: 1px solid rgba(255, 255, 255, 0.35) !important;
  border-radius: 9999px !important;
  padding: 0.6rem 1.6rem !important;
  font-size: 0.88rem !important;
  font-weight: 600 !important;
  text-decoration: none !important;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1) !important;
  backdrop-filter: blur(8px) !important;
  -webkit-backdrop-filter: blur(8px) !important;
}

.btn-hire-me:hover {
  background: #ffffff !important;
  color: #0a0a0a !important;
  border-color: #ffffff !important;
  transform: translateY(-2px) !important;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2) !important;
}

/* 2. Sleek Fixed Left Floating Social Bar */
.sepia-social-bar {
  position: fixed !important;
  left: 1.5rem !important;
  top: 50% !important;
  transform: translateY(-50%) !important;
  z-index: 90 !important;
  display: flex !important;
  flex-direction: column !important;
  gap: 0.65rem !important;
  background: rgba(0, 0, 0, 0.22) !important;
  backdrop-filter: blur(12px) !important;
  -webkit-backdrop-filter: blur(12px) !important;
  border: 1px solid rgba(255, 255, 255, 0.12) !important;
  padding: 0.65rem 0.45rem !important;
  border-radius: 9999px !important;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25) !important;
}

.sepia-social-link {
  width: 2.25rem !important;
  height: 2.25rem !important;
  border-radius: 50% !important;
  background: rgba(255, 255, 255, 0.08) !important;
  border: 1px solid rgba(255, 255, 255, 0.15) !important;
  color: #ffffff !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  transition: all 0.25s ease !important;
  text-decoration: none !important;
}

.sepia-social-link:hover {
  background: #0a0a0a !important;
  border-color: #ffffff !important;
  transform: scale(1.15) !important;
  color: #ffffff !important;
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.5) !important;
}

/* 3. Hero Section Alignment & Spacing */
.sepia-hero-section {
  position: relative !important;
  background-color: var(--sepia-red) !important;
  background: radial-gradient(circle at 75% 30%, #ff4d4d 0%, #ff2a2a 45%, #d91c1c 100%) !important;
  min-height: 100vh !important;
  display: flex !important;
  align-items: center !important;
  padding-top: 5rem !important;
  padding-bottom: 5rem !important;
  overflow: hidden !important;
}

.sepia-hero-container {
  max-width: 1360px !important;
  margin: 0 auto !important;
  padding-left: clamp(2rem, 7vw, 6.5rem) !important;
  padding-right: clamp(1.5rem, 4vw, 3rem) !important;
  display: grid !important;
  grid-template-columns: 1.15fr 0.85fr !important;
  align-items: center !important;
  gap: clamp(2.5rem, 4vw, 4.5rem) !important;
  position: relative !important;
  z-index: 10 !important;
  width: 100% !important;
}

.sepia-hero-content {
  position: relative !important;
  z-index: 2 !important;
}

.sepia-hero-badge {
  display: inline-flex !important;
  align-items: center !important;
  gap: 0.5rem !important;
  background: rgba(0, 0, 0, 0.35) !important;
  border: 1px solid rgba(255, 255, 255, 0.25) !important;
  color: #ffffff !important;
  padding: 0.45rem 1.15rem !important;
  border-radius: 9999px !important;
  font-size: 0.8rem !important;
  font-weight: 700 !important;
  letter-spacing: 0.08em !important;
  margin-bottom: 1.25rem !important;
  backdrop-filter: blur(8px) !important;
  -webkit-backdrop-filter: blur(8px) !important;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15) !important;
}

.sepia-hero-title {
  font-size: clamp(2.4rem, 4.5vw, 4.2rem) !important;
  font-weight: 800 !important;
  line-height: 1.08 !important;
  letter-spacing: -0.035em !important;
  color: #ffffff !important;
  margin-bottom: 1.5rem !important;
}

.sepia-hero-title span.sepia-role-dark {
  color: #0a0a0a !important;
  display: block !important;
  font-weight: 900 !important;
  margin-top: 0.35rem !important;
  letter-spacing: -0.04em !important;
  background: none !important;
  padding: 0 !important;
  border: none !important;
  box-shadow: none !important;
}

.sepia-hero-subtitle {
  font-size: 1.12rem !important;
  line-height: 1.65 !important;
  color: rgba(255, 255, 255, 0.92) !important;
  max-width: 580px !important;
  margin-bottom: 2rem !important;
}

/* 4. Sepia Hero Buttons */
.sepia-hero-btn-group {
  display: flex !important;
  align-items: center !important;
  flex-wrap: wrap !important;
  gap: 1rem !important;
  margin-top: 2rem !important;
}

.sepia-btn-white {
  background: #ffffff !important;
  color: #0a0a0a !important;
  font-weight: 700 !important;
  padding: 0.85rem 2rem !important;
  border-radius: 9999px !important;
  white-space: nowrap !important;
  text-decoration: none !important;
  display: inline-flex !important;
  align-items: center !important;
  gap: 0.5rem !important;
  font-size: 0.95rem !important;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1) !important;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15) !important;
  border: 1px solid transparent !important;
}

.sepia-btn-white:hover {
  background: #f4f4f5 !important;
  transform: translateY(-2px) !important;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.25) !important;
}

.sepia-btn-frosted {
  background: rgba(255, 255, 255, 0.18) !important;
  color: #ffffff !important;
  border: 1px solid rgba(255, 255, 255, 0.32) !important;
  backdrop-filter: blur(8px) !important;
  -webkit-backdrop-filter: blur(8px) !important;
  font-weight: 600 !important;
  padding: 0.85rem 1.85rem !important;
  border-radius: 9999px !important;
  white-space: nowrap !important;
  text-decoration: none !important;
  display: inline-flex !important;
  align-items: center !important;
  gap: 0.5rem !important;
  font-size: 0.95rem !important;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1) !important;
}

.sepia-btn-frosted:hover {
  background: rgba(255, 255, 255, 0.28) !important;
  border-color: rgba(255, 255, 255, 0.6) !important;
  transform: translateY(-2px) !important;
}

.sepia-btn-outline {
  background: transparent !important;
  color: #ffffff !important;
  border: 1px solid rgba(255, 255, 255, 0.4) !important;
  font-weight: 600 !important;
  padding: 0.85rem 1.85rem !important;
  border-radius: 9999px !important;
  white-space: nowrap !important;
  text-decoration: none !important;
  display: inline-flex !important;
  align-items: center !important;
  gap: 0.5rem !important;
  font-size: 0.95rem !important;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1) !important;
}

.sepia-btn-outline:hover {
  background: rgba(255, 255, 255, 0.12) !important;
  border-color: #ffffff !important;
  transform: translateY(-2px) !important;
}

/* 5. Play Reel Widget & Scroll Down Chevron */
.sepia-play-reel-btn {
  position: absolute !important;
  bottom: 2rem !important;
  right: 2.5rem !important;
  display: flex !important;
  align-items: center !important;
  gap: 0.75rem !important;
  cursor: pointer !important;
  z-index: 20 !important;
  color: #ffffff !important;
  transition: transform 0.25s ease !important;
}

.sepia-play-reel-btn:hover {
  transform: scale(1.05) !important;
}

.play-reel-circle {
  width: 44px !important;
  height: 44px !important;
  border-radius: 50% !important;
  background: #ffffff !important;
  color: #0a0a0a !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.25) !important;
  padding-left: 2px !important;
}

.play-reel-label {
  font-size: 0.78rem !important;
  font-weight: 800 !important;
  letter-spacing: 0.12em !important;
  color: #ffffff !important;
}

.sepia-scroll-down-chevron {
  position: absolute !important;
  bottom: 1.5rem !important;
  left: 50% !important;
  transform: translateX(-50%) !important;
  color: #ffffff !important;
  opacity: 0.8 !important;
  z-index: 20 !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  animation: sepiaChevronBounce 2s infinite !important;
  transition: opacity 0.2s ease !important;
}

.sepia-scroll-down-chevron:hover {
  opacity: 1 !important;
}

@keyframes sepiaChevronBounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateX(-50%) translateY(0);
  }
  40% {
    transform: translateX(-50%) translateY(-10px);
  }
  60% {
    transform: translateX(-50%) translateY(-5px);
  }
}

/* 6. Visual Card & Floating Badges */
.sepia-hero-visual-wrapper {
  position: relative !important;
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
  padding: 2rem 2.5rem !important;
}

.sepia-hero-card-desk {
  position: relative !important;
  width: 100% !important;
  max-width: 440px !important;
  border-radius: 28px !important;
  overflow: hidden !important;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.45) !important;
  background: #000000 !important;
  border: 2px solid rgba(255, 255, 255, 0.12) !important;
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1) !important;
}

.sepia-hero-card-desk:hover {
  transform: translateY(-8px) scale(1.02) !important;
}

.sepia-hero-portrait-img {
  width: 100% !important;
  height: 480px !important;
  object-fit: cover !important;
  object-position: center 15% !important;
  display: block !important;
}

.sepia-float-badge {
  position: absolute !important;
  display: inline-flex !important;
  align-items: center !important;
  gap: 0.5rem !important;
  background: rgba(10, 10, 10, 0.85) !important;
  backdrop-filter: blur(12px) !important;
  -webkit-backdrop-filter: blur(12px) !important;
  border: 1px solid rgba(255, 255, 255, 0.15) !important;
  padding: 0.55rem 1.15rem !important;
  border-radius: 9999px !important;
  color: #ffffff !important;
  font-size: 0.82rem !important;
  font-weight: 700 !important;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4) !important;
  z-index: 25 !important;
}

.sepia-float-badge.badge-top-left {
  top: 0.85rem !important;
  left: 0.85rem !important;
  animation: floatTop 4s ease-in-out infinite !important;
}

.sepia-float-badge.badge-bottom-right {
  bottom: 2.5rem !important;
  right: 0.85rem !important;
  animation: floatBottom 4.5s ease-in-out infinite !important;
}

/* 7. Tablet & Mobile Responsive */
@media (max-width: 992px) {
  .site-header {
    height: 70px !important;
    background: rgba(10, 10, 10, 0.88) !important;
    backdrop-filter: blur(16px) !important;
    -webkit-backdrop-filter: blur(16px) !important;
  }
  .nav-menu {
    display: none !important;
  }
  .mobile-nav-toggle {
    display: flex !important;
  }
  .sepia-social-bar {
    display: none !important;
  }
  .sepia-hero-container {
    grid-template-columns: 1fr !important;
    text-align: center !important;
    padding-left: 1.5rem !important;
    padding-right: 1.5rem !important;
    padding-top: 6rem !important;
    gap: 3rem !important;
  }
  .sepia-hero-badge {
    margin: 0 auto 1.25rem auto !important;
  }
  .sepia-hero-title {
    margin-left: auto !important;
    margin-right: auto !important;
  }
  .sepia-hero-subtitle {
    margin: 0 auto 2rem auto !important;
  }
  .sepia-hero-btn-group {
    justify-content: center !important;
  }
  .sepia-play-reel-btn {
    display: none !important;
  }
  .sepia-hero-card-desk {
    max-width: 360px !important;
  }
  .sepia-hero-portrait-img {
    height: 380px !important;
  }
}
"""

    with open('css/sepia-theme.css', 'w', encoding='utf-8') as f:
        f.write(css + '\n' + alignment_rules)

    print("Updated css/sepia-theme.css successfully.")

if __name__ == '__main__':
    update_css()
