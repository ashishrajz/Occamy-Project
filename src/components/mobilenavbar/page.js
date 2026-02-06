"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Users, Droplet, ShoppingCart, User } from 'lucide-react';

const MobileNavbar = () => {
  const pathname = usePathname();
  const [lang] = useState('en'); 

  const translations = {
    en: { field: "Field", meetings: "Meetings", sales: "Sales", samples: "Samples", profile: "Profile" },
    hi: { field: "कार्यक्षेत्र", meetings: "बैठकें", sales: "बिक्री", samples: "नमूने", profile: "प्रोफ़ाइल" },
    mr: { field: "क्षेत्र", meetings: "बैठका", sales: "विक्री", samples: "नमुने", profile: "प्रोफाइल" }
  };

  const t = translations[lang];

  const isActive = (path) => pathname === path;

  return (
    <div className="fixed bottom-3 left-0 right-0 px-6 z-50">
      <div className="max-w-md mx-auto bg-slate-900/95 backdrop-blur-xl rounded-[2.5rem] h-20 shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex items-center justify-around px-4 border border-white/10">

        <NavItem 
          href="/distributor" 
          icon={<Home size={22} />} 
          label={t.field} 
          active={isActive('/distributor')} 
        />

        <NavItem 
          href="/distributor/meetings" 
          icon={<Users size={22} />} 
          label={t.meetings} 
          active={isActive('/distributor/meetings')} 
        />

        <div className="relative -top-8">
          <Link href="/distributor/sales" className="flex flex-col items-center">
            <div className="absolute inset-0 bg-emerald-400 rounded-full blur-2xl opacity-40 animate-pulse"></div>
            <div className={`relative p-5 rounded-full shadow-2xl border-4 border-slate-900 transition-all active:scale-90 ${
              isActive('/distributor/sales') ? 'bg-white text-emerald-600' : 'bg-emerald-500 text-white'
            }`}>
              <ShoppingCart size={28} strokeWidth={2.5} />
            </div>
            <span className={`relative z-10 block text-center text-[10px] font-black mt-2 uppercase tracking-widest transition-colors ${
              isActive('/distributor/sales') ? 'text-emerald-400' : 'text-white/60'
            }`}>
              {t.sales}
            </span>
          </Link>
        </div>

        <NavItem 
          href="/distributor/samples" 
          icon={<Droplet size={22} />} 
          label={t.samples} 
          active={isActive('/distributor/samples')} 
        />

        <NavItem 
          href="/distributor/profile" 
          icon={<User size={22} />} 
          label={t.profile} 
          active={isActive('/distributor/profile')} 
        />

      </div>
    </div>
  );
};

const NavItem = ({ href, icon, label, active }) => (
  <Link 
    href={href} 
    className={`flex flex-col items-center gap-1 transition-all duration-300 relative ${
      active ? 'text-emerald-400 scale-110' : 'text-slate-400 hover:text-slate-200'
    }`}
  >
    <div className={`transition-all duration-300 ${active ? 'drop-shadow-[0_0_8px_rgba(52,211,153,0.6)]' : ''}`}>
      {icon}
    </div>
    <span className={`text-[10px] font-bold uppercase tracking-tighter transition-opacity ${active ? 'opacity-100' : 'opacity-60'}`}>
      {label}
    </span>
    {active && (
      <div className="w-1 h-1 bg-emerald-400 rounded-full absolute -bottom-2 shadow-[0_0_10px_rgba(52,211,153,1)] animate-in fade-in zoom-in duration-500" />
    )}
  </Link>
);

export default MobileNavbar;