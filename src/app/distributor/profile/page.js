"use client";

import { useEffect, useState, useRef } from "react";
import StatsCards from "./stats";
import CalendarView from "./calendar";
import MonthlySummary from "./monthly";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { 
  Camera, 
  Settings, 
  Phone, 
  ShieldCheck, 
  ChevronRight, 
  Loader2,
  User as UserIcon,
  MousePointerClick,
  ChevronDown
} from "lucide-react";

export default function DistributorProfile() {
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [uploading, setUploading] = useState(false);
  const bottomRef = useRef(null);

  const router = useRouter();

  const t = useTranslations("common");

  async function handleLogout() {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });

    router.push("/auth/login");
  }

  useEffect(() => {
    fetch("/api/distributor/profile", { credentials: "include" })
      .then(res => res.json())
      .then(setProfile);

    fetch("/api/distributor/stats", { credentials: "include" })
      .then(res => res.json())
      .then(setStats);
  }, []);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F2F2F7] gap-4">
        <Loader2 className="animate-spin text-emerald-500" size={32} />
        <p className="text-slate-400 font-black text-xs uppercase tracking-[0.2em]">{t("authenticating")}</p>
      </div>
    );
  }

  // Liquid Glass Styles
  const glassCard = "bg-white/70 backdrop-blur-2xl rounded-[2.5rem] p-6 border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.04)] ring-1 ring-inset ring-white/20";
  const sectionLabel = "text-[11px] font-black text-emerald-600 ml-2 uppercase tracking-[0.2em] mb-4 flex items-center gap-2";

  return (
    <div className="min-h-screen bg-[#F2F2F7] pb-40 pt-10 px-5 space-y-10 font-sans selection:bg-emerald-100">
      {/* Background Ornament */}
      <div className="fixed top-0 left-0 w-full h-96 bg-emerald-500/10 blur-[120px] -z-10" />

      {/* Header Area */}
      <div className="flex justify-between items-end px-2">
        <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t("portal")}</p>
            <h1 className="text-4xl font-extrabold tracking-tighter text-slate-900">{t("account")}</h1>
        </div>
        <button className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-slate-900 active:scale-90 transition-transform border border-slate-100">
          <Settings size={22} />
        </button>
      </div>

      {/* Profile Liquid Card */}
      <div className={glassCard}>
        <div className="flex flex-col items-center text-center space-y-5">
          <div className="relative">
            <div className="absolute inset-0 bg-emerald-500 rounded-full blur-2xl opacity-20" />
            <img
              src={profile.avatar || "https://ui-avatars.com/api/?background=10b981&color=fff&name=" + profile.name}
              alt="Profile"
              className="relative w-32 h-32 rounded-[3rem] object-cover border-4 border-white shadow-2xl transition-transform active:scale-95"
            />
            <label className="absolute -bottom-2 -right-2 w-11 h-11 bg-slate-900 text-white rounded-2xl flex items-center justify-center border-4 border-[#F2F2F7] cursor-pointer hover:bg-emerald-600 transition-colors shadow-xl">
              {uploading ? <Loader2 size={18} className="animate-spin" /> : <Camera size={18} />}
              <input type="file" accept="image/*" hidden onChange={e => uploadPhoto(e.target.files[0])} />
            </label>
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">{profile.name}</h2>
            <div className="flex items-center justify-center gap-2">
              <span className="flex items-center gap-1.5 text-[10px] font-black text-emerald-700 bg-emerald-100/50 px-3 py-1.5 rounded-xl uppercase border border-emerald-200">
                <ShieldCheck size={12} strokeWidth={3} /> {profile.role}
              </span>
              <span className="flex items-center gap-1.5 text-[10px] font-black text-slate-500 bg-white px-3 py-1.5 rounded-xl uppercase border border-slate-100 shadow-sm">
                <Phone size={12} strokeWidth={3} /> {profile.phone}
              </span>
            </div>
          </div>
        </div>

        {/* Action List Section */}
        <div className="mt-8 pt-6 border-t border-slate-200/50 space-y-2">
            <div className="flex items-center justify-between p-4 bg-white/50 hover:bg-white rounded-2xl transition-all cursor-pointer group border border-transparent hover:border-emerald-100 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center shadow-inner"><UserIcon size={18}/></div>
                    <span className="text-[15px] font-extrabold text-slate-800">{t("personalInfo")}</span>
                </div>
                <ChevronRight size={18} className="text-slate-300 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
            </div>
        </div>
      </div>

      {/* Analytics Section */}
      <section>
        <p className={sectionLabel}>
           
        {t("performanceOverview")}
        </p>
        {stats ? (
          <div className="grid grid-cols-1 gap-4">
            <StatsCards stats={stats} />
          </div>
        ) : (
          <div className="h-40 bg-white/40 rounded-[2.5rem] animate-pulse flex items-center justify-center border border-white/20">
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{t("calculatingMetrics")}</p>
          </div>
        )}
      </section>

      {/* Activity Timeline */}
      <section className="space-y-8">
        <div>
            <p className={sectionLabel}>{t("attendanceTracking")}</p>
            <div className="bg-emerald-600 text-white p-4 rounded-3xl mb-4 flex items-center gap-3 shadow-lg shadow-emerald-200">
                <MousePointerClick size={20} className="animate-bounce" />
                <p className="text-[11px] font-bold leading-tight uppercase tracking-wider">
                {t("attendanceHint")}
                </p>
            </div>
            <CalendarView />
        </div>
        
        <div>
            <p className={sectionLabel}>{t("financialInsights")}</p>
            <MonthlySummary />
        </div>
      </section>

      {/* Logout / Dangerous Area */}
      <div className="px-2 pt-4">
          <button 
          onClick={handleLogout}
          className="w-full py-5 rounded-[2rem] bg-rose-50 text-rose-600 font-black text-xs uppercase tracking-[0.2em] active:scale-[0.98] transition-all border border-rose-100 shadow-sm">
              {t("signOut")}
          </button>
      </div>

      {/* Scroll to Bottom Indicator */}
      <button 
        onClick={scrollToBottom}
        className="fixed bottom-28 right-6 w-12 h-12 bg-slate-900 text-white rounded-full flex items-center justify-center shadow-2xl animate-bounce z-40 border-4 border-white"
      >
        <ChevronDown size={20} />
      </button>

      {/* Invisible anchor for scroll */}
      <div ref={bottomRef} className="h-2" />
    </div>
  );
}