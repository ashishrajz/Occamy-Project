"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { 
  LayoutDashboard, 
  Users, 
  LogOut, 
  ShieldCheck,
  Bell,
  Search,
  Menu,
  Settings,
  X,
  Activity
} from "lucide-react";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  async function handleLogout() {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });

    router.push("/auth/login");
  }

  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then(res => res.json())
      .then(user => {
        if (!user || user.role !== "ADMIN") {
          router.replace("/auth/login");
        } else {
          setLoading(false);
        }
      })
      .catch(() => router.replace("/auth/login"));
  }, [router]);

  if (loading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#F2F2F7]">
        <div className="w-16 h-16 bg-white rounded-[2rem] shadow-xl flex items-center justify-center animate-pulse">
          <ShieldCheck className="text-emerald-500" size={32} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F2F2F7] font-[-apple-system,BlinkMacSystemFont,sans-serif] antialiased text-slate-900 flex flex-col md:flex-row">
      
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-full md:w-1/2 h-full bg-gradient-to-br from-emerald-100/30 to-transparent" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-200/20 blur-[120px] rounded-full" />
      </div>

      {/* DESKTOP SIDEBAR (Hidden on Mobile) */}
      <aside className="hidden md:flex fixed left-6 top-6 bottom-6 w-20 lg:w-64 z-50 flex-col bg-white/60 backdrop-blur-3xl border border-white/40 rounded-[2.5rem] p-4 lg:p-6 shadow-2xl transition-all duration-500">
        <div className="flex items-center gap-3 px-2 lg:px-4 mb-10">
          <div className="w-10 h-10 bg-black rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-black/20">
            <ShieldCheck className="text-white" size={20} />
          </div>
          <h1 className="hidden lg:block text-xl font-black tracking-tight leading-none">AgriTrack</h1>
        </div>

        <nav className="flex-1 space-y-2">
          <DesktopNavLink href="/admin" icon={<LayoutDashboard size={22} />} label="Dashboard" active={pathname === "/admin"} />
          <DesktopNavLink href="/admin/distributor" icon={<Users size={22} />} label="Distributors" active={pathname.startsWith("/admin/distributor")} />
  <DesktopNavLink href="/admin/activity" icon={<Activity size={22} />} label="Activites" active={pathname.startsWith("/admin/activity")} />
         
        </nav>

        <button
          onClick={handleLogout}
          className="mt-auto flex items-center gap-4 px-4 py-4 text-red-500 font-bold text-sm hover:bg-red-50 rounded-2xl transition-all group"
        >
          <LogOut size={22} className="group-hover:-translate-x-1 transition-transform" />
          <span className="hidden lg:block">Logout</span>
        </button>
      </aside>

      {/* MOBILE HEADER (Hidden on Desktop) */}
      <header className="md:hidden sticky top-0 z-40 px-6 pt-12 pb-4 bg-white/60 backdrop-blur-2xl border-b border-white/20 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-black rounded-2xl flex items-center justify-center shadow-lg">
            <ShieldCheck className="text-white" size={20} />
          </div>
          <span className="font-black text-lg tracking-tight">AgriTrack</span>
        </div>
        <button className="w-10 h-10 bg-white border border-white rounded-full flex items-center justify-center shadow-sm">
          <Bell size={18} />
        </button>
      </header>

      {/* MAIN CONTENT WRAPPER */}
      <main className="flex-1 relative z-10 md:ml-32 lg:ml-80 px-6 md:px-12 py-8 md:py-12">
        {/* DESKTOP TOP BAR (Hidden on Mobile) */}
        <div className="hidden md:flex justify-between items-center mb-10">
          <div className="relative w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-black transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Deep search records..." 
              className="w-full bg-white/40 border border-white focus:bg-white rounded-2xl py-3 pl-12 pr-4 text-sm font-medium outline-none transition-all shadow-sm focus:shadow-md"
            />
          </div>
         
        </div>

        {children}
      </main>

      {/* MOBILE BOTTOM TAB BAR (Hidden on Desktop) */}
      <div className="md:hidden fixed bottom-6 left-6 right-6 z-50">
        <nav className="bg-slate-900/95 backdrop-blur-2xl rounded-[2.5rem] p-2 flex items-center justify-around border border-white/10 shadow-2xl">
          <TabLink href="/admin" icon={<LayoutDashboard size={22} />} active={pathname === "/admin"} />
          <TabLink href="/admin/distributor" icon={<Users size={22} />} active={pathname.startsWith("/admin/distributor")} />
        <TabLink href="/admin/activity" icon={<Activity size={22} />} active={pathname.startsWith("/admin/activity")} />
          
        </nav>
      </div>
    </div>
  );
}

function DesktopNavLink({ href, icon, label, active }) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-4 p-4 rounded-2xl font-bold text-sm transition-all duration-300 group ${
        active 
          ? "bg-black text-white shadow-xl shadow-black/10" 
          : "text-slate-500 hover:bg-white/80 hover:text-black"
      }`}
    >
      <span className={`${active ? "text-emerald-400" : "text-slate-400 group-hover:text-emerald-500"}`}>{icon}</span>
      <span className="hidden lg:block whitespace-nowrap">{label}</span>
    </Link>
  );
}

function TabLink({ href, icon, active }) {
  return (
    <Link
      href={href}
      className={`p-4 rounded-3xl transition-all duration-300 ${active ? "bg-white/10 text-emerald-400 scale-110" : "text-white/40"}`}
    >
      {icon}
    </Link>
  );
}
