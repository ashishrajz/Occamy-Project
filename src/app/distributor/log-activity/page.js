"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PRODUCTS } from "@/lib/constants/products";
import { 
  Users, User, MapPin, Camera, Sparkles, 
  MessageSquare, ChevronRight, X,
  Loader2, Check
} from "lucide-react";
import { useTranslations } from "next-intl";

export default function LogActivityPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const presetType = searchParams.get("type");

  const t = useTranslations("common");

  const headingMap = {
    MEETING_ONE_ON_ONE: "actions.logMeeting",
    MEETING_GROUP: "actions.logMeeting",
    SAMPLE_DISTRIBUTION: "actions.logSample",
    SALE: "actions.logSale",
  };

  const [type, setType] = useState("");
  const [notes, setNotes] = useState("");
  const [odometer, setOdometer] = useState("");
  const [photos, setPhotos] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [meeting, setMeeting] = useState({
    personName: "",
    category: "FARMER",
    contact: "",
    meetingKind: "ONE_ON_ONE",
    attendeeCount: "",
    intent: "TRIAL",
    businessPotential: 2,
  });

  const [sale, setSale] = useState({
    customerName: "",
    customerCategory: "FARMER",
    mode: "B2C",
    productId: "",
    quantity: "",
  });

  const MEETING_KINDS = [
    { value: "ONE_ON_ONE", labelKey: "oneOnOne" },
    { value: "GROUP", labelKey: "group" }
  ];

  useEffect(() => {
    if (presetType) setType(presetType);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      });
    }
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

  const potentialLabels = [
    { label: "5–10kg", descKey: "potential.emerging" },
    { label: "20–50kg", descKey: "potential.growth" },
    { label: "100–200kg", descKey: "potential.high" },
    { label: "200kg+", descKey: "potential.enterprise" }
  ];
  
  async function handleSubmit() {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
        const formData = new FormData();
        formData.append("type", type);
        formData.append("lat", location.lat);
        formData.append("lng", location.lng);
        formData.append("notes", notes);
        formData.append("odometer", odometer);

        if (type.startsWith("MEETING")) formData.append("meeting", JSON.stringify(meeting));
        if (type === "SALE") formData.append("sale", JSON.stringify(sale));
        photos.forEach(photo => formData.append("photos", photo));

        await fetch("/api/distributor/activity", {
          method: "POST",
          credentials: "include",
          body: formData,
        });
        router.push("/distributor");
    } catch (error) {
        console.error("Submission failed", error);
        alert("Failed to save activity. Please try again.");
    } finally {
        setIsSubmitting(false);
    }
  }

  const glassCard = "bg-white/70 backdrop-blur-2xl rounded-[2.5rem] p-6 border border-white/40 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] ring-1 ring-inset ring-white/20";
  const iosInput = "w-full bg-white/50 backdrop-blur-md border border-slate-200/50 p-4 rounded-2xl text-[15px] font-semibold outline-none focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all placeholder:text-slate-400 text-slate-900";
  const iosLabel = "text-[12px] font-black text-slate-500/80 ml-2 uppercase tracking-[0.1em] mb-3 block";

  return (
    <div className="min-h-screen bg-[#F2F2F7] bg-gradient-to-b from-[#F2F2F7] to-[#FFFFFF] font-sans pb-32">
      
      <div className="fixed top-0 left-0 w-full h-64 bg-emerald-500/5 blur-[120px] -z-10 rounded-full" />

      <div className="max-w-md mx-auto px-5 pt-12 space-y-6">
        
        <header className="px-2 space-y-1">
        <h1 className="text-3xl font-black tracking-tight text-slate-900">
  {t(headingMap[type] || "actions.logActivity")}
</h1>

          <p className="text-slate-500 font-bold text-sm">{t("activityDetails")}</p>
        </header>

        {/* ================= MEETING SECTION ================= */}
        {type.startsWith("MEETING") && (
          <>
            <div className="bg-slate-200/50 backdrop-blur-md p-1.5 rounded-[1.5rem] flex ring-1 ring-inset ring-slate-300/20">
            {MEETING_KINDS.map(({ value, labelKey }) => (
  <button
    key={value}
    onClick={() =>
      setMeeting({ ...meeting, meetingKind: value })
    }
    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-[13px] font-black transition-all duration-300 ${
      meeting.meetingKind === value
        ? "bg-white shadow-xl text-slate-900 scale-[1.02]"
        : "text-slate-500 hover:text-slate-700"
    }`}
  >
    {value === "GROUP" ? <Users size={16} /> : <User size={16} />}
    {t(labelKey)}
  </button>
))}

            </div>

            <div className={glassCard + " space-y-5"}>
              <div>
                <label className={iosLabel}>{t("primaryContact")}</label>
                <input
                  placeholder="Person / Group Name"
                  className={iosInput}
                  value={meeting.personName}
                  onChange={(e) => setMeeting({ ...meeting, personName: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <select className={iosInput} value={meeting.category} onChange={(e) => setMeeting({ ...meeting, category: e.target.value })}>
                    <option value="FARMER">{t("farmer")}</option>
                    <option value="SELLER">{t("retailer")}</option>
                    <option value="INFLUENCER">{t("agent")}</option>
                </select>
                <input placeholder={t("phone")} className={iosInput} value={meeting.contact} onChange={(e) => setMeeting({ ...meeting, contact: e.target.value })} />
              </div>
            </div>

            <div className={glassCard + " space-y-6"}>
              <div className="flex justify-between items-center">
                <label className="text-[14px] font-black text-slate-900 flex items-center gap-2 uppercase tracking-tight">
                  <Sparkles size={18} className="text-amber-500" /> {t("potentials")}
                </label>
                <div className="px-3 py-1 bg-emerald-500 text-white text-[10px] font-black rounded-lg uppercase">
  {t(potentialLabels[meeting.businessPotential - 1]?.descKey)}
</div>

              </div>
              <input
                  type="range" min="1" max="4" step="1"
                  value={meeting.businessPotential}
                  onChange={(e) => setMeeting({ ...meeting, businessPotential: Number(e.target.value) })}
                  className="w-full h-2 bg-slate-200 rounded-full appearance-none accent-slate-900"
                />
            </div>
          </>
        )}

        {/* ================= SALE SECTION ================= */}
        {type === "SALE" && (
          <div className={glassCard + " space-y-5"}>
            <label className={iosLabel}>{t("saleRecord")}</label>
            <input placeholder={t("customerName")} className={iosInput} value={sale.customerName} onChange={(e) => setSale({ ...sale, customerName: e.target.value })} />
            <select className={iosInput} value={sale.productId} onChange={(e) => setSale({ ...sale, productId: e.target.value })}>
            <option value="">{t("selectProduct")}</option>
              {PRODUCTS.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            <input type="number" placeholder={t("quantity")} className={iosInput} value={sale.quantity} onChange={(e) => setSale({ ...sale, quantity: e.target.value })} />
          </div>
        )}

        {/* ================= PHOTO PREVIEW ================= */}
        <div className={glassCard}>
          <label className={iosLabel}>{t("photosProof")}</label>
          <div className="flex gap-3 overflow-x-auto pb-2">
            <div className="relative shrink-0 w-24 h-24 bg-slate-100 rounded-3xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 overflow-hidden">
                <input type="file" multiple accept="image/*" className="absolute inset-0 opacity-0 z-10 cursor-pointer" onChange={handleImageChange} />
                <Camera size={24} />
                <span className="text-[10px] font-black mt-1 uppercase">{t("add")}</span>
            </div>

            {previews.map((url, index) => (
              <div key={index} className="relative shrink-0 w-24 h-24">
                <img src={url} alt="preview" className="w-full h-full object-cover rounded-3xl shadow-sm" />
                <button onClick={() => removeImage(index)} className="absolute -top-1 -right-1 bg-white shadow-md text-slate-900 p-1 rounded-full border">
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ================= NOTES & ODOMETER ================= */}
        <div className={glassCard + " space-y-5"}>
          <label className={iosLabel}>{t("additionalInfo")}</label>
          <textarea
            placeholder={t("notes")}
            className="w-full bg-slate-100/50 p-4 rounded-2xl text-[14px] font-semibold outline-none min-h-[100px]"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input type="number" placeholder={t("odometer")} className={iosInput + " pl-12"} value={odometer} onChange={(e) => setOdometer(e.target.value)} />
          </div>
        </div>

        {/* ================= SAVE & PROCEED BUTTON ================= */}
        <div className="pt-4">
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`w-full py-5 rounded-[2rem] font-black flex items-center justify-center gap-3 shadow-xl transition-all active:scale-[0.97] ${
                isSubmitting ? 'bg-slate-700 text-slate-300' : 'bg-slate-900 text-white'
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  {t("saving")}
                </>
              ) : (
                <>
                  {t("saveProceed")}
                  <ChevronRight size={20} />
                </>
              )}
            </button>
        </div>

      </div>
    </div>
  );
}