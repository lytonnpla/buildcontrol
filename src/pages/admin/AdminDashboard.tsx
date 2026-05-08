import React from 'react';
import { 
  ShieldCheck, 
  Activity, 
  Database, 
  Lock, 
  UserPlus, 
  Server, 
  Cpu, 
  History,
  AlertTriangle
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

export default function AdminDashboard() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Technical Overview</h1>
          <p className="text-slate-500 mt-1 uppercase tracking-widest text-[10px] font-bold">Node Identity: BuildControl-Core-01</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
           <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
           <span className="text-[10px] uppercase font-black text-emerald-500 tracking-widest">Systems Online</span>
        </div>
      </div>

      {/* Resource Monitor */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Sessions', value: '142', icon: Activity, color: 'text-brand' },
          { label: 'Database Load', value: '12%', icon: Database, color: 'text-blue-400' },
          { label: 'Cloud Storage', value: '8.2GB', icon: Server, color: 'text-purple-400' },
          { label: 'Security Level', value: 'Tier 1', icon: ShieldCheck, color: 'text-emerald-400' },
        ].map((stat, i) => (
          <div key={i} className="bg-[#0D0E11] border border-white/5 p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
               <stat.icon size={20} className={stat.color} />
               <span className="text-[10px] font-mono text-slate-600">RT-DATA</span>
            </div>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">{stat.label}</p>
            <p className="text-2xl font-black text-white mt-1 tracking-tighter">{stat.value}</p>
            <div className="mt-4 h-1 bg-white/5 rounded-full overflow-hidden">
               <div className={cn("h-full bg-current", stat.color)} style={{ width: '40%' }} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Admin Actions */}
        <div className="lg:col-span-2 bg-[#0D0E11] border border-white/5 rounded-2xl overflow-hidden">
           <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <h3 className="font-bold text-white flex items-center gap-2 text-sm uppercase tracking-widest">
                 <History size={16} className="text-brand" />
                 Audit Logs
              </h3>
              <button className="text-[10px] font-bold text-slate-500 hover:text-white uppercase tracking-widest">View Full Analytics</button>
           </div>
           <div className="divide-y divide-white/[0.03]">
              {[
                { action: 'Permission Change', user: 'Admin_Master', target: 'User_4421', time: '14m ago', status: 'Success' },
                { action: 'Logo Update', user: 'Admin_Design', target: 'Global Branding', time: '1h ago', status: 'Success' },
                { action: 'New Template Published', user: 'Admin_Legal', target: 'Contract_v3', time: '3h ago', status: 'Success' },
                { action: 'Unauthorized Access Blocked', user: 'System', target: 'IP_201.22.45.*', time: '5h ago', status: 'Security_Event' },
              ].map((log, i) => (
                <div key={i} className="p-4 flex items-center justify-between hover:bg-white/[0.01] transition-colors">
                   <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-8 h-8 rounded flex items-center justify-center",
                        log.status === 'Security_Event' ? "bg-red-500/10 text-red-500" : "bg-white/5 text-slate-400"
                      )}>
                         {log.status === 'Security_Event' ? <AlertTriangle size={14} /> : <Cpu size={14} />}
                      </div>
                      <div>
                         <p className="text-sm font-bold text-white leading-none">{log.action}</p>
                         <p className="text-[10px] text-slate-500 mt-1">Initiated by <span className="text-slate-300">{log.user}</span> on {log.target}</p>
                      </div>
                   </div>
                   <div className="text-right">
                      <p className="text-[10px] font-mono text-slate-600">{log.time}</p>
                      <span className={cn(
                        "text-[8px] font-bold uppercase tracking-widest",
                        log.status === 'Security_Event' ? "text-red-500" : "text-emerald-500"
                      )}>{log.status}</span>
                   </div>
                </div>
              ))}
           </div>
        </div>

        {/* Quick Config */}
        <div className="space-y-4">
           <div className="bg-brand/5 border border-brand/20 p-6 rounded-2xl flex flex-col items-center text-center">
              <Lock size={32} className="text-brand mb-4" />
              <h4 className="font-bold text-white mb-2 uppercase tracking-widest text-xs">Security Hardening</h4>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest leading-relaxed">System is currently operating under standard protocol. Enable High-Security mode to force MFA on all worker nodes.</p>
              <button className="mt-6 w-full py-2 bg-brand text-black text-[10px] font-black uppercase tracking-[0.2em] rounded hover:shadow-[0_0_15px_rgba(242,125,38,0.3)] transition-all">
                 Authorize LockDown
              </button>
           </div>
           
           <div className="bg-white/5 border border-white/5 p-6 rounded-2xl flex items-center justify-between group cursor-pointer hover:border-white/20 transition-all">
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center text-slate-400 group-hover:text-white transition-colors">
                    <UserPlus size={20} />
                 </div>
                 <div>
                    <p className="text-sm font-bold text-white">Batch Invite</p>
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">New Staff Users</p>
                 </div>
              </div>
              <div className="w-6 h-6 rounded-full border border-white/10 flex items-center justify-center text-slate-500 group-hover:bg-white/10 transition-all">
                 +
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
