"use client";

import { useEffect, useState, use } from "react";
import dynamic from "next/dynamic";
import { 
  User, 
  Clock, 
  MapPin, 
  ShoppingBag, 
  Beaker, 
  Users, 
  ChevronLeft 
} from "lucide-react";

const AdminActivityMap = dynamic(
  () => import("@/components/AdminActivityMap"),
  { ssr: false }
);

export default function AdminActivityDetail({ params }) {
  const { id } = use(params);
  const [activity, setActivity] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    fetch(`/api/admin/activity/${id}`, {
      credentials: "include",
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to load activity");
        return res.json();
      })
      .then(setActivity)
      .catch(err => setError(err.message));
  }, [id]);

  if (!id) return <p className="p-8 text-slate-500 font-medium">Invalid activity ID</p>;
  
  if (error) return (
    <div className="p-8 text-red-500 bg-red-50/50 backdrop-blur-md rounded-2xl border border-red-100 m-4">
      {error}
    </div>
  );

  if (!activity) return <ShimmerSkeleton />;

  return (
    <div className="min-h-screen bg-[#F2F2F7] text-slate-900 font-[-apple-system,BlinkMacSystemFont,sans-serif] pb-20 antialiased relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[40%] bg-blue-200/40 blur-[120px] rounded-full" />
        <div className="absolute bottom-[10%] left-[-10%] w-[50%] h-[50%] bg-emerald-200/30 blur-[120px] rounded-full" />
      </div>

      <main className="max-w-3xl mx-auto px-4 pt-8 space-y-6 relative z-10">
        <button 
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors mb-4 group"
        >
          <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-bold uppercase tracking-widest">Back</span>
        </button>

        <section className="bg-white/70 backdrop-blur-3xl border border-white/60 p-6 md:p-8 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)]">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 mb-2">Activity Details</p>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 leading-none capitalize">
                {activity.type.replaceAll("_", " ")}
              </h1>
            </div>
            <div className="w-12 h-12 bg-white rounded-2xl border border-white flex items-center justify-center shadow-sm">
               <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DetailItem icon={<User size={16}/>} label="Distributor" value={activity.distributor?.name} />
            <DetailItem icon={<Clock size={16}/>} label="Timestamp" value={new Date(activity.createdAt).toLocaleString()} />
          </div>

          {activity.address && (
            <div className="mt-6 p-4 bg-white/40 rounded-2xl border border-white/50 flex gap-3">
              <MapPin size={18} className="text-slate-400 shrink-0" />
              <p className="text-sm font-medium text-slate-600">{activity.address}</p>
            </div>
          )}
        </section>

        {activity.sale && (
          <DataCard title="Sale Information" icon={<ShoppingBag className="text-blue-500" />}>
            <div className="grid grid-cols-2 gap-y-4">
              <Stat label="Product" value={activity.sale.productId} />
              <Stat label="Quantity" value={activity.sale.quantity} />
              <Stat label="Payment Mode" value={activity.sale.mode} />
              <Stat label="Follow-up" value={activity.sale.isFollowUpSale ? "Yes" : "No"} />
            </div>
          </DataCard>
        )}

        {activity.sample && (
          <DataCard title="Sample Provided" icon={<Beaker className="text-amber-500" />}>
            <div className="grid grid-cols-2 gap-y-4">
              <Stat label="Product" value={activity.sample.productId} />
              <Stat label="Quantity" value={activity.sample.quantity} />
              <Stat label="Purpose" value={activity.sample.purpose} className="col-span-2" />
            </div>
          </DataCard>
        )}

        {activity.meeting && (
          <DataCard title="Meeting Logs" icon={<Users className="text-violet-500" />}>
            <div className="grid grid-cols-2 gap-y-4">
              <Stat label="Contact Person" value={activity.meeting.personName} />
              <Stat label="Category" value={activity.meeting.category} />
              <Stat label="Intent" value={activity.meeting.intent} className="col-span-2" />
            </div>
          </DataCard>
        )}

        {activity.photos?.length > 0 && (
          <div className="bg-white/70 backdrop-blur-3xl border border-white/60 p-6 rounded-[2.5rem]">
             <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Evidence & Photos</p>
             <div className="grid grid-cols-2 gap-3">
                {activity.photos.map((p, i) => (
                  <div key={i} className="aspect-square rounded-3xl overflow-hidden border-2 border-white shadow-sm hover:scale-[1.02] transition-transform cursor-zoom-in">
                    <img src={p} alt="Activity" className="w-full h-full object-cover" />
                  </div>
                ))}
             </div>
          </div>
        )}

        {activity.location?.lat && activity.location?.lng && (
          <div className="bg-white/70 backdrop-blur-3xl border border-white/60 p-2 rounded-[2.5rem] overflow-hidden shadow-xl">
            <div className="p-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Geographic Ping</p>
            </div>
            <div className="h-64 w-full rounded-[2rem] overflow-hidden">
              <AdminActivityMap
                lat={activity.location.lat}
                lng={activity.location.lng}
                address={activity.address}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function DataCard({ title, icon, children }) {
  return (
    <div className="bg-white/70 backdrop-blur-3xl border border-white/60 p-6 md:p-8 rounded-[2.5rem] shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-100">{icon}</div>
        <h2 className="text-lg font-bold tracking-tight text-slate-900">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function DetailItem({ icon, label, value }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-white/40 rounded-2xl border border-white/50">
      <div className="text-slate-400">{icon}</div>
      <div>
        <p className="text-[9px] font-black uppercase tracking-tighter text-slate-400">{label}</p>
        <p className="text-xs font-bold text-slate-700">{value}</p>
      </div>
    </div>
  );
}

function Stat({ label, value, className = "" }) {
  return (
    <div className={className}>
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{label}</p>
      <p className="text-sm font-bold text-slate-800">{value || "N/A"}</p>
    </div>
  );
}

function ShimmerSkeleton() {
  return (
    <div className="min-h-screen bg-[#F2F2F7] p-8 animate-pulse">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="h-4 w-20 bg-slate-200 rounded-full mb-8" />
        <div className="h-64 bg-white/60 rounded-[2.5rem] border border-white" />
        <div className="h-40 bg-white/60 rounded-[2.5rem] border border-white" />
        <div className="h-40 bg-white/60 rounded-[2.5rem] border border-white" />
      </div>
    </div>
  );
}