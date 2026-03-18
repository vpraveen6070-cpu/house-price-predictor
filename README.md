# 🏠 PropSense AI — House Price Predictor

A **premium, fully responsive** House Price Predictor web app built with pure **HTML, CSS, and JavaScript**. Get instant AI-powered sale price and rent estimates for Indian real estate with beautiful glassmorphism UI.

---

## 🚀 Live Features

| Feature | Description |
|---|---|
| 🤖 AI Price Engine | Location multipliers, age depreciation, room premiums |
| 📊 Animated Charts | Chart.js Price vs Area curves with gradient fill |
| 🏷️ Deal Classification | Good Deal ✅ / Fair Price ⚖️ / Overpriced ❌ |
| 🌙 Dark Mode | Toggle with LocalStorage persistence |
| 📜 Prediction History | Last 10 predictions saved locally |
| 📱 Responsive | Mobile, tablet, and desktop support |
| ⚡ Animations | Page load, spinner, number counter, floats |
| 🗺️ Map Placeholder | City coverage section |

---

## 📁 Project Structure

```
house-price-predictor/
├── index.html             # Main page
├── README.md              # Documentation
├── css/
│   ├── style.css          # Design system + components
│   └── animations.css     # Keyframes + utility classes
├── js/
│   ├── logic.js           # Price calculation engine
│   ├── chart.js           # Chart.js integration
│   └── app.js             # UI controller + dark mode + history
├── assets/
│   ├── images/            # Hero & property images
│   └── icons/             # SVG icons (bed, bath, location)
└── components/
    ├── navbar.html         # Navbar component (reference)
    └── footer.html         # Footer component (reference)
```

---

## 🏙️ Supported Cities

| City | Base ₹/sqft | Rent Yield |
|---|---|---|
| Mumbai | ₹28,000 | 2.6% |
| Delhi NCR | ₹18,000 | 2.8% |
| Bangalore | ₹16,000 | 3.0% |
| Hyderabad | ₹12,000 | 3.2% |
| Chennai | ₹11,000 | 3.1% |
| Pune | ₹10,000 | 3.3% |
| Kolkata | ₹8,500 | 3.4% |
| Ahmedabad | ₹7,500 | 3.5% |
| Jaipur | ₹6,500 | 3.6% |

---

## 🧠 Price Formula

```
Sale Price = Area × Base(₹/sqft) × BedroomFactor × BathroomFactor × AgeFactor

BedroomFactor  = 1 + (bedrooms - 1) × 0.04
BathroomFactor = 1 + (bathrooms - 1) × 0.025
AgeFactor      = max(1 - age × 0.015, 0.65)

Monthly Rent   = (Sale Price × rentYield) / 12

Deal Classification:
  actualPSF / expectedPSF < 0.92  → Good Deal ✅
  actualPSF / expectedPSF < 1.08  → Fair Price ⚖️
  else                             → Overpriced ❌
```

---

## 🛠️ Local Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/vpraveen6070-cpu/house-price-predictor.git
   cd house-price-predictor
   ```
2. **Open the project:**
   Open `index.html` in any modern browser. No build tools or dependencies are required!

```bash
# Optional: Serve with a local server
npx serve house-price-predictor
# or
python -m http.server 8080
```

---

## 🎨 Tech Stack

- **HTML5** — Semantic structure
- **CSS3** — Glassmorphism, CSS Variables, Flexbox/Grid
- **Vanilla JavaScript** — Modular ES6 code
- **Chart.js 4** — Animated data visualization
- **Font Awesome 6** — Icons
- **Google Fonts** — Inter + Space Grotesk

---

## 📱 Screenshots

> Hero section with animated floating cards, glassmorphism predictor form, animated results, Chart.js visualization, property showcase, and prediction history.

---

## 📄 License

MIT License — Free to use, modify, and distribute.

---

*Built with ❤️ — PropSense AI, 2026*
