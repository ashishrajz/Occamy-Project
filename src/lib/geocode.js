export async function reverseGeocode(lat, lng) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
      {
        headers: {
          "User-Agent": "occamy-hackathon-app",
        },
      }
    );

    const data = await res.json();
    const address = data.address || {};

    return {
      state: address.state || "",
      district:
        address.state_district ||
        address.county ||
        address.city ||
        "",
      village:
        address.village ||
        address.suburb ||
        address.town ||
        "",
      displayName: data.display_name || "",
    };
  } catch (err) {
    console.error("Reverse geocode failed", err);
    return null;
  }
}
