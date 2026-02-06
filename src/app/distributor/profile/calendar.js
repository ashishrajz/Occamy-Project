"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Circle } from "lucide-react";

export default function CalendarView() {
  const router = useRouter();
  const [presentDays, setPresentDays] = useState([]);
  const today = new Date();

  useEffect(() => {
    fetch("/api/distributor/calendar", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then(setPresentDays);
  }, []);

  const presentDates = new Set(presentDays.map((d) => d.date));
  
  const daysInMonth = new Date(
    today.getFullYear(),
    today.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    today.getFullYear(),
    today.getMonth(),
    1
  ).getDay();

  const monthLabel = today.toLocaleString('default', { month: 'long' });
  const year = today.getFullYear();
  const currentMonthPath = today.toISOString().slice(0, 7);

  const weekDays = ["S", "M", "T", "W", "T", "F", "S"];

  // Liquid Glass Styles
  const glassContainer = "bg-white/70 backdrop-blur-2xl rounded-[2.5rem] p-6 border border-white/40 shadow-[0_8px_32px_0_rgba(31,38,135,0.05)] ring-1 ring-inset ring-white/20";

  return (
    <div className="max-w-md mx-auto p-4">
      <div className={glassContainer}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6 px-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-200">
              <CalendarIcon size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-[17px] font-black text-slate-900 leading-none">
                {monthLabel}
              </h2>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em] mt-1">
                {year} • Activity Log
              </p>
            </div>
          </div>
          <div className="flex gap-1">
             <div className="p-2 text-slate-300"><ChevronLeft size={18} /></div>
             <div className="p-2 text-slate-900 bg-slate-100 rounded-xl"><ChevronRight size={18} /></div>
          </div>
        </div>

        {/* Week Day Labels */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {weekDays.map((day, i) => (
            <div key={i} className="text-center text-[10px] font-black text-slate-400 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {/* Padding for first day of month */}
          {Array.from({ length: firstDayOfMonth }).map((_, i) => (
            <div key={`empty-${i}`} className="p-3" />
          ))}

          {Array.from({ length: daysInMonth }, (_, i) => {
            const dayNum = i + 1;
            const dateStr = `${currentMonthPath}-${String(dayNum).padStart(2, "0")}`;
            const isPresent = presentDates.has(dateStr);
            const isToday = dayNum === today.getDate();

            return (
              <div
                key={dateStr}
                onClick={() => isPresent && router.push(`/distributor/profile/${dateStr}`)}
                className={`
                  relative aspect-square flex items-center justify-center rounded-[1.2rem] text-sm font-black transition-all duration-300 cursor-pointer
                  ${isPresent 
                    ? "bg-emerald-500 text-white shadow-md shadow-emerald-200 active:scale-90" 
                    : "bg-slate-50 text-slate-400 hover:bg-slate-100"}
                  ${isToday && !isPresent ? "ring-2 ring-emerald-500 ring-offset-2" : ""}
                `}
              >
                {dayNum}
                
                {/* Status Dot for missed days */}
                {!isPresent && (
                   <div className="absolute bottom-1.5 w-1 h-1 rounded-full bg-slate-200" />
                )}
                
                {/* Glossy overlay for present days */}
                {isPresent && (
                  <div className="absolute inset-0 rounded-[1.2rem] bg-gradient-to-tr from-white/20 to-transparent pointer-events-none" />
                )}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex justify-around">
            <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Field Work</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">No Activity</span>
            </div>
        </div>
      </div>
    </div>
  );
}