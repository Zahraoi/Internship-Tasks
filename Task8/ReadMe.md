# JavaScript Tasks (Practice)

A collection of six JavaScript mini-projects built with **Tailwind CSS**, presented in a single-page tabbed interface with a soft lavender/purple theme.

---

## Projects Included

### 01 — Carousel Slider
An image carousel with auto-play, prev/next navigation, and clickable thumbnail navigation.

**Features:**
- Auto-advances every 3 seconds
- Prev / Next arrow buttons
- Clickable thumbnail strip to jump to any slide
- Auto-play resets when user manually navigates

---

### 02 — Calculator
A fully functional calculator supporting basic arithmetic operations.

**Features:**
- Addition, subtraction, multiplication, division
- Chained operations (e.g. 5 + 3 × 2)
- Backspace and clear buttons
- Full keyboard support (`0–9`, `+`, `-`, `*`, `/`, `Enter`, `Backspace`, `Escape`)
- Division by zero error handling

---

### 03 — Digital Clock
A real-time clock that updates every second.

**Features:**
- Displays live hours, minutes, and seconds
- Shows current day, month, and full date below the clock

---

### 04 — Temperature Converter
A bidirectional temperature converter between Celsius and Fahrenheit.

**Features:**
- Type in either field — the other updates instantly
- Swap button (⇄) to flip conversion direction
- Formula label updates to match current mode

---

### 05 — Password Generator
A flexible password generator with custom input support.

**Features:**
- Type your **own custom password** and use the Copy button
- Or auto-generate with configurable options:
  - Uppercase letters (A–Z)
  - Lowercase letters (a–z)
  - Numbers (0–9)
  - Special characters (!@#$…)
- Adjustable length slider (8–64 characters)
- Visual strength meter (Weak / Fair / Strong / Very Strong)
- Copy-to-clipboard button with confirmation feedback

---

### Bonus — To-Do List
A persistent to-do app that survives page refreshes.

**Features:**
- Add tasks with a button or by pressing `Enter`
- Mark tasks as complete with a checkbox
- Edit tasks inline (click ✎, press `Enter` or `Escape`)
- Delete individual tasks
- Filter by **All / Active / Done**
- Clear all completed tasks at once
- Task count ("X remaining") updates live
- Data saved to **localStorage** — persists after refresh

---


## File Structure

```
project/
├── index.html   — All HTML markup and Tailwind classes
├── script.js    — All JavaScript logic
└── README.md    — This file
```

---

## How to Run

1. Download both `index.html` and `script.js` into the **same folder**
2. Open `index.html` in a browser

> **Note:** Do not open `index.html` alone without `script.js` in the same folder — the page will not function. For best results use a local server such as the **VS Code Live Server** extension.

---

## Author

**Umam Zahra**

---

##  License

This project is created for **educational and practice purposes only.
