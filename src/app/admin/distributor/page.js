"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Search, 
  ChevronRight, 
  ShieldCheck,
  MoreVertical,
  Phone,
  ArrowRight,
  Star,
  MapPin
} from "lucide-react";

export default function AdminDistributorsPage() {
  const [distributors, setDistributors] = useState([]);
  const [search, setSearch] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetch("/api/admin/distributor", {
      credentials: "include",
    })
      .then(res => res.json())
      .then(setDistributors);
  }, []);

  const filteredDistributors = distributors.filter(d => 
    d.name.toLowerCase().includes(search.toLowerCase()) || 
    d.phone.includes(search)
  );

  return (
    <div className="min-h-screen bg-[#F8F9FA] px-4 py-8 md:px-8 space-y-8 animate-in fade-in duration-700 pb-24 rounded-2xl">
      
      {/* 1. HEADER SECTION (TripGlide Style) */}
      <div className="flex flex-col gap-1">
        <p className="text-slate-400 font-medium text-sm">Welcome back, Admin</p>
        <h1 className="text-3xl font-black tracking-tight text-slate-900">Distributor Network</h1>
      </div>

      {/* 2. SEARCH BAR (Refined Floating Style) */}
      <div className="relative group max-w-2xl">
        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-black transition-colors">
          <Search size={20} />
        </div>
        <input 
          type="text" 
          placeholder="Search partners..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white border-none rounded-full py-5 pl-14 pr-6 text-sm font-semibold shadow-[0_4px_20px_rgba(0,0,0,0.03)] outline-none focus:ring-2 focus:ring-slate-900 transition-all placeholder:text-slate-300"
        />
      </div>

      {/* 3. CATEGORY CHIPS (Optional but adds to the UI) */}
      <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
        {['All Partners', 'Active', 'Top Performers', 'Near Me'].map((chip, i) => (
          <button key={chip} className={`px-6 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all ${i === 0 ? 'bg-slate-900 text-white shadow-lg shadow-slate-200' : 'bg-white text-slate-500 hover:bg-slate-50'}`}>
            {chip}
          </button>
        ))}
      </div>

      {/* 4. DISTRIBUTORS GRID (TripGlide Detail Style) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDistributors.length === 0 ? (
          <div className="col-span-full py-24 text-center">
            <p className="text-slate-400 font-bold">No results found</p>
          </div>
        ) : (
          filteredDistributors.map(d => (
            <div
              key={d._id}
              onClick={() => router.push(`/admin/distributor/${d._id}`)}
              className="group bg-white rounded-[2.5rem] p-6 shadow-[0_10px_40px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)] transition-all duration-500 cursor-pointer relative"
            >
              <div className="flex items-start justify-between">
                <div className="relative">
                  <img
                    src={d.avatar || `https://ui-avatars.com/api/?name=${d.name}&background=random`}
                    alt={d.name}
                    className="w-20 h-20 rounded-[1.8rem] object-cover shadow-inner"
                  />
                  <div className="absolute -top-2 -right-2 bg-white p-1.5 rounded-full shadow-sm">
                    <Star size={12} className="fill-amber-400 text-amber-400" />
                  </div>
                </div>
                
              </div>

              <div className="mt-6 space-y-2">
                <div className="flex items-center gap-2">
                    
                   
                </div>
                <div className="flex items-center gap-1">
                  <h3 className="text-xl font-black text-slate-900">{d.name}</h3>
                  <ShieldCheck size={18} className="text-blue-500" />
                </div>
                <p className="text-sm text-slate-400 font-medium leading-relaxed line-clamp-2">
                  Top performing distributor specializing in organic vitilization and crop protection.
                </p>
              </div>

              <div className="mt-8 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Contact</span>
                  <p className="text-sm font-bold text-slate-900">{d.phone}</p>
                </div>
                
                <div className="w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center text-white group-hover:scale-110 transition-transform shadow-xl shadow-slate-200">
                  <ArrowRight size={20} />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}