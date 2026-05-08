import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Calendar, 
  History, 
  LayoutPanelLeft,
  Settings,
  Download,
  Share2,
  Clock,
  Plus,
  ChevronRight
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

// Modules (To be expanded)
const Overview = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
       <div className="md:col-span-2 bg-sheet/50 border border-border rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">Project Summary</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
             Essential construction management overview. 
             Focus on timeline precision and site operation tracking.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 mt-8">
             <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Start Date</p>
                <p className="text-sm text-white font-mono">Jan 12, 2026</p>
             </div>
             <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Est. Completion</p>
                <p className="text-sm text-white font-mono">Aug 24, 2026</p>
             </div>
             <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Last Update</p>
                <p className="text-sm text-brand font-mono">2h ago</p>
             </div>
          </div>
       </div>
       <div className="bg-sheet/50 border border-border rounded-xl p-6 flex flex-col items-center justify-center text-center">
          <div className="w-24 h-24 rounded-full border-4 border-white/5 flex items-center justify-center relative mb-4">
             <svg className="w-full h-full -rotate-90">
                <circle
                  cx="48"
                  cy="48"
                  r="44"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-white/5"
                />
                <circle
                  cx="48"
                  cy="48"
                  r="44"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={276}
                  strokeDashoffset={276 * 0.35}
                  className="text-brand shadow-[0_0_15px_rgba(242,125,38,0.5)]"
                />
             </svg>
             <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-bold text-white tracking-tighter">65%</span>
                <span className="text-[8px] font-bold text-slate-500 uppercase">done</span>
             </div>
          </div>
          <h4 className="font-bold text-white text-sm">Overall Completion</h4>
          <p className="text-slate-500 text-[10px] mt-1 uppercase tracking-widest font-mono">Phase 2: Structural</p>
       </div>
    </div>
  </div>
);

const ScheduleModule = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h3 className="font-bold text-white text-lg">Work Schedule</h3>
      <div className="flex items-center gap-2">
         <span className="text-xs text-slate-500 uppercase tracking-widest font-bold">Standard View</span>
         <button className="bg-white/5 border border-border px-3 py-1.5 rounded text-xs text-slate-300">Gantt</button>
      </div>
    </div>

    <div className="relative border-l border-white/5 pl-8 ml-4 space-y-8 py-4">
      {[
        { phase: 'Phase 1: Mobilization', status: 'Completed', date: 'Jan 12 - Jan 20', progress: 100 },
        { phase: 'Phase 2: Foundation', status: 'Completed', date: 'Jan 21 - Feb 15', progress: 100 },
        { phase: 'Phase 3: Structural', status: 'In Progress', date: 'Feb 16 - May 30', progress: 65 },
        { phase: 'Phase 4: Roofing', status: 'Pending', date: 'Jun 01 - Jun 20', progress: 0 },
        { phase: 'Phase 5: Finishing', status: 'Pending', date: 'Jun 21 - Aug 24', progress: 0 },
      ].map((item, i) => (
        <div key={i} className="relative">
          <div className={cn(
            "absolute -left-[41px] top-0 w-5 h-5 rounded-full border-4 border-[#0A0A0B]",
            item.status === 'Completed' ? "bg-brand ring-4 ring-brand/10" : 
            item.status === 'In Progress' ? "bg-brand/50 ring-4 ring-brand/5 animate-pulse" : 
            "bg-slate-800"
          )} />
          <div>
            <div className="flex items-center justify-between mb-2">
              <div>
                <h4 className={cn(
                  "font-bold text-sm",
                  item.status === 'Completed' ? "text-white" : item.status === 'In Progress' ? "text-brand" : "text-slate-500"
                )}>{item.phase}</h4>
                <p className="text-[10px] text-slate-500 uppercase font-mono mt-0.5">{item.date}</p>
              </div>
              <span className="text-[10px] font-bold text-slate-400 font-mono">{item.progress}%</span>
            </div>
            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden w-full max-w-md">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${item.progress}%` }}
                className="h-full bg-brand"
              />
            </div>
            
            {item.status === 'In Progress' && (
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                 <div className="p-3 bg-white/5 border border-border rounded-lg border-dashed">
                   <p className="text-[10px] font-bold text-slate-500 uppercase mb-2">Current Task</p>
                   <p className="text-xs text-white">Reinforcing north boundary walls</p>
                 </div>
                 <div className="p-3 bg-white/5 border border-border rounded-lg border-dashed">
                   <p className="text-[10px] font-bold text-slate-500 uppercase mb-2">Blocked By</p>
                   <p className="text-xs text-slate-400">None</p>
                 </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  </div>
);

const DailyLogModule = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h3 className="font-bold text-white text-lg">Daily Site Entries</h3>
      <button className="bg-brand text-black px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2">
        <Plus size={16} /> New Entry
      </button>
    </div>

    <div className="space-y-4">
      {[
        { date: 'May 08, 2026', author: 'Lyton LF', status: 'Completed', tasks: 12, team: 8, notes: 'Foundation pouring completed. Weather conditions optimal.' },
        { date: 'May 07, 2026', author: 'Lyton LF', status: 'Verified', tasks: 8, team: 10, notes: 'Excavation for drainage system. No delays reported.' },
      ].map((entry, i) => (
        <div key={i} className="bg-sheet/50 border border-border rounded-xl p-6 hover:border-slate-700 transition-colors group">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 group-hover:text-brand transition-colors">
                <History size={20} />
              </div>
              <div>
                <h4 className="font-bold text-white">{entry.date}</h4>
                <p className="text-xs text-slate-500">Logged by {entry.author}</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Tasks</p>
                <p className="text-sm text-white font-mono">{entry.tasks} Done</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Efficiency</p>
                <p className="text-sm text-brand font-mono">94%</p>
              </div>
              <div className="px-3 py-1 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-[10px] font-bold uppercase tracking-widest">
                {entry.status}
              </div>
            </div>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed border-l-2 border-brand/20 pl-4 py-1">
            {entry.notes}
          </p>
          
          <div className="flex items-center gap-3 mt-6">
            <div className="flex -space-x-1">
              {[1, 2, 3].map(p => (
                <div key={p} className="w-6 h-6 rounded-full bg-slate-800 border-2 border-[#151619]" />
              ))}
            </div>
            <span className="text-xs text-slate-500">{entry.team} team members active</span>
            <button className="ml-auto text-brand text-xs font-bold flex items-center gap-1 hover:underline">
              View Photos <ChevronRight size={14} />
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const tabs = [
  { id: 'overview', label: 'Overview', icon: LayoutPanelLeft },
  { id: 'schedule', label: 'Schedule', icon: Calendar },
  { id: 'daily-log', label: 'Daily Log', icon: History },
];

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = React.useState('overview');

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
         <button 
           onClick={() => navigate('/erp/projects')}
           className="w-10 h-10 rounded-full bg-white/5 border border-border flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all"
         >
            <ArrowLeft size={20} />
         </button>
         <div>
            <div className="flex items-center gap-2 mb-1">
               <span className="text-[10px] font-bold uppercase tracking-widest bg-brand/10 text-brand border border-brand/20 px-2 py-0.5 rounded">Active Project</span>
               <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 font-mono">#{id?.padStart(4, '0')}</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Villa Mediterranean</h2>
         </div>

         <div className="ml-auto flex items-center gap-3">
            <button className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white/5 border border-border rounded-lg text-sm text-slate-300 hover:bg-white/10 transition-colors">
               <Share2 size={16} /> Share
            </button>
            <button className="p-2 bg-white/5 border border-border rounded-lg text-slate-400 hover:text-white">
               <Settings size={20} />
            </button>
         </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex items-center border-b border-border overflow-x-auto no-scrollbar gap-1">
         {tabs.map((tab) => (
           <button
             key={tab.id}
             onClick={() => setActiveTab(tab.id)}
             className={cn(
               "flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all relative border-b-2 whitespace-nowrap",
               activeTab === tab.id 
                 ? "text-brand border-brand bg-brand/5" 
                 : "text-slate-500 border-transparent hover:text-slate-300 hover:border-slate-800"
             )}
           >
             <tab.icon size={16} />
             {tab.label}
             {activeTab === tab.id && (
               <motion.div 
                 layoutId="activeTab"
                 className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand"
                 transition={{ type: "spring", stiffness: 300, damping: 30 }}
               />
             )}
           </button>
         ))}
      </div>

      {/* Tab Content */}
      <div className="py-4 min-h-[500px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'overview' && <Overview />}
            {activeTab === 'schedule' && <ScheduleModule />}
            {activeTab === 'daily-log' && <DailyLogModule />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
