"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar as CalendarIcon, ArrowRight } from "lucide-react";

export default function AdminCalendar({ distributorId }) {
  const [days, setDays] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetch(`/api/admin/distributor-calendar?distributorId=${distributorId}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setDays(Array.isArray(data) ? data : []));
  }, [distributorId]);

  if (!days) return <ShimmerCalendar />;

  const presentDates = new Set(days.map((d) => d.date));
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const monthName = today.toLocaleString("default", { month: "long" });
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  return (
    <div className="relative overflow-hidden bg-white/40 backdrop-blur-3xl border border-white/40 p-6 md:p-10 rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)] transition-all duration-500 hover:shadow-[0_48px_80px_-16px_rgba(0,0,0,0.08)]">
      <div className="flex items-end justify-between mb-10">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-2"></div>
          <h2 className="text-4xl font-black tracking-tight text-slate-900">
            {monthName}{" "}
            <span className="text-slate-400 font-light">{year}</span>
          </h2>
        </div>

        <div className="hidden md:flex flex-col items-end">
          <p className="text-[10px] font-black uppercase text-slate-400 mb-1 font-mono">
            Month Utility
          </p>
          <p className="text-2xl font-black text-slate-900 tabular-nums">
            {Math.round((presentDates.size / daysInMonth) * 100)}%
          </p>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-3 mb-4">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Instruction Text - Moved outside or set to col-span-full */}
<div className="mb-4 px-2 flex items-center gap-2">
  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
  <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">
    Select a working day to view detailed history
  </p>
</div>

<div className="grid grid-cols-7 gap-3">
  {Array.from({ length: daysInMonth }).map((_, i) => {
    const dayNum = i + 1;
    const date = `${year}-${String(month + 1).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;
    const isPresent = presentDates.has(date);
    const isToday = dayNum === today.getDate();

    return (
      <button
        key={date}
        style={{
          gridColumnStart: i === 0 ? firstDayOfMonth + 1 : "auto",
        }}
        disabled={!isPresent}
        onClick={() =>
          isPresent &&
          router.push(`/admin/distributor/${distributorId}/day/${date}`)
        }
        className={`
          relative aspect-square rounded-[1.25rem] text-sm font-bold flex items-center justify-center transition-all duration-300 transform-gpu
         
          ${isToday && isPresent ? "ring-2 ring-emerald-500 ring-offset-4 ring-offset-[#F2F2F7]" : ""}
        `}
      >
        {isPresent && (
          <div className="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
        )}
        <span className={isPresent ? "z-10" : "opacity-40"}>
          {dayNum}
        </span>
      </button>
    );
  })}
</div>

      <div className="mt-10 pt-8 border-t border-slate-200/60 flex flex-wrap gap-8 items-center justify-between">
        <div className="flex gap-6">
          <LegendItem
            color="bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.4)]"
            label="Active"
          />
          <LegendItem color="bg-slate-200" label="No Logs" />
        </div>

        <div className="text-[10px] font-bold text-slate-400 flex items-center gap-2 italic">
          Deep data available for active days{" "}
          <ArrowRight size={12} className="opacity-50" />
        </div>
      </div>
    </div>
  );
}

function LegendItem({ color, label }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className={`w-2.5 h-2.5 ${color} rounded-full`} />
      <span className="text-[11px] font-black uppercase tracking-tighter text-slate-500">
        {label}
      </span>
    </div>
  );
}

function ShimmerCalendar() {
  return (
    <div className="bg-white/40 backdrop-blur-3xl border border-white/40 p-10 rounded-[3rem] animate-pulse">
      <div className="h-4 w-24 bg-slate-200 rounded-full mb-4" />
      <div className="h-10 w-48 bg-slate-200 rounded-xl mb-12" />
      <div className="grid grid-cols-7 gap-3">
        {Array.from({ length: 31 }).map((_, i) => (
          <div
            key={i}
            className="aspect-square bg-slate-100 rounded-[1.25rem]"
          />
        ))}
      </div>
    </div>
  );
}