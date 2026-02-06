"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Sprout, MapPin, Power, Users, Package,
  ShoppingBag, Navigation, CheckCircle2,
  ChevronRight, Clock, CalendarDays, UserCircle,
  TrendingUp, Wifi, Bell, Flag
} from "lucide-react";

import { useTranslations } from "next-intl";

export default function DistributorDashboard() {
  const router = useRouter();
  const [day, setDay] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasEndedToday, setHasEndedToday] = useState(false);
  const [activities, setActivities] = useState([]);

  const t = useTranslations("common");

  const [elapsedTime, setElapsedTime] = useState("00:00:00");
  const [liveCoords, setLiveCoords] = useState({ lat: null, lng: null });
  const [readableAddress, setReadableAddress] = useState(t("locating"));


  // 1. Initial Data Fetching
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [actRes, dayRes, statusRes] = await Promise.all([
          fetch("/api/distributor/activities-today", { credentials: "include" }),
          fetch("/api/distributor/today", { credentials: "include" }),
          fetch("/api/distributor/day-status", { credentials: "include" })
        ]);

        const activitiesData = await actRes.json();
        const dayData = await dayRes.json();
        const statusData = await statusRes.json();

        setActivities(activitiesData);
        setDay(dayData);
        setHasEndedToday(statusData.hasEndedToday);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 2. Timer Effect (Elapsed Time)
  useEffect(() => {
    if (!day?.startTime) return;
    const interval = setInterval(() => {
      const start = new Date(day.startTime).getTime();
      const now = new Date().getTime();
      const diff = now - start;
      const hours = Math.floor(diff / 3600000);
      const minutes = Math.floor((diff % 3600000) / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      setElapsedTime(
        `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
      );
    }, 1000);
    return () => clearInterval(interval);
  }, [day]);

  // 3. Geolocation & Reverse Geocoding (Fetch City/Street Name)
  useEffect(() => {
    if (!day) return;
    const watchId = navigator.geolocation.watchPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setLiveCoords({ lat: latitude, lng: longitude });

        try {
          // Free Reverse Geocoding API
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          );
          const data = await response.json();
          const locationName =
  data.locality ||
  data.city ||
  data.principalSubdivision ||
  t("unknownArea");
  setReadableAddress(t("locationBypass"));
        } catch (error) {
          setReadableAddress("Location bypass");
        }
      },
      (err) => console.error(err),
      { enableHighAccuracy: true }
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, [day]);

  async function startDay() {
    navigator.geolocation.getCurrentPosition(async pos => {
      await fetch("/api/distributor/start-day", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ location: { lat: pos.coords.latitude, lng: pos.coords.longitude } }),
      });
      window.location.reload();
    });
  }

  async function endDay() {
    navigator.geolocation.getCurrentPosition(async pos => {
      await fetch("/api/distributor/end-day", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ location: { lat: pos.coords.latitude, lng: pos.coords.longitude } }),
      });
      router.replace("/distributor/end-day-summary");
    });
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="relative">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-emerald-500 border-opacity-20"></div>
        <div className="absolute inset-0 animate-spin rounded-full h-12 w-12 border-t-4 border-emerald-500" style={{ animationDuration: '1s' }}></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFB] mb-20 text-slate-900 font-sans pb-10 flex flex-col items-center">
      <main className="w-full max-w-md px-4 pt-6 space-y-6 flex-grow">
        {!day ? (
          <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl shadow-slate-200/50 border border-slate-100 text-center space-y-8">
            <div className="relative w-20 h-20 mx-auto">
              <div className="absolute inset-0 bg-emerald-100 rounded-3xl rotate-6"></div>
              <div className="relative w-full h-full bg-emerald-500 text-white rounded-3xl flex items-center justify-center shadow-lg">
                <CalendarDays size={36} />
              </div>
            </div>
            <div className="space-y-6">
            <h2 className="text-2xl font-black">
  {hasEndedToday ? t("seeYouTomorrow") : t("readyToStart")}
</h2>
              {!hasEndedToday && (
                <button onClick={startDay} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-emerald-200 active:scale-95 transition-all text-sm uppercase tracking-wider">
                  {t("startDay")}
                </button>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* LIVE HERO CARD */}
            <section className="bg-slate-900  rounded-[2.2rem] p-6 text-white shadow-2xl relative overflow-hidden">
              <div className="absolute -top-12 -right-12 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl"></div>
              
              <div className="relative z-10 space-y-6">
                {/* Top Row: Status & Start Time */}
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </span>
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">{t("fieldWork")}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <MapPin size={12} className="text-emerald-500" />
                      <span className="text-[11px] font-bold truncate max-w-[140px] uppercase tracking-tight">
                        {readableAddress}
                      </span>
                    </div>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-2xl px-3 py-2 text-right">
                    <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-0.5">{t("shiftStarted")}</div>
                    <div className="text-xs font-black text-white tabular-nums">
                      {new Date(day.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>

                {/* Bottom Row: Timer & Coordinates */}
                <div className="flex justify-between items-end">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-slate-500 font-bold uppercase text-[9px]">
                      <Clock size={10} /> {t("timeActive")}
                    </div>
                    <h2 className="text-4xl font-black tracking-tighter tabular-nums leading-none">{elapsedTime}</h2>
                  </div>
                 
                </div>
              </div>
            </section>

            {/* ACTION BUTTONS */}
            <div className="grid grid-cols-1 gap-5 py-1">
              <button className="group relative w-full transition-all duration-75 active:translate-y-1">
                <div className="absolute inset-0 bg-blue-800 rounded-2xl translate-y-1.5" />
                <div className="relative flex items-center justify-center gap-3 bg-blue-600 active:bg-blue-700 text-white py-4 rounded-2xl border-b border-blue-400 active:border-b-0 transition-all">
                  <Flag size={20} fill="white" className="group-hover:rotate-12" />
                  <span className="text-sm font-black uppercase tracking-widest">{t("markCheckpoint")}</span>
                </div>
              </button>

              <button onClick={endDay} className="group relative w-full transition-all duration-75 active:translate-y-1">
                <div className="absolute inset-0 bg-rose-800 rounded-2xl translate-y-1.5" />
                <div className="relative flex items-center justify-center gap-3 bg-rose-600 active:bg-rose-700 text-white py-4 rounded-2xl border-b border-rose-400 active:border-b-0 transition-all">
                  <Power size={20} className="group-hover:scale-110" />
                  <span className="text-sm font-black uppercase tracking-widest">{t("finishShift")}</span>
                </div>
              </button>
            </div>

            {/* BENTO COMMAND GRID */}
            <div className="grid grid-cols-2 gap-3">
              <CommandCard label={t("meeting")}
  sub={t("client")} icon={<Users size={20} />} color="bg-indigo-600" onClick={() => router.push("/distributor/log-activity?type=MEETING_ONE_ON_ONE")} />
              <CommandCard label={t("sample")}
  sub={t("units")} icon={<Package size={20} />} color="bg-orange-500" onClick={() => router.push("/distributor/log-activity?type=SAMPLE_DISTRIBUTION")} />
              <CommandCard label={t("sale")}
  sub={t("invoice")} icon={<ShoppingBag size={20} />} color="bg-emerald-500" onClick={() => router.push("/distributor/log-activity?type=SALE")} />
              <CommandCard label={t("gpsPing")}
  sub={t("sync")} icon={<Navigation size={20} />} color="bg-slate-800" onClick={() => router.push("/distributor/log-activity?type=LOCATION_PING")} />
            </div>

            {/* RECENT FEED */}
            <div className="space-y-4 pt-2 pb-6">
              <div className="flex justify-between items-center px-1">
                <div className="flex items-center gap-2">
                  <TrendingUp size={14} className="text-emerald-600" />
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-tight">{t("recentActivity")}</h3>
                </div>
                <span className="text-[8px] font-black bg-slate-100 text-slate-500 px-2 py-1 rounded-full uppercase">{activities.length} {t("logs")}</span>
              </div>

              <div className="space-y-2.5">
                {activities.length === 0 ? (
                  <div className="bg-white rounded-[1.8rem] p-8 text-center border-2 border-dashed border-slate-100">
                    <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">{t("logsAppearHere")}</p>
                  </div>
                ) : (
                  activities.map(act => (
                    <ActivityItem key={act._id} act={act} />
                  ))
                )}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

function CommandCard({ label, sub, icon, color, onClick }) {
  return (
    <button onClick={onClick} className="group flex flex-col items-start p-4 rounded-3xl bg-white border border-slate-100 shadow-sm active:scale-95 transition-all">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md mb-3 group-hover:scale-105 transition-transform ${color}`}>
        {icon}
      </div>
      <span className="text-xs font-black text-slate-800 leading-none mb-1">{label}</span>
      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{sub}</span>
    </button>
  )
}

function ActivityItem({ act }) {
  const isMeeting = act.type.startsWith("MEETING");
  const isSample = act.type === "SAMPLE_DISTRIBUTION";
  const isSale = act.type === "SALE";

  return (
    <div className="group bg-white rounded-2xl p-3.5 shadow-sm border border-slate-50 flex items-center gap-3 active:bg-slate-50 transition-colors">
      <div className={`w-9 h-9 rounded-xl shrink-0 flex items-center justify-center ${isMeeting ? 'bg-indigo-50 text-indigo-600' :
          isSample ? 'bg-orange-50 text-orange-500' :
            isSale ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'
        }`}>
        {isMeeting ? <Users size={16} /> : isSample ? <Package size={16} /> : isSale ? <ShoppingBag size={16} /> : <Navigation size={16} />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center mb-0.5">
          <h4 className="text-[10px] font-black uppercase text-slate-900 truncate tracking-tight">
            {act.type.replaceAll("_", " ")}
          </h4>
          <span className="text-[8px] font-bold text-slate-400">
            {new Date(act.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
        <div className="flex items-center gap-2 text-[9px] font-bold text-slate-500">
          {act.meeting && <span className="truncate">👤 {act.meeting.personName}</span>}
          {act.sample && <span className="truncate">📦 {act.sample.productId}</span>}
          {act.sale && <span className="truncate">🧾 {act.sale.productId}</span>}
          {!act.meeting && !act.sample && !act.sale && <span>GPS Sync</span>}
        </div>
      </div>
      <ChevronRight size={14} className="text-slate-200" />
    </div>
  )
}