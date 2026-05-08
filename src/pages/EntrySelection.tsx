import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  LayoutDashboard, 
  ArrowRight, 
  HardHat, 
  Settings2, 
  Users2, 
  FileCode2, 
  ShieldAlert,
  Lock,
  LogOut
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { useAuth } from '../context/AuthContext';

export default function EntrySelection() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  // We check if the user is a super admin if they are logged in.
  // If not logged in, we assume they might be until they authenticate.
  const isSuperAdmin = !user || user.role === 'Super Admin';

  const handleEntry = (path: string) => {
    if (!user) {
      // Redirect to login but remember where they wanted to go
      navigate('/login', { state: { from: { pathname: path } } });
    } else {
      navigate(path);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 technical-grid opacity-20" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand/5 rounded-full blur-[120px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16 relative z-10"
      >
        <div className="inline-flex items-center gap-3 bg-white/5 border border-border px-4 py-2 rounded-full mb-6">
          <HardHat size={18} className="text-brand" />
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">BuildControl Pro v2.0</span>
        </div>
        <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter mb-4">
          Welcome to the <span className="text-brand shadow-brand/20">Forge</span>
        </h1>
        <p className="text-slate-400 max-w-lg mx-auto text-lg leading-relaxed">
          Select your workspace environment to continue. Management and technical operations are logically separated for security.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl w-full relative z-10">
        {/* ERP Card */}
        <motion.button
          whileHover={{ scale: 1.02, y: -5 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleEntry('/erp')}
          className="group relative bg-sheet/40 border border-border p-1 rounded-2xl overflow-hidden hover:border-brand/50 transition-all text-left"
        >
          <div className="bg-sheet p-8 rounded-2xl h-full flex flex-col">
            <div className="w-14 h-14 bg-brand/10 rounded-xl flex items-center justify-center text-brand mb-6 group-hover:scale-110 transition-transform">
              <LayoutDashboard size={32} />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">ERP Workspace</h2>
            <p className="text-slate-500 text-sm mb-8 flex-1 leading-relaxed">
              Full construction lifecycle management. Estimates, contracts, project scheduling, daily logs, and financial invoicing.
            </p>
            <div className="flex items-center gap-2 text-brand font-bold text-sm">
              Launch ERP <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </div>
            
            {/* Visual Accents */}
            <div className="absolute top-0 right-0 p-4 opacity-10">
               <FileCode2 size={120} />
            </div>
          </div>
        </motion.button>

        {/* Administrator Card */}
        <motion.button
          whileHover={isSuperAdmin ? { scale: 1.02, y: -5 } : {}}
          whileTap={isSuperAdmin ? { scale: 0.98 } : {}}
          disabled={!isSuperAdmin}
          onClick={() => handleEntry('/admin')}
          className={cn(
            "group relative bg-sheet/40 border p-1 rounded-2xl overflow-hidden transition-all text-left flex flex-col h-full",
            isSuperAdmin 
              ? "border-border hover:border-slate-700 cursor-pointer" 
              : "border-border/50 opacity-40 cursor-not-allowed"
          )}
        >
          <div className="bg-sheet p-8 rounded-2xl h-full flex flex-col w-full">
            <div className="w-14 h-14 bg-white/5 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-white transition-colors mb-6 group-hover:scale-110 transition-transform">
              {isSuperAdmin ? <ShieldCheck size={32} /> : <Lock size={32} className="text-slate-700" />}
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">Administrator</h2>
            <p className="text-slate-500 text-sm mb-8 flex-1 leading-relaxed">
              Technical orchestration. System parametrization, user permissions, custom document models, and global branding settings.
            </p>
            <div className="flex items-center gap-2 text-slate-300 font-bold text-sm">
              {isSuperAdmin ? (
                <>Technical Panel <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" /></>
              ) : (
                <span className="text-slate-600 flex items-center gap-2 italic uppercase text-[10px]">Restricted Domain Access</span>
              )}
            </div>

            {/* Visual Accents */}
            <div className="absolute top-0 right-0 p-4 opacity-5">
               <ShieldAlert size={120} />
            </div>
          </div>
        </motion.button>
      </div>

      {user && (
        <div className="max-w-5xl w-full flex justify-end mt-4 relative z-10">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-[10px] font-black text-slate-500 hover:text-brand uppercase tracking-widest transition-colors group"
          >
            <LogOut size={14} className="group-hover:-translate-x-1 transition-transform" />
            Encerrar Sessão / Logout
          </button>
        </div>
      )}

      {/* Footer Info */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-20 flex items-center gap-8 text-[10px] font-bold text-slate-600 uppercase tracking-[0.3em]"
      >
        <span>Secure Protocol 44.2</span>
        <span>Build ID: 2026.05.08</span>
        <span>Environment: Production</span>
      </motion.div>
    </div>
  );
}
