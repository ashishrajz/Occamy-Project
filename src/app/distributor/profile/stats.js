"use client";

import {
  Navigation,
  Users,
  Sprout,
  ShoppingBag,
  Zap,
  Building2,
  CalendarCheck
} from "lucide-react";

export default function StatsCards({ stats }) {
  const cards = [
    {
      label: "Total Distance",
      value: `${stats.totalDistance} km`,
      icon: <Navigation size={20} />,
      color: "from-blue-500/20",
      iconColor: "bg-blue-500",
      wide: true
    },
    {
      label: "Meetings",
      value: stats.meetingsCount,
      icon: <Users size={20} />,
      color: "from-indigo-500/20",
      iconColor: "bg-indigo-500"
    },
    {
      label: "Farmers",
      value: stats.farmersContacted,
      icon: <Sprout size={20} />,
      color: "from-emerald-500/20",
      iconColor: "bg-emerald-500"
    },
    {
      label: "Total Sales",
      value: stats.salesCount,
      icon: <ShoppingBag size={20} />,
      color: "from-orange-500/20",
      iconColor: "bg-orange-500",
      wide: true
    },
    {
      label: "B2C Sales",
      value: stats.b2c,
      icon: <Zap size={20} />,
      color: "from-amber-500/20",
      iconColor: "bg-amber-500"
    },
    {
      label: "B2B Sales",
      value: stats.b2b,
      icon: <Building2 size={20} />,
      color: "from-purple-500/20",
      iconColor: "bg-purple-500"
    },
    {
      label: "Days Worked",
      value: stats.totalDaysWorked,
      icon: <CalendarCheck size={20} />,
      color: "from-slate-500/20",
      iconColor: "bg-slate-800",
      wide: true
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 px-4 w-full max-w-md mx-auto">
      {cards.map((c) => (
        <div
          key={c.label}
          className={`
            relative overflow-hidden group
            
            p-4 sm:p-6 rounded-[2rem] sm:rounded-[2.5rem] 
            border border-white/60 shadow-[0_10px_40px_rgba(0,0,0,0.03)] 
            ring-1 ring-inset ring-white/30 transition-all 
            active:scale-[0.96] active:bg-white/60
            ${c.wide ? "col-span-2" : "col-span-1"}
          `}
        >
          <div className={`absolute -right-6 -top-6 sm:-right-10 sm:-top-10 w-32 h-32 sm:w-40 sm:h-40 bg-gradient-radial ${c.color} to-transparent opacity-40 blur-3xl pointer-events-none`} />

          <div className="relative z-10 flex flex-col h-full justify-between gap-4 sm:gap-6">
            <div className={`w-10 h-10 sm:w-11 sm:h-11 ${c.iconColor} text-white rounded-[1.1rem] sm:rounded-[1.25rem] flex items-center justify-center shadow-lg shadow-${c.iconColor.split('-')[1]}-500/30 group-hover:scale-105 transition-transform duration-300`}>
              {c.icon}
            </div>

            <div className="space-y-0.5">
              <p className="text-[9px] sm:text-[11px] font-black text-slate-500/80 uppercase tracking-[0.12em] sm:tracking-[0.15em] truncate">
                {c.label}
              </p>
              <p className="text-xl sm:text-3xl font-black text-slate-900 tracking-tighter tabular-nums leading-none">
                {c.value}
              </p>
            </div>
          </div>

          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-active:opacity-100 transition-opacity duration-500 pointer-events-none" />
        </div>
      ))}
    </div>
  );
}