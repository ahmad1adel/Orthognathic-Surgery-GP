// Places API (New) — the legacy nearbysearch endpoint is not available on new projects
const PLACES_API_URL = "https://places.googleapis.com/v1/places:searchNearby";

// Great-circle distance between two coordinates, in meters
const haversineDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371000;
  const toRad = (d) => (d * Math.PI) / 180;
  const dPhi = toRad(lat2 - lat1);
  const dLambda = toRad(lng2 - lng1);
  const phi1 = toRad(lat1);
  const phi2 = toRad(lat2);
  const a =
    Math.sin(dPhi / 2) ** 2 +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(dLambda / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// @desc    Find dentists near a coordinate (proxies Google Places, keeps key server-side)
// @route   GET /api/places/nearby-dentists?lat=&lng=&min_rating=&max_distance=
// @access  Public
export const getNearbyDentists = async (req, res) => {
  try {
    const lat = parseFloat(req.query.lat);
    const lng = parseFloat(req.query.lng);
    const minRating = parseFloat(req.query.min_rating) || 0;
    const maxDistance = parseInt(req.query.max_distance, 10) || 3000;

    if (Number.isNaN(lat) || Number.isNaN(lng)) {
      return res.status(400).json({ error: "Missing lat or lng" });
    }

    const key = process.env.GOOGLE_MAPS_API_KEY;
    if (!key) {
      return res
        .status(500)
        .json({ error: "Google Maps API key not configured on the server" });
    }

    const response = await fetch(PLACES_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": key,
        // Only request the fields we use (FieldMask is required by the new API)
        "X-Goog-FieldMask":
          "places.displayName,places.formattedAddress,places.rating,places.location,places.currentOpeningHours.openNow",
      },
      body: JSON.stringify({
        includedTypes: ["dentist"],
        maxResultCount: 20,
        locationRestriction: {
          circle: {
            center: { latitude: lat, longitude: lng },
            radius: Math.min(maxDistance, 50000),
          },
        },
      }),
    });

    const json = await response.json();

    if (!response.ok) {
      return res.status(502).json({
        error: json.error?.message || `Google Places error (${response.status})`,
        status: json.error?.status,
      });
    }

    const results = json.places || [];

    const dentists = results
      .map((place) => {
        const loc = place.location || {};
        return {
          name: place.displayName?.text || "Unknown",
          address: place.formattedAddress || "N/A",
          rating: place.rating || 0,
          lat: loc.latitude,
          lng: loc.longitude,
          distance_m:
            Math.round(haversineDistance(lat, lng, loc.latitude, loc.longitude) * 100) / 100,
          open_now: place.currentOpeningHours?.openNow ?? null,
        };
      })
      .filter((p) => p.rating >= minRating && p.distance_m <= maxDistance)
      .sort((a, b) => a.distance_m - b.distance_m);

    return res.json(dentists);
  } catch (error) {
    console.error("Places error:", error);
    return res.status(500).json({ error: "Failed to fetch nearby dentists" });
  }
};
