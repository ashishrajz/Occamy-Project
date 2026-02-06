"use client";

import { useEffect, useState } from "react";
import { 
  CalendarDays, 
  BarChart3, 
  ChevronDown, 
  Target, 
  Zap, 
  Map, 
  Layers,
  ArrowUpRight
} from "lucide-react";

export default function MonthlySummary() {
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(`/api/distributor/monthly?month=${month}`, { credentials: "include" })
      .then(async res => {
        if (!res.ok) return null;
        const text = await res.text();
        return text ? JSON.parse(text) : null;
      })
      .then(setData);
  }, [month]);

  // Liquid Glass Styles
  const glassContainer = "bg-white/70 backdrop-blur-2xl rounded-[2.5rem] p-6 border border-white/40 shadow-[0_8px_32px_0_rgba(31,38,135,0.05)] ring-1 ring-inset ring-white/20";

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      <div className={glassContainer}>
        {/* Header with Custom iOS-style Date Input */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
              <BarChart3 size={20} className="text-white" />
            </div>
            <h2 className="text-[17px] font-black text-slate-900 tracking-tight">Insights</h2>
          </div>

          <div className="relative group">
            <div className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-xl active:scale-95 transition-all">
              <CalendarDays size={14} className="text-slate-500" />
              <input
                type="month"
                value={month}
                onChange={e => setMonth(e.target.value)}
                className="bg-transparent text-[12px] font-black text-slate-900 outline-none uppercase tracking-tighter"
              />
              <ChevronDown size={14} className="text-slate-400" />
            </div>
          </div>
        </div>

        {!data ? (
          <div className="py-10 text-center space-y-3">
             <div className="w-12 h-12 bg-slate-50 rounded-full mx-auto animate-pulse" />
             <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Gathering Data</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Primary Highlight Card: Volume Sold */}
            <div className="bg-slate-900 rounded-[2rem] p-6 text-white relative overflow-hidden shadow-xl">
              <div className="absolute top-0 right-0 p-4 opacity-20">
                <Target size={60} />
              </div>
              <div className="relative z-10">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Monthly Volume</p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-4xl font-black tracking-tighter tabular-nums">{data.totalQuantity}</h3>
                  <span className="text-emerald-400 text-xs font-bold flex items-center gap-1">
                    Units <ArrowUpRight size={14} />
                  </span>
                </div>
                <div className="mt-4 w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                   <div className="bg-emerald-500 h-full rounded-full" style={{ width: '75%' }} />
                </div>
              </div>
            </div>

            {/* Grid for Secondary Stats */}
            <div className="grid grid-cols-2 gap-4">
              <StatItem 
                label="Meetings" 
                value={data.meetings} 
                icon={<Layers size={16} />} 
                color="text-indigo-600" 
                bg="bg-indigo-50" 
              />
              <StatItem 
                label="Total Sales" 
                value={data.sales} 
                icon={<Zap size={16} />} 
                color="text-amber-600" 
                bg="bg-amber-50" 
              />
              <StatItem 
                label="Field Coverage" 
                value={`${data.distance}km`} 
                icon={<Map size={16} />} 
                color="text-blue-600" 
                bg="bg-blue-50" 
              />
              <StatItem 
                label="Active Days" 
                value={Math.floor(data.meetings / 2)} // Mocking active days logic
                icon={<CalendarDays size={16} />} 
                color="text-rose-600" 
                bg="bg-rose-50" 
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatItem({ label, value, icon, color, bg }) {
  return (
    <div className="bg-white/50 border border-slate-100 p-4 rounded-3xl active:scale-[0.98] transition-all">
      <div className={`w-8 h-8 ${bg} ${color} rounded-xl flex items-center justify-center mb-3`}>
        {icon}
      </div>
      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{label}</p>
      <p className="text-lg font-black text-slate-900 tracking-tight tabular-nums leading-none">{value}</p>
    </div>
  );
}