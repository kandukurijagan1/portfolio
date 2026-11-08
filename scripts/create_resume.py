"""
Generate Professional PDF Resume for KANDUKURI JAGAN
Using ReportLab matching user's official resume specifications and authentic credentials.
"""
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
import os

pdf_path = os.path.join("assets", "resume.pdf")

doc = SimpleDocTemplate(
    pdf_path,
    pagesize=letter,
    rightMargin=34,
    leftMargin=34,
    topMargin=22,
    bottomMargin=22
)

styles = getSampleStyleSheet()

# Color Palette
PRIMARY_COLOR = colors.HexColor("#0f172a")   # Slate 900
ACCENT_COLOR = colors.HexColor("#3b82f6")    # Blue Accent
TEXT_MAIN = colors.HexColor("#1e293b")       # Slate 800
TEXT_MUTED = colors.HexColor("#475569")      # Slate 600
LINE_COLOR = colors.HexColor("#cbd5e1")      # Slate 300

# Typography Styles
name_style = ParagraphStyle(
    'Name',
    parent=styles['Normal'],
    fontName='Helvetica-Bold',
    fontSize=17,
    leading=21,
    textColor=PRIMARY_COLOR,
    alignment=1
)

contact_bar = ParagraphStyle(
    'ContactBar',
    parent=styles['Normal'],
    fontName='Helvetica',
    fontSize=8.2,
    leading=11,
    textColor=TEXT_MUTED,
    alignment=1
)

section_heading = ParagraphStyle(
    'SectionHeading',
    parent=styles['Normal'],
    fontName='Helvetica-Bold',
    fontSize=9.2,
    leading=11.5,
    textColor=PRIMARY_COLOR,
    spaceBefore=3,
    spaceAfter=2
)

item_title = ParagraphStyle(
    'ItemTitle',
    parent=styles['Normal'],
    fontName='Helvetica-Bold',
    fontSize=8.5,
    leading=11,
    textColor=TEXT_MAIN
)

item_right = ParagraphStyle(
    'ItemRight',
    parent=styles['Normal'],
    fontName='Helvetica-Bold',
    fontSize=8.2,
    leading=11,
    textColor=TEXT_MUTED,
    alignment=2
)

body_text = ParagraphStyle(
    'BodyText',
    parent=styles['Normal'],
    fontName='Helvetica',
    fontSize=7.8,
    leading=10,
    textColor=TEXT_MAIN
)

bullet_text = ParagraphStyle(
    'BulletText',
    parent=styles['Normal'],
    fontName='Helvetica',
    fontSize=7.6,
    leading=9.8,
    textColor=TEXT_MAIN,
    leftIndent=8
)

story = []

# Header
story.append(Paragraph("<b>KANDUKURI JAGAN</b>", name_style))
story.append(Spacer(1, 1.5))
story.append(Paragraph('<a href="mailto:kandukurijagan99@gmail.com" color="#475569">kandukurijagan99@gmail.com</a> | <a href="https://wa.me/918367047947" color="#475569">+91 8367047947</a> | Chennai, TN | LinkedIn: <a href="https://www.linkedin.com/in/jagan-kandukuri-053a0331b/" color="#2563eb">linkedin.com/in/jagan-kandukuri-053a0331b</a> | GitHub: <a href="https://github.com/kandukurijagan1?tab=repositories" color="#2563eb">github.com/kandukurijagan1</a>', contact_bar))
story.append(Spacer(1, 2.5))
story.append(HRFlowable(width="100%", thickness=1.5, color=ACCENT_COLOR, spaceAfter=3))

# Education
story.append(Paragraph("EDUCATION", section_heading))
story.append(HRFlowable(width="100%", thickness=0.5, color=LINE_COLOR, spaceAfter=2))
edu_data = [
    [
        Paragraph("<b>Saveetha University</b> — <i>Bachelor of Engineering (B.E) in Computer Science (3rd Year)</i>", item_title),
        Paragraph("Chennai, Tamil Nadu", item_right)
    ],
    [
        Paragraph("<b>CGPA: 9.04</b> | Registration ID: 192472374", item_title),
        Paragraph("Expected Graduation: May 2028", item_right)
    ]
]
t_edu = Table(edu_data, colWidths=[385, 159])
t_edu.setStyle(TableStyle([
    ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ('TOPPADDING', (0,0), (-1,-1), 0.5),
    ('BOTTOMPADDING', (0,0), (-1,-1), 0.5),
    ('LEFTPADDING', (0,0), (-1,-1), 0),
    ('RIGHTPADDING', (0,0), (-1,-1), 0),
]))
story.append(t_edu)
story.append(Spacer(1, 3))

# Profile Summary
story.append(Paragraph("PROFILE SUMMARY", section_heading))
story.append(HRFlowable(width="100%", thickness=0.5, color=LINE_COLOR, spaceAfter=2))
story.append(Paragraph("Third-year Computer Science undergraduate (<b>9.04 CGPA</b>) targeting <b>Full Stack Developer</b> roles and engineering internships. Proven leadership as <b>Main Tech Lead of Synora'26 Hackathon (80+ teams)</b> and multiple collegiate innovation achievements. Strong foundation across MERN stack (MongoDB, Express, React, Node.js), Python system design, and AI automation.", body_text))
story.append(Spacer(1, 3))

# Leadership & Key Achievements
story.append(Paragraph("KEY ACHIEVEMENTS & LEADERSHIP", section_heading))
story.append(HRFlowable(width="100%", thickness=0.5, color=LINE_COLOR, spaceAfter=2))
story.append(Paragraph("• <b>Main Tech Lead & Event Lead — Synora'26 Hackathon (80+ Teams):</b> Spearheaded the overall execution and technical architecture for ~80 competing teams (~350+ developers); architected and operated the 4 integrated event platforms: Registration Portal, Live Event QR Attendance, Multi-Judge Rubric Evaluation, and Automated PDF Certificate Distribution Engine.", bullet_text))
story.append(Paragraph("• <b>International Conference Research Paper Presenter:</b> Presented peer-reviewed research paper at the NAAC-sponsored <b>ICONSTEM 2025</b> International Conference hosted by Jeppiaar Engineering College (Nov 2025).", bullet_text))
story.append(Paragraph("• <b>National Level Paper Presentation — ThoughtSpark:</b> Presented technical paper at CHIPCOMM'26 hosted by R.M.K. Engineering College (Feb 2026).", bullet_text))
story.append(Paragraph("• <b>Lead, College Graphics Designing Team:</b> Directed collegiate branding, marketing creatives, and UI assets for university symposiums and flagship tech events (2024–Present).", bullet_text))
story.append(Spacer(1, 3))

# Projects
story.append(Paragraph("FEATURED PROJECTS", section_heading))
story.append(HRFlowable(width="100%", thickness=0.5, color=LINE_COLOR, spaceAfter=2))

# 1. AI Desktop Assistant
p1_head = [
    Paragraph("<b>AI Powered Real-Time Desktop Assistant</b> | <i>Python, SpeechRecognition, PyAudio, pyttsx3, DuckDuckGo, Telegram</i>", item_title),
    Paragraph("Nov 2025–Current", item_right)
]
t1 = Table([p1_head], colWidths=[424, 120])
t1.setStyle(TableStyle([('LEFTPADDING',(0,0),(-1,-1),0),('RIGHTPADDING',(0,0),(-1,-1),0),('TOPPADDING',(0,0),(-1,-1),0),('BOTTOMPADDING',(0,0),(-1,-1),0)]))
story.append(t1)
story.append(Paragraph("• Voice and text-driven AI assistant implementing live DuckDuckGo web search, intent parsing, OS system automation, and automated PDF report compilation dispatched to Telegram.", bullet_text))
story.append(Spacer(1, 2))

# 2. FishBilling System
p2_head = [
    Paragraph("<b>Aaryan Aqua Needs – Cloud GST Billing & Inventory Hub (v5.4 Pro)</b> | <i>Node.js, Express, Supabase, PostgreSQL, IndexedDB, Puppeteer, WhatsApp API</i>", item_title),
    Paragraph("Commercial Client", item_right)
]
t2 = Table([p2_head], colWidths=[424, 120])
t2.setStyle(TableStyle([('LEFTPADDING',(0,0),(-1,-1),0),('RIGHTPADDING',(0,0),(-1,-1),0),('TOPPADDING',(0,0),(-1,-1),0),('BOTTOMPADDING',(0,0),(-1,-1),0)]))
story.append(t2)
story.append(Paragraph("• First commercial client project deployed in production; engineered offline-first IndexedDB + Supabase PostgreSQL architecture, automated CGST/SGST/IGST tax engine, dynamic UPI QR checkouts, low-stock alerts, and automated WhatsApp PDF dispatch via Puppeteer.", bullet_text))
story.append(Spacer(1, 2))

# 3. Synora'26 Hackathon Suite
p3_head = [
    Paragraph("<b>Synora'26 Management Suite, Attendance & Certificate Systems</b> | <i>React, Node.js, MySQL, Dynamic QR</i>", item_title),
    Paragraph("2025–2026", item_right)
]
t3 = Table([p3_head], colWidths=[424, 120])
t3.setStyle(TableStyle([('LEFTPADDING',(0,0),(-1,-1),0),('RIGHTPADDING',(0,0),(-1,-1),0),('TOPPADDING',(0,0),(-1,-1),0),('BOTTOMPADDING',(0,0),(-1,-1),0)]))
story.append(t3)
story.append(Paragraph("• Engineered complete 4-platform hackathon ecosystem: team registration portal (80+ teams), dynamic QR attendance verification, multi-judge score normalization matrix, and automated cryptographic QR certificate generation with 1-click LinkedIn sharing.", bullet_text))
story.append(Spacer(1, 2))

# 4. Facial Based Crime Monitoring
p4_head = [
    Paragraph("<b>Facial-Based Crime Monitoring & Alert System (WhatsApp & Telegram)</b>", item_title),
    Paragraph("Python, OpenCV, AI", item_right)
]
t4 = Table([p4_head], colWidths=[424, 120])
t4.setStyle(TableStyle([('LEFTPADDING',(0,0),(-1,-1),0),('RIGHTPADDING',(0,0),(-1,-1),0),('TOPPADDING',(0,0),(-1,-1),0),('BOTTOMPADDING',(0,0),(-1,-1),0)]))
story.append(t4)
story.append(Paragraph("• Engineered automated surveillance and long age-gap biometric AI matching elderly individuals (~80y) from youth reference images (15–20y) across +54y age gaps; integrated with WhatsApp & Telegram for real-time suspect alert broadcasts, Thermal FLIR modes, and Section 65B legal FIR export.", bullet_text))
story.append(Spacer(1, 2))

# Verified Certifications & Honors
story.append(Paragraph("VERIFIED CERTIFICATIONS & ACCREDITATIONS (22 CREDENTIALS)", section_heading))
story.append(HRFlowable(width="100%", thickness=0.5, color=LINE_COLOR, spaceAfter=2))
story.append(Paragraph("• <b>Full Stack Python Programming:</b> Python Life (Kiran Sagar, Founding Member) — <i>Cert ID: PL-FSP-2026 (Jan 2026)</i>", bullet_text))
story.append(Paragraph("• <b>IEEE SDGthon 2K26:</b> 24-Hour Online Hackathon — IEEE Student Branch & SDG Cell, Panimalar Eng. College (Mar 2026)", bullet_text))
story.append(Paragraph("• <b>National Mathematics Day Award:</b> Gujarat Technological University (GTU-ITR) — <i>Cert No: GTU-ITR/NMD/2025/1073</i>", bullet_text))
story.append(Paragraph("• <b>AI & Domain Hackathons:</b> INNOBYTE AI Hackathon (SIMATS), CODEVOLT (Nanobiomaterials), UnsaidTalks (AI Evaluator, Emotion Encryption)", bullet_text))
story.append(Paragraph("• <b>Collegiate Competitions:</b> 1st / Verified Honors in Technical Quiz, Paper Presentation, Poster Design, and Collegiate Hackathon", bullet_text))
story.append(Spacer(1, 3))

# Technical Skills
story.append(Paragraph("TECHNICAL SKILLS", section_heading))
story.append(HRFlowable(width="100%", thickness=0.5, color=LINE_COLOR, spaceAfter=2))
skills_data = [
    [Paragraph("<b>Programming Languages:</b>", item_title), Paragraph("Python, Java, JavaScript (ES6+), C, C++, SQL, Swift (iOS), HTML5, CSS3", body_text)],
    [Paragraph("<b>Frameworks & Web:</b>", item_title), Paragraph("React.js, Node.js, Express.js, MongoDB (MERN), Flask, Redux Toolkit, Appwrite, Bootstrap, REST APIs", body_text)],
    [Paragraph("<b>Developer Tools & Methodologies:</b>", item_title), Paragraph("Git, GitHub, AWS, MySQL, Android Studio, PyCharm, VS Code, ReportLab, Agile / Scrum, Linux", body_text)]
]
skills_table = Table(skills_data, colWidths=[140, 404])
skills_table.setStyle(TableStyle([
    ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ('TOPPADDING', (0,0), (-1,-1), 0.8),
    ('BOTTOMPADDING', (0,0), (-1,-1), 0.8),
    ('LEFTPADDING', (0,0), (-1,-1), 0),
    ('RIGHTPADDING', (0,0), (-1,-1), 0),
]))
story.append(skills_table)

doc.build(story)
print(f"Successfully generated {pdf_path}")
