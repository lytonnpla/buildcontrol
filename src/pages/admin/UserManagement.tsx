import React from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  MoreVertical, 
  Mail, 
  ShieldCheck, 
  ShieldAlert,
  Key,
  X,
  Trash2,
  Edit2,
  ChevronLeft,
  ArrowRight,
  ChevronDown,
  Shield,
  Info
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface User {
  id: string;
  name: string;
  role: string;
  email: string;
  lastActive: string;
  permissions: string;
  accessibleProjects: string[];
  accessibleModules: string[];
  accessibleDashboardWidgets: string[];
  requiresPasswordSetup?: boolean;
}

const AVAILABLE_PROJECTS = [
  'Villa Mediterranean',
  'Downtown Penthouse',
  'Echo Park Annex',
  'Skyline Residences',
  'Marina Bay Sands'
];

const AVAILABLE_DASHBOARD_WIDGETS = [
  'Revenue Analytics',
  'Project Progress',
  'Recent Activity',
  'Resource Allocation',
  'Financial Summary',
  'Task Distribution'
];

const AVAILABLE_MODULE_FEATURES = [
  'Contracts - Approval',
  'Schedule - Edit',
  'Daily Log - Master',
  'Estimates - Pricing',
  'Clients - Admin',
  'Suppliers - Verify'
];

const AVAILABLE_MODULES = [
  'Dashboard',
  'Projects',
  'Clients',
  'Suppliers',
  'Contracts',
  'Schedule',
  'Estimates',
  'Daily Log'
];

const INITIAL_USERS: User[] = [
  { 
    id: '1', 
    name: 'Lyton LF', 
    role: 'Super Admin', 
    email: 'lyton@buildcontrol.pro', 
    lastActive: 'Now', 
    permissions: 'All',
    accessibleProjects: AVAILABLE_PROJECTS,
    accessibleModules: AVAILABLE_MODULES,
    accessibleDashboardWidgets: AVAILABLE_DASHBOARD_WIDGETS
  },
  { 
    id: '2', 
    name: 'Mário Silva', 
    role: 'Project Manager', 
    email: 'mario@builders.pt', 
    lastActive: '2h ago', 
    permissions: 'ERP_Write, ERP_Read',
    accessibleProjects: ['Villa Mediterranean', 'Downtown Penthouse'],
    accessibleModules: ['Dashboard', 'Projects', 'Daily Log', 'Schedule'],
    accessibleDashboardWidgets: ['Project Progress', 'Recent Activity']
  },
  { 
    id: '3', 
    name: 'Ana Costa', 
    role: 'Financial Admin', 
    email: 'ana@finance.pt', 
    lastActive: '1d ago', 
    permissions: 'ERP_Financial, ERP_Read',
    accessibleProjects: ['Echo Park Annex'],
    accessibleModules: ['Dashboard', 'Estimates', 'Contracts'],
    accessibleDashboardWidgets: ['Revenue Analytics', 'Financial Summary']
  },
];

export default function UserManagement() {
  const [users, setUsers] = React.useState<User[]>(() => {
    const stored = localStorage.getItem('BUILDCONTROL_USERS');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        return INITIAL_USERS;
      }
    }
    return INITIAL_USERS;
  });

  // Sync with localStorage
  React.useEffect(() => {
    localStorage.setItem('BUILDCONTROL_USERS', JSON.stringify(users));
  }, [users]);

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingUser, setEditingUser] = React.useState<User | null>(null);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [currentStep, setCurrentStep] = React.useState<1 | 2>(1);

  const [formData, setFormData] = React.useState<Omit<User, 'id' | 'lastActive'>>({
    name: '',
    email: '',
    role: 'Standard User',
    permissions: 'ERP_Read',
    accessibleProjects: [],
    accessibleModules: [],
    accessibleDashboardWidgets: []
  });

  const isSuperAdmin = formData.role === 'Super Admin';

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openModal = (user: User | null = null) => {
    setCurrentStep(1);
    if (user) {
      setEditingUser(user);
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
        permissions: user.permissions,
        accessibleProjects: user.accessibleProjects || [],
        accessibleModules: user.accessibleModules || [],
        accessibleDashboardWidgets: user.accessibleDashboardWidgets || []
      });
    } else {
      setEditingUser(null);
      setFormData({
        name: '',
        email: '',
        role: 'Standard User',
        permissions: 'ERP_Read',
        accessibleProjects: [],
        accessibleModules: [],
        accessibleDashboardWidgets: []
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
    setCurrentStep(1);
  };

  const toggleSelection = (list: string[], item: string) => {
    return list.includes(item) 
      ? list.filter(i => i !== item)
      : [...list, item];
  };

  const [notification, setNotification] = React.useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep === 1 && !isSuperAdmin) {
      setCurrentStep(2);
      return;
    }
    
    // Final data to commit
    const finalData = {
      ...formData,
      accessibleProjects: isSuperAdmin ? AVAILABLE_PROJECTS : formData.accessibleProjects,
      accessibleModules: isSuperAdmin ? AVAILABLE_MODULES : formData.accessibleModules,
      accessibleDashboardWidgets: isSuperAdmin ? AVAILABLE_DASHBOARD_WIDGETS : formData.accessibleDashboardWidgets,
    };

    if (editingUser) {
      setUsers(users.map(u => u.id === editingUser.id ? { ...editingUser, ...finalData } : u));
      showNotification(`Identity ${finalData.name} updated successfully`);
    } else {
      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        lastActive: 'Just now',
        ...finalData,
        requiresPasswordSetup: true
      };
      setUsers([...users, newUser]);
      showNotification(`New identity ${finalData.name} authorized`);
    }
    closeModal();
  };

  const deleteUser = (id: string) => {
    const userToDelete = users.find(u => u.id === id);
    if (!userToDelete) return;

    if (confirm(`Are you sure you want to delete ${userToDelete.name}? This action is irreversible.`)) {
      setUsers(users.filter(u => u.id !== id));
      showNotification(`Identity ${userToDelete.name} removed from system`, 'success');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 relative">
      {/* Notification Toast */}
      <AnimatePresence>
        {notification && (
          <motion.div 
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className={cn(
              "fixed top-6 left-1/2 z-[200] px-6 py-3 rounded-xl border shadow-2xl flex items-center gap-3",
              notification.type === 'success' ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-red-500/10 border-red-500/20 text-red-400"
            )}
          >
            <ShieldCheck size={18} />
            <span className="text-xs font-black uppercase tracking-widest">{notification.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Identity Management</h1>
          <p className="text-slate-500 mt-1 uppercase tracking-widest text-[10px] font-bold">Authorized Staff & Authentication Providers</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="flex items-center gap-2 px-6 py-2.5 bg-white/5 border border-white/10 rounded-lg text-xs font-black text-white hover:bg-white/10 transition-all uppercase tracking-widest"
        >
           <Plus size={16} /> New System User
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Profile Stats */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-[#0D0E11] border border-white/5 p-6 rounded-2xl">
             <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-white text-xs uppercase tracking-widest">Active Seats</h3>
                <span className="text-brand font-mono text-xl font-black">{users.length}/20</span>
             </div>
             <div className="h-1.5 bg-white/5 rounded-full overflow-hidden mb-6">
                <div className="h-full bg-brand" style={{ width: `${(users.length / 20) * 100}%` }} />
             </div>
             <p className="text-[10px] text-slate-500 uppercase tracking-widest leading-relaxed">
               You are using {Math.round((users.length / 20) * 100)}% of your current enterprise license capacity.
             </p>
          </div>

          <div className="bg-[#0D0E11] border border-white/5 p-6 rounded-2xl">
             <h3 className="font-bold text-white text-xs uppercase tracking-widest mb-4">RBAC Roles</h3>
             <div className="space-y-3">
                {[
                  { label: 'Super Administrators', count: users.filter(u => u.role === 'Super Admin').length, icon: ShieldCheck, color: 'text-emerald-500' },
                  { label: 'Project Managers', count: users.filter(u => u.role === 'Project Manager').length, icon: Shield, color: 'text-brand' },
                  { label: 'Standard Users', count: users.filter(u => u.role !== 'Super Admin' && u.role !== 'Project Manager').length, icon: Users, color: 'text-blue-500' },
                ].map((role, i) => (
                  <div key={i} className="flex items-center justify-between group cursor-pointer">
                    <div className="flex items-center gap-3">
                       <role.icon size={14} className={role.color} />
                       <span className="text-[10px] font-bold text-slate-400 group-hover:text-white transition-colors">{role.label}</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-600">{role.count}</span>
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* User Table */}
        <div className="lg:col-span-3 bg-[#0D0E11] border border-white/5 rounded-2xl overflow-hidden">
           <div className="p-4 border-b border-white/5 bg-white/[0.01] flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex items-center bg-black/40 border border-white/5 rounded px-4 py-2 w-full max-w-sm focus-within:border-brand/40 transition-colors group">
                 <Search size={16} className="text-slate-600 group-focus-within:text-brand" />
                 <input 
                   type="text" 
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                   placeholder="Search identity or email..."
                   className="bg-transparent border-none outline-none text-xs ml-3 w-full text-slate-300 placeholder:text-slate-600"
                 />
              </div>
              <div className="flex items-center gap-2">
                 <button className="p-2 text-slate-500 hover:text-white transition-colors">
                    <Key size={18} />
                 </button>
                 <button className="p-2 text-slate-500 hover:text-white transition-colors">
                    <ShieldAlert size={18} />
                 </button>
              </div>
           </div>

           <table className="w-full text-left text-sm">
             <thead className="bg-black/20 text-slate-600 text-[10px] font-bold uppercase tracking-widest border-b border-white/10">
               <tr>
                 <th className="px-6 py-4">Identity</th>
                 <th className="px-6 py-4">System Role</th>
                 <th className="px-6 py-4">Last Sync</th>
                 <th className="px-6 py-4">Scope</th>
                 <th className="px-6 py-4"></th>
               </tr>
             </thead>
             <tbody className="divide-y divide-white/[0.03]">
               {filteredUsers.map((user) => (
                 <tr key={user.id} className="hover:bg-white/[0.01] transition-colors group px-6">
                   <td className="px-6 py-4">
                     <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center text-[10px] font-bold text-slate-400 group-hover:text-brand transition-colors">
                         {user.name.charAt(0)}
                       </div>
                       <div>
                         <p className="text-xs font-bold text-white leading-none">{user.name}</p>
                         <p className="text-[10px] text-slate-500 mt-1">{user.email}</p>
                       </div>
                     </div>
                   </td>
                   <td className="px-6 py-4">
                     <span className={cn(
                       "text-[10px] font-bold uppercase tracking-tighter px-2 py-0.5 rounded",
                       user.role === 'Super Admin' ? "bg-emerald-500/10 text-emerald-500" : "bg-brand/10 text-brand"
                     )}>{user.role}</span>
                   </td>
                   <td className="px-6 py-4 font-mono text-[10px] text-slate-500">
                     {user.lastActive}
                   </td>
                   <td className="px-6 py-4">
                     <div className="flex flex-col gap-1">
                        <p className="text-[10px] text-slate-400 font-mono">
                          {user.role === 'Super Admin' ? 'Global Access' : `${user.accessibleProjects?.length || 0} Projects`}
                        </p>
                        <p className="text-[10px] text-slate-500 italic">
                          {user.role === 'Super Admin' ? 'All Modules' : `${user.accessibleModules?.length || 0} Modules`}
                        </p>
                     </div>
                   </td>
                   <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => openModal(user)}
                          className="p-1.5 text-slate-600 hover:text-white transition-colors"
                          title="Edit User"
                        >
                           <Edit2 size={14} />
                        </button>
                        <button 
                          onClick={() => deleteUser(user.id)}
                          className="p-1.5 text-slate-600 hover:text-red-500 transition-colors"
                          title="Delete User"
                        >
                           <Trash2 size={14} />
                        </button>
                      </div>
                   </td>
                 </tr>
               ))}
               {filteredUsers.length === 0 && (
                 <tr>
                   <td colSpan={5} className="px-6 py-12 text-center">
                     <p className="text-slate-500 text-xs italic">No matching identities found in the system registry.</p>
                   </td>
                 </tr>
               )}
             </tbody>
           </table>
           
           <div className="p-4 bg-black/40 border-t border-white/5 flex justify-between items-center">
              <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">Total: {filteredUsers.length} Authenticated Entries</span>
              <div className="flex gap-2">
                 <button className="px-3 py-1 bg-white/5 rounded text-[10px] text-slate-400 disabled:opacity-50" disabled>Previous</button>
                 <button className="px-3 py-1 bg-white/5 rounded text-[10px] text-slate-400">Next</button>
              </div>
           </div>
        </div>
      </div>

      {/* Modal Backdrop */}
      <AnimatePresence mode="wait">
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#0D0E11] border border-white/10 w-full max-w-lg rounded-2xl shadow-2xl relative z-10 overflow-hidden"
            >
              <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {currentStep === 2 && (
                    <button 
                      onClick={() => setCurrentStep(1)}
                      className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                    >
                      <ChevronLeft size={16} />
                    </button>
                  )}
                  <div>
                    <h3 className="text-lg font-bold text-white">{editingUser ? 'Edit System Identity' : 'New System Identity'}</h3>
                    <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-bold">
                      {currentStep === 1 ? 'Step 1: Profile Identity' : 'Step 2: Access Orchestration'}
                    </p>
                  </div>
                </div>
                <button onClick={closeModal} className="text-slate-500 hover:text-white transition-colors">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <AnimatePresence mode="wait">
                  {currentStep === 1 ? (
                    <motion.div 
                      key="step1"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="space-y-4"
                    >
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Full Legal Name</label>
                        <input 
                          required
                          type="text" 
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="e.g. John Doe"
                          className="w-full bg-black/40 border border-white/5 rounded-lg px-4 py-2.5 text-sm text-white focus:border-brand/40 outline-none transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">System Email (Login Identity)</label>
                        <input 
                          required
                          type="email" 
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="john@buildcontrol.pro"
                          className="w-full bg-black/40 border border-white/5 rounded-lg px-4 py-2.5 text-sm text-white focus:border-brand/40 outline-none transition-colors"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">RBAC Role</label>
                          <select 
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            className="w-full bg-black/40 border border-white/5 rounded-lg px-4 py-2.5 text-sm text-white focus:border-brand/40 outline-none transition-colors appearance-none cursor-pointer"
                          >
                            <option value="Super Admin">Super Admin</option>
                            <option value="Project Manager">Project Manager</option>
                            <option value="Standard User">Standard User</option>
                            <option value="Financial Admin">Financial Admin</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Custom Permissions Tag</label>
                          <input 
                            type="text" 
                            value={formData.permissions}
                            onChange={(e) => setFormData({ ...formData, permissions: e.target.value })}
                            placeholder="e.g. ERP_Read"
                            className="w-full bg-black/40 border border-white/5 rounded-lg px-4 py-2.5 text-sm text-white focus:border-brand/40 outline-none transition-colors"
                          />
                        </div>
                      </div>
                      
                      <div className="p-4 bg-brand/5 border border-brand/10 rounded-xl">
                        <div className="flex gap-3">
                          <ShieldCheck size={18} className="text-brand shrink-0" />
                          <p className="text-[10px] text-slate-400 leading-relaxed uppercase tracking-widest">
                            Authorized personnel will be granted {isSuperAdmin ? 'Full Infrastructure' : 'Customized'} access upon completion.
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar"
                    >
                      {/* Project Selection Dropdown-like Multi-select */}
                      <div className="space-y-3">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest flex justify-between">
                          Project Entitlements
                          {isSuperAdmin && <span className="text-brand">Global Access_Active</span>}
                        </label>
                        <div className="relative">
                          <select
                            multiple
                            disabled={isSuperAdmin}
                            value={formData.accessibleProjects}
                            onChange={(e) => {
                              const options = Array.from(e.target.selectedOptions).map((o: any) => o.value);
                              setFormData({ ...formData, accessibleProjects: options });
                            }}
                            className={cn(
                              "w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:border-brand outline-none transition-all min-h-[120px] custom-scrollbar appearance-none",
                              isSuperAdmin && "opacity-50 cursor-not-allowed"
                            )}
                          >
                            {AVAILABLE_PROJECTS.map(project => (
                              <option 
                                key={project} 
                                value={project}
                                className="py-2 px-1 hover:bg-brand/20 checked:bg-brand/30 rounded"
                              >
                                {project}
                              </option>
                            ))}
                          </select>
                          <div className="absolute right-3 top-3 pointer-events-none text-slate-600">
                             <ChevronDown size={14} />
                          </div>
                          <p className="text-[9px] text-slate-600 mt-2 flex items-center gap-1.5 italic">
                            <Info size={10} /> {isSuperAdmin ? 'Full portfolio access forced by role.' : 'Hold Ctrl (or Cmd) to select multiple projects.'}
                          </p>
                        </div>
                      </div>

                      {/* Dashboard Items */}
                      <div className="space-y-3">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest flex justify-between">
                          Dashboard Intelligence Access
                          {isSuperAdmin && <span className="text-brand">Full Visualization</span>}
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                           {AVAILABLE_DASHBOARD_WIDGETS.map(widget => (
                             <button
                               key={widget}
                               type="button"
                               disabled={isSuperAdmin}
                               onClick={() => setFormData({
                                 ...formData,
                                 accessibleDashboardWidgets: toggleSelection(formData.accessibleDashboardWidgets, widget)
                               })}
                               className={cn(
                                 "flex items-center gap-2 px-3 py-2 rounded border text-[10px] font-bold uppercase tracking-tight transition-all text-left group",
                                 (isSuperAdmin || formData.accessibleDashboardWidgets.includes(widget))
                                   ? "bg-brand/10 border-brand/40 text-white"
                                   : "bg-white/[0.02] border-white/5 text-slate-600 hover:border-white/10"
                               )}
                             >
                               <div className={cn(
                                 "w-1.5 h-1.5 rounded-full transition-all duration-300",
                                 (isSuperAdmin || formData.accessibleDashboardWidgets.includes(widget)) 
                                   ? "bg-brand shadow-[0_0_8px_rgba(242,125,38,0.6)] scale-110" 
                                   : "bg-slate-800"
                               )} />
                               <span className="truncate">{widget}</span>
                             </button>
                           ))}
                        </div>
                      </div>

                      {/* Module Selection */}
                      <div className="space-y-3">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest flex justify-between">
                           Granular Module Features
                           {isSuperAdmin && <span className="text-brand">Global Orchestration</span>}
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                           {AVAILABLE_MODULE_FEATURES.map(feature => (
                             <button
                               key={feature}
                               type="button"
                               disabled={isSuperAdmin}
                               onClick={() => setFormData({
                                 ...formData,
                                 accessibleModules: toggleSelection(formData.accessibleModules, feature)
                               })}
                               className={cn(
                                 "flex items-center justify-between px-3 py-2 rounded border text-[9px] font-bold uppercase tracking-widest transition-all",
                                 (isSuperAdmin || formData.accessibleModules.includes(feature))
                                   ? "bg-white/10 border-white/20 text-white"
                                   : "bg-white/[0.02] border-white/5 text-slate-700 hover:border-white/10"
                               )}
                             >
                               <span className="truncate">{feature}</span>
                               {(isSuperAdmin || formData.accessibleModules.includes(feature)) && <ShieldCheck size={10} className="text-brand" />}
                             </button>
                           ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex justify-end gap-3 pt-4">
                  <button 
                    type="button" 
                    onClick={closeModal}
                    className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-white"
                  >
                    Cancel Action
                  </button>
                  <button 
                    type="submit"
                    className="px-6 py-2 bg-brand text-black text-xs font-black uppercase tracking-widest rounded-lg hover:shadow-[0_0_20px_rgba(242,125,38,0.3)] transition-all flex items-center gap-2"
                  >
                    {isSuperAdmin ? (
                      editingUser ? 'Commit Changes' : 'Authorize New User'
                    ) : (
                      currentStep === 1 ? (
                        <>Configure Access <ArrowRight size={14} /></>
                      ) : (
                        editingUser ? 'Commit Changes' : 'Authorize New User'
                      )
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

