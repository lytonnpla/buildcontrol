import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  Users, 
  Settings, 
  Image as ImageIcon, 
  FileCode, 
  ShieldAlert, 
  LayoutPanelLeft,
  ChevronLeft,
  LogOut,
  Lock,
  Palette,
  Terminal
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';

const adminNavItems = [
  { icon: LayoutPanelLeft, label: 'Overview', path: '/admin' },
  { icon: Users, label: 'User Management', path: '/admin/users' },
  { icon: Lock, label: 'Profiles & Permissions', path: '/admin/permissions' },
  { icon: Palette, label: 'Branding & Logo', path: '/admin/branding' },
  { icon: FileCode, label: 'Document Templates', path: '/admin/templates' },
  { icon: Settings, label: 'System Parameters', path: '/admin/settings' },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 3);
  };

  return (
    <div className="flex min-h-screen bg-[#070708] font-sans">
      {/* Admin Sidebar */}
      <aside className="w-64 flex flex-col border-r border-white/5 bg-[#0D0E11]">
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/5 rounded flex items-center justify-center text-slate-400">
              <ShieldCheck size={20} />
            </div>
            <span className="font-bold text-white text-sm tracking-tight uppercase">Admin Panel</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {adminNavItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/admin'}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                isActive 
                  ? "bg-white/5 text-white border border-white/10" 
                  : "text-slate-500 hover:text-slate-300 hover:bg-white/[0.02]"
              )}
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5 space-y-1">
          <button 
            onClick={() => navigate('/')}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-500 hover:text-white transition-colors"
          >
            <ChevronLeft size={18} />
            Exit Admin
          </button>
        </div>
      </aside>

      {/* Admin Content */}
      <main className="flex-1 overflow-y-auto bg-[#070708] relative">
         <div className="absolute top-0 right-0 p-32 opacity-5 pointer-events-none">
            <ShieldAlert size={400} className="text-slate-500" />
         </div>
                  <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-[#0D0E11]/50 backdrop-blur-xl sticky top-0 z-50">
            <div className="flex items-center gap-6">
               <div className="flex items-center gap-3 px-3 py-1 bg-brand/5 border border-brand/20 rounded-md">
                  <div className="relative">
                    <motion.div 
                      animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0.8, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-0 bg-brand rounded-full blur-sm"
                    />
                    <div className="relative w-2 h-2 rounded-full bg-brand shadow-[0_0_10px_rgba(242,125,38,0.8)]" />
                  </div>
                  <span className="text-[10px] font-black text-brand uppercase tracking-[0.2em] animate-pulse">System_Live</span>
               </div>
               
               <div className="h-4 w-px bg-white/10" />
               
               <div className="flex items-center gap-4 group">
                 <div className="flex flex-col">
                   <div className="flex items-center gap-4">
                     <Terminal size={12} className="text-slate-600" />
                     <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] whitespace-nowrap">
                       Authorized Technical Environment
                     </h2>
                   </div>
                   <div className="h-[1px] w-full bg-white/5 mt-1 relative overflow-hidden">
                     <motion.div 
                       animate={{ x: ['-100%', '100%'] }}
                       transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                       className="absolute inset-y-0 w-20 bg-gradient-to-r from-transparent via-brand/40 to-transparent"
                     />
                   </div>
                 </div>
               </div>
            </div>
            <div className="flex items-center gap-4">
               <div className="text-right">
                  <p className="text-xs font-bold text-white leading-none">{user?.name}</p>
                  <p className="text-[10px] text-slate-600 font-mono mt-1 uppercase tracking-tighter">{user?.role?.replace(' ', '_')}_Level_01</p>
               </div>
               <div className="flex items-center gap-3 ml-2 border-l border-white/5 pl-4">
                  <div className="w-8 h-8 rounded bg-slate-800 border border-white/10 flex items-center justify-center text-[10px] text-slate-400 font-bold">
                     {getInitials(user?.name || 'User')}
                  </div>
                  <button 
                    onClick={logout}
                    className="p-1.5 text-slate-500 hover:text-red-500 transition-colors rounded hover:bg-white/5"
                    title="Logout"
                  >
                    <LogOut size={16} />
                  </button>
               </div>
            </div>
         </header>

         <div className="p-8 max-w-6xl mx-auto relative z-10">
            <Outlet />
         </div>
      </main>
    </div>
  );
}
