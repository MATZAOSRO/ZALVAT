import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Consumo, DrinkType, Promocion } from '../types';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

type AppContextType = {
  consumos: Consumo[];
  addConsumo: (tipo: DrinkType, unidades: number, timestamp?: number) => void;
  removeConsumo: (id: string) => void;
  editConsumo: (id: string, updates: Partial<Consumo>) => void;
  promociones: Promocion[];
};

const defaultPromociones: Promocion[] = [
  {
    id: '1',
    titulo: 'Descuento en Cerveza Artesanal 0.0%',
    descripcion: 'Disfruta del sabor sin los efectos. 20% de descuento en tu primera compra.',
    tipo_bebida: 'cerveza',
    activa: true,
    marca: 'Cervecería Libre',
    codigo: 'MODERA20',
    imagen: 'https://picsum.photos/seed/beer0/400/200'
  },
  {
    id: '2',
    titulo: 'Mocktails 2x1 en Bar Central',
    descripcion: 'Muestra este código y obtén un 2x1 en toda la carta de mocktails de autor.',
    tipo_bebida: 'mocktail',
    activa: true,
    marca: 'Bar Central',
    codigo: 'MOCKTAIL2X1',
    imagen: 'https://picsum.photos/seed/mocktail/400/200'
  },
  {
    id: '3',
    titulo: 'Suscripción Kombucha Premium',
    descripcion: 'Una alternativa saludable y deliciosa. 15% off en tu suscripción mensual.',
    tipo_bebida: 'todas',
    activa: true,
    marca: 'VidaKombucha',
    codigo: 'VIDA15',
    imagen: 'https://picsum.photos/seed/kombucha/400/200'
  },
  {
    id: '4',
    titulo: 'Cata de Vinos Desalcoholizados',
    descripcion: 'Descubre el mundo del vino sin alcohol. Entrada 2x1 este fin de semana.',
    tipo_bebida: 'vino',
    activa: true,
    marca: 'Viña Clara',
    codigo: 'VINO00',
    imagen: 'https://picsum.photos/seed/wine0/400/200'
  }
];

const tips = [
  "Recuerda beber un vaso de agua por cada bebida alcohólica.",
  "Come algo antes o mientras bebes para ralentizar la absorción.",
  "Conoce tu límite y respétalo.",
  "Bebe despacio, disfruta el sabor.",
  "Evita mezclar diferentes tipos de alcohol."
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [consumos, setConsumos] = useState<Consumo[]>(() => {
    const saved = localStorage.getItem('modera_consumos');
    return saved ? JSON.parse(saved) : [];
  });

  const [promociones] = useState<Promocion[]>(defaultPromociones);

  useEffect(() => {
    localStorage.setItem('modera_consumos', JSON.stringify(consumos));
  }, [consumos]);

  const addConsumo = (tipo: DrinkType, unidades: number, timestamp: number = Date.now()) => {
    const newConsumo: Consumo = {
      id: Date.now().toString(),
      tipo,
      unidades,
      timestamp,
      fecha_formateada: format(timestamp, 'yyyy-MM-dd')
    };
    setConsumos(prev => [...prev, newConsumo]);
    
    if (tipo !== 'agua' && tipo !== 'mocktail') {
      const randomTip = tips[Math.floor(Math.random() * tips.length)];
      toast.success(`Registrado. Tip: ${randomTip}`, { duration: 5000 });
    } else {
      toast.success(`Registrado: ${unidades} unidades de ${tipo}`);
    }
  };

  const removeConsumo = (id: string) => {
    setConsumos(prev => prev.filter(c => c.id !== id));
    toast.success('Registro eliminado');
  };

  const editConsumo = (id: string, updates: Partial<Consumo>) => {
    setConsumos(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
    toast.success('Registro actualizado');
  };

  return (
    <AppContext.Provider value={{ consumos, addConsumo, removeConsumo, editConsumo, promociones }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
