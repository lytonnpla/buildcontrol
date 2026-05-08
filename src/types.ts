export interface Project {
  id: string;
  name: string;
  code: string;
  type: string;
  
  // Location
  address: string;
  city: string;
  province: string;
  coordinates?: string;

  // Client
  client: string;
  clientContact: string;
  clientNuit: string;

  // Description
  constructionType: string;
  floors: number;
  totalArea: number;
  components: string;

  // Technical Projects (Status)
  techProjects: {
    architectural: boolean;
    structural: boolean;
    electrical: boolean;
    hydraulic: boolean;
    safety: boolean;
  };

  // Licenses
  licenseNumber: string;
  municipalApproval: string;
  processNumber: string;

  // Timeline
  startDate: string;
  deadline: string;
  currentPhase: string;
  
  // Risk
  riskManagement: string;

  progress: number;
  status: string;
  value?: string;
}

export interface Client {
  id: string;
  name: string;
  company: string;
  email: string;
  status: string;
  phone?: string;
  nuit?: string;
  address?: string;
}
