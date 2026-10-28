# Web Development Level 2 - Modern Browser Calculator

A modern, responsive, and intuitive browser-based calculator built using pure **HTML5**, **CSS3 (Grid & Flexbox)**, and **Vanilla JavaScript**.

---

## 🌟 Feature Checklist

- [x] **Display Screen**: Dual-line display showing real-time expression history and current operand/result.
- [x] **Numeric & Decimal Buttons**: Numbers `0` through `9` with single decimal point (`.`) validation.
- [x] **Core Arithmetic Operators**: Addition (`+`), subtraction (`−`), multiplication (`×`), and division (`÷`).
- [x] **Equals (`=`) Evaluation**: Accurate calculation adhering to mathematical operator precedence (BODMAS/PEMDAS).
- [x] **Clear (`C` / `AC`) Button**: Contextual clear button (clears current entry when typing or resets entire calculation).
- [x] **Backspace / Delete (`DEL`)**: Removes the last character or undoes an operator to re-edit previous operands.
- [x] **Division-by-Zero Protection**: Gracefully catches division by zero and displays `"Cannot divide by zero"` without crashing.
- [x] **Operator Chaining**: Supports seamless sequential operations (e.g., `5 + 3 × 2 = 11`) and continuous chaining from previous results.
- [x] **CSS Grid Layout**: Grid-aligned button interface designed with fluid responsiveness across desktop and mobile.
- [x] **Pure Event Listeners**: Modern event-driven architecture using `addEventListener` with zero inline `onclick` attributes.
- [x] **Keyboard Shortcuts**: Complete desktop keyboard navigation support with visual press animations.
- [x] **Extra Utilities**: Includes Sign Toggle (`±`) and Percentage calculation (`%`).

---

## ⌨️ Keyboard Shortcuts

| Key | Calculator Action |
| :--- | :--- |
| `0` – `9` | Enter digit |
| `.` | Enter decimal point |
| `+` | Addition |
| `-` | Subtraction |
| `*` | Multiplication |
| `/` | Division |
| `Enter` or `=` | Calculate result (Equals) |
| `Backspace` | Delete last character (Backspace) |
| `Escape` or `C` / `c` | Clear / All Clear |
| `%` | Calculate percentage |

---

## 📂 Project Structure

```text
WebDev-L2-Calculator/
├── index.html       # Semantic HTML5 markup with accessible ARIA attributes
├── style.css        # CSS Grid layout, dark glassmorphism styling & animations
├── script.js        # Vanilla JS calculation engine and event listeners
└── README.md        # Project documentation
```

---

## 🚀 How to Run

1. Open `index.html` directly in any modern web browser (Google Chrome, Mozilla Firefox, Microsoft Edge, Safari).
2. Alternatively, serve with any local HTTP server (such as VS Code Live Server or `python -m http.server 8000`).

