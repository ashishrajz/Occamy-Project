"use client";

import { useEffect, useState } from "react";

export default function AdminMonthly({ distributorId }) {
  const [month, setMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(
      `/api/admin/distributor-monthly?distributorId=${distributorId}&month=${month}`,
      { credentials: "include" }
    )
      .then(res => res.json())
      .then(setData);
  }, [month, distributorId]);

  if (!data) return null;

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="font-semibold mb-2">
        Monthly Summary
      </h2>

      <input
        type="month"
        value={month}
        onChange={e => setMonth(e.target.value)}
        className="border p-1 mb-3"
      />

      <ul className="text-sm space-y-1">
        <li>Days worked: {data.daysWorked}</li>
        <li>Meetings: {data.meetings}</li>
        <li>Sales: {data.sales}</li>
        <li>Samples: {data.samples}</li>
      </ul>
    </div>
  );
}
