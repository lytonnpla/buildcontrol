import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Shield, 
  Lock, 
  Mail, 
  ArrowRight, 
  Terminal,
  ShieldAlert,
  Loader2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

export default function Login() {
  const [showSplash, setShowSplash] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/select';

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const loggedUser = await (login(email.trim(), password.trim()) as any);
      if (loggedUser.requiresPasswordSetup) {
        navigate('/password-setup', { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    } catch (err: any) {
      setError('AUTHENTICATION_FAILED: Invalid identity credentials');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#06070a] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
      </div>

      <AnimatePresence mode="wait">
        {showSplash ? (
          <motion.div 
            key="splash"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col items-center gap-8 relative z-50"
          >
            <div className="relative">
              <div className="w-24 h-24 rounded-2xl bg-brand/10 border border-brand/20 flex items-center justify-center shadow-[0_0_50px_rgba(242,125,38,0.3)]">
                <Shield className="text-brand" size={48} />
              </div>
              <motion.div 
                animate={{ y: [-40, 40], opacity: [0, 1, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                className="absolute inset-x-[-20px] h-[1px] bg-brand shadow-[0_0_10px_#F27D26]"
              />
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-black text-white uppercase tracking-[0.2em]">BuildControl</h1>
              <div className="mt-4 flex items-center gap-3">
                <div className="h-[1px] w-12 bg-white/10" />
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.3em]">SECURE_TUNNEL_INITIALIZING</p>
                <div className="h-[1px] w-12 bg-white/10" />
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="login-form"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md relative"
          >
            {/* Core Frame */}
            <div className="bg-[#0D0E11] border border-white/5 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl">
              {/* Header Section */}
          <div className="p-8 pb-4 border-b border-white/5 relative">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-brand/10 border border-brand/20 flex items-center justify-center shadow-[0_0_20px_rgba(242,125,38,0.15)]">
                <Shield className="text-brand" size={24} />
              </div>
              <div>
                <h1 className="text-xl font-black text-white uppercase tracking-wider">BuildControl</h1>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-0.5">Industrial Infrastructure ERP</p>
              </div>
            </div>

            <div className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-md w-fit">
               <motion.div 
                 animate={{ opacity: [0.4, 1, 0.4] }}
                 transition={{ duration: 2, repeat: Infinity }}
                 className="w-1.5 h-1.5 rounded-full bg-brand"
               />
               <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Protocol_Handshake_Pending</span>
            </div>
          </div>

          {/* Form Section */}
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <AnimatePresence mode="wait">
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex items-center gap-3"
                >
                  <ShieldAlert className="text-red-500 shrink-0" size={16} />
                  <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <Mail size={10} /> Identity Identity (Email)
                </label>
                <div className="relative group">
                  <input 
                    required
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:border-brand/40 outline-none transition-all placeholder:text-slate-700"
                    placeholder="operator@buildcontrol.pro"
                  />
                  <div className="absolute inset-0 rounded-xl bg-brand/5 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <Lock size={10} /> Access Security Key
                </label>
                <div className="relative group">
                  <input 
                    required
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:border-brand/40 outline-none transition-all placeholder:text-slate-700"
                    placeholder="••••••••••••"
                  />
                  <div className="absolute inset-0 rounded-xl bg-brand/5 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />
                </div>
              </div>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className={cn(
                "w-full py-3.5 bg-brand text-black text-xs font-black uppercase tracking-[0.2em] rounded-xl transition-all relative overflow-hidden group",
                isLoading ? "opacity-70 cursor-wait" : "hover:shadow-[0_0_30px_rgba(242,125,38,0.3)] hover:scale-[1.02] active:scale-[0.98]"
              )}
            >
              <div className="relative z-10 flex items-center justify-center gap-2">
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" size={16} />
                    Validating...
                  </>
                ) : (
                  <>
                    Initialize Auth Session
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </div>
              <div className="absolute inset-x-0 bottom-0 h-[2px] bg-black/20" />
            </button>

            <button 
              type="button"
              onClick={() => navigate('/select')}
              className="w-full py-2 text-slate-500 hover:text-white text-[10px] font-black uppercase tracking-[0.2em] transition-colors"
            >
              Cancel / Back to Selection
            </button>
          </form>

          {/* Infrastructure Health Footer */}
          <div className="p-6 bg-white/[0.02] border-t border-white/5">
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <Terminal className="text-slate-600" size={14} />
                   <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Authorized node access only</p>
                </div>
                <div className="text-[9px] text-slate-700 font-mono">v4.1.8-STABLE</div>
             </div>
          </div>
        </div>

        {/* Demo Credentials Hint */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 p-4 bg-white/[0.01] border border-white/[0.05] rounded-xl text-center"
        >
          <p className="text-[10px] text-slate-600 uppercase tracking-widest font-bold">System Credentials Registry</p>
          <div className="mt-2 text-[11px] text-slate-500">
            <span className="text-slate-400">IDENTITY:</span> {email || 'operator@buildcontrol.pro'} <span className="mx-2 text-slate-700">|</span> <span className="text-slate-400">KEY:</span> password123
          </div>
        </motion.div>
        </motion.div>
      )}
      </AnimatePresence>
    </div>
  );
}
