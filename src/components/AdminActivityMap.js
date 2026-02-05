"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "@/lib/leafletIcons";

export default function AdminActivityMap({ lat, lng, address }) {
  if (!lat || !lng) return null;

  return (
    <div className="w-full h-[300px] rounded overflow-hidden">
      <MapContainer
        center={[lat, lng]}
        zoom={15}
        className="h-full w-full"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        <Marker position={[lat, lng]}>
          <Popup>{address}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
