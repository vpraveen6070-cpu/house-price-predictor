/**
 * app.js — Main UI controller: form handling, dark mode, localStorage history
 */

document.addEventListener("DOMContentLoaded", () => {
  initDarkMode();
  initNavbar();
  initToggle();
  initForm();
  loadHistory();
  initOwlCarousel();
  initScrollReveal();
});

/* ===== DARK MODE ===== */
function initDarkMode() {
  const btn = document.getElementById("darkModeBtn");
  const root = document.documentElement;
  const saved = localStorage.getItem("hp-darkmode");

  if (saved === "dark" || (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
    root.classList.add("dark");
    if (btn) btn.innerHTML = `<i class="fa-solid fa-sun"></i>`;
  }

  if (btn) {
    btn.addEventListener("click", () => {
      root.classList.toggle("dark");
      const isDark = root.classList.contains("dark");
      btn.innerHTML = isDark
        ? `<i class="fa-solid fa-sun"></i>`
        : `<i class="fa-solid fa-moon"></i>`;
      localStorage.setItem("hp-darkmode", isDark ? "dark" : "light");
    });
  }
}

/* ===== NAVBAR ===== */
function initNavbar() {
  const navbar = document.getElementById("navbar");
  const hamburger = document.getElementById("hamburgerBtn");
  const navMenu = document.getElementById("navMenu");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 60) {
      navbar?.classList.add("scrolled");
    } else {
      navbar?.classList.remove("scrolled");
    }
  });

  hamburger?.addEventListener("click", () => {
    navMenu?.classList.toggle("open");
    hamburger.classList.toggle("active");
  });

  document.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", () => {
      navMenu?.classList.remove("open");
      hamburger?.classList.remove("active");
    });
  });

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener("click", e => {
      const target = document.querySelector(a.getAttribute("href"));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });
}

/* ===== SALE / RENT TOGGLE ===== */
function initToggle() {
  const toggleBtns = document.querySelectorAll(".toggle-btn");
  toggleBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      toggleBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
    });
  });
}

function getActiveMode() {
  const active = document.querySelector(".toggle-btn.active");
  return active ? active.dataset.mode : "sale";
}

/* ===== FORM ===== */
function initForm() {
  const form = document.getElementById("predictorForm");
  const rangeArea = document.getElementById("areaRange");
  const areaInput = document.getElementById("area");
  const rangeAge = document.getElementById("ageRange");
  const ageInput = document.getElementById("age");

  // Sync range <-> number inputs for area
  rangeArea?.addEventListener("input", () => { areaInput.value = rangeArea.value; });
  areaInput?.addEventListener("input", () => { rangeArea.value = areaInput.value; });

  // Sync range <-> number inputs for age
  rangeAge?.addEventListener("input", () => { ageInput.value = rangeAge.value; });
  ageInput?.addEventListener("input", () => { rangeAge.value = ageInput.value; });

  form?.addEventListener("submit", e => {
    e.preventDefault();
    handlePredict();
  });
}

/* ===== PREDICTION HANDLER ===== */
function handlePredict() {
  const area = parseInt(document.getElementById("area").value);
  const bedrooms = parseInt(document.getElementById("bedrooms").value);
  const bathrooms = parseInt(document.getElementById("bathrooms").value);
  const location = document.getElementById("location").value;
  const age = parseInt(document.getElementById("age").value);
  const mode = getActiveMode();

  // Validate
  if (!area || area < 100 || area > 20000) {
    showToast("Please enter a valid area (100–20,000 sqft)", "error");
    return;
  }
  if (bedrooms < 1 || bathrooms < 1) {
    showToast("Bedrooms and bathrooms must be at least 1", "error");
    return;
  }

  // Show spinner
  showSpinner(true);

  // Simulate AI "thinking" delay for UX
  setTimeout(() => {
    const result = window.HousePriceLogic.predictPrice({ area, bedrooms, bathrooms, location, age, mode });
    showSpinner(false);
    displayResult(result, mode, { area, bedrooms, bathrooms, location, age });
    updateChart(result, location, bedrooms, bathrooms, age, area);
    saveToHistory(result, { area, bedrooms, bathrooms, location, age, mode });
    document.getElementById("resultSection")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 1200);
}

/* ===== RESULT DISPLAY ===== */
function displayResult(result, mode, inputs) {
  const section = document.getElementById("resultSection");
  if (!section) return;
  section.classList.remove("hidden");
  section.classList.add("result-appear");

  const priceEl = document.getElementById("salePriceDisplay");
  const rentEl = document.getElementById("rentPriceDisplay");
  const dealEl = document.getElementById("dealTag");
  const psfEl = document.getElementById("pricePerSqFt");
  const locEl = document.getElementById("resultLocation");

  if (priceEl) animateValue(priceEl, 0, result.salePrice, 800, window.HousePriceLogic.formatINR);
  if (rentEl) animateValue(rentEl, 0, result.rentPrice, 800, v => `${window.HousePriceLogic.formatINR(v)}/mo`);

  if (dealEl) {
    dealEl.textContent = result.dealLabel;
    dealEl.className = "deal-tag";
    dealEl.classList.add(`deal-${result.dealTag}`);
  }

  if (psfEl) psfEl.textContent = `${window.HousePriceLogic.formatINR(result.pricePerSqFt)}/sqft`;
  if (locEl) locEl.textContent = `📍 ${result.locationName}`;

  // Extra Insights
  const yieldEl = document.getElementById('yieldRate');
  const gradeEl = document.getElementById('investGrade');
  const paybackEl = document.getElementById('paybackPeriod');
  const location = document.getElementById('location').value;
  const locData = window.HousePriceLogic?.LOCATION_DATA?.[location];

  if (locData && yieldEl) {
    const y = (locData.rentYield * 100).toFixed(1);
    yieldEl.textContent = `${y}% p.a.`;
    if (gradeEl) {
      gradeEl.textContent = parseFloat(y) > 3 ? '⭐ High Yield' : '✅ Stable';
      gradeEl.style.color = parseFloat(y) > 3 ? '#fbbf24' : '#10b981';
    }
    if (paybackEl) paybackEl.textContent = `~${Math.round(1 / locData.rentYield)} years`;
  }

  // Hide empty state
  const emptyState = document.getElementById('emptyState');
  if (emptyState) emptyState.style.display = 'none';
}

/* ===== CHART UPDATE ===== */
function updateChart(result, location, bedrooms, bathrooms, age, currentArea) {
  const data = window.HousePriceLogic.generateChartData(location, bedrooms, bathrooms, age);
  const locData = window.HousePriceLogic.LOCATION_DATA[location] || window.HousePriceLogic.LOCATION_DATA["other"];
  window.HousePriceChart.initPriceChart(data, locData.name, currentArea, result.salePrice);
}

/* ===== SPINNER ===== */
function showSpinner(show) {
  const spinner = document.getElementById("loadingSpinner");
  const btn = document.getElementById("predictBtn");
  if (spinner) spinner.classList.toggle("hidden", !show);
  if (btn) {
    btn.disabled = show;
    btn.innerHTML = show
      ? `<span class="spinner-inline"></span> Analyzing...`
      : `<i class="fa-solid fa-wand-magic-sparkles"></i> Predict Price`;
  }
}

/* ===== ANIMATE NUMBER ===== */
function animateValue(el, start, end, duration, formatter) {
  const range = end - start;
  const startTime = performance.now();
  function step(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = formatter(Math.floor(start + range * eased));
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

/* ===== LOCAL STORAGE HISTORY ===== */
function saveToHistory(result, inputs) {
  const history = JSON.parse(localStorage.getItem("hp-history") || "[]");
  const entry = {
    id: Date.now(),
    timestamp: new Date().toLocaleString("en-IN"),
    inputs,
    salePrice: result.salePrice,
    rentPrice: result.rentPrice,
    dealTag: result.dealTag,
    dealLabel: result.dealLabel,
    locationName: result.locationName,
  };
  history.unshift(entry);
  if (history.length > 10) history.pop();
  localStorage.setItem("hp-history", JSON.stringify(history));
  renderHistory(history);
}

function loadHistory() {
  const history = JSON.parse(localStorage.getItem("hp-history") || "[]");
  renderHistory(history);
}

function renderHistory(history) {
  const container = document.getElementById("historyList");
  if (!container) return;

  if (history.length === 0) {
    container.innerHTML = `<p class="history-empty">No predictions yet. Try the predictor above!</p>`;
    return;
  }

  container.innerHTML = history
    .map(
      entry => `
    <div class="history-card glass-card animate-fade-in">
      <div class="history-header">
        <span class="history-location">${entry.locationName}</span>
        <span class="deal-tag deal-${entry.dealTag} deal-small">${entry.dealLabel}</span>
      </div>
      <div class="history-details">
        <span><i class="fa-solid fa-maximize"></i> ${entry.inputs.area} sqft</span>
        <span><i class="fa-solid fa-bed"></i> ${entry.inputs.bedrooms} BHK</span>
        <span><i class="fa-solid fa-bath"></i> ${entry.inputs.bathrooms} Bath</span>
      </div>
      <div class="history-prices">
        <span class="price-label">Sale: <strong>${window.HousePriceLogic.formatINR(entry.salePrice)}</strong></span>
        <span class="price-label">Rent: <strong>${window.HousePriceLogic.formatINR(entry.rentPrice)}/mo</strong></span>
      </div>
      <span class="history-time">${entry.timestamp}</span>
    </div>
  `
    )
    .join("");
}

function clearHistory() {
  localStorage.removeItem("hp-history");
  renderHistory([]);
  showToast("History cleared!", "success");
}

/* ===== TOAST ===== */
function showToast(message, type = "info") {
  let toast = document.getElementById("toastNotification");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toastNotification";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.className = `toast toast-${type} show`;
  setTimeout(() => toast.classList.remove("show"), 3500);
}

/* ===== SCROLL REVEAL SYSTEM ===== */
function initScrollReveal() {
  const revealElements = document.querySelectorAll(".reveal");
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("reveal-active");
        // Optionally unobserve if we only want it to reveal once
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15, // Trigger when 15% of element is visible
    rootMargin: "0px 0px -50px 0px" // Slight offset for better feel
  });

  revealElements.forEach(el => observer.observe(el));
}

/* ===== OWL FEATURES PSEUDO CAROUSEL ===== */
function initOwlCarousel() {
  // Simple feature card scroll cycling
}

// Expose clear history globally for button onclick
window.clearHistory = clearHistory;
