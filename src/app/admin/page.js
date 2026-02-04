"use client";

import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/api/admin/overview", {
      credentials: "include",
    })
      .then(res => res.json())
      .then(setData);
  }, []);

  if (!data) return <p className="p-4">Loading...</p>;

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-xl font-semibold">
        Admin Dashboard
      </h1>

      <div className="grid grid-cols-2 gap-4">
        <Stat label="Total Distributors" value={data.totalDistributors} />
        <Stat label="Active Today" value={data.activeToday} />
        <Stat label="Meetings Today" value={data.meetingsToday} />
        <Stat label="Distance Today (km)" value={data.distanceToday} />
        <Stat label="B2C Sales" value={data.b2c} />
        <Stat label="B2B Sales" value={data.b2b} />
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="bg-white p-4 rounded shadow text-center">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-lg font-semibold">{value}</p>
    </div>
  );
}
