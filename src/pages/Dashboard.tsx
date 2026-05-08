import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, 
  Users, 
  Briefcase, 
  Clock, 
  CircleDollarSign,
  ArrowUpRight,
  ChevronRight,
  HardHat,
  X,
  Plus,
  ArrowRight
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { cn } from '../lib/utils';

const data = [
  { name: 'Jan', revenue: 4000, costs: 2400 },
  { name: 'Feb', revenue: 3000, costs: 1398 },
  { name: 'Mar', revenue: 2000, costs: 9800 },
  { name: 'Apr', revenue: 2780, costs: 3908 },
  { name: 'May', revenue: 1890, costs: 4800 },
  { name: 'Jun', revenue: 2390, costs: 3800 },
];

interface Project {
  id: string;
  name: string;
  client: string;
  location: string;
  progress: number;
  status: string;
  value: string;
  type: string;
  team?: number;
  deadline?: string;
}

interface Client {
  id: string;
  name: string;
  company: string;
  email: string;
  status: string;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [activeDetail, setActiveDetail] = useState<'projects' | 'revenue' | 'clients' | null>(null);

  useEffect(() => {
    const storedProjects = localStorage.getItem('BUILDCONTROL_PROJECTS');
    const storedClients = localStorage.getItem('BUILDCONTROL_CLIENTS');
    
    if (storedProjects) setProjects(JSON.parse(storedProjects));
    if (storedClients) setClients(JSON.parse(storedClients));
  }, []);

  const stats = useMemo(() => {
    const activeProjects = projects.filter(p => p.status === 'Active');
    const activeClients = clients.filter(c => c.status === 'Active');
    
    const totalRev = projects.reduce((acc, p) => {
      const val = parseFloat(p.value.replace(/[^0-9.]/g, '')) || 0;
      // Handle M/K suffixes if any
      if (p.value.toUpperCase().includes('M')) return acc + (val * 1000000);
      if (p.value.toUpperCase().includes('K')) return acc + (val * 1000);
      return acc + val;
    }, 0);

    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    });

    return [
      { id: 'projects', label: 'Active Projects', value: activeProjects.length.toString(), icon: Briefcase, color: 'text-brand', items: activeProjects },
      { id: 'revenue', label: 'Total Revenue', value: formatter.format(totalRev), icon: CircleDollarSign, color: 'text-emerald-400', total: totalRev },
      { id: 'clients', label: 'Active Clients', value: activeClients.length.toString(), icon: Users, color: 'text-blue-400', items: activeClients },
      { id: 'uptime', label: 'System Uptime', value: '99.9%', icon: Clock, color: 'text-purple-400' },
    ];
  }, [projects, clients]);

  const isSuperAdmin = user?.role === 'Super Admin';
  const hasWidget = (name: string) => isSuperAdmin || user?.accessibleDashboardWidgets.includes(name);

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white font-sans tracking-tight">System Dashboard</h2>
          <p className="text-slate-400 text-sm">Welcome back, {user?.name || 'Operator'}. Here's what's happening today.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-white/5 border border-border px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/10 transition-colors">
            Export Report
          </button>
          <Link 
            to="/erp/projects"
            state={{ openNewProject: true }}
            className="bg-brand text-black px-4 py-2 rounded-lg text-sm font-bold hover:bg-brand/90 transition-colors shadow-[0_0_20px_-5px_rgba(242,125,38,0.5)]"
          >
            New Project
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      {hasWidget('Financial Summary') && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              key={i} 
              onClick={() => stat.id !== 'uptime' && setActiveDetail(stat.id as any)}
              className={cn(
                "bg-sheet/50 border border-border p-5 rounded-xl group hover:border-brand/30 transition-colors cursor-pointer",
                stat.id === 'uptime' && "cursor-default"
              )}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={cn("p-2 rounded-lg bg-white/5", stat.color)}>
                  <stat.icon size={20} />
                </div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">+12%</span>
              </div>
              <h3 className="text-slate-400 text-xs font-medium uppercase tracking-wider">{stat.label}</h3>
              <p className="text-2xl font-bold text-white mt-1 font-mono tracking-tight">{stat.value}</p>
              {stat.id !== 'uptime' && (
                <div className="mt-4 flex items-center gap-1 text-[10px] font-black text-brand uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                  View Analysis <ChevronRight size={10} />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      <AnimatePresence>
        {activeDetail && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveDetail(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#0D0E11] border border-white/10 w-full max-w-2xl rounded-2xl shadow-2xl relative z-10 overflow-hidden"
            >
              <div className="p-6 border-b border-white/5 flex items-center justify-between bg-brand/5">
                <div>
                  <h3 className="text-lg font-bold text-white uppercase tracking-tighter">
                    {activeDetail === 'projects' ? 'Active Projects Analysis' : 
                     activeDetail === 'clients' ? 'Active Client Registry' : 
                     'Revenue Convergence Details'}
                  </h3>
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">Operational drill-down enabled</p>
                </div>
                <button onClick={() => setActiveDetail(null)} className="text-slate-500 hover:text-white transition-colors p-2 bg-white/5 rounded-lg">
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
                {activeDetail === 'projects' && (
                  <div className="space-y-4">
                    {projects.filter(p => p.status === 'Active').map(p => (
                      <div key={p.id} className="bg-white/5 border border-white/5 p-4 rounded-xl flex items-center justify-between group hover:border-brand/30 transition-all">
                        <div>
                          <h4 className="text-white font-bold text-sm tracking-tight">{p.name}</h4>
                          <p className="text-[10px] text-slate-500 uppercase tracking-widest">{p.client} • {p.location}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-brand font-mono text-xs">{p.value}</p>
                          <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">{p.progress}% Ready</p>
                        </div>
                      </div>
                    ))}
                    {projects.filter(p => p.status === 'Active').length === 0 && (
                      <p className="text-center text-slate-600 py-8 italic text-sm">No active projects detected in workspace.</p>
                    )}
                  </div>
                )}

                {activeDetail === 'clients' && (
                  <div className="space-y-4">
                    {clients.filter(c => c.status === 'Active').map(c => (
                      <div key={c.id} className="bg-white/5 border border-white/5 p-4 rounded-xl flex items-center justify-between group hover:border-brand/30 transition-all">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-brand/10 border border-brand/20 rounded-full flex items-center justify-center text-brand font-black text-xs">
                            {c.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <h4 className="text-white font-bold text-sm tracking-tight">{c.name}</h4>
                            <p className="text-[10px] text-slate-500 uppercase tracking-widest">{c.company} • {c.email}</p>
                          </div>
                        </div>
                        <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest rounded-full">
                          Verified
                        </div>
                      </div>
                    ))}
                    {clients.filter(c => c.status === 'Active').length === 0 && (
                      <p className="text-center text-slate-600 py-8 italic text-sm">No active clients found in directory.</p>
                    )}
                  </div>
                )}

                {activeDetail === 'revenue' && (
                  <div className="space-y-6">
                    <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl mb-4">
                      <p className="text-[10px] text-emerald-500/60 font-black uppercase tracking-widest mb-1">Cumulative Portfolio Value</p>
                      <h4 className="text-3xl font-black text-white font-mono">
                        {stats.find(s => s.id === 'revenue')?.value}
                      </h4>
                    </div>

                    <div className="space-y-3">
                      <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest px-1">Revenue Breakdown by Project</p>
                      {projects.map(p => (
                        <div key={p.id} className="flex items-center justify-between py-2 border-b border-white/5 px-1">
                          <span className="text-slate-400 text-sm">{p.name}</span>
                          <span className="text-white font-mono text-sm">{p.value}</span>
                        </div>
                      ))}
                    </div>

                    <div className="p-4 bg-white/5 rounded-xl border border-white/5 mt-6">
                       <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-3">Revenue Projection Growth</p>
                       <div className="h-2 bg-black/40 rounded-full overflow-hidden">
                          <div className="h-full bg-brand w-[70%]" />
                       </div>
                       <div className="flex justify-between mt-2">
                          <span className="text-[9px] text-slate-600 uppercase font-black tracking-widest italic">Target: $2.0M</span>
                          <span className="text-[9px] text-brand uppercase font-black tracking-widest">70% Reached</span>
                       </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="p-4 bg-white/5 border-t border-white/5 flex justify-end">
                <button 
                  onClick={() => setActiveDetail(null)}
                  className="px-6 py-2 bg-brand text-black font-black uppercase tracking-widest text-[10px] rounded-lg"
                >
                  Close Analysis
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart - Mapped to Revenue Analytics */}
        {hasWidget('Revenue Analytics') ? (
          <div className="lg:col-span-2 bg-sheet/50 border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-bold text-white flex items-center gap-2">
                <TrendingUp size={18} className="text-brand" />
                Financial Overview
              </h3>
              <div className="flex items-center gap-4 text-xs font-medium">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-brand" />
                  <span className="text-slate-400">Revenue</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-slate-600" />
                  <span className="text-slate-400">Costs</span>
                </div>
              </div>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F27D26" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#F27D26" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2A2C32" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    stroke="#475569" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false}
                    dy={10}
                  />
                  <YAxis 
                    stroke="#475569" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#151619', borderColor: '#2A2C32', color: '#fff' }}
                    itemStyle={{ color: '#F27D26' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#F27D26" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorRev)" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="costs" 
                    stroke="#475569" 
                    strokeWidth={2}
                    fill="transparent"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-2 bg-sheet/30 border border-white/5 border-dashed rounded-xl p-6 flex flex-col items-center justify-center min-h-[300px]">
             <CircleDollarSign size={40} className="text-slate-800 mb-4" />
             <p className="text-slate-600 text-xs font-bold uppercase tracking-widest">Financial Analytics Access Restricted</p>
             <p className="text-slate-700 text-[10px] mt-2 italic">Contact systems administrator for orchestration privilege.</p>
          </div>
        )}

        {/* Recent Projects - Mapped to Project Progress */}
        {hasWidget('Project Progress') ? (
          <div className="bg-sheet/50 border border-border rounded-xl overflow-hidden flex flex-col">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h3 className="font-bold text-white flex items-center gap-2">
                <HardHat size={18} className="text-brand" />
                Recent Projects
              </h3>
              <button className="text-brand text-xs font-bold hover:underline">View All</button>
            </div>
            <div className="flex-1 overflow-y-auto">
              {projects.slice(0, 5).map((project, i) => (
                <div 
                  key={project.id} 
                  className={cn(
                    "p-5 hover:bg-white/5 transition-colors cursor-pointer group",
                    i !== Math.min(projects.length, 5) - 1 && "border-b border-white/[0.03]"
                  )}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-bold text-white text-sm group-hover:text-brand transition-colors">{project.name}</h4>
                      <p className="text-slate-500 text-xs mt-0.5">{project.client}</p>
                    </div>
                    <ArrowUpRight size={14} className="text-slate-600 group-hover:text-brand transition-colors" />
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                      <span className="text-slate-500">Progress</span>
                      <span className="text-white font-mono">{project.progress}%</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${project.progress}%` }}
                        className="h-full bg-brand"
                      />
                    </div>
                  </div>
                </div>
              ))}
              {projects.length === 0 && (
                <div className="flex flex-col items-center justify-center p-12 text-center">
                   <Briefcase size={24} className="text-slate-700 mb-2" />
                   <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">No recent data</p>
                </div>
              )}
            </div>
            <div className="p-4 bg-brand/5 mt-auto">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-400">System Uptime</span>
                <span className="text-brand font-mono">99.9%</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-sheet/30 border border-white/5 border-dashed rounded-xl p-6 flex flex-col items-center justify-center">
             <HardHat size={40} className="text-slate-800 mb-4" />
             <p className="text-slate-600 text-xs font-bold uppercase tracking-widest text-center">Project Monitoring Offline</p>
          </div>
        )}
      </div>
    </div>
  );
}
