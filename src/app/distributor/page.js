"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DistributorDashboard() {
  const router = useRouter();
  const [day, setDay] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasEndedToday, setHasEndedToday] = useState(false);


  const [activities, setActivities] = useState([]);

useEffect(() => {
  fetch("/api/distributor/activities-today", {
    credentials: "include",
  })
    .then(res => res.json())
    .then(setActivities);
}, []);


  useEffect(() => {
    fetch("/api/distributor/today", { credentials: "include" })
      .then(res => res.json())
      .then(data => {
        setDay(data);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetch("/api/distributor/day-status", {
      credentials: "include",
    })
      .then(res => res.json())
      .then(data => setHasEndedToday(data.hasEndedToday));
  }, []);
  

  function captureLocation() {
    navigator.geolocation.getCurrentPosition(async pos => {
      await fetch("/api/distributor/activity", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "LOCATION",
          location: {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          },
          discussionNotes: "Periodic location capture",
        }),
      });
  
      alert("Location captured");
    });
  }
  

  async function startDay() {
    navigator.geolocation.getCurrentPosition(async pos => {
      await fetch("/api/distributor/start-day", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          location: {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          },
        }),
      });
      location.reload();
    });
  }

  async function endDay() {
    navigator.geolocation.getCurrentPosition(async pos => {
      await fetch("/api/distributor/end-day", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          location: {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          },
        }),
      });
  
      // ❌ NO alert
      // ❌ NO reload
      router.replace("/distributor/end-day-summary");
    });
  }
  
  

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-semibold">
        Distributor Dashboard
      </h1>
  
      {!day ? (
  hasEndedToday ? (
    <div className="p-3 bg-green-50 border rounded text-sm text-green-800">
      ✅ Day completed for today.  
      <br />
      You can start again tomorrow.
    </div>
  ) : (
    <button
      onClick={startDay}
      className="btn-primary w-full"
    >
      Start Day
    </button>
  )
) : (
  <>
    {/* ACTIVE DAY UI — EXACTLY AS YOU ALREADY HAVE IT */}

    <div className="bg-white p-3 rounded shadow">
      <p className="text-sm text-gray-600">
        Day started at:
      </p>
      <p className="font-medium">
        {new Date(day.startTime).toLocaleTimeString()}
      </p>
      {day.startAddress && (
        <p className="text-sm text-gray-600">
          📍 {day.startAddress}
        </p>
      )}
    </div>

    {/* LOG BUTTONS */}
    <div className="grid grid-cols-2 gap-3">
      <button
        onClick={() =>
          window.location.href =
            "/distributor/log-activity?type=MEETING"
        }
        className="btn-secondary"
      >
        Log Meeting
      </button>

      <button
        onClick={() =>
          window.location.href =
            "/distributor/log-activity?type=SAMPLE"
        }
        className="btn-secondary"
      >
        Log Sample
      </button>

      <button
        onClick={() =>
          window.location.href =
            "/distributor/log-activity?type=SALE"
        }
        className="btn-secondary"
      >
        Log Sale
      </button>

      <button
        onClick={captureLocation}
        className="btn-secondary"
      >
        Capture Location
      </button>
    </div>

    {/* TODAY LOGS */}
    <div className="mt-6">
      <h2 className="font-semibold mb-2">
        Today’s Logs
      </h2>

      {activities.length === 0 && (
        <p className="text-sm text-gray-500">
          No activities logged yet
        </p>
      )}

      {activities.map(act => (
        <div
          key={act._id}
          className="bg-white border rounded p-3 mb-2"
        >
          <p className="font-medium">{act.type}</p>
          <p className="text-sm text-gray-600">
            {new Date(act.createdAt).toLocaleTimeString()}
          </p>
          {act.notes && (
            <p className="text-sm">{act.notes}</p>
          )}
        </div>
      ))}
    </div>

    {/* END DAY */}
    <button
      onClick={endDay}
      className="btn-danger w-full mt-4"
    >
      End Day
    </button>
  </>
)}

    </div>
  );
  
}
