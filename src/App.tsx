import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Clock } from 'lucide-react';
import AppLayout from './components/AppLayout';
import AdminLayout from './components/AdminLayout';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Clients from './pages/Clients';
import EntrySelection from './pages/EntrySelection';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import PasswordSetup from './pages/PasswordSetup';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider, useAuth } from './context/AuthContext';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import BrandingSettings from './pages/admin/BrandingSettings';

const Suppliers = () => (
  <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
    <h2 className="text-2xl font-bold text-white mb-2 text-brand">Supplier Directory</h2>
    <p className="text-slate-400 leading-relaxed max-w-lg">
      Streamline your procurement process. Track supplier performance, manage purchase orders, and coordinate logistics in one industrial-grade interface.
    </p>
    <div className="mt-8 border border-dashed border-border p-12 rounded-2xl flex items-center justify-center bg-white/[0.01]">
       <Clock size={48} className="text-slate-800" />
    </div>
  </div>
);

const GeneralModule = ({ title, description }: { title: string, description: string }) => (
  <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
    <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
    <p className="text-slate-400">{description}</p>
  </div>
);

const ERPIndexRedirect = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (user.role === 'Super Admin') return <Dashboard />;
  
  if (user.accessibleModules.includes('Dashboard')) return <Dashboard />;
  if (user.accessibleModules.includes('Projects')) return <Navigate to="/erp/projects" />;
  if (user.accessibleModules.includes('Clients')) return <Navigate to="/erp/clients" />;
  if (user.accessibleModules.includes('Suppliers')) return <Navigate to="/erp/suppliers" />;
  if (user.accessibleModules.includes('Contracts')) return <Navigate to="/erp/contracts" />;
  if (user.accessibleModules.includes('Schedule')) return <Navigate to="/erp/schedule" />;
  if (user.accessibleModules.includes('Estimates')) return <Navigate to="/erp/estimates" />;
  if (user.accessibleModules.includes('Daily Log')) return <Navigate to="/erp/daily-log" />;

  return <div className="p-12 text-center text-slate-500 italic">No accessible modules found. Please contact administrator.</div>;
};

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Authentication */}
        <Route path="/login" element={<Login />} />
        <Route path="/password-setup" element={
          <ProtectedRoute>
            <PasswordSetup />
          </ProtectedRoute>
        } />

        {/* Protected System Selector */}
        <Route path="/select" element={<EntrySelection />} />

        {/* ERP Workspace Area */}
        <Route path="/erp" element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }>
          <Route index element={<ERPIndexRedirect />} />
          <Route path="projects" element={<Projects />} />
          <Route path="projects/:id" element={<ProjectDetail />} />
          <Route path="clients" element={<Clients />} />
          <Route path="suppliers" element={<Suppliers />} />
          <Route path="estimates" element={<GeneralModule title="Budget Estimates" description="Financial calculation engine for project itemization." />} />
          <Route path="contracts" element={<GeneralModule title="Project Contracts" description="Manage project-specific legal terms and payment schedules." />} />
          <Route path="schedule" element={<GeneralModule title="Master Schedule" description="Consolidated timeline view across all active construction projects." />} />
          <Route path="daily-log" element={<GeneralModule title="Site Journals" description="A unified stream of all site reports and diaries from the field." />} />
          
          <Route path="*" element={<Navigate to="/erp" replace />} />
        </Route>

        {/* Administrator Technical Area */}
        <Route path="/admin" element={
          <ProtectedRoute adminOnly>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="permissions" element={<GeneralModule title="RBAC Policy Manager" description="Define granular permission scopes for system-wide roles." />} />
          <Route path="branding" element={<BrandingSettings />} />
          <Route path="templates" element={<GeneralModule title="Document Scythe" description="Configure master templates for PDF generation (Invoices/Estimates)." />} />
          <Route path="settings" element={<GeneralModule title="Core Parameters" description="Global system variables, API integrations, and technical flags." />} />
          
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Route>

        {/* Global Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}
