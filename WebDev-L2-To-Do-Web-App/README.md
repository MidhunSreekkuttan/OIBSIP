# TaskMaster — Interactive To-Do Web Application

An intuitive, responsive, and feature-packed To-Do Web Application built with **HTML5**, **CSS3**, **Vanilla JavaScript**, and **Lucide Icons**. Developed for the **Oasis Infobyte (OIBSIP) Web Development Internship — Level 2 Task**.

---

## 🌟 Live Demo & Overview

TaskMaster helps users organize their daily workflow effortlessly by separating tasks into **Pending** and **Completed** sections with real-time statistics, inline editing, priority categorization, timestamps, light & dark themes, and crisp **Lucide Icons**.

---

## 📋 Features Checklist

- [x] **Add Tasks**: Text input field with an **"Add Task"** button and `Enter` key support.
- [x] **Organized Lists**: Distinct **Pending Tasks** and **Completed Tasks** sections.
- [x] **Immediate Rendering**: Newly added tasks appear immediately at the top of the Pending list.
- [x] **Mark Complete Toggle**: Seamlessly move tasks between Pending and Completed with custom accessible checkboxes.
- [x] **Inline Editing**: Click the Edit (`pencil`) button or the task title to modify text and priority inline with Save (`Enter`) and Cancel (`Esc`) controls.
- [x] **Delete Functionality**: Permanently remove tasks from either list with smooth exit animations and Lucide `trash-2` icons.
- [x] **Dynamic Task Counters**: Real-time `"X pending"` and `"Y completed"` badges prominently displayed in list headers.
- [x] **Timestamps (Bonus)**: Relative & absolute timestamps showing when each task was created (`Added Today at 10:30 AM`) with `clock` icon and completed (`Done Today at 10:45 AM`) with `check-check` icon.
- [x] **Data Persistence (Bonus)**: All tasks, status changes, and user preferences are automatically saved in browser `localStorage`.
- [x] **Friendly Empty States**: Meaningful empty state Lucide illustrations (`clipboard-list`, `trophy`) and messages when lists or search queries have no tasks.
- [x] **Lucide Icons Integration**: Clean, modern Lucide icons used throughout the app with offline SVG fallback resilience.
- [x] **Dark / Light Mode**: Instant theme switching (`sun` / `moon` icons) with persistent theme preference and system preference auto-detection.
- [x] **Search & Priority Filter**: Real-time instant search bar (`search` icon) and priority filter (`🔥 High`, `⚡ Medium`, `🌱 Low`).
- [x] **Toast Notifications**: Micro-interactions with feedback alerts for all major user actions.
- [x] **Fully Responsive**: Mobile-first fluid design that adapts seamlessly from smartphones to 4K desktop screens.

---

## 🛠️ Tech Stack

- **HTML5**: Semantic tags (`<header>`, `<main>`, `<section>`, `<form>`, `<aside>`, `<footer>`), accessible ARIA attributes.
- **CSS3**: CSS Custom Properties (Variables), Flexbox, CSS Grid, keyframe micro-animations, light/dark color themes.
- **JavaScript (ES6+)**: Vanilla JS, event delegation, DOM manipulation, local storage API, error handling. Zero framework dependencies.
- **Lucide Icons**: Standard open-source icon suite loaded via CDN with built-in offline SVG fallback dictionary.

---

## 📁 File Structure

```text
WebDev-L2-To-Do-Web-App/
├── index.html        # Semantic HTML5 layout & accessible structure with Lucide CDN
├── styles.css        # Responsive CSS3 styles, theme system & Lucide icon scaling
├── app.js            # Vanilla JavaScript application logic, localStorage & Lucide renderer
└── README.md         # Documentation & project guide
```

---

## 🚀 Getting Started

No build tools, bundlers, or package managers are required!

### Option 1: Direct Browser Launch
Simply double-click `index.html` or drag and drop it into any modern web browser (Chrome, Edge, Firefox, Safari).

### Option 2: Local Development Server
Using Python (built-in):
```bash
python -m http.server 8000
```
Or using Node.js:
```bash
npx serve
```
Then visit `http://localhost:8000` in your web browser.

---

## 💡 Keyboard Shortcuts

| Shortcut | Context | Action |
| :--- | :--- | :--- |
| `Enter` | Add task input | Submits and adds the new task |
| `Enter` | Inline editing input | Saves task modifications |
| `Escape` | Inline editing input | Cancels editing without saving |

---

## 👨‍💻 Author & Acknowledgement

Developed as part of the **Oasis Infobyte Internship Program (OIBSIP)** — Web Development & Designing.
