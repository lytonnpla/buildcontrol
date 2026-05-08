import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export interface User {
  id: string;
  name: string;
  role: string;
  email: string;
  permissions: string;
  accessibleProjects: string[];
  accessibleModules: string[];
  accessibleDashboardWidgets: string[];
  requiresPasswordSetup?: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updatePassword: (password: string) => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock Users specifically with passwords for the simulation
export const DEFAULT_USERS: (User & { password: string })[] = [
  { 
    id: '0', 
    name: 'Lyton Junior', 
    role: 'Super Admin', 
    email: 'lyton.lfjunior@gmail.com', 
    password: 'password123',
    permissions: 'All',
    accessibleProjects: ['Villa Mediterranean', 'Downtown Penthouse', 'Echo Park Annex', 'Skyline Residences', 'Marina Bay Sands'],
    accessibleModules: ['Dashboard', 'Projects', 'Clients', 'Suppliers', 'Contracts', 'Schedule', 'Estimates', 'Daily Log'],
    accessibleDashboardWidgets: ['Revenue Analytics', 'Project Progress', 'Recent Activity', 'Resource Allocation', 'Financial Summary', 'Task Distribution']
  },
  { 
    id: '1', 
    name: 'Lyton LF', 
    role: 'Super Admin', 
    email: 'lyton@buildcontrol.pro', 
    password: 'password123',
    permissions: 'All',
    accessibleProjects: ['Villa Mediterranean', 'Downtown Penthouse', 'Echo Park Annex', 'Skyline Residences', 'Marina Bay Sands'],
    accessibleModules: ['Dashboard', 'Projects', 'Clients', 'Suppliers', 'Contracts', 'Schedule', 'Estimates', 'Daily Log'],
    accessibleDashboardWidgets: ['Revenue Analytics', 'Project Progress', 'Recent Activity', 'Resource Allocation', 'Financial Summary', 'Task Distribution']
  },
  { 
    id: '2', 
    name: 'Mário Silva', 
    role: 'Project Manager', 
    email: 'mario@builders.pt', 
    password: 'password123',
    permissions: 'ERP_Write, ERP_Read',
    accessibleProjects: ['Villa Mediterranean', 'Downtown Penthouse'],
    accessibleModules: ['Dashboard', 'Projects', 'Daily Log', 'Schedule'],
    accessibleDashboardWidgets: ['Project Progress', 'Recent Activity']
  }
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Sync default users into storage
    const stored = localStorage.getItem('BUILDCONTROL_USERS');
    let users = stored ? JSON.parse(stored) : [];
    
    // Ensure all default users exist in stored users
    let updated = false;
    DEFAULT_USERS.forEach(defUser => {
      if (!users.find((u: any) => u.email === defUser.email)) {
        users.push(defUser);
        updated = true;
      }
    });

    if (updated || !stored) {
      localStorage.setItem('BUILDCONTROL_USERS', JSON.stringify(users));
    }

    const savedUser = localStorage.getItem('auth_user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
        setIsAuthenticated(true);
      } catch (e) {
        localStorage.removeItem('auth_user');
      }
    }
  }, []);

  const login = async (email: string, password: string) => {
    // Simulate API call using dynamic user registry
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        const storedUsers = JSON.parse(localStorage.getItem('BUILDCONTROL_USERS') || '[]');
        const foundUser = storedUsers.find((u: any) => 
          u.email.toLowerCase() === email.toLowerCase() && 
          (u.password === password || (!u.password && password === 'password123'))
        );
        
        if (foundUser) {
           const { password, ...userWithoutPassword } = foundUser;
           setUser(userWithoutPassword);
           setIsAuthenticated(true);
           localStorage.setItem('auth_user', JSON.stringify(userWithoutPassword));
           // @ts-ignore - we want to return the user for conditional routing
           resolve(userWithoutPassword);
        } else {
           reject(new Error('Invalid credentials'));
        }
      }, 800);
    });
  };

  const updatePassword = async (password: string) => {
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        if (!user) {
          reject(new Error('No user authenticated'));
          return;
        }

        const storedUsers = JSON.parse(localStorage.getItem('BUILDCONTROL_USERS') || '[]');
        const userIndex = storedUsers.findIndex((u: any) => u.id === user.id);

        if (userIndex !== -1) {
          storedUsers[userIndex].password = password;
          storedUsers[userIndex].requiresPasswordSetup = false;
          
          const updatedUser = { ...user, requiresPasswordSetup: false };
          setUser(updatedUser);
          localStorage.setItem('auth_user', JSON.stringify(updatedUser));
          localStorage.setItem('BUILDCONTROL_USERS', JSON.stringify(storedUsers));
          resolve();
        } else {
          reject(new Error('User not found in registry'));
        }
      }, 800);
    });
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('auth_user');
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updatePassword, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
