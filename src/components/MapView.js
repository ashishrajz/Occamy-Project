"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";
import "leaflet/dist/leaflet.css";

const MapContainer = dynamic(
  () => import("react-leaflet").then(m => m.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then(m => m.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then(m => m.Marker),
  { ssr: false }
);
const Polyline = dynamic(
  () => import("react-leaflet").then(m => m.Polyline),
  { ssr: false }
);

export default function MapView({ activities }) {
  useEffect(() => {
    // 👇 Leaflet is imported ONLY in the browser
    import("leaflet").then(L => {
      delete L.Icon.Default.prototype._getIconUrl;

      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });
    });
  }, []);

  const points = activities
    .filter(a => a.location?.lat)
    .map(a => [a.location.lat, a.location.lng]);

  if (points.length === 0) return null;

  return (
    <div className="h-64 w-full rounded overflow-hidden">
      <MapContainer
        center={points[0]}
        zoom={13}
        className="h-full w-full"
      >
        <TileLayer
          attribution="© OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {points.map((p, idx) => (
          <Marker key={idx} position={p} />
        ))}

        <Polyline positions={points} />
      </MapContainer>
    </div>
  );
}
