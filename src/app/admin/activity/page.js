"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const TYPES = [
  "ALL",
  "MEETING_ONE_ON_ONE",
  "MEETING_GROUP",
  "SAMPLE_DISTRIBUTION",
  "SALE",
  "LOCATION_PING",
];

export default function AdminActivityPage() {
  const router = useRouter();
  const [activities, setActivities] = useState([]);
  const [filters, setFilters] = useState({
    type: "ALL",
    state: "ALL",
    district: "ALL",
    range: "MONTH",
  });
  const [meta, setMeta] = useState({
    states: [],
    districts: [],
  });
  
  useEffect(() => {
    fetch("/api/admin/dashboard?range=MONTH", {
      credentials: "include",
    })
      .then(res => res.json())
      .then(d => {
        setMeta({
          states: d.states || [],
          districts: d.districts || [],
        });
      });
  }, []);
  
  useEffect(() => {
    const params = new URLSearchParams(filters);
    fetch(`/api/admin/activity?${params}`, {
      credentials: "include",
    })
      .then(res => res.json())
      .then(setActivities);
  }, [filters]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">All Activities</h1>

      {/* FILTERS */}
      <div className="flex flex-wrap gap-3">
        <select
          value={filters.type}
          onChange={e =>
            setFilters({ ...filters, type: e.target.value })
          }
          className="border p-2 rounded"
        >
          {TYPES.map(t => (
            <option key={t} value={t}>
              {t.replaceAll("_", " ")}
            </option>
          ))}
        </select>

        <select
          value={filters.range}
          onChange={e =>
            setFilters({ ...filters, range: e.target.value })
          }
          className="border p-2 rounded"
        >
          <option value="TODAY">Today</option>
          <option value="MONTH">This Month</option>
          <option value="YEAR">This Year</option>
        </select>
        <select
  value={filters.state}
  onChange={e =>
    setFilters({
      ...filters,
      state: e.target.value,
      district: "ALL",
    })
  }
  className="border p-2 rounded"
>
  <option value="ALL">All States</option>
  {meta.states.map(s => (
    <option key={s} value={s}>{s}</option>
  ))}
</select>

<select
  value={filters.district}
  onChange={e =>
    setFilters({ ...filters, district: e.target.value })
  }
  className="border p-2 rounded"
>
  <option value="ALL">All Districts</option>
  {meta.districts.map(d => (
    <option key={d} value={d}>{d}</option>
  ))}
</select>

      </div>

      {/* LIST */}
      <div className="space-y-3">
        {activities.map(act => (
          <div
            key={act._id}
            onClick={() =>
              router.push(`/admin/activity/${act._id}`)
            }
            className="border rounded p-3 cursor-pointer hover:bg-gray-50"
          >
            <div className="flex justify-between">
              <p className="font-medium">
                {act.type.replaceAll("_", " ")}
              </p>
              <p className="text-xs text-gray-500">
                {new Date(act.createdAt).toLocaleString()}
              </p>
            </div>

            <p className="text-sm text-gray-600">
              👤 {act.distributor?.name}
            </p>

            {act.address && (
              <p className="text-xs text-gray-500">
                📍 {act.address}
              </p>
            )}

            {act.sale && (
              <p className="text-sm">
                🛒 {act.sale.productId} × {act.sale.quantity}
              </p>
            )}

            {act.sample && (
              <p className="text-sm">
                🎁 {act.sample.productId} × {act.sample.quantity}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
