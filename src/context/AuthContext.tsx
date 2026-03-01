import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { calculateSuggestedLimit } from '../utils/metrics';
import { supabase } from '../lib/supabase';

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password?: string) => Promise<void>;
  register: (email: string, password?: string) => Promise<void>;
  logout: () => Promise<void>;
  updateLimite: (limite: number) => Promise<void>;
  updateName: (name: string) => Promise<void>;
  updateMetrics: (peso: number, altura: number) => Promise<void>;
  updateOnboarding: (nombre: string, peso: number, altura: number, phone: string) => Promise<void>;
  updateContactoEmergencia: (phone: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        fetchProfile(session.user.id, session.user.email!);
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        fetchProfile(session.user.id, session.user.email!);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (id: string, email: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();

    if (data) {
      setUser({ ...data, email } as User);
    } else {
      // Create incomplete profile
      const newProfile = {
        id,
        email,
        limite_sugerido: 10,
        nombre: ''
      };
      await supabase.from('profiles').upsert(newProfile);
      setUser(newProfile as User);
    }
    setLoading(false);
  };

  const login = async (email: string, password?: string) => {
    if (!password) return;
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const register = async (email: string, password?: string) => {
    if (!password) return;
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  const updateLimite = async (limite: number) => {
    if (!user) return;
    const { error } = await supabase.from('profiles').update({ limite_sugerido: limite }).eq('id', user.id);
    if (!error) setUser(prev => prev ? { ...prev, limite_sugerido: limite } : null);
  };

  const updateName = async (name: string) => {
    if (!user) return;
    const { error } = await supabase.from('profiles').update({ nombre: name }).eq('id', user.id);
    if (!error) setUser(prev => prev ? { ...prev, nombre: name } : null);
  };

  const updateMetrics = async (peso: number, altura: number) => {
    if (!user) return;
    const { error } = await supabase.from('profiles').update({ peso, altura }).eq('id', user.id);
    if (!error) setUser(prev => prev ? { ...prev, peso, altura } : null);
  };

  const updateOnboarding = async (nombre: string, peso: number, altura: number, phone: string) => {
    if (!user) return;
    const limite_sugerido = calculateSuggestedLimit(peso, altura);
    const { error } = await supabase.from('profiles').update({ nombre, peso, altura, phone, limite_sugerido }).eq('id', user.id);
    if (!error) setUser(prev => prev ? { ...prev, nombre, peso, altura, phone, limite_sugerido } : null);
  };

  const updateContactoEmergencia = async (phone: string) => {
    if (!user) return;
    const { error } = await supabase.from('profiles').update({ contacto_emergencia: phone }).eq('id', user.id);
    if (!error) setUser(prev => prev ? { ...prev, contacto_emergencia: phone } : null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateLimite, updateName, updateMetrics, updateOnboarding, updateContactoEmergencia }}>
      {!loading && children}
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
