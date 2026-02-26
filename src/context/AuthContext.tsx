import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';

type AuthContextType = {
  user: User | null;
  login: (phone: string, nombre: string) => void;
  logout: () => void;
  updateLimite: (limite: number) => void;
  updateName: (name: string) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('modera_user');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('modera_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('modera_user');
    }
  }, [user]);

  const login = (phone: string, nombre: string) => {
    const newUser: User = { 
      id: Date.now().toString(), 
      phone, 
      nombre,
      limite_sugerido: 10, // Default goal
      fecha_registro: Date.now()
    };
    setUser(newUser);
  };

  const logout = () => {
    setUser(null);
  };

  const updateLimite = (limite: number) => {
    if (user) {
      setUser({ ...user, limite_sugerido: limite });
    }
  };

  const updateName = (name: string) => {
    if (user) {
      setUser({ ...user, nombre: name });
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateLimite, updateName }}>
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
