import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  HardHat, 
  Users, 
  Truck, 
  FileText, 
  Calendar, 
  Calculator,
  History,
  Settings,
  Bell,
  Search,
  Menu,
  X,
  LogOut
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/erp' },
  { icon: HardHat, label: 'Projects', path: '/erp/projects' },
  { icon: Users, label: 'Clients', path: '/erp/clients' },
  { icon: Truck, label: 'Suppliers', path: '/erp/suppliers' },
  { icon: FileText, label: 'Contracts', path: '/erp/contracts' },
  { icon: Calendar, label: 'Schedule', path: '/erp/schedule' },
  { icon: Calculator, label: 'Estimates', path: '/erp/estimates' },
  { icon: History, label: 'Daily Log', path: '/erp/daily-log' },
];

export default function AppLayout() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  const filteredNavItems = React.useMemo(() => {
    if (!user) return [];
    if (user.role === 'Super Admin') return navItems;
    return navItems.filter(item => user.accessibleModules.includes(item.label));
  }, [user]);

  return (
    <div className="flex min-h-screen bg-[#0A0A0B]">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex w-64 flex-col border-r border-border bg-sheet/50 backdrop-blur-xl">
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand rounded-lg flex items-center justify-center text-black">
              <HardHat size={24} strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="font-bold text-white tracking-tight leading-none text-lg">BuildControl</h1>
              <span className="text-[10px] uppercase tracking-[0.2em] text-brand font-bold">Pro Edition</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {filteredNavItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group",
                isActive 
                  ? "bg-brand/10 text-brand border border-brand/20 shadow-[0_0_15px_-5px_rgba(242,125,38,0.4)]" 
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/5 active:scale-95"
              )}
            >
              <item.icon size={18} className={cn(
                "transition-transform",
                "group-hover:scale-110"
              )} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 px-3 py-2 text-slate-400 hover:text-slate-200 cursor-pointer">
            <Settings size={18} />
            <span className="text-sm font-medium">Settings</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 relative">
        {/* Technical Background Grid */}
        <div className="absolute inset-0 technical-grid opacity-20 pointer-events-none" />

        {/* Top Header */}
        <header className="h-16 border-b border-border bg-sheet/30 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-40">
          <button 
            className="lg:hidden text-slate-400 hover:text-white"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu size={24} />
          </button>

          <div className="hidden md:flex items-center bg-white/5 border border-border rounded-full px-4 py-1.5 w-96 group focus-within:border-brand/40 transition-colors">
            <Search size={16} className="text-slate-500 group-focus-within:text-brand" />
            <input 
              type="text" 
              placeholder="Search projects, client, tasks..."
              className="bg-transparent border-none outline-none text-sm ml-2 w-full text-slate-200 placeholder:text-slate-600"
            />
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-white relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-brand rounded-full border-2 border-sheet" />
            </button>
            <div className="flex items-center gap-3 ml-2 border-l border-white/10 pl-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand to-orange-600 flex items-center justify-center text-xs font-bold text-black border border-white/20">
                {getInitials(user?.name || 'User')}
              </div>
              <button 
                onClick={logout}
                className="p-1.5 text-slate-500 hover:text-red-500 transition-colors rounded-md hover:bg-red-500/10"
                title="Sair"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-6 relative">
          <Outlet />
        </div>
      </main>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-72 bg-sheet z-[60] lg:hidden border-r border-border"
            >
              <div className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-brand rounded flex items-center justify-center text-black">
                    <HardHat size={18} />
                  </div>
                  <span className="font-bold text-white">BuildControl</span>
                </div>
                <button onClick={() => setIsMobileMenuOpen(false)} className="text-slate-400">
                  <X size={24} />
                </button>
              </div>
              <nav className="p-4 space-y-1">
                {filteredNavItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) => cn(
                      "flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium",
                      isActive ? "bg-brand/10 text-brand" : "text-slate-400"
                    )}
                  >
                    <item.icon size={20} />
                    {item.label}
                  </NavLink>
                ))}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
