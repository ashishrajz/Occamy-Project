"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  MapPin, 
  Phone, 
  Mail, 
  Send, 
  Leaf,
  CheckCircle2,
  Building2,
  Factory,
  RefreshCcw,
  Globe 
} from 'lucide-react';

const ContactPage = () => {
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);
  const [lang, setLang] = useState('en');

  const translations = {
    en: {
      title: "Support Center",
      heroTitle: "How can we help",
      heroSub: "your farm today?",
      labelName: "Name",
      labelPhone: "Mobile Number",
      labelAddress: "Address",
      placeholderName: "e.g. Rahul Patil",
      placeholderAddress: "Enter detailed address",
      btnSubmit: "Request a Callback",
      successTitle: "Request Received!",
      successSub: "An Occamy expert will contact you within 24 hours.",
      btnAnother: "Send another request",
      network: "Our Network",
      call: "Call Now",
      mail: "Send Mail"
    },
    hi: {
      title: "सहायता केंद्र",
      heroTitle: "आज हम आपकी",
      heroSub: "कैसे मदद कर सकते हैं?",
      labelName: "नाम",
      labelPhone: "मोबाइल नंबर",
      labelAddress: "पता",
      placeholderName: "उदा. राहुल पाटिल",
      placeholderAddress: "अपना पूरा पता दर्ज करें",
      btnSubmit: "कॉल बैक का अनुरोध करें",
      successTitle: "अनुरोध प्राप्त हुआ!",
      successSub: "एक विशेषज्ञ 24 घंटे के भीतर आपसे संपर्क करेगा।",
      btnAnother: "दूसरा अनुरोध भेजें",
      network: "हमारा नेटवर्क",
      call: "अभी कॉल करें",
      mail: "मेल भेजें"
    },
    mr: {
      title: "मदत केंद्र",
      heroTitle: "आज आम्ही तुमच्या",
      heroSub: "शेतीसाठी काय मदत करू शकतो?",
      labelName: "नाव",
      labelPhone: "मोबाईल नंबर",
      labelAddress: "पत्ता",
      placeholderName: "उदा. राहुल पाटील",
      placeholderAddress: "तुमचा पूर्ण पत्ता प्रविष्ट करा",
      btnSubmit: "कॉल बॅकसाठी विनंती करा",
      successTitle: "विनंती प्राप्त झाली!",
      successSub: "आमचे तज्ज्ञ २४ तासांच्या आत तुमच्याशी संपर्क साधतील.",
      btnAnother: "दुसरी विनंती पाठवा",
      network: "आमचे नेटवर्क",
      call: "कॉल करा",
      mail: "मेल पाठवा"
    }
  };

  const t = translations[lang];

  const contactInfo = {
    headOffice: "901, A wing Twins Towers, Sector 20, Kharghar, Maharashtra 410210",
    regionalOffice: "5 R S Enclave, Near SBI Kalyanpur Indira Nagar Kanpur 208026 Uttar Pradesh",
    factory: "Sarvodaya Industrial Estate, Shed No 2, Ambeghar, Pen-Khopoli Road, Raigad Maharashtra.",
    phone: "9321605475",
    email: "occamybioscience@gmail.com"
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#F7F9F6] font-sans selection:bg-emerald-100 pb-20">
      {/* Decorative Background */}
      <div className="fixed top-[-10%] right-[-10%] w-64 h-64 bg-emerald-100/40 rounded-full blur-3xl -z-10" />
      <div className="fixed bottom-[-5%] left-[-5%] w-80 h-80 bg-emerald-200/20 rounded-full blur-3xl -z-10" />

      {/* Navigation */}
      <nav className="p-4 sticky top-0 z-50">
        <div className="max-w-md mx-auto space-y-3">
          <div className="flex items-center justify-between bg-white/70 backdrop-blur-xl border border-white/40 p-2 rounded-[2rem] shadow-sm">
            <button onClick={() => router.back()} className="p-3 hover:bg-emerald-50 rounded-full text-emerald-700 transition-colors">
              <ArrowLeft size={20} />
            </button>
            <span className="font-extrabold text-gray-800 tracking-tight">{t.title}</span>
            <div className="p-3 opacity-0"><ArrowLeft size={20} /></div>
          </div>

          <div className="bg-white/50 backdrop-blur-md border border-white/40 p-1.5 rounded-2xl flex shadow-sm">
            {['en', 'hi', 'mr'].map((key) => (
              <button 
                key={key} 
                onClick={() => setLang(key)} 
                className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${lang === key ? 'bg-emerald-600 text-white shadow-md' : 'text-gray-400'}`}
              >
                {key === 'en' ? 'English' : key === 'hi' ? 'हिंदी' : 'मराठी'}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="max-w-md mx-auto px-6">
        {/* Hero Section */}
        <div className="pt-6 pb-8 text-center space-y-3">
          <div className="inline-flex p-3 bg-emerald-600 rounded-3xl shadow-lg shadow-emerald-200 mb-2">
            <Leaf className="text-white" size={28} />
          </div>
          <h2 className="text-3xl font-black text-gray-900 leading-tight">
            {t.heroTitle} <br/>
            <span className="text-emerald-600">{t.heroSub}</span>
          </h2>
        </div>

        {/* 1. INFO SECTION (NOW ABOVE) */}
        <section className="space-y-6">
          <div className="flex items-center gap-4 px-2">
            <div className="h-[1px] flex-1 bg-gray-200" />
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">{t.network}</span>
            <div className="h-[1px] flex-1 bg-gray-200" />
          </div>

          <div className="space-y-4">
            <LocationCard icon={<Building2 size={20}/>} title={lang === 'en' ? "Head Office" : lang === 'hi' ? "मुख्य कार्यालय" : "मुख्य कार्यालय"} address={contactInfo.headOffice} color="bg-emerald-50 text-emerald-700" />
            <LocationCard icon={<Building2 size={20}/>} title={lang === 'en' ? "Regional Office" : lang === 'hi' ? "क्षेत्रीय कार्यालय" : "प्रादेशिक कार्यालय"} address={contactInfo.regionalOffice} color="bg-blue-50 text-blue-700" />
            <LocationCard icon={<Factory size={20}/>} title={lang === 'en' ? "Factory Unit" : lang === 'hi' ? "फैक्टरी इकाई" : "फॅक्टरी युनिट"} address={contactInfo.factory} color="bg-orange-50 text-orange-700" />
          </div>

          <div className="flex gap-3 mb-10">
             <a href={`tel:${contactInfo.phone}`} className="flex-1 bg-emerald-600 p-5 rounded-[2rem] flex flex-col items-center justify-center gap-2 shadow-lg shadow-emerald-100 active:scale-95 transition-transform">
                <Phone className="text-white/80" size={20}/>
                <span className="text-[10px] font-black text-white uppercase tracking-widest">{t.call}</span>
             </a>
             <a href={`mailto:${contactInfo.email}`} className="flex-1 bg-white p-5 rounded-[2rem] border border-gray-100 flex flex-col items-center justify-center gap-2 shadow-sm active:scale-95 transition-transform">
                <Mail className="text-emerald-600" size={20}/>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t.mail}</span>
             </a>
          </div>
        </section>

        {/* 2. FORM SECTION (NOW BELOW) */}
        <section className="relative mt-4">
          <div className="relative bg-white p-8 rounded-[2.5rem] shadow-xl shadow-emerald-900/5 border border-white min-h-[400px] flex flex-col justify-center">
            {!submitted ? (
              <form className="space-y-5 animate-in fade-in duration-500" onSubmit={handleSubmit}>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-emerald-800 uppercase tracking-widest px-1">{t.labelName}</label>
                  <input required type="text" placeholder={t.placeholderName} className="w-full bg-gray-50/50 border border-gray-100 p-4 rounded-2xl focus:outline-none focus:border-emerald-500 focus:bg-white transition-all text-sm shadow-inner" />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-emerald-800 uppercase tracking-widest px-1">{t.labelPhone}</label>
                  <input required type="tel" placeholder="+91" className="w-full bg-gray-50/50 border border-gray-100 p-4 rounded-2xl focus:outline-none focus:border-emerald-500 focus:bg-white transition-all text-sm shadow-inner" />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-emerald-800 uppercase tracking-widest px-1">{t.labelAddress}</label>
                  <input required type="text" placeholder={t.placeholderAddress} className="w-full bg-gray-50/50 border border-gray-100 p-4 rounded-2xl focus:outline-none focus:border-emerald-500 focus:bg-white transition-all text-sm shadow-inner" />
                </div>

                <button className="group w-full bg-gray-900 hover:bg-emerald-600 text-white font-bold py-5 rounded-2xl shadow-xl hover:shadow-emerald-200 flex items-center justify-center gap-3 transition-all active:scale-95">
                  <span className="text-sm">{t.btnSubmit}</span>
                  <Send size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
              </form>
            ) : (
              <div className="py-6 text-center space-y-6 animate-in zoom-in-95 fade-in duration-700">
                <div className="relative mx-auto w-20 h-20">
                  <div className="absolute inset-0 bg-emerald-100 rounded-full animate-ping opacity-20" />
                  <div className="relative bg-emerald-500 rounded-full p-5 text-white shadow-lg">
                    <CheckCircle2 size={40} />
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">{t.successTitle}</h3>
                  <p className="text-xs text-gray-500 px-6 leading-relaxed">{t.successSub}</p>
                </div>
                <button onClick={() => setSubmitted(false)} className="inline-flex items-center gap-2 text-emerald-600 font-bold text-[10px] uppercase tracking-widest hover:bg-emerald-50 px-6 py-3 rounded-xl transition-colors">
                  <RefreshCcw size={12} /> {t.btnAnother}
                </button>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

const LocationCard = ({ icon, title, address, color }) => (
  <div className="group bg-white p-5 rounded-[2rem] border border-gray-50 flex gap-5 hover:shadow-md transition-all">
    <div className={`p-4 rounded-2xl h-fit transition-colors ${color}`}>{icon}</div>
    <div className="space-y-1">
      <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{title}</h4>
      <p className="text-[12px] text-gray-600 font-medium leading-relaxed group-hover:text-gray-900 transition-colors">{address}</p>
    </div>
  </div>
);

export default ContactPage;