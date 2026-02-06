"use client";

import { useEffect, useState } from "react";
import MapView from "@/components/MapView";
import { useTranslations } from "next-intl";
import {
  TrendingUp,
  Package,
  ShoppingCart,
  Users,
  MapPin,
  Calendar,
  Clock,
  ClipboardList,
  Navigation2,
  Download,
  User,
  Tag,
  ArrowUpRight,
  X,
  Eye,
  Loader2,
} from "lucide-react";

export default function EndDaySummary() {
  const [summary, setSummary] = useState(null);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const t = useTranslations("common");

  useEffect(() => {
    fetch("/api/distributor/end-day-summary", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then(setSummary);
  }, []);

  // ✅ Export JUST NUMBERS as CSV
  const exportSummaryNumbers = () => {
    if (!summary) return;

    const csvContent = `Metric,Value
Meetings,${summary.meetings}
Samples,${summary.samples}
Total Sales,${summary.sales}
B2C Orders,${summary.b2cSales}
B2B Leads,${summary.b2bSales}
Distance (km),${summary.distanceCoveredKm}
Generated,${new Date().toLocaleDateString()}`;

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `AgriTrack-Numbers-${new Date().toLocaleDateString()}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  if (!summary) return <SummarySkeleton />;

  return (
    <div className="min-h-screen bg-[#fcfdfe] pb-20 selection:bg-emerald-100 relative">
      <div className="bg-white border-b border-slate-200/60 px-6 py-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-emerald-600 font-black text-[10px] uppercase tracking-[0.2em]">
            {t("finalReport")}
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
              <span className="text-emerald-600">{t("daySummary")}</span>
            </h1>
            <p className="text-slate-500 font-medium max-w-md leading-relaxed">
            {t("summaryDescription")}
            </p>
          </div>

          {/* ✅ ONLY CSV EXPORT BUTTON */}
          <button
            onClick={exportSummaryNumbers}
            className="flex items-center gap-2 bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black text-sm hover:bg-emerald-700 transition-all active:scale-95 shadow-2xl hover:shadow-emerald-500/25"
          >
            <Download size={20} />
            {t("exportCsv")}
          </button>
        </div>
      </div>

      <main className="max-w-6xl mx-auto p-6 space-y-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <StatCard
            label={t("meetings")}
            value={summary.meetings}
            icon={<Users size={20} />}
            theme="blue"
          />
          <StatCard
            label={t("samples")}
            value={summary.samples}
            icon={<Package size={20} />}
            theme="amber"
          />
          <StatCard
            label={t("totalSales")}
            value={summary.sales}
            icon={<ShoppingCart size={20} />}
            theme="emerald"
          />
          <StatCard
            label={t("b2cOrders")}
            value={summary.b2cSales}
            icon={<TrendingUp size={18} />}
            theme="indigo"
          />
          <StatCard
            label={t("b2bLeads")}
            value={summary.b2bSales}
            icon={<TrendingUp size={18} />}
            theme="purple"
          />
          <StatCard
            label={t("distance")}
            value={`${summary.distanceCoveredKm} km`}
            icon={<Navigation2 size={20} />}
            theme="rose"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 space-y-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
                <ClipboardList className="text-emerald-600" size={28} />
                {t("activityTimeline")}
              </h2>
              <span className="text-[10px] font-black bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg uppercase border border-emerald-100 tracking-wider">
                {summary.activities.length} {t("verifiedLogs")}
              </span>
            </div>

            <div className="relative space-y-6 before:absolute before:inset-0 before:ml-6 before:-translate-x-px before:h-full before:w-0.5 before:bg-slate-100">
              {summary.activities.map((act, idx) => (
                <ActivityItem
                  key={act._id || idx}
                  act={act}
                  onViewDetails={() => setSelectedActivity(act)}
                />
              ))}
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="sticky top-28">
              <div className="bg-white rounded-[2.5rem] border border-slate-200/60 shadow-2xl p-3">
                <div className="p-4">
                  <h2 className="font-black text-slate-800 uppercase text-xs tracking-widest">
                  {t("routeVerification")}
                  </h2>
                </div>
                <div className="rounded-[2rem] overflow-hidden border border-slate-100 h-[400px]">
                  <MapView activities={summary.activities} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <DetailModal
        activity={selectedActivity}
        onClose={() => setSelectedActivity(null)}
      />
    </div>
  );
}

function StatCard({ label, value, icon, theme }) {
  const themes = {
    blue: "bg-blue-600",
    amber: "bg-amber-500",
    emerald: "bg-emerald-600",
    indigo: "bg-indigo-600",
    purple: "bg-purple-600",
    rose: "bg-rose-600",
  };

  return (
    <div className="bg-white p-6 rounded-[2.2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 group">
      <div
        className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform ${themes[theme]} text-white`}
      >
        {icon}
      </div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-1">
        {label}
      </p>
      <div className="flex items-end justify-between">
        <p className="text-2xl font-black text-slate-900 tracking-tight">
          {value}
        </p>
        <ArrowUpRight
          size={16}
          className="text-slate-300 group-hover:text-emerald-500 transition-colors"
        />
      </div>
    </div>
  );
}

function ActivityItem({ act, onViewDetails }) {
  const isMeeting = !!act.meeting;
  const isSample = !!act.sample;
  const isSale = !!act.sale;

  return (
    <div className="relative pl-14 group">
      <div
        className={`absolute left-0 top-2 w-12 h-12 rounded-2xl border-4 border-white flex items-center justify-center z-10 shadow-md transition-all group-hover:scale-110
        ${isMeeting ? "bg-blue-600" : isSample ? "bg-amber-500" : isSale ? "bg-emerald-600" : "bg-slate-800"}`}
      >
        {isMeeting ? (
          <Users size={20} className="text-white" />
        ) : isSample ? (
          <Package size={20} className="text-white" />
        ) : (
          <ShoppingCart size={20} className="text-white" />
        )}
      </div>

      <div
        onClick={onViewDetails}
        className="bg-white border border-slate-100 p-6 rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-500 group-hover:border-emerald-100 cursor-pointer"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="font-black text-slate-900 uppercase text-sm tracking-tight">
              {act.type.replaceAll("_", " ")}
            </h3>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-slate-400 font-bold text-[10px] uppercase">
                <Clock size={12} className="text-emerald-500" />
                {new Date(act.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })}
              </div>
              {act.address && (
                <div className="flex items-center gap-1.5 text-slate-400 font-bold text-[10px] uppercase">
                  <MapPin size={12} className="text-emerald-500" />
                  {act.address.split(",")[0]}
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 text-emerald-600 font-bold text-[10px] uppercase opacity-0 group-hover:opacity-100 transition-opacity">
            <Eye size={14} /> {t("viewDetails")}
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailModal({ activity, onClose }) {
  if (!activity) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-end p-4 sm:p-6 overflow-hidden">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-lg h-full bg-white rounded-[3rem] shadow-2xl flex flex-col animate-in slide-in-from-right duration-500">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center">
          <div>
            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full">
            {t("recordEntry")}
            </span>
            <h2 className="text-2xl font-black text-slate-900 mt-2 uppercase tracking-tighter">
              {activity.type.replaceAll("_", " ")}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-3 hover:bg-slate-100 rounded-2xl transition-colors"
          >
            <X size={24} className="text-slate-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          <div className="grid grid-cols-2 gap-4">
            <DetailBox
              label={t("time")}
              value={new Date(activity.createdAt).toLocaleTimeString()}
            />
            <DetailBox
              label={t("date")}
              value={new Date(activity.createdAt).toLocaleDateString()}
            />
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] px-2">
            {t("dataIntelligence")}
            </h4>
            {activity.meeting && (
              <div className="space-y-3">
                <DetailRow
                  icon={<User size={18} />}
                  label={t("clientName")}
                  value={activity.meeting.personName}
                />
                <DetailRow
                  icon={<Tag size={18} />}
                  label={t("category")}
                  value={activity.meeting.category}
                />
                <DetailRow
                  icon={<TrendingUp size={18} />}
                  label={t("intent")}
                  value={activity.meeting.intent}
                />
              </div>
            )}
            {activity.sale && (
              <div className="space-y-3">
                <DetailRow
                  icon={<ShoppingCart size={18} />}
                  label={t("product")}
                  value={activity.sale.productId}
                />
                <DetailRow
                  icon={<Package size={18} />}
                  label={t("quantity")}
                  value={activity.sale.quantity}
                />
                <div className="p-6 bg-emerald-600 rounded-[2rem] text-white shadow-xl flex justify-between items-center">
                  <span className="text-xs font-bold uppercase tracking-widest opacity-80">
                  {t("paymentMode")}
                  </span>
                  <span className="font-black uppercase">
                    {activity.sale.mode}
                  </span>
                </div>
              </div>
            )}
          </div>

          {activity.notes && (
            <div className="space-y-3">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] px-2">
              {t("fieldNotes")}
              </h4>
              <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-200 border-dashed text-sm text-slate-600 leading-relaxed italic">
                "{activity.notes}"
              </div>
            </div>
          )}
        </div>

        <div className="p-8 border-t border-slate-100">
          <button
            onClick={onClose}
            className="w-full py-4 bg-slate-900 text-white font-black rounded-2xl uppercase text-xs tracking-widest hover:bg-emerald-600 transition-colors"
          >
            {t("closePanel")}
          </button>
        </div>
      </div>
    </div>
  );
}

function DetailBox({ label, value }) {
  return (
    <div className="bg-slate-50 p-4 rounded-3xl">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
        {label}
      </p>
      <p className="text-sm font-bold text-slate-900">{value}</p>
    </div>
  );
}

function DetailRow({ icon, label, value }) {
  return (
    <div className="flex items-center gap-4 p-4 border border-slate-100 rounded-3xl">
      <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
          {label}
        </p>
        <p className="text-sm font-bold text-slate-900">{value}</p>
      </div>
    </div>
  );
}

function SummarySkeleton() {
  return (
    <div className="p-10 max-w-6xl mx-auto space-y-10 animate-pulse">
      <div className="h-12 w-64 bg-slate-100 rounded-xl" />
      <div className="grid grid-cols-6 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-32 bg-slate-50 rounded-[2rem]" />
        ))}
      </div>
      <div className="grid grid-cols-12 gap-10">
        <div className="col-span-8 space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 bg-slate-50 rounded-[2rem]" />
          ))}
        </div>
      </div>
    </div>
  );
}