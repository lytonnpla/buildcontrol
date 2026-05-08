import React from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  Mail, 
  Phone, 
  Globe, 
  MoreVertical,
  ExternalLink,
  X,
  Trash2,
  Edit2,
  ShieldCheck
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface Client {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  projects: number;
  status: string;
}

const INITIAL_CLIENTS: Client[] = [
  { id: '1', name: 'John Smith', company: 'Individual', email: 'john.smith@gmail.com', phone: '+351 912 345 678', projects: 2, status: 'Active' },
  { id: '2', name: 'ArchiCorp', company: 'Architecture Firm', email: 'contact@archicorp.com', phone: '+351 213 456 789', projects: 5, status: 'Active' },
  { id: '3', name: 'Sarah Lane', company: 'Lane & Co', email: 'sarah@laneco.com', phone: '+351 965 432 109', projects: 1, status: 'Inactive' },
  { id: '4', name: 'TechBuild SA', company: 'Real Estate Developer', email: 'dev@techbuild.pt', phone: '+351 211 223 344', projects: 8, status: 'Active' },
];

export default function Clients() {
  const [clients, setClients] = React.useState<Client[]>(() => {
    const stored = localStorage.getItem('BUILDCONTROL_CLIENTS');
    return stored ? JSON.parse(stored) : INITIAL_CLIENTS;
  });

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingClient, setEditingClient] = React.useState<Client | null>(null);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [notification, setNotification] = React.useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const [formData, setFormData] = React.useState<Omit<Client, 'id' | 'projects'>>({
    name: '',
    company: '',
    email: '',
    phone: '',
    status: 'Active'
  });

  React.useEffect(() => {
    localStorage.setItem('BUILDCONTROL_CLIENTS', JSON.stringify(clients));
  }, [clients]);

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openModal = (client: Client | null = null) => {
    if (client) {
      setEditingClient(client);
      setFormData({
        name: client.name,
        company: client.company,
        email: client.email,
        phone: client.phone,
        status: client.status
      });
    } else {
      setEditingClient(null);
      setFormData({
        name: '',
        company: '',
        email: '',
        phone: '',
        status: 'Active'
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingClient(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingClient) {
      setClients(clients.map(c => c.id === editingClient.id ? { ...c, ...formData } : c));
      showNotification(`Client ${formData.name} updated`);
    } else {
      const newClient: Client = {
        id: Math.random().toString(36).substr(2, 9),
        projects: 0,
        ...formData
      };
      setClients([...clients, newClient]);
      showNotification(`Client ${formData.name} added`);
    }
    closeModal();
  };

  const deleteClient = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete ${name}?`)) {
      setClients(clients.filter(c => c.id !== id));
      showNotification(`Client ${name} removed`, 'success');
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
            <ShieldCheck size={18} />
            <span className="text-xs font-black uppercase tracking-widest">{notification.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Client Directory</h2>
          <p className="text-slate-400 text-sm">Manage client contact information and project associations.</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="bg-brand text-black px-4 py-2 rounded-lg text-sm font-bold hover:bg-brand/90 transition-colors shadow-[0_0_20px_-5px_rgba(242,125,38,0.5)] flex items-center gap-2"
        >
          <Plus size={18} />
          Add Client
        </button>
      </div>

      <div className="bg-sheet/50 border border-border rounded-xl overflow-hidden backdrop-blur-sm">
        <div className="p-4 border-b border-border bg-white/[0.02]">
           <div className="flex items-center bg-black/20 border border-border rounded-lg px-4 py-2 w-full max-w-md focus-within:border-brand/40 transition-colors group">
              <Search size={18} className="text-slate-500 group-focus-within:text-brand" />
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search clients by name, company or email..."
                className="bg-transparent border-none outline-none text-sm ml-3 w-full text-slate-200"
              />
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#0D0E11] text-slate-500 text-[10px] font-bold uppercase tracking-widest border-b border-border">
              <tr>
                <th className="px-6 py-4">Client / Company</th>
                <th className="px-6 py-4">Contact Detail</th>
                <th className="px-6 py-4">Projects</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03]">
              {filteredClients.map((client) => (
                <tr key={client.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-brand/10 border border-brand/20 flex items-center justify-center text-brand font-bold">
                        {client.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-white group-hover:text-brand transition-colors">{client.name}</p>
                        <p className="text-[10px] text-slate-500 uppercase font-mono">{client.company}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 space-y-1">
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <Mail size={12} className="text-slate-600" />
                      {client.email}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <Phone size={12} className="text-slate-600" />
                      {client.phone}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                       <span className="font-mono text-white font-bold">{client.projects}</span>
                       <span className="text-[10px] text-slate-500 uppercase tracking-widest">Active</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest border",
                      client.status === 'Active' 
                        ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" 
                        : "bg-slate-500/10 text-slate-500 border-slate-500/20"
                    )}>
                      {client.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 text-slate-600">
                       <button 
                        onClick={() => openModal(client)}
                        className="p-2 hover:bg-white/5 rounded-lg hover:text-white transition-colors"
                        title="Edit Client"
                       >
                          <Edit2 size={16} />
                       </button>
                       <button 
                        onClick={() => deleteClient(client.id, client.name)}
                        className="p-2 hover:bg-white/5 rounded-lg hover:text-red-500 transition-colors"
                        title="Delete Client"
                       >
                          <Trash2 size={16} />
                       </button>
                       <button className="p-2 hover:bg-white/5 rounded-lg hover:text-white transition-colors">
                          <MoreVertical size={16} />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredClients.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500 italic text-xs">
                    No clients found in the directory.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
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
              className="bg-[#0D0E11] border border-white/10 w-full max-w-md rounded-2xl shadow-2xl relative z-10 overflow-hidden"
            >
              <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">{editingClient ? 'Edit Client' : 'Add New Client'}</h3>
                <button onClick={closeModal} className="text-slate-500 hover:text-white transition-colors">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Legal Name / Representative</label>
                    <input 
                      required
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. John Smith"
                      className="w-full bg-black/40 border border-white/5 rounded-lg px-4 py-2.5 text-sm text-white focus:border-brand/40 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Company / Entity</label>
                    <input 
                      required
                      type="text" 
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="Individual or Company Name"
                      className="w-full bg-black/40 border border-white/5 rounded-lg px-4 py-2.5 text-sm text-white focus:border-brand/40 outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Email Address</label>
                      <input 
                        required
                        type="email" 
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-black/40 border border-white/5 rounded-lg px-4 py-2.5 text-sm text-white focus:border-brand/40 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Phone Number</label>
                      <input 
                        required
                        type="text" 
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-black/40 border border-white/5 rounded-lg px-4 py-2.5 text-sm text-white focus:border-brand/40 outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Status</label>
                    <select 
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full bg-black/40 border border-white/5 rounded-lg px-4 py-2.5 text-sm text-white focus:border-brand/40 outline-none appearance-none"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-6">
                  <button 
                    type="button" 
                    onClick={closeModal}
                    className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-6 py-2 bg-brand text-black text-xs font-black uppercase tracking-widest rounded-lg transition-all"
                  >
                    {editingClient ? 'Update Registry' : 'Commit Client'}
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
