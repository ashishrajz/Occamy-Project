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
    <div className="max-w-6xl mx-auto p-6 space-y-8 bg-white min-h-screen">
      {/* HEADER */}
      <div className="border-b border-emerald-100 pb-4">
        <h1 className="text-3xl font-bold text-gray-900">
          Activity <span className="text-emerald-600">Feed</span>
        </h1>
        <p className="text-gray-500 text-sm mt-1">Monitor distributor actions and updates in real-time.</p>
      </div>

      {/* FILTERS CARD */}
      <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100 flex flex-wrap gap-4 items-center">
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-emerald-700 uppercase ml-1">Activity Type</label>
          <select
            value={filters.type}
            onChange={e => setFilters({ ...filters, type: e.target.value })}
            className="bg-white border-emerald-200 text-gray-700 text-sm p-2.5 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 min-w-[160px] shadow-sm outline-none border"
          >
            {TYPES.map(t => (
              <option key={t} value={t}>{t.replaceAll("_", " ")}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-emerald-700 uppercase ml-1">Time Range</label>
          <select
            value={filters.range}
            onChange={e => setFilters({ ...filters, range: e.target.value })}
            className="bg-white border-emerald-200 text-gray-700 text-sm p-2.5 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 shadow-sm outline-none border"
          >
            <option value="TODAY">Today</option>
            <option value="MONTH">This Month</option>
            <option value="YEAR">This Year</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-emerald-700 uppercase ml-1">State</label>
          <select
            value={filters.state}
            onChange={e => setFilters({ ...filters, state: e.target.value, district: "ALL" })}
            className="bg-white border-emerald-200 text-gray-700 text-sm p-2.5 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 min-w-[140px] shadow-sm outline-none border"
          >
            <option value="ALL">All States</option>
            {meta.states.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-emerald-700 uppercase ml-1">District</label>
          <select
            value={filters.district}
            onChange={e => setFilters({ ...filters, district: e.target.value })}
            className="bg-white border-emerald-200 text-gray-700 text-sm p-2.5 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 min-w-[140px] shadow-sm outline-none border"
          >
            <option value="ALL">All Districts</option>
            {meta.districts.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
      </div>

      {/* ACTIVITY LIST */}
      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
        {activities.map(act => (
          <div
            key={act._id}
            onClick={() => router.push(`/admin/activity/${act._id}`)}
            className="group relative bg-white border border-gray-100 rounded-xl p-5 shadow-sm transition-all hover:shadow-md hover:border-emerald-200 cursor-pointer flex flex-col gap-3"
          >
            <div className="flex justify-between items-start">
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold tracking-wide">
                {act.type.replaceAll("_", " ")}
              </span>
              <span className="text-[11px] text-gray-400 font-medium">
                {new Date(act.createdAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
              </span>
            </div>

            <div className="space-y-2">
              <p className="text-gray-800 font-semibold flex items-center gap-2">
                <span className="text-emerald-500">👤</span> {act.distributor?.name || "Unknown User"}
              </p>

              {act.address && (
                <p className="text-xs text-gray-500 flex items-start gap-2 leading-relaxed">
                  <span className="text-emerald-500 mt-0.5">📍</span> {act.address}
                </p>
              )}
            </div>

            {/* DATA PILLS */}
            {(act.sale || act.sample) && (
              <div className="mt-2 pt-3 border-t border-gray-50 flex flex-wrap gap-2">
                {act.sale && (
                  <div className="bg-blue-50 text-blue-700 text-xs px-3 py-1.5 rounded-md flex items-center gap-2 border border-blue-100">
                    <span className="font-bold text-sm">🛒</span>
                    <span>{act.sale.productId} <b className="ml-1">× {act.sale.quantity}</b></span>
                  </div>
                )}
                {act.sample && (
                  <div className="bg-amber-50 text-amber-700 text-xs px-3 py-1.5 rounded-md flex items-center gap-2 border border-amber-100">
                    <span className="font-bold text-sm">🎁</span>
                    <span>{act.sample.productId} <b className="ml-1">× {act.sample.quantity}</b></span>
                  </div>
                )}
              </div>
            )}
            
            <div className="absolute top-1/2 right-4 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-emerald-400">
              →
            </div>
          </div>
        ))}

        {activities.length === 0 && (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-gray-100 rounded-2xl">
            <p className="text-gray-400">No activities found matching those filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
