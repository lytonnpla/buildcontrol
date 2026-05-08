import { Project, Client } from './types';

export const INITIAL_PROJECTS: Project[] = [
  { 
    id: '1', 
    name: 'Villa Mediterranean', 
    code: 'VM-2024-01',
    client: 'John Smith', 
    clientContact: '+258 84 123 4567',
    clientNuit: '123456789',
    address: 'Av. Marginal, 1200',
    city: 'Maputo',
    province: 'Maputo City',
    constructionType: 'Luxary Villa',
    floors: 2,
    totalArea: 450,
    components: 'Pool, Garden, Home Office',
    techProjects: { architectural: true, structural: true, electrical: true, hydraulic: true, safety: false },
    licenseNumber: 'LC-MAP-2024-88',
    municipalApproval: 'Approved',
    processNumber: 'PROC-992/24',
    startDate: '2024-01-15',
    deadline: '2024-12-20',
    currentPhase: 'Structure',
    riskManagement: 'Condições climáticas podem atrasar fundações',
    progress: 65, 
    status: 'Active', 
    type: 'Residential'
  },
];

export const INITIAL_CLIENTS: Client[] = [
  {
    id: '1',
    name: 'John Smith',
    company: 'Ocean View Estates',
    email: 'john@oceanview.com',
    status: 'Active',
    phone: '+258 84 123 4567',
    nuit: '123456789'
  },
  {
    id: '2',
    name: 'Sarah Matsinhe',
    company: 'Matsinhe Architects',
    email: 'sarah@matsinhe.co.mz',
    status: 'Active',
    phone: '+258 82 987 6543'
  }
];
