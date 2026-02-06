"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  Users, User, MapPin, Camera, Sparkles, 
  ChevronRight, X, Loader2, Package, 
  Clock, Globe, Shield,
  Sprout
} from "lucide-react";
import { useTranslations } from "next-intl";

const PRODUCT_ENUM = ["RAKSHAK", "BOVI_BOOSTER", "JODI_NO_1", "BUCK_BOOSTER"];

function LogActivityContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const presetType = searchParams.get("type");

  const [type, setType] = useState("");
  const [notes, setNotes] = useState("");
  const [odometer, setOdometer] = useState("");
  const [photos, setPhotos] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const t = useTranslations("common");


  const [geo, setGeo] = useState({ state: t("detecting"), district: t("detecting"), village: "" });

  const [location, setLocation] = useState({ lat: null, lng: null });

  const [meeting, setMeeting] = useState({
    personName: "",
    category: "FARMER",
    contact: "",
    meetingKind: "ONE_ON_ONE",
    attendeeCount: "1",
    intent: "TRIAL",
    businessPotential: 2,
  });

  const [sample, setSample] = useState({
    productId: "",
    quantity: "",
    purpose: "TRIAL",
    givenTo: "",
  });

  const [sale, setSale] = useState({
    customerName: "",
    customerCategory: "FARMER",
    productId: "",
    sku: "",
    packSize: "",
    quantity: "",
    mode: "B2C",
    amount: "",
    isFollowUpSale: false,
    isRepeatOrder: false,
  });

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    if (presetType) setType(presetType);
    
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        const { latitude, longitude } = pos.coords;
        setLocation({ lat: latitude, lng: longitude });
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await res.json();
          const addr = data.address;
          setGeo({
            state: addr.state || "",
            district: addr.city || addr.district || addr.county || "",
            village: addr.suburb || addr.village || addr.town || ""
          });
        } catch (e) {
          console.error(t("reverseGeocodeFailed"));

        }
      });
    }
    return () => clearInterval(timer);
  }, [presetType]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setPhotos((prev) => [...prev, ...files]);
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    setPhotos(photos.filter((_, i) => i !== index));
    setPreviews(previews.filter((_, i) => i !== index));
  };

  async function handleSubmit() {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
        const formData = new FormData();
        formData.append("type", type);
        formData.append("location", JSON.stringify(location));
        formData.append("geo", JSON.stringify(geo));
        formData.append("notes", notes);
        formData.append("odometer", odometer);
        if (type.startsWith("MEETING")) formData.append("meeting", JSON.stringify(meeting));
        if (type === "SALE") formData.append("sale", JSON.stringify(sale));
        if (type === "SAMPLE_DISTRIBUTION") formData.append("sample", JSON.stringify(sample));
        photos.forEach(photo => formData.append("photos", photo));
        await fetch("/api/distributor/activity", { method: "POST", body: formData });
        router.push("/distributor");
    } catch (error) {
      alert(t("submissionFailed"));

    } finally {
        setIsSubmitting(false);
    }
  }

  const glassCard = "bg-white/70 backdrop-blur-2xl rounded-[2.5rem] p-6 border border-white/40 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] ring-1 ring-inset ring-white/20";
  const iosInput = "w-full bg-white/50 backdrop-blur-md border border-slate-200/50 p-4 rounded-2xl text-[15px] font-semibold outline-none focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all placeholder:text-slate-400 text-slate-900";
  const iosLabel = "text-[12px] font-black text-slate-500/80 ml-2 uppercase tracking-[0.1em] mb-3 block";

  return (
    <div className="min-h-screen bg-[#F2F2F7] bg-gradient-to-b from-[#F2F2F7] to-[#FFFFFF] pb-32">
      <div className="max-w-md mx-auto px-5 pt-12 space-y-6">
        <header className="px-2 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 uppercase">
            {type ? type.replace(/_/g, " ") : "Log Activity"}

            </h1>
            <p className="text-slate-500 font-bold text-sm">{t("realTimeEntry")}
            </p>
          </div>
          <div className="bg-emerald-500 px-4 py-2 rounded-2xl shadow-lg shadow-emerald-200 text-white text-right">
             <div className="flex items-center gap-1.5 justify-end">
                <Clock size={12} className="animate-pulse" />
                <span className="text-[10px] font-black uppercase leading-none">{t("currentTime")}
                </span>
             </div>
             <div className="text-lg font-black leading-none mt-1">
               {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
             </div>
          </div>
        </header>

        <div className="bg-emerald-600 rounded-[2.5rem] p-6 text-white shadow-2xl shadow-emerald-200 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
             <Sprout size={120} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
                <MapPin size={20} />
              </div>
              <div>
                <h3 className="text-[10px] font-black uppercase opacity-80 tracking-widest">{t("verifiedLocation")}
                </h3>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 border-t border-white/20 pt-4">
               <div>
                 <p className="text-[10px] font-black opacity-60 uppercase">{t("district")}</p>
                 <p className="font-bold text-xs truncate">{geo.district}</p>
               </div>
               <div>
                 <p className="text-[10px] font-black opacity-60 uppercase">{t("coordinates")}</p>
                 <p className="font-bold text-[10px] font-mono">{location.lat?.toFixed(4)}, {location.lng?.toFixed(4)}</p>
               </div>
            </div>
          </div>
        </div>

        {type.startsWith("MEETING") && (
          <>
            <div className="bg-slate-200/50 backdrop-blur-md p-1.5 rounded-[1.5rem] flex">
              {['ONE_ON_ONE', 'GROUP'].map((kind) => (
                <button
                  key={kind}
                  onClick={() => setMeeting({ ...meeting, meetingKind: kind })}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-[13px] font-black transition-all ${
                    meeting.meetingKind === kind ? 'bg-white shadow-xl text-slate-900' : 'text-slate-500'
                  }`}
                >
                  {kind === 'GROUP' ? <Users size={16} /> : <User size={16} />}
                  {t(`meetingKind.${kind}`)}
                </button>
              ))}
            </div>

            <div className={glassCard + " space-y-5"}>
              <input placeholder={t("personOrGroup")}
 className={iosInput} value={meeting.personName} onChange={(e) => setMeeting({ ...meeting, personName: e.target.value })} />
              <div className="grid grid-cols-2 gap-4">
                <select className={iosInput} value={meeting.category} onChange={(e) => setMeeting({ ...meeting, category: e.target.value })}>
                <option value="FARMER">{t("farmer")}</option>
<option value="SELLER">{t("retailer")}</option>
<option value="INFLUENCER">{t("influencer")}</option>

                </select>
                <input placeholder={t("contactPhone")} className={iosInput} value={meeting.contact} onChange={(e) => setMeeting({ ...meeting, contact: e.target.value })} />
              </div>
              {meeting.meetingKind === "GROUP" && (
                 <input type="number" placeholder={t("attendeeCount")} className={iosInput} value={meeting.attendeeCount} onChange={(e) => setMeeting({ ...meeting, attendeeCount: e.target.value })} />
              )}
              <select className={iosInput} value={meeting.intent} onChange={(e) => setMeeting({ ...meeting, intent: e.target.value })}>
              <option value="TRIAL">{t("trialIntent")}</option>
<option value="DEMO">{t("productDemo")}</option>
<option value="FOLLOW_UP">{t("followUp")}</option>

              </select>
            </div>
          </>
        )}

        {type === "SAMPLE_DISTRIBUTION" && (
          <div className={glassCard + " space-y-5"}>
            <label className={iosLabel}>{t("sampleDetails")}
            </label>
            <select className={iosInput} value={sample.productId} onChange={(e) => setSample({ ...sample, productId: e.target.value })}>
                <option value="">{t("selectSampleProduct")}
                </option>
                {PRODUCT_ENUM.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            <div className="grid grid-cols-2 gap-4">
                <input type="number" placeholder={t("quantity")} className={iosInput} value={sample.quantity} onChange={(e) => setSample({ ...sample, quantity: e.target.value })} />
                <select className={iosInput} value={sample.purpose} onChange={(e) => setSample({ ...sample, purpose: e.target.value })}>
                <option value="TRIAL">{t("trial")}</option>
                <option value="DEMO">{t("demo")}</option>
                </select>
            </div>
            <input placeholder={t("givenTo")} className={iosInput} value={sample.givenTo} onChange={(e) => setSample({ ...sample, givenTo: e.target.value })} />
          </div>
        )}

        {type === "SALE" && (
          <div className={glassCard + " space-y-5"}>
            <label className={iosLabel}>{t("saleRecord")}
            </label>
            <input placeholder={t("customerName")} className={iosInput} value={sale.customerName} onChange={(e) => setSale({ ...sale, customerName: e.target.value })} />
            <div className="grid grid-cols-2 gap-4">
                <select className={iosInput} value={sale.customerCategory} onChange={(e) => setSale({ ...sale, customerCategory: e.target.value })}>
                <option value="FARMER">{t("farmer")}</option>
<option value="RETAILER">{t("retailer")}</option>
<option value="DISTRIBUTOR">{t("distributor")}</option>

                </select>
                <select className={iosInput} value={sale.mode} onChange={(e) => setSale({ ...sale, mode: e.target.value })}>
                    <option value="B2C">B2C</option>
                    <option value="B2B">B2B</option>
                </select>
            </div>
            <select className={iosInput} value={sale.productId} onChange={(e) => setSale({ ...sale, productId: e.target.value })}>
                <option value="">{t("selectProduct")}
                </option>
                {PRODUCT_ENUM.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            <div className="grid grid-cols-2 gap-4">
                <input type="number" placeholder={t("quantity")} className={iosInput} value={sale.quantity} onChange={(e) => setSale({ ...sale, quantity: e.target.value })} />
                <input type="number" placeholder={t("totalAmount")}
 className={iosInput} value={sale.amount} onChange={(e) => setSale({ ...sale, amount: e.target.value })} />
            </div>
            <div className="flex gap-2">
                <button onClick={() => setSale({...sale, isRepeatOrder: !sale.isRepeatOrder})} className={`flex-1 py-3 rounded-xl text-[10px] font-black border ${sale.isRepeatOrder ? 'bg-emerald-500 text-white' : 'bg-white text-slate-400'}`}>{t("repeat")}</button>
                <button onClick={() => setSale({...sale, isFollowUpSale: !sale.isFollowUpSale})} className={`flex-1 py-3 rounded-xl text-[10px] font-black border ${sale.isFollowUpSale ? 'bg-blue-500 text-white' : 'bg-white text-slate-400'}`}>{t("followUp")}</button>
            </div>
          </div>
        )}

        <div className={glassCard}>
          <label className={iosLabel}>{t("photosProof")}</label>
          <div className="flex gap-3 overflow-x-auto pb-2">
            <div className="relative shrink-0 w-24 h-24 bg-slate-100 rounded-3xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400">
                <input type="file" multiple accept="image/*" className="absolute inset-0 opacity-0 z-10 cursor-pointer" onChange={handleImageChange} />
                <Camera size={24} />
                <span className="text-[10px] font-black mt-1 uppercase">{t("add")}
                </span>
            </div>
            {previews.map((url, index) => (
              <div key={index} className="relative shrink-0 w-24 h-24">
                <img src={url} alt="preview" className="w-full h-full object-cover rounded-3xl shadow-sm" />
                <button onClick={() => removeImage(index)} className="absolute -top-1 -right-1 bg-white shadow-md p-1 rounded-full border"><X size={12} /></button>
              </div>
            ))}
          </div>
        </div>

        <div className={glassCard + " space-y-5"}>
          <textarea
            placeholder={t("fieldNotes")}

            className="w-full bg-slate-100/50 p-4 rounded-2xl text-[14px] font-semibold outline-none min-h-[80px]"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
          <div className="relative">
            <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input type="number" placeholder={t("odometer")}
 className={iosInput + " pl-12"} value={odometer} onChange={(e) => setOdometer(e.target.value)} />
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className={`w-full py-5 rounded-[2rem] font-black flex items-center justify-center gap-3 shadow-xl transition-all active:scale-95 ${
            isSubmitting ? 'bg-slate-700 text-slate-300' : 'bg-slate-900 text-white'
          }`}
        >
          {isSubmitting ? (
  <Loader2 className="animate-spin" size={20} />
) : (
  t("finishActivity")
)}

          {!isSubmitting && <ChevronRight size={20} />}
        </button>
      </div>
    </div>
  );
}

export default function LogActivityPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="animate-spin" /></div>}>
      <LogActivityContent />
    </Suspense>
  );
}