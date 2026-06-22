from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import math

app = Flask(__name__)
CORS(app)

GOOGLE_MAPS_API_KEY = "AIzaSyDsbABEhgA20vIbMHm6DEXlAaYtld9Wrl0"
PLACES_API_URL = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"

def haversine_distance(lat1, lng1, lat2, lng2):
    R = 6371000
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lng2 - lng1)

    a = math.sin(delta_phi/2)**2 + math.cos(phi1)*math.cos(phi2)*math.sin(delta_lambda/2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c

@app.route('/nearby-dentists', methods=['GET'])
def get_nearby_dentists():
    lat = request.args.get('lat', type=float)
    lng = request.args.get('lng', type=float)
    min_rating = request.args.get('min_rating', default=0, type=float)
    max_distance = request.args.get('max_distance', default=3000, type=int)

    if lat is None or lng is None:
        return jsonify({"error": "Missing lat or lng"}), 400

    params = {
        "key": GOOGLE_MAPS_API_KEY,
        "location": f"{lat},{lng}",
        "radius": max_distance,
        "type": "dentist"
    }

    response = requests.get(PLACES_API_URL, params=params)
    data = response.json()

    if data.get("status") not in ("OK", "ZERO_RESULTS", None):
        return jsonify({
            "error": data.get("error_message", f"Google Places error: {data.get('status')}"),
            "status": data.get("status")
        }), 502

    results = data.get("results", [])

    filtered_results = []
    for place in results:
        name = place.get("name")
        rating = place.get("rating", 0)
        address = place.get("vicinity", "N/A")
        loc = place["geometry"]["location"]
        lat2 = loc["lat"]
        lng2 = loc["lng"]

        distance = haversine_distance(lat, lng, lat2, lng2)

        opening_hours = place.get("opening_hours", {})
        open_now = opening_hours.get("open_now", None)

        if rating >= min_rating and distance <= max_distance:
            filtered_results.append({
                "name": name,
                "address": address,
                "rating": rating,
                "lat": lat2,
                "lng": lng2,
                "distance_m": round(distance, 2),
                "open_now": open_now
            })

    filtered_results.sort(key=lambda x: x["distance_m"])

    return jsonify(filtered_results)

if __name__ == '__main__':
    # Port 5001 to avoid clashing with the Node backend (which runs on 5000)
    app.run(debug=True, port=5001)
