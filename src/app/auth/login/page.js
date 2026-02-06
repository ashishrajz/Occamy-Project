"use client";

import { ChevronLeft, Sprout, CheckCircle2, Languages, User, Phone, Mail, Loader2, ArrowRight, ShieldCheck } from 'lucide-react';
import React, { useState, useRef, useMemo } from 'react';
import { useRouter } from "next/navigation";

const translations = {
    en: {
        back: "Back",
        title: "Welcome ",
        titleHighlight: "Back",
        subtitle: "The future of agriculture starts here. Select your portal.",
        continue: "Enter Dashboard",
        placeholders: { name: "Full Name", phone: "Phone Number", email: "Admin Email" },
        roles: { farmer: "Farmer", distributor: "Distributor", admin: "Admin" }
    },
    hi: {
        back: "पीछे",
        title: "आपका ",
        titleHighlight: "स्वागत है",
        subtitle: "खेती का भविष्य यहाँ से शुरू होता है। अपना पोर्टल चुनें।",
        continue: "डैशबोर्ड में प्रवेश करें",
        placeholders: { name: "पूरा नाम", phone: "फ़ोन नंबर", email: "ईमेल" },
        roles: { farmer: "किसान", distributor: "वितरक", admin: "एडमिन" }
    },
    mr: {
        back: "मागे",
        title: "तुमचे ",
        titleHighlight: "स्वागत आहे",
        subtitle: "शेतीचे भविष्य इथून सुरू होते. तुमचा पोर्टल निवडा.",
        continue: "डॅशबोर्डवर जा",
        roles: { farmer: "शेतकरी", distributor: "वितरक", admin: "अ‍ॅडमिन" },
        placeholders: { name: "पूर्ण नाव", phone: "फोन नंबर", email: "ईमेल" }
    }
};

export default function () {
    const router = useRouter();
    const formSectionRef = useRef(null);
    const nameInputRef = useRef(null);

    const [role, setRole] = useState("DISTRIBUTOR");
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [language, setLanguage] = useState("en");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const t = translations[language];

    const roleOptions = useMemo(() => [
        { id: 'FARMER', title: t.roles.farmer, image: '/farmer.png', desc: 'Crops & Yields' },
        { id: 'DISTRIBUTOR', title: t.roles.distributor, image: '/distributor.png', desc: 'Logistics & Supply' },
        { id: 'ADMIN', title: t.roles.admin, image: '/admin.png', desc: 'System Control' },
    ], [t]);

    const handleRoleSelection = (selectedId) => {
        setRole(selectedId);
        // Subtle haptic simulation for mobile
        if (typeof window !== 'undefined' && window.navigator.vibrate) {
            window.navigator.vibrate(10);
        }
        
        setTimeout(() => {
            formSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            nameInputRef.current?.focus();
        }, 300);
    };

    async function handleLogin(e) {
        e.preventDefault();
        if (phone.length < 10) return setError("Please enter a valid phone number");
        
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, phone, email, role, language }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Authentication failed");

            router.push(`/${data.user.role.toLowerCase()}`);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='min-h-screen w-full bg-[#fcfdfe] text-slate-900 overflow-x-hidden selection:bg-emerald-100'>
            {/* Animated Background Gradient */}
            <div className="fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-emerald-100/50 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute top-[20%] -right-[10%] w-[30%] h-[30%] bg-teal-100/40 blur-[100px] rounded-full" />
            </div>

            <header className="fixed top-0 left-0 right-0 z-50 flex justify-center p-4">
                <nav className="w-full max-w-5xl h-16 px-6 flex items-center justify-between bg-white/80 backdrop-blur-2xl border border-white/20 shadow-sm rounded-3xl">
                    <button onClick={() => router.back()} className='group flex items-center gap-2 text-slate-500 hover:text-emerald-600 transition-colors'>
                        <div className="p-1 group-hover:bg-emerald-50 rounded-lg transition-colors">
                            <ChevronLeft size={20} />
                        </div>
                        <span className='hidden sm:inline font-semibold text-sm'>{t.back}</span>
                    </button>

                    <div className='flex items-center gap-2.5'>
                        <div className='bg-gradient-to-br from-emerald-500 to-teal-600 p-2 rounded-xl shadow-lg shadow-emerald-200'>
                            <Sprout className="text-white" size={20} />
                        </div>
                        <h1 className='text-xl font-black tracking-tight text-slate-800'>Agri<span className="text-emerald-600">Track</span></h1>
                    </div>

                    <div className='flex items-center gap-2 bg-slate-100/80 p-1 rounded-2xl border border-slate-200/50'>
                        <Languages size={14} className='ml-2 text-slate-500' />
                        <select 
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            className='bg-transparent border-none text-[11px] font-bold outline-none cursor-pointer py-1.5 pr-2 uppercase'
                        >
                            <option value="en">EN</option>
                            <option value="hi">HI</option>
                            <option value="mr">MR</option>
                        </select>
                    </div>
                </nav>
            </header>

            <main className='max-w-6xl mx-auto px-6 pt-36 pb-20'>
                {/* Entry Animation for Title */}
                <section className='text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700'>
                  
                    <h1 className='text-5xl md:text-7xl font-black text-slate-900 tracking-tight mb-4 leading-[1.1]'>
                        {t.title}<span className='text-emerald-600 underline decoration-emerald-200 underline-offset-8 transition-all hover:decoration-emerald-400'>{t.titleHighlight}</span>
                    </h1>
                    <p className='text-slate-500 text-lg font-medium max-w-lg mx-auto'>{t.subtitle}</p>
                </section>

                <form onSubmit={handleLogin} className="w-full max-w-5xl mx-auto space-y-20">
                    {/* Role Selection Grid */}
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
                        {roleOptions.map((opt, index) => (
                            <div key={opt.id} className={`delay-${index * 100} animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both`}>
                                <RoleCard 
                                    title={opt.title}
                                    desc={opt.desc}
                                    image={opt.image}
                                    isSelected={role === opt.id}
                                    onClick={() => handleRoleSelection(opt.id)}
                                />
                            </div>
                        ))}
                    </div>

                    {/* Input Section */}
                    <div ref={formSectionRef} className="max-w-xl mx-auto relative group">
                        <div className="absolute -inset-4 bg-gradient-to-tr from-emerald-50 to-teal-50 rounded-[4rem] -z-10 opacity-0 group-focus-within:opacity-100 transition-opacity duration-700" />
                        <div className="bg-white/70 backdrop-blur-2xl p-8 md:p-10 rounded-[3rem] border border-white shadow-2xl shadow-slate-200/40 space-y-5">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-emerald-50 rounded-lg">
                                    <ShieldCheck className="text-emerald-600" size={20} />
                                </div>
                                <h2 className="font-bold text-xl text-slate-800">Verify Identity</h2>
                            </div>

                            <InputField 
                                icon={<User size={18} />}
                                ref={nameInputRef}
                                type="text"
                                placeholder={t.placeholders.name}
                                value={name}
                                onChange={setName}
                            />

                            <InputField 
                                icon={<Phone size={18} />}
                                type="tel"
                                placeholder={t.placeholders.phone}
                                value={phone}
                                onChange={setPhone}
                            />

                            {role === "ADMIN" && (
                                <div className="animate-in slide-in-from-top-4 fade-in duration-300">
                                    <InputField 
                                        icon={<Mail size={18} />}
                                        type="email"
                                        placeholder={t.placeholders.email}
                                        value={email}
                                        onChange={setEmail}
                                    />
                                </div>
                            )}

                            {error && (
                                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 text-sm font-semibold flex items-center gap-2 animate-shake">
                                    <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                                    {error}
                                </div>
                            )}

                            <button 
                                type="submit"
                                disabled={loading}
                                className={`group w-full py-5 rounded-[2rem] font-bold text-lg transition-all duration-500 flex items-center justify-center gap-3 active:scale-[0.98]
                                    ${loading ? 'bg-slate-200 text-slate-400' : 'bg-slate-900 text-white hover:bg-emerald-600 hover:shadow-xl hover:shadow-emerald-200'}`}
                            >
                                {loading ? (
                                    <Loader2 className="animate-spin" size={24} />
                                ) : (
                                    <>
                                        {t.continue}
                                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </main>
        </div>
    );
}

const InputField = React.forwardRef(({ icon, type, placeholder, value, onChange }, ref) => (
    <div className="relative group/field">
        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/field:text-emerald-500 group-focus-within/field:scale-110 transition-all duration-300">
            {icon}
        </div>
        <input
            ref={ref}
            type={type}
            required
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full bg-slate-50/50 border border-slate-100 p-5 pl-14 rounded-2xl text-[15px] font-medium outline-none focus:ring-4 focus:ring-emerald-500/5 focus:bg-white focus:border-emerald-200 transition-all placeholder:text-slate-400"
        />
    </div>
));
InputField.displayName = "InputField";

const RoleCard = ({ image, title, desc, isSelected, onClick }) => {
    return (
        <div 
            onClick={onClick}
            className={`group relative cursor-pointer transition-all duration-500 ease-out h-full ${isSelected ? 'scale-[1.03]' : 'hover:-translate-y-2 opacity-90 hover:opacity-100'}`}
        >
            <div className={`relative h-full bg-white border-[3px] rounded-[2.8rem] p-2 transition-all duration-500 shadow-xl ${isSelected ? 'border-emerald-500 shadow-emerald-100' : 'border-transparent hover:shadow-2xl hover:shadow-slate-200'}`}>
                <div className={`rounded-[2.4rem] p-8 flex flex-col items-center text-center gap-4 h-full transition-colors duration-500 ${isSelected ? 'bg-emerald-50/30' : 'bg-slate-50/50 group-hover:bg-white'}`}>
                    
                    {/* Status Badge */}
                    <div className={`absolute top-6 right-6 transition-all duration-500 ${isSelected ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}>
                        <div className="bg-emerald-500 rounded-full p-1.5 shadow-lg shadow-emerald-200">
                            <CheckCircle2 className="text-white" size={18} />
                        </div>
                    </div>

                    <div className='relative w-28 h-28 mb-2'>
                        <div className={`absolute inset-0 rounded-full blur-2xl transition-all duration-700 ${isSelected ? 'bg-emerald-200/60 scale-125' : 'bg-slate-200 opacity-0 group-hover:opacity-40'}`} />
                        <img 
                            src={image} 
                            alt={title} 
                            className={`relative w-full h-full object-contain transition-all duration-700 ${isSelected ? 'scale-110 rotate-2' : 'group-hover:scale-105'}`} 
                        />
                    </div>

                    <div>
                        <h3 className={`text-xl font-black mb-1 transition-colors ${isSelected ? 'text-emerald-700' : 'text-slate-800'}`}>{title}</h3>
                        <p className={`text-[10px] font-bold uppercase tracking-[0.15em] transition-colors ${isSelected ? 'text-emerald-500' : 'text-slate-400'}`}>
                            {desc}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};