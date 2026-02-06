"use client";

import { useEffect, useState } from "react";
import { CalendarDays, Briefcase, ShoppingBag, Beaker, ChevronRight, ArrowDown, ChevronDown } from "lucide-react";

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

  if (!data) return <ShimmerMonthly />;

  return (
    <div className="relative overflow-hidden bg-white/40 backdrop-blur-3xl border border-white/40 p-6 md:p-10 rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)] transition-all duration-500 hover:shadow-[0_48px_80px_-16px_rgba(0,0,0,0.08)]">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-2">
            
          </div>
          <h2 className="text-3xl font-black tracking-tight text-slate-900">
            Performance <span className="text-slate-400 font-light">Metrics</span>
          </h2>
        </div>

        <div className="relative group flex gap-1 items-center">
          <input
            type="month"
            value={month}
            onChange={e => setMonth(e.target.value)}
            className="appearance-none bg-white/80 border border-white shadow-sm px-5 py-2.5 rounded-2xl text-xs font-bold text-slate-700 outline-none hover:bg-white transition-all cursor-pointer ring-offset-2 focus:ring-2 focus:ring-blue-500/20"
            
          />
          <ChevronDown/>
          
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <MetricTile 
          label="Days Worked" 
          value={data.daysWorked} 
          icon={<CalendarDays size={18} />} 
          color="text-slate-600"
          bg="bg-slate-100/50"
        />
        <MetricTile 
          label="Total Meetings" 
          value={data.meetings} 
          icon={<Briefcase size={18} />} 
          color="text-blue-600"
          bg="bg-blue-50/50"
        />
        <MetricTile 
          label="Gross Sales" 
          value={data.sales} 
          icon={<ShoppingBag size={18} />} 
          color="text-emerald-600"
          bg="bg-emerald-50/50"
        />
        <MetricTile 
          label="Samples Handed" 
          value={data.samples} 
          icon={<Beaker size={18} />} 
          color="text-amber-600"
          bg="bg-amber-50/50"
        />
      </div>

      <div className="mt-8 pt-6 border-t border-white/60 flex items-center justify-between">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Aggregate Data View</p>
        <div className="flex -space-x-2">
           {[...Array(3)].map((_, i) => (
             <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-slate-200" />
           ))}
        </div>
      </div>
    </div>
  );
}

function MetricTile({ label, value, icon, color, bg }) {
  return (
    <div className={`p-5 rounded-[2rem] ${bg} border border-white/60 flex items-center gap-4 transition-transform hover:scale-[1.02] duration-300`}>
      <div className={`w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-tighter text-slate-400 mb-0.5">{label}</p>
        <p className="text-xl font-black text-slate-900 leading-none">{value}</p>
      </div>
    </div>
  );
}

function ShimmerMonthly() {
  return (
    <div className="bg-white/40 backdrop-blur-3xl border border-white/40 p-10 rounded-[3rem] animate-pulse">
      <div className="flex justify-between items-center mb-10">
        <div className="space-y-3">
          <div className="h-2 w-20 bg-slate-200 rounded-full" />
          <div className="h-8 w-48 bg-slate-200 rounded-xl" />
        </div>
        <div className="h-10 w-32 bg-slate-200 rounded-2xl" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 bg-slate-100/50 rounded-[2rem]" />
        ))}
      </div>
    </div>
  );
}