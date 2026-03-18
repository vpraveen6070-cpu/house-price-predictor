/**
 * chart.js — Chart.js integration for Price vs Area graph
 */

let priceChart = null;

/**
 * Initialize or update the Price vs Area chart
 * @param {Array} data - Array of { x, y } points
 * @param {string} locationName - Display name for the location
 * @param {number} currentArea - Highlighted current area point
 * @param {number} currentPrice - Highlighted current price
 */
function initPriceChart(data, locationName, currentArea, currentPrice) {
  const ctx = document.getElementById("priceChart");
  if (!ctx) return;

  const labels = data.map(d => d.x + " sqft");
  const values = data.map(d => d.y);

  // Gradient fill
  const canvas = ctx;
  const chartCtx = canvas.getContext("2d");
  const gradient = chartCtx.createLinearGradient(0, 0, 0, 400);
  gradient.addColorStop(0, "rgba(99, 102, 241, 0.6)");
  gradient.addColorStop(1, "rgba(99, 102, 241, 0.02)");

  // Highlight current input point
  const pointColors = data.map(d =>
    Math.abs(d.x - currentArea) < 200 ? "#f59e0b" : "rgba(99, 102, 241, 0.8)"
  );
  const pointSizes = data.map(d =>
    Math.abs(d.x - currentArea) < 200 ? 10 : 5
  );

  const chartData = {
    labels,
    datasets: [
      {
        label: `${locationName} — Sale Price (₹)`,
        data: values,
        borderColor: "#6366f1",
        backgroundColor: gradient,
        borderWidth: 3,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: pointColors,
        pointRadius: pointSizes,
        pointHoverRadius: 8,
      },
    ],
  };

  const config = {
    type: "line",
    data: chartData,
    options: {
      responsive: true,
      animation: {
        duration: 1200,
        easing: "easeInOutQuart",
      },
      interaction: {
        intersect: false,
        mode: "index",
      },
      plugins: {
        legend: {
          labels: {
            color: getComputedStyle(document.documentElement)
              .getPropertyValue("--text-primary")
              .trim() || "#f9fafb",
            font: { size: 13, family: "'Inter', sans-serif" },
          },
        },
        tooltip: {
          backgroundColor: "rgba(17, 24, 39, 0.95)",
          titleColor: "#6366f1",
          bodyColor: "#e5e7eb",
          borderColor: "#6366f1",
          borderWidth: 1,
          padding: 12,
          callbacks: {
            label: function (context) {
              const val = context.parsed.y;
              return " " + window.HousePriceLogic.formatINR(val);
            },
          },
        },
      },
      scales: {
        x: {
          grid: { color: "rgba(255,255,255,0.06)" },
          ticks: {
            color: "#9ca3af",
            font: { size: 11 },
          },
        },
        y: {
          grid: { color: "rgba(255,255,255,0.06)" },
          ticks: {
            color: "#9ca3af",
            font: { size: 11 },
            callback: function (value) {
              return window.HousePriceLogic.formatINR(value);
            },
          },
        },
      },
    },
  };

  if (priceChart) {
    priceChart.destroy();
  }

  priceChart = new Chart(ctx, config);
}

window.HousePriceChart = { initPriceChart };
