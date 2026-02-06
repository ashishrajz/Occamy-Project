"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  ShieldCheck, 
  Star, 
  Heart,
  ChevronRight,
  PhoneCallIcon
} from 'lucide-react';

const ProductPage = ({ params }) => {
  const router = useRouter();
  const { id } = React.use(params);
  
  const [lang, setLang] = useState('eng');
  const [isLiked, setIsLiked] = useState(false);

  const productData = {
    bovi: {
      eng: {
        name: "Occamy BOVI",
        tagline: "The Soil Vitalizer",
        price: "₹1,450",
        description: "BOVI is a premium bio-stimulant engineered with high-velocity organic acids. It acts as a biological catalyst to revitalize exhausted soil microbial life instantly.",
        benefits: ["Increases NPK availability", "Improves soil aeration", "Boosts organic carbon"],
        labels: { about: "About Product", benefits: "Key Benefits", contact: "Contact Dealer" }
      },
      hin: {
        name: "ओकमी BOVI",
        tagline: "मिट्टी का जीवनदाता",
        price: "₹1,450",
        description: "BOVI एक प्रीमियम बायो-स्टिमुलेंट है जिसे उच्च-वेग वाले कार्बनिक एसिड के साथ बनाया गया है। यह थकी हुई मिट्टी के सूक्ष्मजीवों को तुरंत पुनर्जीवित करने के लिए उत्प्रेरक के रूप में कार्य करता है।",
        benefits: ["NPK की उपलब्धता बढ़ाता है", "मिट्टी के वतन में सुधार", "जैविक कार्बन को बढ़ावा"],
        labels: { about: "उत्पाद के बारे में", benefits: "मुख्य लाभ", contact: "डीलर से संपर्क करें" }
      },
      mar: {
        name: "ओकमी BOVI",
        tagline: "जमिनीचा संजीवनी",
        price: "₹1,450",
        description: "BOVI हे उच्च-वेग सेंद्रिय ॲसिडसह इंजिनिअर केलेले प्रीमियम बायो-स्टिमुलंट आहे. हे थकलेल्या जमिनीतील सूक्ष्मजीव सृष्टीला त्वरित पुनरुज्जीवित करण्यासाठी जैविक उत्प्रेरक म्हणून कार्य करते.",
        benefits: ["NPK उपलब्धता वाढवते", "जमिनीची हवा खेळती ठेवते", "सेंद्रिय कर्ब वाढवते"],
        labels: { about: "उत्पादनाबद्दल माहिती", benefits: "मुख्य फायदे", contact: "डीलरशी संपर्क साधा" }
      }
    },
    rakshak: {
      eng: {
        name: "Occamy RAKSHAK",
        tagline: "The Crop Protector",
        price: "₹950",
        description: "RAKSHAK acts as an organic shield. It utilizes bio-rational technology to build internal immunity against fungal and bacterial stresses.",
        benefits: ["Zero-chemical shield", "Eco-friendly guard", "Long-lasting immunity"],
        labels: { about: "About Product", benefits: "Key Benefits", contact: "Contact Dealer" }
      },
      hin: {
        name: "ओकमी RAKSHAK",
        tagline: "फसल रक्षक",
        price: "₹950",
        description: "RAKSHAK एक जैविक ढाल के रूप में कार्य करता है। यह फंगल और बैक्टीरियल तनाव के खिलाफ आंतरिक प्रतिरक्षा बनाने के लिए बायो-रेशनल तकनीक का उपयोग करता है।",
        benefits: ["शून्य-रासायनिक ढाल", "पर्यावरण के अनुकूल", "दीर्घकालिक प्रतिरक्षा"],
        labels: { about: "उत्पाद के बारे में", benefits: "मुख्य लाभ", contact: "डीलर से संपर्क करें" }
      },
      mar: {
        name: "ओकमी RAKSHAK",
        tagline: "पीक संरक्षक",
        price: "₹950",
        description: "RAKSHAK एक सेंद्रिय संरक्षण कवच म्हणून कार्य करते. हे बुरशीजन्य आणि बॅक्टेरियल तणावाविरुद्ध अंतर्गत प्रतिकारशक्ती निर्माण करण्यासाठी बायो-रेशनल तंत्रज्ञानाचा वापर करते.",
        benefits: ["झिरो-केमिकल कवच", "पर्यावरणपूरक रक्षक", "दीर्घकाळ टिकणारी प्रतिकारशक्ती"],
        labels: { about: "उत्पादनाबद्दल माहिती", benefits: "मुख्य फायदे", contact: "डीलरशी संपर्क साधा" }
      }
    }
  };

  const productInfo = productData[id] || productData.bovi;
  const content = productInfo[lang];

  return (
    <div className="min-h-screen bg-[#F2F2F7] font-[-apple-system,BlinkMacSystemFont,sans-serif] text-black antialiased">
      
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 pt-12 pb-4 bg-white/40 backdrop-blur-2xl border-b border-white/20 flex justify-between items-center">
        <button 
          onClick={() => router.back()} 
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white/80 shadow-sm border border-white/40 active:scale-90 transition-transform"
        >
          <ArrowLeft size={20} strokeWidth={2.5} />
        </button>

        <div className="flex bg-white/50 p-1 rounded-full border border-white/40 backdrop-blur-md">
          {['eng', 'hin', 'mar'].map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase transition-all ${
                lang === l ? 'bg-black text-white' : 'text-slate-500'
              }`}
            >
              {l}
            </button>
          ))}
        </div>

        <button 
          onClick={() => setIsLiked(!isLiked)}
          className={`w-10 h-10 flex items-center justify-center rounded-full border transition-all active:scale-75 ${
            isLiked ? 'bg-red-50 border-red-100 text-red-500' : 'bg-white/80 border-white/40'
          }`}
        >
          <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
        </button>
      </nav>

      <div className="relative pt-32 pb-10 flex items-center justify-center overflow-hidden">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-64 h-64 bg-emerald-400/20 blur-[100px] rounded-full" />
        <div className="relative z-10 w-full px-12 group">
          <div className="overflow-hidden rounded-[3rem] bg-white/30 backdrop-blur-md border border-white/40 shadow-inner">
            <img 
              src={`/${id || 'bovi'}.png`} 
              alt={content.name} 
              className="w-full h-72 object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.1)] group-hover:scale-110 transition-transform duration-700 ease-out p-6" 
            />
          </div>
        </div>
      </div>

      <main className="px-6 pb-40">
        <div className="bg-white/70 backdrop-blur-3xl rounded-[2.5rem] p-8 border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.05)] space-y-8">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600/80">{content.tagline}</span>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">{content.name}</h1>
            </div>
            <div className="flex flex-col items-end">
              <div className="flex items-center gap-1 bg-black text-white px-3 py-1 rounded-full text-xs font-bold">
                <Star size={12} className="fill-current" />
                <span>5.0</span>
              </div>
            </div>
          </div>

          <section className="space-y-4">
             <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400">{content.labels.about}</h2>
             <p className="text-[15px] leading-relaxed text-slate-600 font-medium">
                {content.description}
             </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400">{content.labels.benefits}</h2>
            <div className="space-y-3">
              {content.benefits.map((benefit, index) => (
                <div key={index} className="flex items-center justify-between bg-white/50 p-4 rounded-2xl border border-white">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <ShieldCheck size={20} strokeWidth={2.5} />
                    </div>
                    <span className="text-[14px] font-bold text-slate-800">{benefit}</span>
                  </div>
                  <ChevronRight size={16} className="text-slate-300" />
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      <footer className="fixed bottom-8 left-6 right-6 z-50">
        <div className="bg-slate-900/90 backdrop-blur-2xl rounded-[2rem] p-4 flex items-center justify-between border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
          <div className="pl-4">
            <span className="text-xl font-black text-white">{content.price}</span>
          </div>
          <button className="flex items-center gap-3 bg-emerald-500 text-white px-8 py-4 rounded-2xl font-bold transition-all active:scale-95 shadow-lg shadow-emerald-500/20" onClick={()=>router.push('/contactus')}>
            <PhoneCallIcon size={18} />
            <span>{content.labels.contact}</span>
          </button>
        </div>
      </footer>
    </div>
  );
};

export default ProductPage;