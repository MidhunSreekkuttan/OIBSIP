# Dr. A. P. J. Abdul Kalam — Tribute Page
> **Level 2 Web Development Task | Oasis Infobyte Summer Internship Program (OIBSIP)**  
> Built with HTML5, CSS3, and Vanilla JavaScript.

![License](https://img.shields.io/badge/License-MIT-blue.svg)
![Status](https://img.shields.io/badge/Status-Completed-success.svg)
![Responsive](https://img.shields.io/badge/Design-Fully%20Responsive-orange.svg)

---

## 📖 Project Overview

This project is a dedicated tribute page honouring **Dr. Avul Pakir Jainulabdeen Abdul Kalam** (1931–2015), affectionately known as *“The Missile Man of India”* and *“The People's President.”*

The tribute highlights his early life in Rameswaram, his pioneering aerospace and defense leadership at ISRO and DRDO, his historic presidency, his transformative publications, and his tireless dedication to mentoring young minds.

---

## ✅ Feature Checklist Compliance

| Feature Requirement | Status | Implementation Details |
|---|:---:|---|
| **Page title with name & one-line tagline** | Completed | Header title `<title>` & Hero banner: *"Dr. A. P. J. Abdul Kalam &bull; The Missile Man of India & The People's President"* |
| **Prominent royalty-free image** | Completed | Official portrait sourced from [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:A._P._J._Abdul_Kalam.jpg) (Public Domain) with a fallback SVG illustration |
| **Biography (3–4 paragraphs original content)** | Completed | 4 in-depth paragraphs covering: Early Life & Rameswaram, Aerospace & Defense Leadership, The People's Presidency, and His Eternal Legacy as a Teacher |
| **Timeline or key achievements section** | Completed | Both included: (1) 6-card Key Achievements Grid, and (2) Interactive Chronological Timeline with category filtering |
| **Quote block styled distinctly** | Completed | Large featured quote with decorative watermark and gold accent border, plus an interactive "Inspire Me" quote carousel |
| **At least 2 background colours across sections** | Completed | **9 distinct thematic backgrounds**: Cosmic Navy hero, Obsidian quote banner, Crisp warm slate biography, Midnight navy achievements, Soft slate timeline, Dark slate quote box, Pure white books showcase, Blue ribbon banner, and Deep night footer |
| **At least 2 font styles explored** | Completed | **Serif**: *Playfair Display* & *Cinzel* for headings, quotes, and milestone dates; **Sans-serif**: *Inter* for body text, navigation, and badges |
| **Responsive layout** | Completed | Mobile-first architecture, flexible CSS Grid & Flexbox, smooth collapsing timeline on screens `< 768px`, and full touch navigation |

---

## 🎨 Design System & Palette

- **Primary Colors**: Deep Cosmic Blue (`#0B132B`, `#1E3A8A`), Midnight Slate (`#0F172A`)
- **Accent Colors**: Radiant Warm Gold (`#F59E0B`, `#FBBF24`, `#D97706`)
- **Neutrals**: Crisp Warm White (`#FFFFFF`, `#F8FAFC`, `#F1F5F9`)
- **Typography**:
  - Headings & Blockquotes: `'Playfair Display'`, serif; `'Cinzel'`, serif
  - Body & UI Controls: `'Inter'`, sans-serif
- **Contrast & Accessibility**: Meets WCAG AA contrast standards; includes skip-to-content link, semantic HTML5 elements (`<article>`, `<figure>`, `<blockquote>`, `<time>`), and accessible ARIA attributes.

---

## ⚡ Interactive Enhancements

1. **Light / Dark Theme Toggle**: Easily toggle between dark and light modes, automatically saved to `localStorage` with system preference auto-detection.
2. **Interactive Quote Carousel**: Click *"✨ Inspire Me (Next Quote)"* to cycle through notable maxims or click *"📋 Copy Quote"* to copy to your clipboard with a confirmation toast.
3. **Timeline Category Filter**: Filter historical milestones by *All*, *Space & Defense*, *National Leadership*, or *Youth & Legacy*.
4. **Scroll Spy Navigation**: Active menu item highlights automatically as you scroll down the page.
5. **Back to Top Button**: Smooth scroll-to-top floating button appearing after scrolling past 450px.
6. **Network-Resilient Image Fallback**: In the event of offline viewing, an artistic inline SVG portrait automatically loads so the layout remains pristine.

---

## 📂 Project Structure

```
WebDev-L2-TributePage/
├── index.html        # Main semantic HTML5 document
├── css/
│   └── style.css     # CSS3 styles, variables, typography, and responsive media queries
├── js/
│   └── script.js     # Vanilla JavaScript for interactions, theme, and filters
└── README.md         # Documentation and project overview
```

---

## 🚀 How to Run

1. Clone or open this repository directory.
2. Simply double-click `index.html` or open it with any modern web browser (Google Chrome, Mozilla Firefox, Microsoft Edge, Safari).
3. Alternatively, launch with VS Code Live Server or any local static HTTP server:
   ```bash
   npx serve .
   ```

---

## 📜 Credits & Attributions

- **Subject**: Dr. A. P. J. Abdul Kalam (1931–2015)
- **Portrait Photograph**: [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:A._P._J._Abdul_Kalam.jpg) — Public Domain.
- **Biographical References**: *Wings of Fire* (1999), *Ignited Minds* (2002), and public educational records.
- **Fonts**: [Google Fonts](https://fonts.google.com/) (*Playfair Display*, *Cinzel*, *Inter*).
- **Icons**: Unicode & native inline vector SVGs.

