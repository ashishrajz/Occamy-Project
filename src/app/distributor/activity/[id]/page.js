"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import MapView from "@/components/MapView";

import { useTranslations } from "next-intl";

import { 
  Calendar, MapPin, User, Tag, 
  Package, ShoppingCart, FileText, 
  Image as ImageIcon, ChevronLeft, Clock,
  Briefcase, TrendingUp, IndianRupee
} from "lucide-react";

export default function ActivityDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [activity, setActivity] = useState(null);

  const t = useTranslations("common");


  useEffect(() => {
    if (!id) return;
    fetch(`/api/distributor/activity/${id}`, { credentials: "include" })
      .then(res => res.json())
      .then(setActivity);
  }, [id]);

  if (!activity) return <DetailSkeleton />;

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 font-sans">
     

      <main className="max-w-2xl mx-auto p-4 space-y-6">
        
        {/* HERO SECTION: MAP */}
        <div className="rounded-[2.5rem] overflow-hidden shadow-xl shadow-slate-200 border-4 border-white h-64 relative">
          <MapView activities={[activity]} />
          <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-2xl shadow-lg border border-white">
            <div className="flex items-center gap-2 text-emerald-600">
              <MapPin size={16} />
              <span className="text-xs font-bold uppercase tracking-widest">{t("verifiedSpot")}</span>
            </div>
          </div>
        </div>

        {/* TIME & LOCATION CARD */}
        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 flex justify-between items-center">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-slate-400">
              <Calendar size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest">{t("loggedOn")}</span>
            </div>
            <p className="text-sm font-bold text-slate-800">
              {new Date(activity.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </p>
          </div>
          <div className="h-10 w-[1px] bg-slate-100" />
          <div className="space-y-1 text-right">
            <div className="flex items-center gap-2 text-slate-400 justify-end">
              <Clock size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest">{t("loggedOn")}</span>
            </div>
            <p className="text-sm font-bold text-slate-800">
              {new Date(activity.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>

        {/* DYNAMIC CONTENT SECTIONS */}
        <div className="space-y-4">
          
          {/* MEETING SECTION */}
          {activity.meeting && (
            <DataSection title={t("transactionDetails")} icon={<Briefcase size={18} className="text-blue-500" />}>
              <GridItem label={t("primaryContact")} value={activity.meeting.personName} icon={<User size={14} />} />
              <GridItem label={t("category")} value={activity.meeting.category} icon={<Tag size={14} />} />
              <GridItem label={t("village")} value={activity.meeting.village || "Not Specified"} icon={<MapPin size={14} />} />
              <GridItem 
                label={t("businessPotential")} 
                value={activity.meeting.businessPotential} 
                icon={<TrendingUp size={14} />} 
                highlight 
              />
            </DataSection>
          )}

          {/* SAMPLE SECTION */}
          {activity.sample && (
            <DataSection title={t("sampleDistribution")} icon={<Package size={18} className="text-amber-500" />}>
              <GridItem label={t("productName")} value={activity.sample.productName} />
              <GridItem label={t("quantityIssued")} value={activity.sample.quantity} />
              <div className="col-span-2 mt-2 p-3 bg-amber-50 rounded-xl text-xs text-amber-800 font-medium">
                <strong>{t("purpose")}</strong> {activity.sample.purpose}
              </div>
            </DataSection>
          )}

          {/* SALE SECTION */}
          {activity.sale && (
            <DataSection title={t("transactionDetails")} icon={<ShoppingCart size={18} className="text-emerald-500" />}>
              <GridItem label={t("customer")} value={activity.sale.customerName} />
              <GridItem label={t("mode")} value={activity.sale.mode} />
              <GridItem label={t("productId")} value={activity.sale.productId} />
              <GridItem label={t("volume")} value={activity.sale.quantity} />
              <div className="col-span-2 flex gap-2 pt-2">
                <Badge label={t("repeatOrder")} active={activity.sale.isRepeatOrder} />
                <Badge label={t("followUpSale")} active={activity.sale.isFollowUpSale} />
              </div>
              {activity.sale.amount && (
                <div className="col-span-2 mt-4 bg-emerald-600 p-4 rounded-2xl flex justify-between items-center text-white shadow-lg shadow-emerald-200">
                  <span className="text-xs font-bold uppercase tracking-widest opacity-80">{t("totalRevenue")}</span>
                  <span className="text-xl font-black flex items-center gap-1">
                    <IndianRupee size={20} /> {activity.sale.amount}
                  </span>
                </div>
              )}
            </DataSection>
          )}

          {/* ADDRESS & NOTES */}
          <DataSection title={t("fieldNotes")} icon={<FileText size={18} className="text-slate-500" />}>
             <div className="space-y-4">
                {activity.address && (
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">{t("geocodedAddress")}</p>
                    <p className="text-xs font-bold text-slate-700 leading-relaxed">{activity.address}</p>
                  </div>
                )}
                {activity.notes && (
                  <p className="text-sm text-slate-600 leading-relaxed italic">
                    "{activity.notes}"
                  </p>
                )}
             </div>
          </DataSection>

          {/* PHOTOS */}
          {activity.photos?.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 px-2">
                <ImageIcon size={18} className="text-indigo-500" />
                <h2 className="text-sm font-black text-slate-800 uppercase tracking-tight">Visual Evidence</h2>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {activity.photos.map((url, i) => (
                  <div key={i} className="group relative rounded-3xl overflow-hidden border-2 border-white shadow-md transition-transform hover:scale-[1.02]">
                    <img
                      src={url}
                      alt="Activity Proof"
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// ATOMIC COMPONENTS FOR THE REDESIGN
function DataSection({ title, icon, children }) {
  return (
    <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 space-y-4">
      <div className="flex items-center gap-3 border-b border-slate-50 pb-3">
        {icon}
        <h2 className="font-black text-slate-800 text-sm uppercase tracking-tight">{title}</h2>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {children}
      </div>
    </div>
  );
}

function GridItem({ label, value, icon, highlight }) {
  return (
    <div className="space-y-1">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
        {icon} {label}
      </p>
      <p className={`text-sm font-bold ${highlight ? 'text-emerald-600' : 'text-slate-700'}`}>
        {value}
      </p>
    </div>
  );
}

function Badge({ label, active }) {
  if (!active) return null;
  return (
    <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-tighter border border-emerald-100">
      {label}
    </span>
  );
}

function DetailSkeleton() {
  return (
    <div className="p-6 space-y-6 animate-pulse">
      <div className="h-10 w-1/2 bg-slate-200 rounded-xl" />
      <div className="h-64 w-full bg-slate-200 rounded-[2.5rem]" />
      <div className="space-y-4">
        <div className="h-20 w-full bg-slate-200 rounded-2xl" />
        <div className="h-40 w-full bg-slate-200 rounded-2xl" />
      </div>
    </div>
  );
}