import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  Activity, 
  Cpu, 
  Globe, 
  ArrowRight,
  Zap,
  Layers,
  Database
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

import { useAuth } from '../context/AuthContext';

export default function LandingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleAction = () => {
    navigate('/select');
  };

  return (
    <div className="min-h-screen bg-[#06070a] text-white selection:bg-brand/30 selection:text-brand">
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden h-screen">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-brand/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/10 blur-[120px] rounded-full" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.15] mix-blend-overlay" />
        
        {/* Grid Overlay */}
        <div 
          className="absolute inset-0 opacity-[0.03]" 
          style={{ 
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.2) 1px, transparent 0)',
            backgroundSize: '40px 40px' 
          }} 
        />
      </div>

      {/* Navigation */}
      <nav className="relative z-50 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-brand/10 border border-brand/20 flex items-center justify-center shadow-[0_0_20px_rgba(242,125,38,0.2)]">
            <Shield className="text-brand" size={20} />
          </div>
          <div>
            <h1 className="text-lg font-black uppercase tracking-tighter">BuildControl</h1>
            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-[0.2em] -mt-1">Industrial ERP</p>
          </div>
        </div>
        
        <div className="hidden md:flex items-center gap-8">
          {['Infrastructure', 'Real-Time', 'Security', 'Scalability'].map((item) => (
            <a key={item} href="#" className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors">
              {item}
            </a>
          ))}
          <button 
            onClick={handleAction}
            className="px-6 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all"
          >
            ENTER THE SYSTEM
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-8 pt-20 pb-32">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/10 border border-brand/20 mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand"></span>
              </span>
              <span className="text-[10px] font-black text-brand uppercase tracking-[0.2em]">IT HELPDESK, LTD PRODUCTION</span>
            </div>
            
            <h2 className="text-6xl md:text-7xl font-black leading-[0.95] tracking-tighter mb-8">
              BUILD CONTROL <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand via-orange-400 to-white">
                PROFESSIONAL
              </span>
            </h2>
            
            <p className="text-lg text-slate-400 max-w-xl leading-relaxed mb-10 font-medium italic">
              Centralized command for global infrastructure deployments. 
              Real-time synchronization across all technical nodes and financial layers.
            </p>

            <div className="flex flex-wrap gap-4">
              <button 
                onClick={handleAction}
                className="px-8 py-4 bg-brand text-black font-black uppercase tracking-widest text-sm rounded-xl hover:shadow-[0_0_40px_rgba(242,125,38,0.4)] transition-all flex items-center gap-3 hover:scale-[1.02] active:scale-[0.98]"
              >
                ENTER THE SYSTEM
                <ArrowRight size={18} />
              </button>
              <button className="px-8 py-4 bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest text-sm rounded-xl hover:bg-white/10 transition-all">
                Documentation
              </button>
            </div>

            <div className="mt-16 grid grid-cols-3 gap-8 border-t border-white/5 pt-8">
              {[
                { label: 'Latency', value: '4ms' },
                { label: 'Uptime', value: '99.9%' },
                { label: 'Nodes', value: '1.2k+' }
              ].map((stat, i) => (
                <div key={i}>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{stat.label}</p>
                  <p className="text-xl font-bold font-mono">{stat.value}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotateY: 10 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            {/* Visual Representation of Infrastructure */}
            <div className="relative aspect-square">
              <div className="absolute inset-0 bg-brand/5 rounded-3xl border border-white/5 backdrop-blur-3xl overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-brand/20 via-transparent to-blue-500/10" />
                
                {/* Simulated Data Blocks */}
                <div className="p-8 grid grid-cols-2 gap-4 h-full">
                  {[Activity, Cpu, Globe, Zap, Layers, Database].map((Icon, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ y: -5, borderColor: 'rgba(242, 125, 38, 0.4)' }}
                      className="bg-black/40 border border-white/5 rounded-2xl p-6 flex flex-col justify-between transition-all"
                    >
                      <Icon className="text-brand/60 group-hover:text-brand" size={24} />
                      <div className="mt-4">
                        <div className="h-1 w-12 bg-white/10 rounded-full mb-2" />
                        <div className="h-1 w-8 bg-white/5 rounded-full" />
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Scanning Light Effect */}
                <motion.div 
                  animate={{ y: ['-100%', '200%'] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-x-0 h-40 bg-gradient-to-b from-transparent via-brand/10 to-transparent pointer-events-none"
                />
              </div>
              
              {/* Floating Accents */}
              <motion.div 
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-10 -right-10 p-4 bg-[#0D0E11] border border-white/10 rounded-2xl shadow-2xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                    <Activity size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-white uppercase tracking-widest">Network Safe</p>
                    <p className="text-[9px] text-slate-500 uppercase">Encrypted Session</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Feature Grid */}
      <section className="relative z-10 bg-black/50 border-y border-white/5 py-24 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                title: 'Data Integrity',
                desc: 'Cryptographic verification on every financial transaction and project state change.',
                icon: Shield
              },
              {
                title: 'Global Sync',
                desc: 'Sub-millisecond synchronization across distributed construction sites and management nodes.',
                icon: Globe
              },
              {
                title: 'Granular RBAC',
                desc: 'Hyper-specific permission mapping for every organizational role and technical module.',
                icon: Layers
              }
            ].map((feature, i) => (
              <div key={i} className="group">
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:border-brand/40 transition-colors">
                  <feature.icon className="text-slate-400 group-hover:text-brand transition-colors" size={24} />
                </div>
                <h3 className="text-lg font-bold mb-3 uppercase tracking-tight">{feature.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-12 px-8 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 opacity-50">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500">
            © 2026 BUILDCONTROL_SYSTEMS. ALL RIGHTS RESERVED.
          </p>
          <div className="flex gap-8">
            {['Privacy', 'Legal', 'Infrastructure', 'Security'].map(item => (
              <a key={item} href="#" className="text-[9px] font-black uppercase tracking-widest hover:text-white transition-colors">
                {item}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
