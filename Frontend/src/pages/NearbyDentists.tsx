import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Star, Navigation as NavIcon, Loader2 } from 'lucide-react';
import { loadGoogleMaps } from '@/lib/googleMaps';
import { useAuthGate } from '@/contexts/AuthGate';

interface Dentist {
  name: string;
  address: string;
  rating: number;
  lat: number;
  lng: number;
  distance_m: number;
  open_now: boolean | null;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const DEFAULT_CENTER = { lat: 30.0444, lng: 31.2357 }; // Cairo

const NearbyDentists: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const google = useRef<any>(null);
  const markers = useRef<any[]>([]);
  const userMarker = useRef<any>(null);
  const directionsService = useRef<any>(null);
  const directionsRenderer = useRef<any>(null);

  const [dentists, setDentists] = useState<Dentist[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { requireAuth } = useAuthGate();

  // Initialise the map once
  useEffect(() => {
    let cancelled = false;
    loadGoogleMaps()
      .then((g) => {
        if (cancelled || !mapRef.current) return;
        google.current = g;
        map.current = new g.maps.Map(mapRef.current, {
          zoom: 12,
          center: DEFAULT_CENTER,
          mapTypeControl: false,
          streetViewControl: false,
        });
        directionsService.current = new g.maps.DirectionsService();
        directionsRenderer.current = new g.maps.DirectionsRenderer({ suppressMarkers: true });
        directionsRenderer.current.setMap(map.current);
      })
      .catch(() => setError('Could not load Google Maps. Please check the API key.'));
    return () => {
      cancelled = true;
    };
  }, []);

  const clearMarkers = () => {
    markers.current.forEach((m) => m.setMap(null));
    markers.current = [];
    directionsRenderer.current?.set('directions', null);
  };

  const drawRoute = (destLat: number, destLng: number, origin: { lat: number; lng: number }) => {
    directionsService.current?.route(
      { origin, destination: { lat: destLat, lng: destLng }, travelMode: 'DRIVING' },
      (result: any, status: string) => {
        if (status === 'OK') directionsRenderer.current.setDirections(result);
      }
    );
  };

  const search = () => {
    setError('');
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }
    if (!map.current) {
      setError('Map is still loading, please try again in a moment.');
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const userLocation = { lat: position.coords.latitude, lng: position.coords.longitude };
        const g = google.current;
        try {
          map.current.setCenter(userLocation);
          map.current.setZoom(14);

          userMarker.current?.setMap(null);
          userMarker.current = new g.maps.Marker({
            position: userLocation,
            map: map.current,
            title: 'You are here',
            icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
          });

          clearMarkers();

          const res = await fetch(
            `${API_URL}/places/nearby-dentists?lat=${userLocation.lat}&lng=${userLocation.lng}&min_rating=3.5&max_distance=3000`
          );
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || 'Failed to load dentists');

          setDentists(data);
          if (!data.length) {
            setError('No nearby dentists found within 3 km.');
            return;
          }

          data.forEach((place: Dentist) => {
            const iconUrl =
              place.open_now === true
                ? 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
                : place.open_now === false
                ? 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
                : 'http://maps.google.com/mapfiles/ms/icons/grey-dot.png';

            const marker = new g.maps.Marker({
              position: { lat: place.lat, lng: place.lng },
              map: map.current,
              title: place.name,
              icon: iconUrl,
            });

            const statusText =
              place.open_now === true ? '🟢 Open Now' : place.open_now === false ? '🔴 Closed' : '⚪ Unknown';

            const infowindow = new g.maps.InfoWindow({
              content: `<strong>${place.name}</strong><br>${place.address}<br>Rating: ${place.rating} ⭐<br>Distance: ${place.distance_m} m<br>${statusText}`,
            });

            marker.addListener('click', () => {
              infowindow.open(map.current, marker);
              drawRoute(place.lat, place.lng, userLocation);
            });

            markers.current.push(marker);
          });

          drawRoute(data[0].lat, data[0].lng, userLocation);
        } catch (e) {
          setError(e instanceof Error ? e.message : 'Something went wrong.');
        } finally {
          setLoading(false);
        }
      },
      () => {
        setLoading(false);
        setError('Location permission denied. Please allow location access to find clinics near you.');
      }
    );
  };

  const handleSearch = () => requireAuth(search);

  const focusClinic = (index: number) => {
    const place = dentists[index];
    if (!map.current || !place) return;
    map.current.setCenter({ lat: place.lat, lng: place.lng });
    map.current.setZoom(16);
    google.current?.maps.event.trigger(markers.current[index], 'click');
  };

  const statusLabel = (open: boolean | null) =>
    open === true ? 'Open now' : open === false ? 'Closed' : 'Hours unknown';

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-3">Find Nearby Dentists</h1>
          <p className="text-muted-foreground">
            Discover dental clinics around you with ratings, distance and directions.
          </p>
        </div>

        <div className="flex justify-center mb-8">
          <Button onClick={handleSearch} disabled={loading} size="lg" className="gap-2">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <NavIcon className="h-4 w-4" />}
            {loading ? 'Searching…' : 'Find dentists near me'}
          </Button>
        </div>

        {error && (
          <div className="mb-6 text-center text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg py-3 px-4 max-w-2xl mx-auto">
            {error}
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Map */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div ref={mapRef} className="h-[500px] w-full bg-secondary" />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar list */}
          <div className="space-y-4 lg:max-h-[500px] lg:overflow-y-auto lg:pr-1">
            {dentists.length === 0 ? (
              <Card>
                <CardContent className="py-10 text-center text-muted-foreground">
                  <MapPin className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>Click “Find dentists near me” to see clinics around you.</p>
                </CardContent>
              </Card>
            ) : (
              dentists.map((clinic, index) => (
                <Card
                  key={`${clinic.name}-${index}`}
                  className="cursor-pointer transition-colors hover:border-primary hover:bg-secondary/50"
                  onClick={() => focusClinic(index)}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-start justify-between gap-2">
                      <span>{clinic.name}</span>
                      <span className="flex items-center gap-1 text-sm font-medium text-primary shrink-0">
                        <Star className="h-4 w-4 fill-primary" />
                        {clinic.rating || '—'}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-1">
                    <p className="text-sm text-muted-foreground">{clinic.address}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        {clinic.distance_m >= 1000
                          ? `${(clinic.distance_m / 1000).toFixed(1)} km away`
                          : `${Math.round(clinic.distance_m)} m away`}
                      </span>
                      <span
                        className={
                          clinic.open_now === true
                            ? 'text-success font-medium'
                            : clinic.open_now === false
                            ? 'text-destructive font-medium'
                            : 'text-muted-foreground'
                        }
                      >
                        {statusLabel(clinic.open_now)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NearbyDentists;
