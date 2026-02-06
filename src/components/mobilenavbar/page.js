"use client";

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Home, Users, Droplet, ShoppingCart, User } from 'lucide-react';

const NavbarContent = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [activeIndex, setActiveIndex] = useState(2);

  const translations = {
    en: { field: "Field", meetings: "Meet", sales: "Sales", samples: "Samples", profile: "Profile" },
  };

  const navItems = useMemo(() => [
    { href: "/distributor/log-activity?type=SALE", icon: ShoppingCart, label: translations.en.sales },
    { href: "/distributor/log-activity?type=MEETING_ONE_ON_ONE", icon: Users, label: translations.en.meetings },
    { href: "/distributor", icon: Home, label: translations.en.field },
    { href: "/distributor/log-activity?type=SAMPLE", icon: Droplet, label: translations.en.samples },
    { href: "/distributor/profile", icon: User, label: translations.en.profile },
  ], []);

  useEffect(() => {
    const currentFullRoute = `${pathname}${searchParams.toString() ? '?' + searchParams.toString() : ''}`;
    const index = navItems.findIndex(item => item.href === currentFullRoute || item.href === pathname);
    if (index !== -1) setActiveIndex(index);
  }, [pathname, searchParams, navItems]);

  return (
    <div className="fixed bottom-0 left-0 right-0 px-4 pb-4 z-50 pointer-events-none mb-[env(safe-area-inset-bottom)]">
      <div className="max-w-md mx-auto relative pointer-events-auto">
        
        {/* Main Navbar Wrapper: NO overflow-hidden here so the circle can pop out */}
        <div className="relative h-18 bg-slate-900 shadow-2xl rounded-[2rem] flex justify-around items-center border border-white/10 px-2 select-none touch-none">
          
          {/* 1. CLIPPED LAYER: This handles the SVG "Dip" so it doesn't cause horizontal shaking */}
          <div className="absolute inset-0 overflow-hidden rounded-[2rem] pointer-events-none">
            <div 
              className="absolute top-0 h-full transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
              style={{ 
                width: `${100 / navItems.length}%`, 
                left: `${activeIndex * (100 / navItems.length)}%` 
              }}
            >
              {/* SVG Curve - Locked inside the clipped layer */}
              <div className="absolute -top-[1px] left-1/2 -translate-x-1/2 w-[110px]">
                  <svg viewBox="0 0 100 25" className="fill-slate-900 w-full h-auto">
                      <path d="M0 0 C 20 0 15 0 30 0 C 35 0 33 22 50 22 C 67 22 65 0 70 0 C 85 0 80 0 100 0 L 100 4 L 0 4 Z" />
                  </svg>
              </div>
            </div>
          </div>

          {/* 2. FLOATING LAYER: The active circle (outside the clip) */}
          <div 
            className="absolute top-0 h-full transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] pointer-events-none"
            style={{ 
              width: `${100 / navItems.length}%`, 
              left: `${activeIndex * (100 / navItems.length)}%` 
            }}
          >
            <div className="absolute -top-7 left-1/2 -translate-x-1/2 w-14 h-14 bg-slate-900 rounded-full border-4 border-slate-950 flex items-center justify-center shadow-xl z-20">
              <div className="absolute inset-0 rounded-full bg-emerald-500 blur-md opacity-20 animate-pulse" />
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center relative z-10">
                {React.createElement(navItems[activeIndex].icon, { size: 20, className: "text-white" })}
              </div>
            </div>
          </div>

          {/* 3. INTERACTIVE LAYER: The Links */}
          {navItems.map((item, index) => (
            <Link 
              key={index}
              href={item.href}
              className="relative flex flex-col items-center justify-center flex-1 h-full z-10 outline-none"
            >
              <div className={`transition-all duration-500 ${
                activeIndex === index ? 'opacity-0 -translate-y-8' : 'text-slate-400 opacity-100'
              }`}>
                <item.icon size={22} />
              </div>
              
              <span className={`absolute bottom-3 text-[10px] font-bold uppercase tracking-tighter transition-all duration-500 ${
                activeIndex === index ? 'text-emerald-400 opacity-100 scale-100' : 'text-slate-500 opacity-0 scale-50 translate-y-2'
              }`}>
                {item.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

const MobileNavbar = () => (
  <Suspense fallback={null}>
    <NavbarContent />
  </Suspense>
);

export default MobileNavbar;