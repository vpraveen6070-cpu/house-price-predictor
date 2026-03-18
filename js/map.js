/**
 * map.js — Interactive India Map logic using Leaflet.js
 */

document.addEventListener("DOMContentLoaded", () => {
    initMap();
});

function initMap() {
    const mapContainer = document.getElementById("map");
    if (!mapContainer) return;

    // India Coordinates: [20.5937, 78.9629]
    // Zoom: 5 is good for overview
    const map = L.map("map", {
        center: [22.5, 78.5],
        zoom: 4.8,
        zoomControl: true,
        scrollWheelZoom: false,
        attributionControl: false
    });

    // Dark Matter Tiles (CartoDB)
    // Alternatives: Stadia.AlidadeSmoothDark
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19
    }).addTo(map);

    // City Coordinates Mapping
    const CITY_COORDS = {
        mumbai: [19.0760, 72.8777],
        delhi: [28.6139, 77.2090],
        bangalore: [12.9716, 77.5946],
        hyderabad: [17.3850, 78.4867],
        chennai: [13.0827, 80.2707],
        pune: [18.5204, 73.8567],
        kolkata: [22.5726, 88.3639],
        ahmedabad: [23.0225, 72.5714],
        jaipur: [26.9124, 75.7873]
    };

    // Add Markers from HousePriceLogic
    const locationData = window.HousePriceLogic?.LOCATION_DATA || {};

    Object.keys(CITY_COORDS).forEach(key => {
        const cityInfo = locationData[key];
        const coords = CITY_COORDS[key];

        if (cityInfo && coords) {
            // Custom Marker Icon
            const icon = L.divIcon({
                className: 'custom-div-icon',
                html: `<div class="map-marker-inner"><i class="fa-solid fa-location-dot"></i></div>`,
                iconSize: [40, 40],
                iconAnchor: [20, 20]
            });

            const marker = L.marker(coords, { icon: icon }).addTo(map);

            // Popup Layout
            const popupContent = `
                <div style="text-align: center;">
                    <h4 style="margin: 0 0 8px 0; font-family: 'Space Grotesk', sans-serif; font-size: 1.1rem; color: var(--primary-light);">${cityInfo.name}</h4>
                    <div style="display: flex; flex-direction: column; gap: 4px; font-size: 0.85rem;">
                        <div style="display: flex; justify-content: space-between; gap: 15px;">
                            <span style="color: var(--text-muted);">Avg Rate:</span>
                            <span style="font-weight: 700;">₹${cityInfo.multiplier.toLocaleString('en-IN')}/sqft</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; gap: 15px;">
                            <span style="color: var(--text-muted);">Rent Yield:</span>
                            <span style="font-weight: 700; color: #10b981;">${(cityInfo.rentYield * 100).toFixed(1)}%</span>
                        </div>
                    </div>
                    <button onclick="document.getElementById('location').value='${key}'; document.getElementById('predictor').scrollIntoView({behavior: 'smooth'})" 
                            style="margin-top: 12px; width: 100%; padding: 6px; border-radius: 6px; background: var(--gradient-primary); color: white; border: none; font-size: 0.75rem; font-weight: 600; cursor: pointer;">
                        Select City
                    </button>
                </div>
            `;

            marker.bindPopup(popupContent);
        }
    });

    // Handle Window Resize
    window.addEventListener('resize', () => {
        map.invalidateSize();
    });
}
