// For testing puroposes, you may need to change these places to something closer to you
const places = [
    { name: "The Marshall Rochester", latitude: 43.0635, longitude: 77.6584 },
    { name: "Charge Point", latitude: 43.06444454331844, longitude: -77.6844609744161 },
];

const fetchPlacesFromOSM = async (latitude, longitude) => {
    // For testing puroposes, you may need to increase the radius and/or change the API query
    // For example, you can try "amenity"="cafe"
    const radius = 1000; // radius in meters
    const query = `
        [out:json];
        node["historic"="monument"](around:${radius},${latitude},${longitude});
        out;
    `;

    const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch POIs from OpenStreetMap");

        const data = await response.json();

        const places = data.elements.map(el => ({
            name: el.tags.name || "Unknown Attraction",
            latitude: el.lat,
            longitude: el.lon
        }));

        loadPlaces(places);
    } catch (error) {
        console.error("Error fetching POIs:", error);
        alert("Failed to load POIs. Please try again.");
    }
};

const loadPlaces = (places) => {
    const scene = document.querySelector("a-scene");

    places.forEach(place => {
        const entity = document.createElement("a-entity");

        entity.setAttribute("gps-entity-place", `latitude: ${place.latitude}; longitude: ${place.longitude}`);
        entity.setAttribute("geometry", "primitive: sphere");
        entity.setAttribute("material", "color: blue");

        const text = document.createElement("a-text");
        text.setAttribute("value", place.name);
        text.setAttribute("align", "center");
        text.setAttribute("position", "0 2 0");
        entity.appendChild(text);

        entity.addEventListener("click", () => alert(`You clicked on: ${place.name}`));

        scene.appendChild(entity);
    });
};

window.onload = () => {
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            fetchPlacesFromOSM(latitude, longitude);
        },
        (error) => {
            console.error("Geolocation error:", error);
            alert("Failed to get location. Please enable location services.");
        }
    );
};