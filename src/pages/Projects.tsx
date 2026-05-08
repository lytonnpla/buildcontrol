import React from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  MoreVertical, 
  Calendar, 
  MapPin, 
  Users as UsersIcon,
  ChevronRight,
  CircleDollarSign,
  Briefcase,
  HardHat,
  X,
  Trash2,
  Edit2,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { Project } from '../types';
import { INITIAL_PROJECTS } from '../constants';

// Project type is now imported

// INITIAL_PROJECTS is now imported

export default function Projects() {
  const { user } = useAuth();
  const location = useLocation();
  const [projects, setProjects] = React.useState<Project[]>(() => {
    const stored = localStorage.getItem('BUILDCONTROL_PROJECTS');
    return stored ? JSON.parse(stored) : INITIAL_PROJECTS;
  });

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingProject, setEditingProject] = React.useState<Project | null>(null);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [notification, setNotification] = React.useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const [formData, setFormData] = React.useState<Omit<Project, 'id'>>({
    name: '',
    code: '',
    type: 'Residential',
    address: '',
    city: '',
    province: 'Maputo',
    coordinates: '',
    client: '',
    clientContact: '',
    clientNuit: '',
    constructionType: '',
    floors: 1,
    totalArea: 0,
    components: '',
    techProjects: {
      architectural: false,
      structural: false,
      electrical: false,
      hydraulic: false,
      safety: false
    },
    licenseNumber: '',
    municipalApproval: '',
    processNumber: '',
    startDate: '',
    deadline: '',
    currentPhase: 'Foundation',
    riskManagement: '',
    progress: 0,
    status: 'Active'
  });

  React.useEffect(() => {
    localStorage.setItem('BUILDCONTROL_PROJECTS', JSON.stringify(projects));
  }, [projects]);

  React.useEffect(() => {
    if (location.state?.openNewProject) {
      openModal();
      // Clear state to avoid reopening on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const filteredProjects = React.useMemo(() => {
    const baseList = projects.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.city && p.city.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (!user) return [];
    if (user.role === 'Super Admin') return baseList;
    return baseList.filter(p => user.accessibleProjects.includes(p.name));
  }, [user, projects, searchTerm]);

  const openModal = (project: Project | null = null) => {
    if (project) {
      setEditingProject(project);
      setFormData({ ...project });
    } else {
      setEditingProject(null);
      setFormData({
        name: '',
        code: '',
        type: 'Residential',
        address: '',
        city: '',
        province: 'Maputo',
        client: '',
        clientContact: '',
        clientNuit: '',
        constructionType: '',
        floors: 1,
        totalArea: 0,
        components: '',
        techProjects: {
          architectural: false,
          structural: false,
          electrical: false,
          hydraulic: false,
          safety: false
        },
        licenseNumber: '',
        municipalApproval: '',
        processNumber: '',
        startDate: '',
        deadline: '',
        currentPhase: 'Foundation',
        riskManagement: '',
        progress: 0,
        status: 'Active'
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProject(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingProject) {
      setProjects(projects.map(p => p.id === editingProject.id ? { ...p, ...formData } : p));
      showNotification(`Project ${formData.name} updated`);
    } else {
      const newProject: Project = {
        id: Math.random().toString(36).substr(2, 9),
        ...formData
      };
      setProjects([...projects, newProject]);
      showNotification(`Project ${formData.name} created`);
    }
    closeModal();
  };

  const deleteProject = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete ${name}?`)) {
      setProjects(projects.filter(p => p.id !== id));
      showNotification(`Project ${name} deleted`, 'success');
    }
  };

  return (
    <div className="space-y-6 relative">
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
            <TrendingUp size={18} />
            <span className="text-xs font-black uppercase tracking-widest">{notification.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Project Portfolio</h2>
          <p className="text-slate-400 text-sm">Manage and track all ongoing construction projects.</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="bg-brand text-black px-4 py-2 rounded-lg text-sm font-bold hover:bg-brand/90 transition-colors shadow-[0_0_20px_-5px_rgba(242,125,38,0.5)] flex items-center gap-2"
        >
          <Plus size={18} />
          New Project
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 flex items-center bg-sheet/50 border border-border rounded-lg px-4 py-2 group focus-within:border-brand/40 transition-colors">
          <Search size={18} className="text-slate-500 group-focus-within:text-brand" />
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search projects by name, client, or location..."
            className="bg-transparent border-none outline-none text-sm ml-3 w-full text-slate-200"
          />
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-sheet/50 border border-border rounded-lg text-sm text-slate-300 hover:bg-white/5">
            <Filter size={18} />
            Status
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-sheet/50 border border-border rounded-lg text-sm text-slate-300 hover:bg-white/5">
            <Filter size={18} />
            Type
          </button>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 pb-12">
        {filteredProjects.map((project) => (
          <div 
            key={project.id} 
            className="bg-sheet/50 border border-border rounded-xl p-6 hover:border-brand/50 transition-all group relative overflow-hidden flex flex-col sm:flex-row gap-6"
          >
            {/* Project Cover / Type Indicator */}
            <Link 
              to={`/erp/projects/${project.id}`}
              className="w-full sm:w-40 h-40 bg-zinc-900 border border-border rounded-lg flex items-center justify-center shrink-0 relative overflow-hidden group-hover:border-brand/30 transition-colors"
            >
               <div className="absolute inset-0 bg-gradient-to-br from-brand/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
               <div className="flex flex-col items-center gap-2">
                 <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-slate-400 group-hover:text-brand transition-colors">
                    {project.type === 'Residential' ? <UsersIcon size={24} /> : project.type === 'Commercial' ? <Briefcase size={24} /> : <HardHat size={24} />}
                 </div>
                 <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{project.type}</span>
               </div>
            </Link>

            <div className="flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-1">
                <span className={cn(
                  "text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border mb-2 inline-block",
                  project.status === 'Completed' 
                    ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" 
                    : "bg-brand/10 text-brand border-brand/20"
                )}>
                  {project.status}
                </span>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                   <button 
                    onClick={() => openModal(project)}
                    className="p-1.5 text-slate-600 hover:text-white transition-colors"
                   >
                      <Edit2 size={14} />
                   </button>
                   <button 
                    onClick={() => deleteProject(project.id, project.name)}
                    className="p-1.5 text-slate-600 hover:text-red-500 transition-colors"
                   >
                      <Trash2 size={14} />
                   </button>
                </div>
              </div>

              <Link to={`/erp/projects/${project.id}`}>
                <h3 className="text-xl font-bold text-white group-hover:text-brand transition-colors mb-2">{project.name}</h3>
              </Link>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-4 mb-6">
                 <div className="flex items-center gap-2 text-slate-400">
                    <UsersIcon size={14} className="text-slate-600" />
                    <span className="text-xs">{project.client}</span>
                 </div>
                 <div className="flex items-center gap-2 text-slate-400">
                    <MapPin size={14} className="text-slate-600" />
                    <span className="text-xs truncate">{project.city}, {project.province}</span>
                 </div>
                 <div className="flex items-center gap-2 text-slate-400">
                    <Calendar size={14} className="text-slate-600" />
                    <span className="text-xs">{project.deadline}</span>
                 </div>
              </div>

              <div className="mt-auto pt-4 border-t border-white/[0.03]">
                <div className="flex items-center justify-between mb-2">
                   <div />
                   <Link to={`/erp/projects/${project.id}`} className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-[10px] font-bold text-slate-500 uppercase">Construction</p>
                        <p className="text-xs font-mono text-white tracking-widest">{project.progress}%</p>
                      </div>
                      <ChevronRight size={18} className="text-slate-700 group-hover:text-brand group-hover:translate-x-1 transition-all" />
                   </Link>
                </div>
                <div className="h-1 bg-white/[0.03] rounded-full overflow-hidden">
                   <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${project.progress}%` }}
                    transition={{ duration: 0.8 }}
                    className="h-full bg-brand shadow-[0_0_10px_rgba(242,125,38,0.3)]" 
                   />
                </div>
              </div>
            </div>
          </div>
        ))}
        {filteredProjects.length === 0 && (
          <div className="col-span-full py-20 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-2xl bg-white/[0.02]">
            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-slate-500 mb-4">
              <Briefcase size={32} />
            </div>
            <h3 className="text-white font-bold text-lg mb-2">No projects found</h3>
            <p className="text-slate-500 text-sm mb-8 text-center max-w-md">
              Start by creating your first project to begin tracking construction progress and management.
            </p>
            <button 
              onClick={() => openModal()}
              className="bg-brand text-black px-6 py-3 rounded-xl text-sm font-black uppercase tracking-widest hover:bg-brand/90 transition-all flex items-center gap-3 shadow-xl"
            >
              <Plus size={18} />
              New Project
            </button>
          </div>
        )}
      </div>

      {/* Modal Backdrop */}
      <AnimatePresence>
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
              className="bg-[#0D0E11] border border-white/10 w-full max-w-4xl h-[90vh] rounded-3xl shadow-2xl relative z-10 overflow-hidden flex flex-col"
            >
              <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">{editingProject ? 'Edit Project' : 'New Project'}</h3>
                <button onClick={closeModal} className="text-slate-500 hover:text-white transition-colors">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-0 flex flex-col h-full overflow-hidden">
                <div className="flex-1 p-6 space-y-10 overflow-y-auto custom-scrollbar bg-black/20">
                  {/* Section 1: Identification */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                      <div className="w-1.5 h-1.5 rounded-full bg-brand" />
                      <h4 className="text-[10px] font-black text-white uppercase tracking-[0.2em]">01. Project Identification</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Project Name</label>
                        <input 
                          required
                          type="text" 
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="e.g. Skyline Residences"
                          className="w-full bg-black/40 border border-white/5 rounded-lg px-4 py-2.5 text-sm text-white focus:border-brand/40 outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Project ID / Code</label>
                        <input 
                          required
                          type="text" 
                          value={formData.code}
                          onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                          placeholder="PROJ-2024-X"
                          className="w-full bg-black/40 border border-white/5 rounded-lg px-4 py-2.5 text-sm text-white focus:border-brand/40 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Type</label>
                        <select 
                          value={formData.type}
                          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                          className="w-full bg-black/40 border border-white/5 rounded-lg px-4 py-2.5 text-sm text-white focus:border-brand/40 outline-none appearance-none"
                        >
                          <option value="Residential">Residential</option>
                          <option value="Commercial">Commercial</option>
                          <option value="Industrial">Industrial</option>
                          <option value="Public Works">Public Works</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Location */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                      <div className="w-1.5 h-1.5 rounded-full bg-brand" />
                      <h4 className="text-[10px] font-black text-white uppercase tracking-[0.2em]">02. Location</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Full Address</label>
                        <input 
                          required
                          type="text" 
                          value={formData.address}
                          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                          className="w-full bg-black/40 border border-white/5 rounded-lg px-4 py-2.5 text-sm text-white focus:border-brand/40 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">City</label>
                        <input 
                          required
                          type="text" 
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          className="w-full bg-black/40 border border-white/5 rounded-lg px-4 py-2.5 text-sm text-white focus:border-brand/40 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Province</label>
                        <input 
                          required
                          type="text" 
                          value={formData.province}
                          onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                          className="w-full bg-black/40 border border-white/5 rounded-lg px-4 py-2.5 text-sm text-white focus:border-brand/40 outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section 3: Client */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                      <div className="w-1.5 h-1.5 rounded-full bg-brand" />
                      <h4 className="text-[10px] font-black text-white uppercase tracking-[0.2em]">03. Client Details</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Owner / Company Name</label>
                        <input 
                          required
                          type="text" 
                          value={formData.client}
                          onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                          className="w-full bg-black/40 border border-white/5 rounded-lg px-4 py-2.5 text-sm text-white focus:border-brand/40 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Contact Method</label>
                        <input 
                          required
                          type="text" 
                          value={formData.clientContact}
                          onChange={(e) => setFormData({ ...formData, clientContact: e.target.value })}
                          placeholder="Phone / Email"
                          className="w-full bg-black/40 border border-white/5 rounded-lg px-4 py-2.5 text-sm text-white focus:border-brand/40 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">NUIT</label>
                        <input 
                          type="text" 
                          value={formData.clientNuit}
                          onChange={(e) => setFormData({ ...formData, clientNuit: e.target.value })}
                          className="w-full bg-black/40 border border-white/5 rounded-lg px-4 py-2.5 text-sm text-white focus:border-brand/40 outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section 04: Project Description */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                      <div className="w-1.5 h-1.5 rounded-full bg-brand" />
                      <h4 className="text-[10px] font-black text-white uppercase tracking-[0.2em]">04. Project Description</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Construction Type</label>
                        <input 
                          type="text" 
                          value={formData.constructionType}
                          onChange={(e) => setFormData({ ...formData, constructionType: e.target.value })}
                          placeholder="e.g. Mixed-Use Building"
                          className="w-full bg-black/40 border border-white/5 rounded-lg px-4 py-2.5 text-sm text-white focus:border-brand/40 outline-none"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Floors</label>
                          <input 
                            type="number" 
                            value={formData.floors}
                            onChange={(e) => setFormData({ ...formData, floors: parseInt(e.target.value) })}
                            className="w-full bg-black/40 border border-white/5 rounded-lg px-4 py-2.5 text-sm text-white focus:border-brand/40 outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Area (m²)</label>
                          <input 
                            type="number" 
                            value={formData.totalArea}
                            onChange={(e) => setFormData({ ...formData, totalArea: parseInt(e.target.value) })}
                            className="w-full bg-black/40 border border-white/5 rounded-lg px-4 py-2.5 text-sm text-white focus:border-brand/40 outline-none"
                          />
                        </div>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Main Components</label>
                        <textarea 
                          value={formData.components}
                          onChange={(e) => setFormData({ ...formData, components: e.target.value })}
                          placeholder="Foundations, Structure, Luxury finishes..."
                          className="w-full bg-black/40 border border-white/5 rounded-lg px-4 py-2.5 text-sm text-white focus:border-brand/40 outline-none min-h-[80px]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section 05: Technical Projects */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                      <div className="w-1.5 h-1.5 rounded-full bg-brand" />
                      <h4 className="text-[10px] font-black text-white uppercase tracking-[0.2em]">05. Technical Projects Readiness</h4>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {[
                        { key: 'architectural', label: 'Architectural' },
                        { key: 'structural', label: 'Structural' },
                        { key: 'electrical', label: 'Electrical' },
                        { key: 'hydraulic', label: 'Hydraulic' },
                        { key: 'safety', label: 'Safety/Fire' },
                      ].map((proj) => (
                        <button
                          key={proj.key}
                          type="button"
                          onClick={() => setFormData({
                            ...formData,
                            techProjects: {
                              ...formData.techProjects,
                              [proj.key]: !formData.techProjects[proj.key as keyof typeof formData.techProjects]
                            }
                          })}
                          className={cn(
                            "px-4 py-3 rounded-xl border flex items-center justify-between transition-all group",
                            formData.techProjects[proj.key as keyof typeof formData.techProjects]
                              ? "bg-brand/10 border-brand/30 text-brand"
                              : "bg-white/5 border-white/5 text-slate-500 hover:border-white/10"
                          )}
                        >
                          <span className="text-[10px] font-black uppercase tracking-widest">{proj.label}</span>
                          <div className={cn(
                            "w-4 h-4 rounded border flex items-center justify-center transition-colors",
                            formData.techProjects[proj.key as keyof typeof formData.techProjects]
                              ? "bg-brand border-brand"
                              : "border-slate-700 bg-transparent"
                          )}>
                            {formData.techProjects[proj.key as keyof typeof formData.techProjects] && <ShieldCheck size={10} className="text-black" />}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Section 06: Legalization & Licenses */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                      <div className="w-1.5 h-1.5 rounded-full bg-brand" />
                      <h4 className="text-[10px] font-black text-white uppercase tracking-[0.2em]">06. Legalization & Licenses</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">License #</label>
                        <input 
                          type="text" 
                          value={formData.licenseNumber}
                          onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                          className="w-full bg-black/40 border border-white/5 rounded-lg px-4 py-2.5 text-sm text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Municipal Approval</label>
                        <input 
                          type="text" 
                          value={formData.municipalApproval}
                          onChange={(e) => setFormData({ ...formData, municipalApproval: e.target.value })}
                          className="w-full bg-black/40 border border-white/5 rounded-lg px-4 py-2.5 text-sm text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Process #</label>
                        <input 
                          type="text" 
                          value={formData.processNumber}
                          onChange={(e) => setFormData({ ...formData, processNumber: e.target.value })}
                          className="w-full bg-black/40 border border-white/5 rounded-lg px-4 py-2.5 text-sm text-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section 07: Construction Timeline */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                      <div className="w-1.5 h-1.5 rounded-full bg-brand" />
                      <h4 className="text-[10px] font-black text-white uppercase tracking-[0.2em]">07. Construction Timeline</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Start Date</label>
                        <input 
                          type="date" 
                          value={formData.startDate}
                          onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                          className="w-full bg-black/40 border border-white/5 rounded-lg px-4 py-2.5 text-sm text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">End Date Target</label>
                        <input 
                          type="date" 
                          value={formData.deadline}
                          onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                          className="w-full bg-black/40 border border-white/5 rounded-lg px-4 py-2.5 text-sm text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Current Phase</label>
                        <select 
                          value={formData.currentPhase}
                          onChange={(e) => setFormData({ ...formData, currentPhase: e.target.value })}
                          className="w-full bg-black/40 border border-white/5 rounded-lg px-4 py-2.5 text-sm text-white"
                        >
                          <option value="Site Prep">01. Site Prep / Earthworks</option>
                          <option value="Foundation">02. Foundation</option>
                          <option value="Structure">03. Structure</option>
                          <option value="Finishing">04. Finishing</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Section 08: Risk Management */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                      <div className="w-1.5 h-1.5 rounded-full bg-brand" />
                      <h4 className="text-[10px] font-black text-white uppercase tracking-[0.2em]">08. Risk Management & Registry</h4>
                    </div>
                    <div className="space-y-4">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest border-l-2 border-red-500 pl-2">Risk Management & Climatic Defense</label>
                      <textarea 
                        value={formData.riskManagement}
                        onChange={(e) => setFormData({ ...formData, riskManagement: e.target.value })}
                        placeholder="Identify delays, resource scarcity or site hazards..."
                        className="w-full bg-black/40 border border-white/5 rounded-lg px-4 py-2.5 text-sm text-white min-h-[120px]"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-[#111216] border-t border-white/5 flex justify-end items-center gap-6">
                  <div className="hidden sm:flex items-center gap-3 mr-auto">
                     <div className="w-2 h-2 rounded-full bg-brand animate-pulse" />
                     <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Encryption: Active (E2EE)</span>
                  </div>
                  <button 
                    type="button" 
                    onClick={closeModal}
                    className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-white uppercase tracking-widest"
                  >
                    Discard Changes
                  </button>
                  <button 
                    type="submit"
                    className="px-8 py-3 bg-brand text-black text-xs font-black uppercase tracking-widest rounded-xl hover:shadow-[0_0_30px_rgba(242,125,38,0.3)] hover:scale-[1.02] transition-all"
                  >
                    {editingProject ? 'Commit Modifications' : 'Initialize Portfolio Entry'}
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
