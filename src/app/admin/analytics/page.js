"use client";

import { useEffect, useState } from "react";

export default function AdminAnalytics() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/api/admin/analytics", {
      credentials: "include",
    })
      .then(res => res.json())
      .then(setData);
  }, []);

  if (!data) return <p>Loading analytics...</p>;

  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">
        Company Analytics
      </h1>

      <div className="grid grid-cols-2 gap-4">
        <Stat label="Total Meetings" value={data.meetings} />
        <Stat label="Total Sales" value={data.sales} />
        <Stat label="B2C Sales" value={data.b2c} />
        <Stat label="B2B Sales" value={data.b2b} />
        <Stat label="Total Distance" value={data.distance} />
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
