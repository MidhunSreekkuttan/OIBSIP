# 🌡️ Interactive Temperature Converter (WebDev-L1)

An interactive, responsive, and robust web tool designed to convert temperature values seamlessly between **Celsius (°C)**, **Fahrenheit (°F)**, and **Kelvin (K)**, featuring real-time input validation, scientific boundary enforcement (absolute zero violations), and simultaneous multi-unit output.

Built as part of the **OIBSIP Web Development Internship (Level 1 - Task 01)**.

---

## 🚀 Live Demo & Preview

- **Interface:** Modern dark glassmorphism / slate theme with dynamic thermal state badges (Cryogenic, Freezing, Moderate, Warm, Extreme Heat).
- **Tech Stack:** Semantic HTML5, Modern Responsive CSS3, Vanilla JavaScript (ES6+).

---

## ✨ Features Checklist

- [x] **Numeric Input with Validation**:
  - Validates in real time.
  - Rejects empty, non-numeric, or malformed inputs with clear error messages.
  - Supports positive, negative, and decimal values (e.g. `25`, `-10.5`, `.75`, `+30`).
- [x] **Source Unit Selector**:
  - Dropdown menu allowing selection of Celsius (°C), Fahrenheit (°F), or Kelvin (K).
  - Dynamically updates the unit indicator inside the text input.
- [x] **Target Unit & Multi-Unit Simultaneous View**:
  - Target Unit selector allowing focused single conversion or "All Units (Simultaneous)".
  - Multi-card grid showing converted values in Celsius, Fahrenheit, and Kelvin side-by-side with scientific descriptions.
- [x] **Unit Swap Button**:
  - Quick-switch button with smooth rotation animation to swap source and target units instantly.
- [x] **Convert Button & Enter Key Trigger**:
  - Dedicated "Convert" button triggering calculations with tactile active feedback.
  - Form handles `Enter` key presses natively.
- [x] **Edge Case & Absolute Zero Handling**:
  - Protects against scientifically impossible temperatures below absolute zero:
    - **Celsius:** `< -273.15 °C`
    - **Fahrenheit:** `< -459.67 °F`
    - **Kelvin:** `< 0 K`
  - Displays user-friendly, informative warning messages explaining why values cannot drop below thermodynamic absolute zero.
- [x] **Formulas & Step Explanation**:
  - Displays the exact mathematical formula used for the conversion in real time.
- [x] **Thermal State Indicator**:
  - Dynamic badge indicating temperature classification (*Cryogenic*, *Freezing*, *Moderate*, *Warm*, or *Extreme Heat*).
- [x] **Quick Physical Benchmarks**:
  - Interactive shortcut pills for rapid testing (*Absolute Zero*, *Freezing Point*, *Human Body*, *Boiling Point*).
- [x] **Copy to Clipboard**:
  - One-click copy button with instant feedback to copy results.
- [x] **Reset Functionality**:
  - One-click reset button clearing inputs, errors, and resetting the UI cleanly.
- [x] **Clean, Centered UI Layout**:
  - Fully centered, accessible, and responsive across mobile, tablet, and desktop screens.

---

## 📐 Scientific Conversion Formulas

| From \ To | Celsius (°C) | Fahrenheit (°F) | Kelvin (K) |
| :--- | :--- | :--- | :--- |
| **Celsius (°C)** | $C$ | $(C \times \frac{9}{5}) + 32$ | $C + 273.15$ |
| **Fahrenheit (°F)** | $(F - 32) \times \frac{5}{9}$ | $F$ | $(F - 32) \times \frac{5}{9} + 273.15$ |
| **Kelvin (K)** | $K - 273.15$ | $(K - 273.15) \times \frac{9}{5} + 32$ | $K$ |

### Physical Limits (Absolute Zero)
- **Celsius:** $-273.15 \text{ °C}$
- **Fahrenheit:** $-459.67 \text{ °F}$
- **Kelvin:** $0 \text{ K}$

---

## 📁 Project Structure

```text
WebDev-L1-TemperatureConverterWebsite/
├── index.html       # Semantic HTML5 markup and accessible form structure
├── style.css        # Responsive CSS3 styling with CSS variables and glassmorphism
├── script.js        # Vanilla JavaScript conversion logic, validation & event handlers
└── README.md        # Comprehensive documentation
```

---

## 💻 How to Run Locally

No external build tools, bundlers, or dependencies are required.

1. Clone or navigate to the project directory:
   ```bash
   cd WebDev-L1-TemperatureConverterWebsite
   ```
2. Open `index.html` in any modern web browser (Chrome, Edge, Firefox, Safari):
   - Double-click `index.html`, or
   - Using VS Code: Right-click `index.html` → **Open with Live Server**, or
   - Using Python: `python -m http.server 8000` and visit `http://localhost:8000`.

---

## 🛡️ Input Validation & Error Handling Scenarios

| Scenario | Input | Behavior / Feedback |
| :--- | :--- | :--- |
| **Valid Numeric** | `100` (°C) | Displays `212 °F` and `373.15 K`, shows formula and "Extreme Heat" badge. |
| **Empty Input** | `""` | Shows error: *"Please enter a temperature value."* |
| **Non-Numeric Characters** | `abc` or `25a` | Shows error: *"Invalid input. Please enter a valid number (e.g., 25, -10.5)."* |
| **Absolute Zero Violation** | `-300` (°C) | Shows warning: *"Absolute Zero Violation: -300 °C is below absolute zero (-273.15 °C)..."* |
| **Negative Decimals** | `-17.8` (°C) | Accurately calculates `~0 °F` and `255.35 K`. |

---

## 🤝 Acknowledgments
Developed for the **Oasis Infobyte Internship Program (OIBSIP)** in Web Development & Designing.

