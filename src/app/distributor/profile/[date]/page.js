"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import MapView from "@/components/MapView";

export default function DaySummaryPage() {
  const { date } = useParams();
  const router = useRouter();
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!date) return;

    fetch(`/api/distributor/summary?date=${date}`, {
      credentials: "include",
    })
      .then(res => res.json())
      .then(setData);
  }, [date]);

  if (!data) {
    return (
      <div className="p-4 text-gray-500">
        Loading day summary…
      </div>
    );
  }

  if (data.error) {
    return (
      <div className="p-4 text-red-600">
        {data.error}
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-xl font-semibold">
        Day Summary — {date}
      </h1>

      {/* OVERALL MAP */}
      <MapView activities={data.activities} />

      {/* DAY INFO */}
      <div className="grid grid-cols-2 gap-3">
        <Stat label="Meetings" value={data.meetings} />
        <Stat label="Samples" value={data.samples} />
        <Stat label="Sales" value={data.sales} />
        <Stat
          label="Total Activities"
          value={data.activities.length}
        />
      </div>

      {/* ACTIVITY LIST */}
<div>
  <h2 className="font-semibold mb-3">
    Activities
  </h2>

  {data.activities.length === 0 && (
    <p className="text-sm text-gray-500">
      No activities found
    </p>
  )}

  {data.activities.map(act => (
    <div
      key={act._id}
      onClick={() =>
        router.push(`/distributor/activity/${act._id}`)
      }
      className="border rounded p-3 mb-2 cursor-pointer hover:bg-gray-50 space-y-1"
    >
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <p className="font-medium">
          {formatType(act.type)}
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
        <p className="text-xs text-gray-500 line-clamp-2">
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
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-lg font-semibold">{value}</p>
    </div>
  );
}

function formatType(type) {
  return type
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, l => l.toUpperCase());
}
