"use client";

import { useEffect, useState, use } from "react";
import dynamic from "next/dynamic";

const AdminActivityMap = dynamic(
  () => import("@/components/AdminActivityMap"),
  { ssr: false }
);


export default function AdminActivityDetail({ params }) {
  // ✅ THIS IS THE KEY FIX
  const { id } = use(params);

  const [activity, setActivity] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    fetch(`/api/admin/activity/${id}`, {
      credentials: "include",
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to load activity");
        return res.json();
      })
      .then(setActivity)
      .catch(err => setError(err.message));
  }, [id]);

  if (!id) return <p className="p-4">Invalid activity ID</p>;
  if (error) return <p className="p-4 text-red-600">{error}</p>;
  if (!activity) return <p className="p-4">Loading…</p>;

  return (
    <div className="space-y-4 p-4">
      <h1 className="text-xl font-semibold">
        {activity.type.replaceAll("_", " ")}
      </h1>

      <p className="text-sm text-gray-600">
        👤 {activity.distributor?.name}
      </p>

      <p className="text-sm text-gray-500">
        🕒 {new Date(activity.createdAt).toLocaleString()}
      </p>

      {activity.address && (
        <p className="text-sm">📍 {activity.address}</p>
      )}

      {/* SALE */}
      {activity.sale && (
        <div className="border p-3 rounded">
          <h2 className="font-medium">Sale</h2>
          <p>Product: {activity.sale.productId}</p>
          <p>Quantity: {activity.sale.quantity}</p>
          <p>Mode: {activity.sale.mode}</p>
          <p>
            Follow-up:{" "}
            {activity.sale.isFollowUpSale ? "Yes" : "No"}
          </p>
        </div>
      )}

      {/* SAMPLE */}
      {activity.sample && (
        <div className="border p-3 rounded">
          <h2 className="font-medium">Sample</h2>
          <p>Product: {activity.sample.productId}</p>
          <p>Quantity: {activity.sample.quantity}</p>
          <p>Purpose: {activity.sample.purpose}</p>
        </div>
      )}

      {/* MEETING */}
      {activity.meeting && (
        <div className="border p-3 rounded">
          <h2 className="font-medium">Meeting</h2>
          <p>Name: {activity.meeting.personName}</p>
          <p>Category: {activity.meeting.category}</p>
          <p>Intent: {activity.meeting.intent}</p>
        </div>
      )}

      {/* PHOTOS */}
      {activity.photos?.length > 0 && (
        <div className="grid grid-cols-2 gap-2">
          {activity.photos.map((p, i) => (
            <img
              key={i}
              src={p}
              className="rounded border"
            />
          ))}
        </div>
      )}

      {/* MAP */}
{activity.location?.lat && activity.location?.lng && (
  <div className="mt-6">
    <h2 className="font-medium mb-2">Location</h2>
    <AdminActivityMap
      lat={activity.location.lat}
      lng={activity.location.lng}
      address={activity.address}
    />
  </div>
)}

    </div>
  );
}
