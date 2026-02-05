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

  {summary.activities.length === 0 && (
    <p className="text-sm text-gray-500">
      No activities for this day
    </p>
  )}

  {summary.activities.map(act => (
    <div
      key={act._id}
      className="border rounded p-3 mb-2 space-y-1 bg-white"
    >
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <p className="font-medium">
          {act.type.replaceAll("_", " ")}
        </p>
        <p className="text-xs text-gray-500">
          {new Date(act.createdAt).toLocaleTimeString()}
        </p>
      </div>

      {/* ADDRESS */}
      {act.address && (
        <p className="text-xs text-gray-600">
          📍 {act.address.split(",").slice(0, 2).join(",")}
        </p>
      )}

      {/* MEETING */}
      {act.meeting && (
        <div className="text-sm">
          <p>👤 {act.meeting.personName}</p>
          {act.meeting.intent && (
            <p className="text-xs text-gray-600">
              Intent: {act.meeting.intent}
            </p>
          )}
        </div>
      )}

      {/* SAMPLE */}
      {act.sample && (
        <div className="text-sm">
          <p>
            📦 {act.sample.productId} — {act.sample.quantity}
          </p>
          {act.sample.purpose && (
            <p className="text-xs text-gray-600">
              Purpose: {act.sample.purpose}
            </p>
          )}
        </div>
      )}

      {/* SALE */}
      {act.sale && (
        <div className="text-sm">
          <p>
            🧾 {act.sale.productId} — {act.sale.quantity}
          </p>
          <p className="text-xs text-gray-600">
            {act.sale.customerName} · {act.sale.mode}
          </p>
        </div>
      )}

      {/* NOTES */}
      {act.notes && (
        <p className="text-xs text-gray-500">
          📝 {act.notes}
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
