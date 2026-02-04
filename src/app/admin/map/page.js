"use client";

import { useEffect, useState } from "react";
import MapView from "@/components/MapView";

export default function AdminMapPage() {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    fetch("/api/admin/map-data", {
      credentials: "include",
    })
      .then(res => res.json())
      .then(setActivities);
  }, []);

  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">
        Field Activity Map
      </h1>

      <MapView activities={activities} />
    </div>
  );
}
