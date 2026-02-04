"use client";

import { useEffect, useState } from "react";
import MapView from "@/components/MapView";

export default function EndDaySummary() {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    fetch("/api/distributor/end-day-summary", {
      credentials: "include",
    })
      .then(res => res.json())
      .then(setSummary);
  }, []);

  if (!summary) return <p className="p-4">Loading summary...</p>;

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-semibold">End Day Summary</h1>

      <div className="grid grid-cols-2 gap-3">
        <Stat label="Meetings" value={summary.meetings} />
        <Stat label="Samples" value={summary.samples} />
        <Stat label="Sales" value={summary.sales} />
        <Stat label="B2C Sales" value={summary.b2cSales} />
        <Stat label="B2B Sales" value={summary.b2bSales} />
        <Stat
          label="Distance Covered (km)"
          value={summary.distanceCoveredKm}
        />
      </div>

      {/* MAP */}
      <MapView activities={summary.activities} />

      {/* TIMELINE */}
      <div>
        <h2 className="font-medium mb-2">Activity Timeline</h2>
        {summary.activities.map(act => (
          <div
            key={act._id}
            className="border rounded p-2 mb-2"
          >
            <p className="font-medium">{act.type}</p>
            <p className="text-sm text-gray-600">
              {new Date(act.createdAt).toLocaleTimeString()}
            </p>
            {act.address && (
              <p className="text-xs text-gray-500">
                📍 {act.address}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="bg-white p-3 rounded shadow text-center">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-lg font-semibold">{value}</p>
    </div>
  );
}
