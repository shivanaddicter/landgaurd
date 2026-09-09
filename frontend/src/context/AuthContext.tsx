import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  id: string;
  name: string;
  role: string;
  clearanceLevel: number;
  agency: string;
  sector: string;
  avatar: string;
  email: string;
  badgeColor: string;
}

export const DEMO_PERSONAS: User[] = [
  {
    id: 'dr_norbu',
    name: 'Dr. T. Norbu, IAS',
    role: 'Disaster Incident Commander',
    clearanceLevel: 4,
    agency: 'National Disaster Management Authority (NDMA)',
    sector: 'North Eastern Region HQs, Itanagar',
    avatar: 'TN',
    email: 't.norbu@ndma.gov.in',
    badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40'
  },
  {
    id: 'col_sharma',
    name: 'Col. Rajeshwar Sharma, VSM',
    role: 'Tactical Field Commander',
    clearanceLevel: 4,
    agency: 'NDRF 12th Bn / BRO Task Force Vartak',
    sector: 'Tawang & Kameng Highway Sector',
    avatar: 'RS',
    email: 'r.sharma.ndrf@gov.in',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40'
  },
  {
    id: 'dr_chettri',
    name: 'Dr. Priya Chettri, PhD',
    role: 'Senior Geotechnical Scientist',
    clearanceLevel: 3,
    agency: 'Geological Survey of India (GSI) Bhuvan',
    sector: 'Sikkim & Teesta Landslide Observatory',
    avatar: 'PC',
    email: 'p.chettri@gsi.gov.in',
    badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
  },
  {
    id: 'tenzing',
    name: 'Tenzing Wangchuk',
    role: 'IoT Telemetry Specialist',
    clearanceLevel: 2,
    agency: 'Arunachal State Disaster Mgmt (SDMA)',
    sector: 'Sela Tunnel & Bhalukpong Sensor Fleet',
    avatar: 'TW',
    email: 't.wangchuk@sdma.arunachal.gov.in',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
  }
];

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
  switchPersona: (personaId: string) => void;
  isLoginModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem('ai_slopeguard_user');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to parse stored user:', e);
    }
    // Default to Dr. T. Norbu on initial load
    return DEMO_PERSONAS[0];
  });

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem('ai_slopeguard_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('ai_slopeguard_user');
      }
    } catch (e) {
      console.warn('Failed to persist user session:', e);
    }
  }, [user]);

  const login = (newUser: User) => {
    setUser(newUser);
    setIsLoginModalOpen(false);
  };

  const logout = () => {
    setUser(null);
  };

  const switchPersona = (personaId: string) => {
    const found = DEMO_PERSONAS.find((p) => p.id === personaId);
    if (found) {
      setUser(found);
      setIsLoginModalOpen(false);
    }
  };

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        login,
        logout,
        switchPersona,
        isLoginModalOpen,
        openLoginModal,
        closeLoginModal
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
