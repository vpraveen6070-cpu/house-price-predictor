/**
 * logic.js — Price calculation engine for House Price Predictor
 */

// Location multipliers (Indian cities, ₹ per sq ft base)
const LOCATION_DATA = {
  mumbai:     { name: "Mumbai",     multiplier: 28000, rentYield: 0.026 },
  delhi:      { name: "Delhi",      multiplier: 18000, rentYield: 0.028 },
  bangalore:  { name: "Bangalore",  multiplier: 16000, rentYield: 0.030 },
  hyderabad:  { name: "Hyderabad",  multiplier: 12000, rentYield: 0.032 },
  chennai:    { name: "Chennai",    multiplier: 11000, rentYield: 0.031 },
  pune:       { name: "Pune",       multiplier: 10000, rentYield: 0.033 },
  kolkata:    { name: "Kolkata",    multiplier: 8500,  rentYield: 0.034 },
  ahmedabad:  { name: "Ahmedabad",  multiplier: 7500,  rentYield: 0.035 },
  jaipur:     { name: "Jaipur",     multiplier: 6500,  rentYield: 0.036 },
  other:      { name: "Other",      multiplier: 5000,  rentYield: 0.038 },
};

/**
 * Main price predictor engine
 * @param {Object} inputs - { area, bedrooms, bathrooms, location, age, mode }
 * @returns {Object} - { salePrice, rentPrice, dealTag, dealScore }
 */
function predictPrice(inputs) {
  const { area, bedrooms, bathrooms, location, age } = inputs;

  const locData = LOCATION_DATA[location] || LOCATION_DATA["other"];
  const basePerSqFt = locData.multiplier;

  // --- Base price calculation ---
  let basePrice = area * basePerSqFt;

  // Bedroom premium (each bedroom adds 4% above 1 BHK)
  const bedroomFactor = 1 + (bedrooms - 1) * 0.04;

  // Bathroom premium (each bathroom adds 2.5%)
  const bathroomFactor = 1 + (bathrooms - 1) * 0.025;

  // Age depreciation: -1.5% per year, max -35%
  const ageFactor = Math.max(1 - age * 0.015, 0.65);

  let salePrice = basePrice * bedroomFactor * bathroomFactor * ageFactor;

  // Add slight randomness (±3%) to feel realistic
  const noise = 1 + (Math.random() * 0.06 - 0.03);
  salePrice = Math.round(salePrice * noise);

  // Monthly rent
  const annualRent = salePrice * locData.rentYield;
  const rentPrice = Math.round(annualRent / 12);

  // --- Deal Classification ---
  const dealInfo = classifyDeal(area, salePrice, basePerSqFt, age);

  return {
    salePrice,
    rentPrice,
    dealTag: dealInfo.tag,
    dealLabel: dealInfo.label,
    dealScore: dealInfo.score,
    locationName: locData.name,
    pricePerSqFt: Math.round(salePrice / area),
  };
}

/**
 * Classify the deal as Good Deal, Fair Price, or Overpriced
 */
function classifyDeal(area, salePrice, basePerSqFt, age) {
  const actualPSF = salePrice / area;
  const expected = basePerSqFt * Math.max(1 - age * 0.015, 0.65);
  const ratio = actualPSF / expected;

  if (ratio < 0.92) {
    return { tag: "good", label: "Good Deal ✅", score: ratio };
  } else if (ratio < 1.08) {
    return { tag: "fair", label: "Fair Price ⚖️", score: ratio };
  } else {
    return { tag: "overpriced", label: "Overpriced ❌", score: ratio };
  }
}

/**
 * Generate chart data points: price vs area for given location/params
 */
function generateChartData(location, bedrooms, bathrooms, age) {
  const locData = LOCATION_DATA[location] || LOCATION_DATA["other"];
  const areas = [500, 750, 1000, 1250, 1500, 1750, 2000, 2500, 3000, 3500, 4000];

  const bedroomFactor = 1 + (bedrooms - 1) * 0.04;
  const bathroomFactor = 1 + (bathrooms - 1) * 0.025;
  const ageFactor = Math.max(1 - age * 0.015, 0.65);

  return areas.map(a => ({
    x: a,
    y: Math.round(a * locData.multiplier * bedroomFactor * bathroomFactor * ageFactor),
  }));
}

/**
 * Format number as Indian currency string
 */
function formatINR(amount) {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Cr`;
  } else if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)} L`;
  } else {
    return `₹${amount.toLocaleString("en-IN")}`;
  }
}

// Export for use in other modules
window.HousePriceLogic = {
  predictPrice,
  generateChartData,
  formatINR,
  LOCATION_DATA,
};
