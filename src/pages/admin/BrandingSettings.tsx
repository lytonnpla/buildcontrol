import React from 'react';
import { ImageIcon, Upload, Trash2, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

export default function BrandingSettings() {
  const [logo, setLogo] = React.useState<string | null>(null);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Personalization & Branding</h1>
        <p className="text-slate-500 mt-1">Configure global visual parameters and document assets.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Logo Section */}
        <div className="bg-[#0D0E11] border border-white/5 rounded-2xl p-8 space-y-6">
           <div className="flex items-center gap-2 mb-2">
              <ImageIcon size={20} className="text-slate-400" />
              <h3 className="font-bold text-white uppercase text-xs tracking-widest">Global Corporate Logo</h3>
           </div>
           
           <div className="flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-2xl p-12 bg-white/[0.01] group hover:border-brand/40 transition-colors cursor-pointer relative overflow-hidden">
              {logo ? (
                <div className="relative z-10 flex flex-col items-center">
                   <img src={logo} alt="Logo" className="max-h-32 mb-6" />
                   <button 
                     onClick={(e) => { e.stopPropagation(); setLogo(null); }}
                     className="flex items-center gap-2 text-red-500 text-xs font-bold hover:underline"
                   >
                     <Trash2 size={14} /> Remove Artwork
                   </button>
                </div>
              ) : (
                <div className="flex flex-col items-center text-center">
                   <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center text-slate-500 mb-4 group-hover:text-brand transition-colors">
                      <Upload size={32} />
                   </div>
                   <p className="text-white font-bold mb-1">Click to upload brand logo</p>
                   <p className="text-slate-500 text-xs">High Resolution PNG or SVG recommended (max 2MB)</p>
                </div>
              )}
           </div>

           <div className="p-4 bg-white/5 rounded-xl border border-white/5">
              <div className="flex gap-3">
                 <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
                 <p className="text-xs text-slate-400 leading-relaxed italic">
                    This logo will automatically appear in the top-right corner of all generated Estimates, Contracts, and Invoices across the entire application.
                 </p>
              </div>
           </div>
        </div>

        {/* Color Parameters */}
        <div className="bg-[#0D0E11] border border-white/5 rounded-2xl p-8 space-y-6">
           <div className="flex items-center gap-2 mb-2">
              <div className="w-4 h-4 bg-brand rounded-full" />
              <h3 className="font-bold text-white uppercase text-xs tracking-widest">UI Theme & Accent Colors</h3>
           </div>

           <div className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                 {[
                   { label: 'Safety Orange', value: '#F27D26', active: true },
                   { label: 'Industrial Blue', value: '#267DF2', active: false },
                   { label: 'Forest Green', value: '#26F27D', active: false },
                 ].map((color) => (
                   <button 
                    key={color.value}
                    className={cn(
                      "p-3 rounded-xl border transition-all text-left group",
                      color.active ? "bg-white/5 border-brand" : "bg-transparent border-white/5 hover:border-white/10"
                    )}
                   >
                     <div className="w-full h-8 rounded-lg mb-2" style={{ backgroundColor: color.value }} />
                     <p className="text-[10px] font-bold text-white uppercase group-hover:text-brand transition-colors">{color.label}</p>
                   </button>
                 ))}
              </div>

              <div className="space-y-4 pt-6 border-t border-white/5">
                 <div className="flex justify-between items-center group">
                    <div>
                       <p className="text-sm font-bold text-white">System Dark Mode</p>
                       <p className="text-xs text-slate-500">Enable high-contrast technical slate theme.</p>
                    </div>
                    <div className="w-12 h-6 bg-brand rounded-full relative p-1 cursor-pointer">
                       <div className="absolute right-1 w-4 h-4 bg-black rounded-full" />
                    </div>
                 </div>
                 
                 <div className="flex justify-between items-center group">
                    <div>
                       <p className="text-sm font-bold text-white">Grid Overlays</p>
                       <p className="text-xs text-slate-500">Show technical background blueprint grid.</p>
                    </div>
                    <div className="w-12 h-6 bg-brand rounded-full relative p-1 cursor-pointer">
                       <div className="absolute right-1 w-4 h-4 bg-black rounded-full" />
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* Persistence Controls */}
      <div className="flex justify-end gap-4 pt-8 border-t border-white/5">
         <button className="px-6 py-2.5 rounded-lg text-sm font-bold text-slate-400 hover:text-white">Discard Changes</button>
         <button className="px-8 py-2.5 rounded-lg text-sm font-black bg-brand text-black hover:shadow-[0_0_20px_rgba(242,125,38,0.3)] transition-all">
            Commit Global Settings
         </button>
      </div>
    </div>
  );
}
