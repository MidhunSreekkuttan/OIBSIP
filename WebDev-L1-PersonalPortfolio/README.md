# Midhun M — Personal Portfolio

A modern, responsive personal portfolio website built with HTML, CSS, and JavaScript to showcase my skills, introduce myself as a developer, and connect with potential collaborators and employers.

## ✨ Features

- **Modern dark UI** — A sleek interface with gradient accents, glowing backgrounds, and glassmorphism effects.
- **Responsive design** — Optimized layouts for desktops, tablets, and mobile devices.
- **Interactive hero section** — Developer profile card, animated orbits, floating skill badges, and social links.
- **About section** — An introduction to my development interests, goals, and approach to building web applications.
- **Skills showcase** — Dedicated cards highlighting my technical skills and tools.
- **Contact section** — Quick access to email, GitHub, and LinkedIn.
- **Mobile navigation** — Responsive menu with keyboard and outside-click support.
- **Lucide icons** — Clean, lightweight interface icons with fallback SVG rendering.
- **Subtle animations** — Hover effects, floating elements, animated gradients, and glowing accents.
- **Accessibility considerations** — Semantic HTML, accessible navigation labels, visible keyboard focus, and reduced-motion support.
- **Dynamic copyright year** — Automatically updates the footer year using JavaScript.
- **SEO basics** — Page title, description, and theme-color metadata.

## 🛠️ Technologies Used

| Technology | Purpose |
|---|---|
| HTML5 | Semantic page structure |
| CSS3 | Styling, layouts, animations, and responsiveness |
| JavaScript | Mobile navigation, icon rendering, and dynamic content |
| Lucide | Interface icons |
| Google Fonts | DM Sans and Space Grotesk typography |
| Git & GitHub | Version control and project hosting |

## 📁 Project Structure

```text
WebDev-L1-PersonalPortfolio/
│
├── index.html    # Main portfolio page
├── style.css     # Styles, layouts, and animations
├── script.js     # Interactions and JavaScript functionality
└── README.md     # Project documentation
```

## 🚀 Getting Started

### Prerequisites

- A modern web browser.
- A code editor such as Visual Studio Code.
- The Live Server extension for VS Code (recommended).

### Installation

**1. Clone the repository**

Replace the placeholder below with your actual repository URL.

```bash
git clone <your-repository-url>
```

**2. Navigate to the project folder**

```bash
cd WebDev-L1-PersonalPortfolio
```

**3. Run the project**

Open `index.html` directly in your browser, or open the project in VS Code and select **Open with Live Server**.

No build tools, package installation, or backend server are required.

> **Note:** Google Fonts and the Lucide CDN require an internet connection. The included SVG fallback supports the icons defined in `script.js`, but the fonts will use their fallback fonts when offline.

## 🎨 Customization

Make the following changes before publishing the portfolio.

### 1. Update your personal information

Edit `index.html` to customize:

- Your name and professional title.
- Your introduction and About section.
- Your technical skills.
- Your availability status.
- Your social profile links.

### 2. Add your email address

Find the placeholder `your-email@example.com` in the Contact section of `index.html`.

Replace it in both the `href` and the visible text:

```html
<a href="mailto:yourname@example.com">
  yourname@example.com
</a>
```

Use your actual email address in place of the example above.

### 3. Update the design

Modify `style.css` to change the colors, typography, spacing, card styles, animations, and responsive breakpoints.

The CSS custom properties inside `:root` provide a central place to adjust the theme.

### 4. Update social links

Replace the GitHub and LinkedIn URLs in `index.html` with your preferred profile links.

### 5. Personalize the profile illustration

The current profile card uses CSS shapes to create a stylized developer avatar. Its appearance can be customized in `style.css`, or you can replace the illustration with a real profile photograph.

## 🌐 Deployment

This is a static website, so it can be hosted using services such as:

- **GitHub Pages** — Host the portfolio directly from a GitHub repository.
- **Netlify** — Deploy by connecting your GitHub repository or uploading the project files.
- **Vercel** — Deploy the project as a static site.

### Deploy using GitHub Pages

1. Push your project to a GitHub repository.
2. Open the repository on GitHub.
3. Navigate to **Settings → Pages**.
4. Under the build and deployment settings, choose **Deploy from a branch**.
5. Select your branch (usually `main`) and the root folder (`/`).
6. Save the settings and wait for the deployment to complete.
7. Open the published URL provided by GitHub Pages.

Make sure `index.html` is located in the selected publishing directory.

## 📱 Responsive Design

The stylesheet includes responsive breakpoints for different screen sizes.

- **Desktop:** Two-column hero layout and three-column skills grid.
- **Tablet:** Stacked hero layout and two-column skills grid.
- **Mobile:** Collapsible navigation, single-column skill cards, and full-width action buttons.

The design also includes a reduced-motion preference to minimize animations for users who request less motion.

## 🔮 Future Improvements

Potential enhancements for future versions include:

- [ ] Add a dedicated Projects section with live demos and source code.
- [ ] Add a downloadable resume.
- [ ] Add a working contact form with backend integration.
- [ ] Add project filtering by technology.
- [ ] Replace the CSS avatar with a personal photograph.
- [ ] Add SEO improvements and social sharing metadata.
- [ ] Optimize performance and test accessibility across browsers.
- [ ] Add analytics to understand portfolio traffic.

## 👨‍💻 About Me

I'm Midhun M, a developer interested in building modern, responsive web applications. I enjoy learning new technologies, solving practical problems, and improving my ability to write clean, maintainable code.

I'm continually developing my skills in JavaScript, React, Node.js, and database-driven application development.

### Connect with Me

- **GitHub:** [MidhunSreekkuttan](https://github.com/MidhunSreekkuttan)
- **LinkedIn:** [Midhun Sreekkuttan](https://linkedin.com/in/midhun-sreekkuttan)

## 📄 License

This project is intended for personal portfolio and learning purposes. If you plan to distribute or reuse it publicly, consider adding a `LICENSE` file that clearly defines the permissions for reuse.

---

*Designed and built with care by Midhun M.*