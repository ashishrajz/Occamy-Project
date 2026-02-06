"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Correct import for App Router
import { 
  LogOut, 
  Leaf, 
  ChevronRight, 
  Search,
  SlidersHorizontal,
  Heart,
  ShoppingCart,
  Globe,
  Star,
  PhoneCall 
} from 'lucide-react';

const FarmerDashboard = () => {
  const [lang, setLang] = useState('en');
  const router = useRouter(); // Initialize the router

  const translations = {
    en: {
      langName: "English",
      greeting: "Hello, Farmer",
      subGreeting: "Welcome to Occamy Bioscience",
      search: "Search bio-solutions...",
      supplies: "Premium Bio-Solutions",
      seeAll: "Full Catalog",
      viewDetail: "Product Info",
      contact: "Support",
      reviews: "Reviews",
      products: [
        { id: "bovi", name: "Occamy BOVI", category: "Bio-Stimulant", sticker: "High Yield", summary: "A powerful combination of organic acids and plant extracts.", price: "₹1,450", rating: 4.8, reviewCount: 124, image: "/bovi.png" },
        { id: "rakshak", name: "Occamy RAKSHAK", category: "Plant Protector", sticker: "Eco-Guard", summary: "Bio-rational plant protector against fungal stresses.", price: "₹950", rating: 4.5, reviewCount: 89, image: "/rakshak.png" },
        { id: "jodi", name: "Occamy JODI", category: "Yield Enhancer", sticker: "Best Result", summary: "Synergistic formula for balanced growth.", price: "₹1,850", rating: 4.9, reviewCount: 210, image: "/jodi.png" }
      ]
    },
    hi: {
      langName: "हिन्दी",
      greeting: "नमस्ते, किसान",
      subGreeting: "Occamy Bioscience में स्वागत है",
      search: "खोजें...",
      supplies: "प्रीमियम उत्पाद",
      seeAll: "पूरा कैटलॉग",
      viewDetail: "विवरण",
      contact: "संपर्क",
      reviews: "समीक्षाएं",
      products: [
        { id: "bovi", name: "Occamy BOVI (बोवी)", category: "मिट्टी सुधारक", sticker: "अधिक पैदावार", summary: "मिट्टी की उर्वरता बढ़ाने के लिए जैविक एसिड।", price: "₹1,450", rating: 4.8, reviewCount: 124, image: "/bovi.png" },
        { id: "rakshak", name: "Occamy RAKSHAK (रक्षक)", category: "पौधा रक्षक", sticker: "सुरक्षा कवच", summary: "फफूंद और बैक्टीरिया से सुरक्षा।", price: "₹950", rating: 4.5, reviewCount: 89, image: "/rakshak.png" },
        { id: "jodi", name: "Occamy JODI (जोड़ी)", category: "पैदावार वर्धक", sticker: "बेहतरीन परिणाम", summary: "बेहतर फूलों और विकास के लिए जोड़ी।", price: "₹1,850", rating: 4.9, reviewCount: 210, image: "/jodi.png" }
      ]
    },
    mr: {
      langName: "मराठी",
      greeting: "नमस्कार, शेतकरी मित्र",
      subGreeting: "Occamy Bioscience मध्ये आपले स्वागत आहे",
      search: "बायो-सोल्युशन्स शोधा...",
      supplies: "प्रीमियम उत्पादने",
      seeAll: "सर्व उत्पादने",
      viewDetail: "माहिती पहा",
      contact: "संपर्क",
      reviews: "समीक्षा",
      products: [
        { id: "bovi", name: "Occamy BOVI (बोवी)", category: "मृदा सुधारक", sticker: "भरघोस उत्पन्न", summary: "मातीची सुपीकता वाढवण्यासाठी सेंद्रिय ॲसिड.", price: "₹1,450", rating: 4.8, reviewCount: 124, image: "/bovi.png" },
        { id: "rakshak", name: "Occamy RAKSHAK (रक्षक)", category: "पीक संरक्षक", sticker: "सुरक्षा कवच", summary: "बुरशी आणि बॅक्टेरियापासून पिकाचे संरक्षण.", price: "₹950", rating: 4.5, reviewCount: 89, image: "/rakshak.png" },
        { id: "jodi", name: "Occamy JODI (जोडी)", category: "उत्पन्न वर्धक", sticker: "उत्तम निकाल", summary: "चांगल्या फुलांसाठी आणि वाढीसाठी जोडी.", price: "₹1,850", rating: 4.9, reviewCount: 210, image: "/jodi.png" }
      ]
    }
  };

  const t = translations[lang] || translations['en'];

  return (
    <div className="min-h-screen bg-[#F9F9F9] font-sans pb-32">
      {/* Fixed Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100 px-6 py-4">
        <div className="flex flex-col gap-4 max-w-md mx-auto">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Globe size={14} className="text-emerald-600" />
              <span className="text-[10px] font-black uppercase tracking-tighter text-gray-400">Language / भाषा</span>
            </div>
            
            {/* Fixed Router Push */}
            <button 
              className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full text-xs font-bold border border-emerald-100 active:scale-95 transition-all shadow-sm shadow-emerald-900/5"
              onClick={() => router.push('/contactus')}
            >
              <PhoneCall size={14} />
              {t.contact}
            </button>
          </div>

          <div className="bg-gray-50 p-1 rounded-2xl flex border border-gray-100 shadow-inner">
            {Object.keys(translations).map((key) => (
              <button 
                key={key} 
                onClick={() => setLang(key)} 
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${lang === key ? 'bg-emerald-600 text-white shadow-md' : 'text-gray-400'}`}
              >
                {translations[key].langName}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-40"> 
        <header className="px-6 pb-6 space-y-2">
          <h1 className="text-2xl font-bold text-gray-900">{t.greeting}</h1>
          <p className="text-sm text-gray-500">{t.subGreeting}</p>
          <div className="pt-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input type="text" placeholder={t.search} className="w-full bg-white py-4 pl-12 pr-4 rounded-2xl shadow-sm focus:outline-none text-sm border border-transparent focus:border-emerald-200 transition-all" />
            </div>
          </div>
        </header>

        {/* Horizontal Cards Section */}
        <section className="space-y-4 mb-8">
          <div className="px-6 flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-900">{t.supplies}</h2>
            <span className="text-emerald-600 text-xs font-bold uppercase tracking-wide">{t.seeAll}</span>
          </div>

          <div className="flex overflow-x-auto gap-5 px-6 pb-4 no-scrollbar">
            {t.products.map((product) => (
              <Link key={product.id} href={`/products/${product.id}`} className="relative min-w-[280px] h-[380px] rounded-[2.5rem] overflow-hidden shadow-2xl active:scale-95 transition-transform">
                <img src={product.image} className="absolute inset-0 w-full h-full object-cover" alt={product.name} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 space-y-3">
                  <p className="text-emerald-400 text-[10px] font-bold uppercase tracking-[0.2em]">{product.category}</p>
                  <h3 className="text-white text-xl font-bold">{product.name}</h3>
                  <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-2 flex items-center justify-between border border-white/20">
                    <span className="text-white text-xs font-bold pl-3">{t.viewDetail}</span>
                    <div className="bg-emerald-500 text-white p-2 rounded-xl"><ChevronRight size={18} /></div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Detailed Product List */}
        <section className="px-6 space-y-4">
          <h2 className="text-lg font-bold text-gray-900">
              {lang === 'mr' ? 'विशेष शिफारसी' : lang === 'hi' ? 'विशेष सिफारिशें' : 'Featured Ratings'}
          </h2>
          <div className="space-y-4">
            {t.products.map((product) => (
              <div key={product.id} className="bg-white p-4 rounded-[2rem] shadow-sm border border-gray-100 flex items-center gap-4">
                <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gray-50 flex-shrink-0">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                </div>
                
                <div className="flex-1 space-y-1">
                  <h4 className="font-bold text-gray-900 text-sm">{product.name}</h4>
                  <div className="flex items-center gap-1.5">
                    <div className="flex items-center text-amber-500">
                      <Star size={14} fill="currentColor" />
                      <span className="ml-1 text-xs font-black text-gray-900">{product.rating}</span>
                    </div>
                    <span className="text-[10px] text-gray-400 font-medium">({product.reviewCount} {t.reviews})</span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-emerald-700 font-bold text-sm">{product.price}</span>
                    <button className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg active:bg-emerald-600 active:text-white transition-colors">
                      + {lang === 'mr' ? 'खरेदी करा' : lang === 'hi' ? 'खरीदें' : 'Buy'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default FarmerDashboard;