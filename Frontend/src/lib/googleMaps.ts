const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";

let loaderPromise: Promise<any> | null = null;

/**
 * Loads the Google Maps JS API once and resolves with the global `google` object.
 * Subsequent calls reuse the same promise.
 */
export function loadGoogleMaps(): Promise<any> {
  const w = window as any;

  if (w.google?.maps) {
    return Promise.resolve(w.google);
  }

  if (loaderPromise) return loaderPromise;

  loaderPromise = new Promise((resolve, reject) => {
    if (!GOOGLE_MAPS_API_KEY) {
      reject(new Error("Missing VITE_GOOGLE_MAPS_API_KEY"));
      return;
    }
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve(w.google);
    script.onerror = () => reject(new Error("Failed to load Google Maps"));
    document.head.appendChild(script);
  });

  return loaderPromise;
}
