"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import MapView from "@/components/MapView";
import { useTranslations } from "next-intl";
import { 
  ChevronLeft, 
  MapPin, 
  Users, 
  Package, 
  ShoppingBag, 
  ClipboardList, 
  Clock,
  ArrowRight,
  Eye
} from "lucide-react";

export default function DaySummaryPage() {
  const { date } = useParams();
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const t = useTranslations("common");

  useEffect(() => {
    if (!date) return;
    setLoading(true);
    fetch(`/api/distributor/summary?date=${date}`, { credentials: "include" })
      .then(res => res.json())
      .then(json => {
        setData(json);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [date]);

  const glassCard = "bg-white/70 backdrop-blur-2xl rounded-[2.5rem] border border-white/40 shadow-[0_8px_32px_0_rgba(31,38,135,0.04)] ring-1 ring-inset ring-white/20";

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-emerald-500 border-r-2 border-emerald-200"></div>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{t("loading")}</p>
      </div>
    );
  }

  // Safety check if data is null or empty
  const activities = data?.activities || [];

  return (
    <div className="min-h-screen bg-[#fcfdfe] pb-20 font-sans selection:bg-emerald-100 mb-16">
      <div className="max-w-md mx-auto px-5 pt-8 space-y-6">
        
        <header className="flex items-center gap-4">
          <button 
            onClick={() => router.back()}
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm active:scale-90 transition-transform border border-slate-100"
          >
            <ChevronLeft size={20} className="text-slate-900" />
          </button>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 leading-tight">{t("title")}</h1>
            <p className="text-[11px] font-black text-emerald-600 uppercase tracking-widest">{date}</p>
          </div>
        </header>

        {/* MAP SECTION */}
        <div className="rounded-[2.5rem] overflow-hidden shadow-xl border-4 border-white h-48 bg-slate-100">
          {activities.length > 0 ? (
            <MapView activities={activities} />
          ) : (
            <div className="h-full flex items-center justify-center text-slate-400 text-xs font-bold">{t("noRouteData")}</div>
          )}
        </div>

        {/* STATS GRID */}
        <div className="grid grid-cols-2 gap-3">
          <Stat label={t("meetings")} value={data?.meetings || 0} icon={<Users size={14} />} color="text-indigo-600" bg="bg-indigo-50" />
          <Stat label={t("samples")} value={data?.samples || 0} icon={<Package size={14} />} color="text-orange-600" bg="bg-orange-50" />
          <Stat label={t("sales")} value={data?.sales || 0} icon={<ShoppingBag size={14} />} color="text-emerald-600" bg="bg-emerald-50" />
          <Stat label={t("totalLogs")} value={activities.length} icon={<ClipboardList size={14} />} color="text-slate-600" bg="bg-slate-50" />
        </div>

        {/* TIMELINE SECTION */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-[12px] font-black text-slate-400 uppercase tracking-[0.2em]">{t("timeline")}</h2>
            <span className="text-[9px] font-bold bg-slate-100 px-2 py-0.5 rounded text-slate-500">{t("entries", { count: activities.length })}</span>
          </div>
          
          {activities.length === 0 ? (
            <div className={glassCard + " p-10 text-center"}>
              <p className="text-xs font-bold text-slate-400">{t("noActivity")}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {activities.map(act => (
                <div
                  key={act._id}
                  onClick={() => router.push(`/distributor/activity/${act._id}`)}
                  className={glassCard + " p-5 active:scale-[0.98] transition-all cursor-pointer group hover:border-emerald-200"}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-lg">
                        {getTypeIcon(act.type)}
                      </div>
                      <div>
                        <p className="text-[13px] font-black text-slate-900 uppercase tracking-tight">
                          {formatType(act.type)}
                        </p>
                        <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                          <Clock size={10} />
                          {new Date(act.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                       <span className="text-[9px] font-black text-emerald-600 uppercase opacity-0 group-hover:opacity-100 transition-opacity">{t("details")}</span>
                       <ArrowRight size={16} className="text-slate-200 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>

                  {act.address && (
                    <div className="flex items-center gap-1.5 mb-3 bg-emerald-50/50 p-1.5 rounded-lg border border-emerald-100/30">
                      <MapPin size={10} className="text-emerald-500" />
                      <p className="text-[9px] font-bold text-slate-600 truncate uppercase tracking-tighter">
                        {act.address.split(",").slice(0, 2).join(",")}
                      </p>
                    </div>
                  )}

                  <div className="bg-slate-50 rounded-2xl p-3 space-y-2 border border-slate-100">
                    {act.meeting && (
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-black text-slate-900 flex items-center gap-1.5">
                          <Users size={10} className="text-indigo-500"/> {act.meeting.personName}
                        </span>
                        <span className="text-[9px] font-black text-slate-400 uppercase bg-white px-2 py-0.5 rounded shadow-sm">{act.meeting.intent}</span>
                      </div>
                    )}
                    {act.sample && (
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-black text-slate-900">📦 {act.sample.productId}</span>
                        <span className="text-[11px] font-black text-orange-600 bg-orange-100/50 px-2 py-0.5 rounded">x{act.sample.quantity}</span>
                      </div>
                    )}
                    {act.sale && (
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-black text-slate-900">🧾 {act.sale.productId}</span>
                        <span className="text-[11px] font-black text-emerald-600 bg-emerald-100/50 px-2 py-0.5 rounded">x{act.sale.quantity}</span>
                      </div>
                    )}
                    {act.notes && (
                      <p className="text-[10px] font-medium text-slate-400 leading-relaxed italic border-t border-slate-200/50 pt-2 mt-2">
                        "{act.notes.length > 60 ? act.notes.substring(0, 60) + '...' : act.notes}"
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ATOMIC COMPONENTS & HELPERS
function Stat({ label, value, icon, color, bg }) {
  return (
    <div className="bg-white p-4 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center">
      <div className={`w-8 h-8 ${bg} ${color} rounded-xl flex items-center justify-center mb-2`}>
        {icon}
      </div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{label}</p>
      <p className="text-lg font-black text-slate-900 tabular-nums">{value}</p>
    </div>
  );
}

function getTypeIcon(type) {
  const t = type.toUpperCase();
  if (t.includes("MEETING")) return <Users size={16} />;
  if (t.includes("SAMPLE")) return <Package size={16} />;
  if (t.includes("SALE")) return <ShoppingBag size={16} />;
  return <MapPin size={16} />;
}

function formatType(type) {
  if (!type) return "Activity";
  return type.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
}