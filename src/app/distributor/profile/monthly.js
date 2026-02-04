"use client";

import { useEffect, useState } from "react";

export default function MonthlySummary() {
  const [month, setMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(`/api/distributor/monthly?month=${month}`, {
        credentials: "include",
      })
        .then(async res => {
          if (!res.ok) return null;
          const text = await res.text();
          return text ? JSON.parse(text) : null;
        })
        .then(setData);
      
  }, [month]);

  return (
    <div>
      <h2 className="font-semibold mb-2">Monthly Summary</h2>

      <input
        type="month"
        value={month}
        onChange={e => setMonth(e.target.value)}
        className="border p-2 mb-3"
      />

      {data && (
        <div className="grid grid-cols-2 gap-3">
          <Stat label="Meetings" value={data.meetings} />
          <Stat label="Sales" value={data.sales} />
          <Stat label="Volume Sold" value={data.totalQuantity} />
          <Stat label="Distance (km)" value={data.distance} />
        </div>
      )}
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
