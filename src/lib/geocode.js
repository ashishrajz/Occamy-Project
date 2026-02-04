export async function reverseGeocode(lat, lng) {
    try {
      const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;
  
      const res = await fetch(url, {
        headers: {
          // REQUIRED by Nominatim usage policy
          "User-Agent": "occamy-hackathon-app",
        },
      });
  
      if (!res.ok) return null;
  
      const data = await res.json();
  
      return {
        displayName: data.display_name,
        address: data.address,
      };
    } catch (err) {
      console.error("Reverse geocode failed", err);
      return null;
    }
  }
  