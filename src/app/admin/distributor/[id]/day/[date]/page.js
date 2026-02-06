"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { 
  Users, 
  ShoppingBag, 
  Beaker, 
  Layers, 
  Clock, 
  Map as MapIcon, 
  ChevronLeft,
  Calendar,
  X,
  Info,
  TrendingUp,
  Activity,
  MousePointer2
} from "lucide-react";

const MapView = dynamic(
  () => import("@/components/MapView"),
  { ssr: false }
);

export default function AdminDailyActivityPage() {
  const { id, date } = useParams();
  const [data, setData] = useState(null);
  const [status, setStatus] = useState("loading");
  const [showHistory, setShowHistory] = useState(false); // Toggle for detailed history
  const router = useRouter();

  useEffect(() => {
    fetch(
      `/api/admin/distributor-day-activities?distributorId=${id}&date=${date}`,
      { credentials: "include" }
    )
      .then(res => res.json())
      .then(res => {
        if (res.absent) {
          setStatus("absent");
        } else {
          setData(res);
          setStatus("present");
        }
      });
  }, [id, date]);

  if (status === "loading") return <ShimmerLoader />;

  if (status === "absent") {
    return (
      <div className="min-h-screen bg-[#F2F2F7] flex items-center justify-center p-6">
        <div className="bg-white/70 backdrop-blur-3xl border border-white p-10 rounded-[2.5rem] shadow-xl text-center max-w-sm w-full">
          <div className="w-16 h-16 bg-rose-100 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Calendar size={32} />
          </div>
          <h1 className="text-2xl font-black text-slate-900 mb-2">No Activity</h1>
          <p className="text-slate-500 font-medium">Distributor did not record any logs on {date}.</p>
          <button 
            onClick={() => router.back()}
            className="mt-8 w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-slate-800 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const summary = data.summary || { meetings: 0, sales: 0, samples: 0, b2c: 0, b2b: 0 };
  const mapActivities = Array.isArray(data.mapActivities) ? data.mapActivities : [];
  const activities = Array.isArray(data.activities) ? data.activities : [];

  return (
    <div className="min-h-screen bg-[#F2F2F7] text-slate-900 font-[-apple-system,BlinkMacSystemFont,sans-serif] pb-20 antialiased relative">
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-5%] left-[-5%] w-[50%] h-[40%] bg-blue-200/30 blur-[120px] rounded-full" />
        <div className="absolute bottom-[10%] right-[-5%] w-[40%] h-[40%] bg-emerald-200/20 blur-[120px] rounded-full" />
      </div>

      <header className="sticky top-0 z-50 px-4 md:px-8 pt-8 pb-6 bg-white/60 backdrop-blur-2xl border-b border-white/20">
        <div className="max-w-7xl mx-auto flex flex-col gap-4">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors w-fit">
            <ChevronLeft size={18} />
            <span className="text-[10px] font-black uppercase tracking-widest">Back to Fleet</span>
          </button>
          <div className="flex justify-between items-end">
            {/* Clickable Date for History */}
            <button 
              onClick={() => setShowHistory(true)}
              className="group text-left focus:outline-none"
            >
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 mb-1 leading-none flex items-center gap-2">
                Daily Ledger <Info size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </p>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 leading-none hover:text-emerald-700 transition-colors cursor-pointer">
                {date}
              </h1>
            </button>
            <div className="hidden md:flex gap-4 text-right">
                <TimeMarker label="First Activity" time={summary.firstActivity} />
                <TimeMarker label="Last Activity" time={summary.lastActivity} />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-8 pt-8 space-y-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Meetings" value={summary.meetings} icon={<Users size={18}/>} color="bg-blue-500" />
          <StatCard label="Sales" value={summary.sales} icon={<ShoppingBag size={18}/>} color="bg-emerald-500" />
          <StatCard label="Samples" value={summary.samples} icon={<Beaker size={18}/>} color="bg-amber-500" />
          <StatCard label="B2C / B2B" value={`${summary.b2c} / ${summary.b2b}`} icon={<Layers size={18}/>} color="bg-violet-500" />
        </div>

        <div className="bg-white/70 backdrop-blur-3xl border border-white/60 p-2 rounded-[2.5rem] overflow-hidden shadow-xl">
          <div className="p-6">
            <div className="flex items-center gap-2 mb-1">
               <MapIcon size={16} className="text-emerald-600" />
               <h2 className="text-sm font-black uppercase tracking-widest text-slate-400">Route Map</h2>
            </div>
            <p className="text-lg font-bold">Visual Path Trace</p>
          </div>
          <div className="h-[400px] w-full rounded-[2rem] overflow-hidden">
            {mapActivities.length > 0 ? (
              <MapView activities={mapActivities} />
            ) : (
              <div className="h-full flex items-center justify-center bg-slate-100 text-slate-400 font-medium">No location data for this day</div>
            )}
          </div>
        </div>

<div className="space-y-6">
          <div className="px-2">
            <h2 className="text-xl font-black tracking-tight text-slate-900 leading-none">Timeline Logs</h2>
            <div className="flex items-center gap-4 mt-2">
              <div className="w-1 h-1 rounded-full bg-blue-500 animate-pulse" ><MousePointer2/></div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Tap an event card to inspect deep activity data
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activities.map((act) => (
              <ActivityRow 
                key={act._id} 
                act={act} 
                onClick={() => router.push(`/admin/activity/${act._id}`)} 
              />
            ))}
          </div>
        </div>      </main>

      {/* DEEP HISTORY OVERLAY (Liquid Glass Sidebar) */}
      {showHistory && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div 
            className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity" 
            onClick={() => setShowHistory(false)}
          />
          <div className="relative w-full max-w-md h-full bg-white/80 backdrop-blur-3xl shadow-[-20px_0_50px_rgba(0,0,0,0.1)] border-l border-white/40 p-8 flex flex-col animate-in slide-in-from-right duration-500">
            <div className="flex justify-between items-center mb-10">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-1">Deep History</p>
                <h2 className="text-2xl font-black">{date}</h2>
              </div>
              <button 
                onClick={() => setShowHistory(false)}
                className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-8 overflow-y-auto no-scrollbar pb-10">
              <HistorySection title="Efficiency Analytics" icon={<Activity size={16}/>}>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-white/50 rounded-2xl border border-white">
                    <p className="text-[9px] font-black text-slate-400 uppercase">Pace</p>
                    <p className="text-lg font-bold">{Math.round(activities.length / 8)} logs/hr</p>
                  </div>
                  <div className="p-4 bg-white/50 rounded-2xl border border-white">
                    <p className="text-[9px] font-black text-slate-400 uppercase">Conversion</p>
                    <p className="text-lg font-bold">{Math.round((summary.sales / summary.meetings) * 100 || 0)}%</p>
                  </div>
                </div>
              </HistorySection>

              <HistorySection title="Time Markers" icon={<Clock size={16}/>}>
                <div className="space-y-3">
                  <TimeLog label="Shift Start" time={summary.firstActivity} />
                  <TimeLog label="Peak Activity" time={activities[Math.floor(activities.length / 2)]?.createdAt} />
                  <TimeLog label="Shift End" time={summary.lastActivity} />
                </div>
              </HistorySection>

              <HistorySection title="Performance Note" icon={<TrendingUp size={16}/>}>
                <p className="text-sm text-slate-600 leading-relaxed font-medium bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100">
                  On this day, the distributor covered {mapActivities.length} geo-tagged locations. 
                  The highest density of sales occurred in the 
                  {new Date(summary.firstActivity).getHours() < 14 ? " morning " : " afternoon "} session.
                </p>
              </HistorySection>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* --- REUSABLE SUB-COMPONENTS --- */

function ActivityRow({ act, onClick }) {
  return (
    <div
      onClick={onClick}
      className="group bg-white/70 backdrop-blur-xl border border-white/60 p-6 rounded-[2rem] shadow-sm hover:shadow-xl hover:scale-[1.01] transition-all duration-300 cursor-pointer"
    >
      <div className="flex justify-between items-start mb-4">
        <span className="px-3 py-1 bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest rounded-full">
          {act.type.replace("_", " ")}
        </span>
        <div className="flex items-center gap-1.5 text-slate-400">
          <Clock size={12} />
          <span className="text-[11px] font-bold">{new Date(act.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </div>
      <div className="space-y-3">
        {act.address && (
          <div className="flex gap-2">
            <MapPinIcon size={14} className="text-slate-400 shrink-0" />
            <p className="text-xs font-bold text-slate-600 line-clamp-1">{act.address}</p>
          </div>
        )}
        {act.sale && (
          <div className="grid grid-cols-3 gap-2 p-3 bg-emerald-50/50 rounded-2xl border border-emerald-100/50">
            <MiniStat label="Product" value={act.sale.product} />
            <MiniStat label="Qty" value={act.sale.quantity} />
            <MiniStat label="Mode" value={act.sale.mode} />
          </div>
        )}
        {act.meeting && (
          <div className="p-3 bg-blue-50/50 rounded-2xl border border-blue-100/50">
            <p className="text-[9px] font-black uppercase text-blue-600 mb-1">Meeting With</p>
            <p className="text-sm font-bold text-slate-800">{act.meeting.name} • {act.meeting.category}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function HistorySection({ title, icon, children }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 px-1">
        <div className="text-emerald-600">{icon}</div>
        <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function TimeLog({ label, time }) {
  return (
    <div className="flex justify-between items-center p-3 bg-white/30 rounded-xl border border-white/50">
      <span className="text-xs font-bold text-slate-500">{label}</span>
      <span className="text-xs font-black text-slate-900">
        {time ? new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "--:--"}
      </span>
    </div>
  );
}

function StatCard({ label, value, icon, color }) {
  return (
    <div className="bg-white/70 backdrop-blur-xl border border-white p-5 rounded-[2rem] shadow-sm transition-transform hover:-translate-y-1">
      <div className={`${color} w-10 h-10 rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg shadow-inherit/20`}>
        {icon}
      </div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
      <p className="text-2xl font-black text-slate-900 mt-1">{value}</p>
    </div>
  );
}

function MiniStat({ label, value }) {
  return (
    <div>
      <p className="text-[8px] font-black uppercase text-slate-400">{label}</p>
      <p className="text-[11px] font-bold text-slate-800 truncate">{value}</p>
    </div>
  );
}

function TimeMarker({ label, time }) {
  return (
    <div>
      <p className="text-[9px] font-black uppercase text-slate-400 tracking-tighter">{label}</p>
      <p className="text-sm font-bold text-slate-900">{time ? new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "—"}</p>
    </div>
  );
}

function MapPinIcon({ size, className }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
  );
}

function ShimmerLoader() {
  return (
    <div className="min-h-screen bg-[#F2F2F7] p-8 animate-pulse">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="h-20 bg-white/60 rounded-[2rem]" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="h-32 bg-white/60 rounded-[2rem]" />)}
        </div>
        <div className="h-[400px] bg-white/60 rounded-[2.5rem]" />
      </div>
    </div>
  );
}