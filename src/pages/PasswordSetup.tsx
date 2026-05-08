import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Key, ShieldCheck, Lock, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { cn } from '../lib/utils';

export default function PasswordSetup() {
  const navigate = useNavigate();
  const { user, updatePassword } = useAuth();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!user?.requiresPasswordSetup) {
    navigate('/select');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsSubmitting(true);
    try {
      await updatePassword(password);
      navigate('/select');
    } catch (err: any) {
      setError(err.message || 'Failed to update password');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-brand/5 rounded-full blur-[120px]" />
        <div className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] bg-brand/5 rounded-full blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-[#0D0E11] border border-white/5 p-8 rounded-3xl shadow-2xl">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-16 h-16 bg-brand/10 border border-brand/20 rounded-2xl flex items-center justify-center text-brand mb-4">
              <Key size={32} />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Security Initialization</h1>
            <p className="text-slate-500 mt-2 text-xs uppercase tracking-widest font-black">Credential Setup Required</p>
          </div>

          <div className="p-4 bg-brand/5 border border-brand/10 rounded-xl mb-8 flex gap-3">
            <ShieldCheck size={18} className="text-brand shrink-0" />
            <p className="text-[10px] text-slate-400 leading-relaxed uppercase tracking-widest">
              Welcome, <span className="text-white">{user?.name}</span>. An administrator has created your account. 
              Please define your secure password to activate your environment.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">New Secure Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 transition-colors group-focus-within:text-brand" size={16} />
                  <input 
                    required
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min. 8 characters"
                    className="w-full bg-black/40 border border-white/5 rounded-xl py-3.5 pl-12 pr-4 text-sm text-white focus:border-brand/40 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Confirm Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 transition-colors group-focus-within:text-brand" size={16} />
                  <input 
                    required
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    className="w-full bg-black/40 border border-white/5 rounded-xl py-3.5 pl-12 pr-4 text-sm text-white focus:border-brand/40 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3 text-red-500 text-[10px] uppercase font-black tracking-widest"
              >
                <AlertCircle size={14} />
                {error}
              </motion.div>
            )}

            <button 
              disabled={isSubmitting}
              className="w-full relative group h-14"
            >
              <div className={cn(
                "absolute inset-0 bg-brand rounded-xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity",
                isSubmitting && "opacity-0"
              )} />
              <div className="relative h-full bg-brand text-black font-black uppercase tracking-[0.2em] text-xs rounded-xl flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100">
                {isSubmitting ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <>
                    Initialize Environment
                    <ArrowRight size={18} />
                  </>
                )}
              </div>
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-white/5 flex flex-col items-center gap-4">
             <div className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-brand" />
                <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">End-to-End Encryption Protocol</span>
             </div>
             <p className="text-[9px] text-slate-700 text-center leading-relaxed">
               Secure your credentials. This environment enforces military-grade access control. 
               Shared account usage is strictly prohibited.
             </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
