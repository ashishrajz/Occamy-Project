"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import MapView from "@/components/MapView";
import { useRouter } from "next/navigation";


export default function AdminDailyActivityPage() {
  const { id, date } = useParams();
  const [data, setData] = useState(null);
  const [status, setStatus] = useState("loading");
  const router = useRouter();


  useEffect(() => {
    fetch(
      `/api/admin/distributor-day-activities?distributorId=${id}&date=${date}`,
      { credentials: "include" }
    )
      .then(res => res.json())
      .then(res => {
        if (res.absent) {
          setStatus("absent");
        } else {
          setData(res);
          setStatus("present");
        }
      });
  }, [id, date]);

  if (status === "loading") {
    return <p className="p-4">Loading day activity…</p>;
  }

  if (status === "absent") {
    return (
      <div className="p-6 text-center bg-red-50 border rounded">
        <h1 className="font-semibold text-lg">
          No Activity
        </h1>
        <p className="text-sm text-gray-600 mt-2">
          Distributor did not work on {date}.
        </p>
      </div>
    );
  }

  const summary = data.summary || {
    meetings: 0,
    sales: 0,
    samples: 0,
    b2c: 0,
    b2b: 0,
  };
  
  const mapActivities = Array.isArray(data.mapActivities)
    ? data.mapActivities
    : [];
  
  const activities = Array.isArray(data.activities)
    ? data.activities
    : [];
  
  

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-xl font-semibold">
        Activity Summary — {date}
      </h1>

      {/* SUMMARY */}
      {summary && (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
    <Stat label="Meetings" value={summary.meetings} />
    <Stat label="Sales" value={summary.sales} />
    <Stat label="Samples" value={summary.samples} />
    <Stat label="B2C / B2B" value={`${summary.b2c} / ${summary.b2b}`} />
  </div>
)}


      <div className="text-sm text-gray-600">
        <p>
          First activity:{" "}
          {summary.firstActivity
            ? new Date(summary.firstActivity).toLocaleTimeString()
            : "—"}
        </p>
        <p>
          Last activity:{" "}
          {summary.lastActivity
            ? new Date(summary.lastActivity).toLocaleTimeString()
            : "—"}
        </p>
      </div>

      {/* MAP */}
      {mapActivities.length > 0 ? (
  <div className="bg-white p-4 rounded shadow">
    <h2 className="font-semibold mb-2">
      Route & Locations
    </h2>
    <MapView activities={mapActivities} />
  </div>
) : (
  <p className="text-sm text-gray-500">
    No location data recorded for this day.
  </p>
)}


      {/* ACTIVITY LIST */}
      <div className="space-y-3">
        <h2 className="font-semibold">
          Detailed Activities
        </h2>

        {activities.map(act => (
          <div
            key={act._id}
            onClick={() =>
              router.push(`/admin/activity/${act._id}`)
            }
            className="bg-white border rounded p-4 space-y-1"
          >
            <p className="font-medium">{act.type}</p>
            <p className="text-xs text-gray-500">
              {new Date(act.createdAt).toLocaleTimeString()}
            </p>

            {act.address && (
              <p className="text-sm">📍 {act.address}</p>
            )}

            {act.notes && (
              <p className="text-sm">📝 {act.notes}</p>
            )}

            {act.sale && (
              <div className="text-sm mt-2">
                <p>Product: {act.sale.product}</p>
                <p>Quantity: {act.sale.quantity}</p>
                <p>Mode: {act.sale.mode}</p>
              </div>
            )}

            {act.meeting && (
              <div className="text-sm mt-2">
                <p>Person: {act.meeting.name}</p>
                <p>Category: {act.meeting.category}</p>
              </div>
            )}

            {act.photos?.length > 0 && (
              <div className="flex gap-2 mt-2">
                {act.photos.map((url, i) => (
                  <img
                    key={i}
                    src={url}
                    className="w-20 h-20 rounded object-cover"
                  />
                ))}
              </div>
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
