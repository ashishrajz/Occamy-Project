"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { User, Phone, ShieldCheck, Zap, TrendingUp, MapPin, Download } from "lucide-react";
import StatsCards from "@/app/distributor/profile/stats";
import AdminCalendar from "./AdminCalendar";
import AdminMonthly from "./AdminMonthly";

export default function AdminDistributorProfile() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch(`/api/admin/distributor/${id}`, {
      credentials: "include",
    })
      .then(res => res.json())
      .then(data => {
        setProfile(data.profile);
        setStats(data.stats);
      });
  }, [id]);

  const downloadCSV = () => {
    if (!profile || !stats) return;

    const dataRows = [
      ["Field", "Value"],
      ["Distributor Name", profile.name],
      ["Phone", profile.phone],
      ["Role", profile.role],
      ["Location", profile.location || "N/A"],
      ["", ""], // Spacer
      ["Performance Metric", "Value"],
      ...Object.entries(stats).map(([key, val]) => [
        key.charAt(0).toUpperCase() + key.slice(1),
        val
      ])
    ];

    const csvContent = "data:text/csv;charset=utf-8," 
      + dataRows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${profile.name.replace(/\s+/g, '_')}_Report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!profile) return <ShimmerProfile />;

  return (
    <div className="min-h-screen bg-[#F2F2F7] text-slate-900 font-[-apple-system,BlinkMacSystemFont,sans-serif] pb-20 antialiased relative">
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[40%] bg-blue-200/30 blur-[120px] rounded-full" />
        <div className="absolute bottom-[10%] left-[-10%] w-[50%] h-[50%] bg-emerald-200/20 blur-[120px] rounded-full" />
      </div>

      <main className="max-w-7xl mx-auto px-4 md:px-8 pt-12 space-y-8 relative z-10">
        
        <section className="bg-white/40 backdrop-blur-3xl border border-white/40 p-6 md:p-10 rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)] flex flex-col md:flex-row gap-8 items-center md:items-start transition-all duration-500 hover:shadow-[0_48px_80px_-16px_rgba(0,0,0,0.08)]">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-tr from-emerald-500 to-blue-500 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
            <img
              src={profile.avatar || `https://ui-avatars.com/api/?name=${profile.name}`}
              className="relative w-32 h-32 rounded-full border-4 border-white shadow-xl object-cover"
              alt={profile.name}
            />
            <div className="absolute bottom-1 right-1 w-8 h-8 bg-emerald-500 border-4 border-white rounded-full flex items-center justify-center text-white">
              <ShieldCheck size={14} />
            </div>
          </div>

          <div className="flex-1 text-center md:text-left space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.4em] text-emerald-600 mb-1 leading-none">Verified Distributor</p>
                <h1 className="text-4xl font-black tracking-tight text-slate-900 leading-none">{profile.name}</h1>
              </div>
              
              <button 
                onClick={downloadCSV}
                className="flex items-center justify-center gap-2 px-6 py-3 text-white bg-emerald-500 hover:bg-emerald-600 hover:text-white transition-all duration-300 rounded-2xl border border-white shadow-sm text-xs font-bold group"
              >
                <Download size={14} className="group-hover:translate-y-0.5 transition-transform" />
                Download Performance Report
              </button>
            </div>

            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              <ContactBadge icon={<Phone size={12} />} text={profile.phone} />
              <ContactBadge icon={<User size={12} />} text={`Role: ${profile.role}`} />
              <ContactBadge icon={<MapPin size={12} />} text={profile.location || "North Region"} />
            </div>
          </div>

          <div className="hidden lg:flex gap-4">
            <QuickMetric label="Efficiency" value="94%" />
            <QuickMetric label="Growth" value="+12%" />
          </div>
        </section>

        {stats && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 px-4">
              <TrendingUp className="text-slate-400" size={20} />
              <h2 className="text-xl font-black tracking-tight text-slate-900">Performance Overview</h2>
            </div>
            <StatsCards stats={stats} />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <AdminCalendar distributorId={id} />
          <AdminMonthly distributorId={id} />
        </div>
      </main>
    </div>
  );
}

function ContactBadge({ icon, text }) {
  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-md border border-white rounded-full text-[11px] font-bold text-slate-600 shadow-sm">
      <span className="text-slate-400">{icon}</span>
      {text}
    </div>
  );
}

function QuickMetric({ label, value }) {
  return (
    <div className="bg-slate-900 text-white p-6 rounded-[2rem] min-w-[120px] text-center shadow-2xl">
      <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">{label}</p>
      <p className="text-2xl font-black">{value}</p>
    </div>
  );
}

function ShimmerProfile() {
  return (
    <div className="min-h-screen bg-[#F2F2F7] p-8 space-y-8 animate-pulse">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="h-64 bg-white/60 rounded-[3rem] border border-white" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => <div key={i} className="h-32 bg-white/60 rounded-[2rem]" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="h-96 bg-white/60 rounded-[3rem]" />
          <div className="h-96 bg-white/60 rounded-[3rem]" />
        </div>
      </div>
    </div>
  );
}