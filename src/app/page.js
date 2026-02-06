"use client";

import Link from "next/link";
import { 
  Leaf, 
  ShieldCheck, 
  Globe, 
  MoveRight, 
  Activity, 
  FlaskConical, 
  Microscope, 
  ChevronRight,
  BarChart3,
  Users2,
  Database
} from "lucide-react";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900 font-[-apple-system,BlinkMacSystemFont,sans-serif] antialiased">
      
      {/* NAVIGATION */}
      <nav className="fixed top-0 w-full z-[100] px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between bg-white/70 backdrop-blur-xl border border-white/40 px-6 py-3 rounded-2xl shadow-sm">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white">
              <Leaf size={18} />
            </div>
            <span className="text-lg font-black tracking-tighter">OCCAMY <span className="text-emerald-600">BIOSCIENCE</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-[11px] font-black uppercase tracking-widest text-slate-500">
            <a href="#about" className="hover:text-emerald-600 transition-colors">Who We Are</a>
            <a href="#products" className="hover:text-emerald-600 transition-colors">Innovation</a>
            <a href="#features" className="hover:text-emerald-600 transition-colors">Operations</a>
          </div>
          <Link href="/auth/login">
            <button className="px-5 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-emerald-600 transition-all active:scale-95 shadow-lg shadow-slate-900/10">
              Portal Login
            </button>
          </Link>
        </div>
      </nav>

      {/* HERO SECTION WITH IMAGE BACKDROP */}
      <section className="relative pt-48 pb-32 px-6 overflow-hidden min-h-[90vh] flex items-center">
        {/* THE BACKGROUND IMAGE INTEGRATION */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-fixed bg-center"
          style={{ 
            backgroundImage: `linear-gradient(to right, rgba(255,255,255,1) 30%, rgba(255,255,255,0.7) 60%, rgba(255,255,255,0.4) 100%), url('/agriculturebg.jpg')` 
          }}
        />
        
        <div className="max-w-7xl mx-auto relative z-10 grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100/80 backdrop-blur-md border border-emerald-200 rounded-full">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-800">Next-Gen Bio-Agriculture</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tight leading-[0.9] text-slate-900">
              Sustainably <br /> <span className="text-emerald-600">Feeding</span> <br /> the Future.
            </h1>
            <p className="text-xl text-slate-700 max-w-lg leading-relaxed font-semibold backdrop-blur-sm bg-white/10 rounded-lg p-2">
              Occamy Bioscience leverages advanced bio-chemistry to create high-yield, zero-waste agricultural solutions for ruminants and farming ecosystems.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/auth/login">
                <button className="flex items-center justify-center gap-3 px-10 py-5 bg-emerald-600 text-white rounded-2xl font-black text-sm shadow-2xl shadow-emerald-600/30 hover:bg-emerald-500 transition-all group hover:-translate-y-1">
                  EXPLORE OPERATIONS
                  <MoveRight className="group-hover:translate-x-2 transition-transform" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* WHO WE ARE - WITH BLURRED IMAGE ACCENT */}
      <section id="about" className="py-24 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-1">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-600 mb-4">Our Mission</p>
              <h2 className="text-4xl font-black tracking-tight text-slate-900">Research. Results. <br/>Responsibility.</h2>
            </div>
            <div className="lg:col-span-2 space-y-8">
              <p className="text-2xl font-medium text-slate-600 leading-relaxed italic border-l-4 border-emerald-500 pl-6">
                "We bridge the gap between high-end laboratory microbiology and actual field requirements by studying regional variations in livestock diet."
              </p>
              <div className="grid md:grid-cols-2 gap-8 pt-6">
                <AboutCard 
                  icon={<FlaskConical />} 
                  title="Bio-Nutraceuticals" 
                  desc="Developing microbial proteins and probiotics that improve milk fat, SNF, and overall ruminant immunity." 
                />
                <AboutCard 
                  icon={<Globe />} 
                  title="Grassroots Impact" 
                  desc="Direct integration with 5,000+ farmers to reduce methane emissions by 30-50% sustainably." 
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCTS SECTION - USING IMAGES FROM YOUR SITE DATA */}
      <section id="products" className="py-24 px-6 bg-slate-50 rounded-[4rem]">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6">
            <div className="space-y-4">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-600">The Catalog</p>
              <h2 className="text-5xl font-black tracking-tight text-slate-900">Product Portfolio</h2>
            </div>
            <p className="text-slate-500 font-bold text-sm max-w-xs">Tested in NABL accredited labs for verified biological impact.</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <ProductCard 
              img="bovi.png"
              tag="Cattle"
              title="Bovi Booster"
              desc="Improves milk fat, SNF, and SNF while reducing somatic cell counts."
            />
            <ProductCard 
              img="buck-booster.png"
              tag="Goats"
              title="Buck Booster"
              desc="High protein microbial supplement for superior weight gain."
            />
            <ProductCard 
              img="rakshak.png"
              tag="Immunity"
              title="Rakshak"
              desc="Affordable science-backed immunity for backyard farming."
            />
            <ProductCard 
              img="jodi.png"
              tag="Strength"
              title="Jodi No. 1"
              desc="Muscle strength and stamina builder for farming and racing bulls."
            />
          </div>
        </div>
      </section>

      {/* OPERATION FEATURES - WITH IMAGE OVERLAY */}
      <section id="features" className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto bg-slate-900 text-white rounded-[4rem] overflow-hidden relative shadow-2xl">
          {/* Subtle Image Overlay inside the dark box */}
          <div 
            className="absolute inset-0 opacity-10 bg-cover bg-center mix-blend-overlay"
            style={{ backgroundImage: `url('/agriculturebg.jpg')` }}
          />
          
          <div className="relative z-10 grid lg:grid-cols-2 gap-20 items-center p-12 md:p-20">
            <div className="space-y-8">
              <h2 className="text-5xl font-black tracking-tight leading-none">Intelligence-Led <br/> Field Operations.</h2>
              <p className="text-slate-400 text-lg leading-relaxed">
                Our proprietary digital backbone tracks methane reduction metrics and farmer capacity building across rural coordinates.
              </p>
              <div className="space-y-6">
                <FeatureItem icon={<Database className="text-emerald-400"/>} title="One-Health Framework" desc="Interlinked monitoring of human, animal, and environmental health." />
                <FeatureItem icon={<BarChart3 className="text-emerald-400"/>} title="Methane Tracking" desc="Real-time reporting on carbon footprint reduction for green-credit economy." />
                <FeatureItem icon={<ShieldCheck className="text-emerald-400"/>} title="Lab-to-Land Traceability" desc="Full accountability for every supplement batch delivered to gaushalas." />
              </div>
            </div>
            <div className="relative group">
              <div className="absolute -inset-4 bg-emerald-500/20 blur-3xl rounded-full group-hover:bg-emerald-500/30 transition-all" />
              <div className="relative bg-white/5 border border-white/10 p-4 rounded-[3rem] backdrop-blur-md">
                <img 
                  src="https://images.unsplash.com/photo-1586772002130-b0f3daa6288b?q=80&w=1000&auto=format&fit=crop" 
                  className="rounded-[2rem] shadow-2xl grayscale group-hover:grayscale-0 transition-all duration-700" 
                  alt="Field Intelligence" 
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-20 px-6 border-t border-slate-100">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
          <div className="col-span-2 space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white">
                <Leaf size={18} />
              </div>
              <span className="text-lg font-black tracking-tighter uppercase">Occamy Bioscience</span>
            </div>
            <p className="text-slate-500 max-w-sm text-sm font-medium">
              Bridging the gap between lab science and animal husbandry economics for 5,000+ farmers.
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Governance</h4>
            <div className="flex flex-col gap-2 text-sm font-bold text-slate-600">
              <span className="flex items-center gap-2 italic text-emerald-600"><ShieldCheck size={12}/> Startup India Certified</span>
              <span className="flex items-center gap-2 italic text-blue-600"><Activity size={12}/> NABL Verified Ingredients</span>
            </div>
          </div>
          <div className="space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Portal Access</h4>
            <div className="flex flex-col gap-3">
              <Link href="/auth/login" className="px-6 py-3 bg-slate-100 rounded-xl text-xs font-black text-slate-900 hover:bg-slate-200 transition-all text-center">
                INTERNAL DASHBOARD
              </Link>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between gap-4">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">© 2026 Occamy Bioscience. Based in Navi Mumbai, India.</p>
          <div className="flex gap-6 text-[10px] font-black uppercase tracking-widest text-slate-400 underline underline-offset-4">
            <a href="#">Privacy Policy</a>
            <a href="#">Operations Manual</a>
          </div>
        </div>
      </footer>
    </main>
  );
}

/* SUB-COMPONENTS */

function AboutCard({ icon, title, desc }) {
  return (
    <div className="space-y-3 group p-6 rounded-3xl hover:bg-white hover:shadow-xl transition-all duration-500 border border-transparent hover:border-slate-100">
      <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-black tracking-tight">{title}</h3>
      <p className="text-sm text-slate-500 font-semibold leading-relaxed">{desc}</p>
    </div>
  );
}

function ProductCard({ img, tag, title, desc }) {
  return (
    <div className="group space-y-4 bg-white p-4 rounded-[2.5rem] border border-slate-100 hover:shadow-2xl hover:border-emerald-100 transition-all duration-500 hover:-translate-y-2">
      <div className="aspect-square rounded-3xl overflow-hidden relative bg-slate-50">
        <img src={img} className="w-full h-full object-contain p-4 mix-blend-multiply transition-transform duration-700 group-hover:scale-110" alt={title} />
        <div className="absolute top-4 left-4">
          <span className="px-4 py-1.5 bg-emerald-600 text-white rounded-full text-[9px] font-black uppercase tracking-widest">
            {tag}
          </span>
        </div>
      </div>
      <div className="px-2 pb-2">
        <h3 className="text-lg font-black tracking-tight text-slate-900 group-hover:text-emerald-600 transition-colors">{title}</h3>
        <p className="text-[11px] text-slate-500 font-bold mt-1 line-clamp-2">{desc}</p>
      </div>
    </div>
  );
}

function FeatureItem({ icon, title, desc }) {
  return (
    <div className="flex items-start gap-5 p-4 rounded-2xl hover:bg-white/5 transition-colors">
      <div className="mt-1 p-2 bg-white/10 rounded-lg">{icon}</div>
      <div>
        <h4 className="text-sm font-black uppercase tracking-[0.1em]">{title}</h4>
        <p className="text-slate-400 text-sm mt-1 font-medium">{desc}</p>
      </div>
    </div>
  );
}