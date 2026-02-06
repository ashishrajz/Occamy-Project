import React from 'react'
import { Sprout, Bell, MenuIcon } from 'lucide-react';
const page = () => {
  return (
    <div>
         <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 h-16 flex items-center justify-between">
                <div className='flex items-center gap-2'>
                    <div className='bg-emerald-600 p-1.5 rounded-lg'>
                        <Sprout className="text-white" size={18} />
                    </div>
                    <h1 className='text-lg font-bold tracking-tight text-slate-800'>
                        AgriTrack
                    </h1>
                </div>

                <div className='flex items-center gap-4'>
                    <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-full transition-colors">
                        <Bell size={20} />
                    </button>
                    <div className="h-6 w-[1px] bg-slate-200" />
                    <button className="p-2 text-slate-600">
                        <MenuIcon size={20} />
                    </button>
                </div>
            </nav>

    </div>
  )
}

export default page