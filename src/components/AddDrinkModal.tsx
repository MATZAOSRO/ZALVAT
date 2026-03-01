import { useState } from 'react';
import { DrinkType } from '../types';
import { useAppContext } from '../context/AppContext';
import { Beer, Wine, Martini, Droplets, X, Coffee, GlassWater, Apple, GlassWater as ShotGlass } from 'lucide-react';

type AddDrinkModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const drinkOptions: { type: DrinkType; label: string; icon: any; color: string; defaultUnits: number; abv: number; defaultMl: number }[] = [
  { type: 'cerveza', label: 'Cerveza', icon: Beer, color: 'text-amber-500', defaultUnits: 1, abv: 0.05, defaultMl: 330 },
  { type: 'vino', label: 'Vino', icon: Wine, color: 'text-rose-600', defaultUnits: 1, abv: 0.12, defaultMl: 150 },
  { type: 'coctel', label: 'Cóctel', icon: Martini, color: 'text-indigo-500', defaultUnits: 1.5, abv: 0.15, defaultMl: 100 },
  { type: 'destilado', label: 'Destilado', icon: Coffee, color: 'text-orange-700', defaultUnits: 1, abv: 0.40, defaultMl: 40 },
  { type: 'sidra', label: 'Sidra', icon: Apple, color: 'text-green-500', defaultUnits: 1, abv: 0.05, defaultMl: 330 },
  { type: 'licor', label: 'Licor', icon: ShotGlass, color: 'text-purple-500', defaultUnits: 1, abv: 0.20, defaultMl: 50 },
  { type: 'fernet', label: 'Fernet', icon: Coffee, color: 'text-stone-800', defaultUnits: 1.5, abv: 0.39, defaultMl: 50 },
  { type: 'vermut', label: 'Vermut', icon: Wine, color: 'text-red-800', defaultUnits: 1, abv: 0.15, defaultMl: 100 },
  { type: 'agua', label: 'Agua', icon: Droplets, color: 'text-sky-500', defaultUnits: 0, abv: 0, defaultMl: 250 },
  { type: 'mocktail', label: 'Mocktail', icon: GlassWater, color: 'text-brand-500', defaultUnits: 0, abv: 0, defaultMl: 250 },
];

export function AddDrinkModal({ isOpen, onClose }: AddDrinkModalProps) {
  const { addConsumo } = useAppContext();
  const [selectedType, setSelectedType] = useState<DrinkType>('cerveza');
  const [inputMode, setInputMode] = useState<'unidades' | 'mililitros'>('unidades');
  const [units, setUnits] = useState<number>(1);
  const [ml, setMl] = useState<number>(330);

  if (!isOpen) return null;

  const handleTypeSelect = (type: DrinkType, defaultUnits: number, defaultMl: number) => {
    setSelectedType(type);
    setUnits(defaultUnits);
    setMl(defaultMl);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let finalUnits = units;
    if (inputMode === 'mililitros') {
      const option = drinkOptions.find(o => o.type === selectedType);
      if (option && option.abv > 0) {
        finalUnits = (ml * option.abv) / 10;
      } else {
        finalUnits = 0;
      }
    }
    addConsumo(selectedType, Number(finalUnits.toFixed(1)));
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center p-4 border-b border-slate-100">
          <h3 className="font-bold text-lg text-slate-900">Registrar Bebida</h3>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3">¿Qué estás tomando?</label>
            <div className="grid grid-cols-3 gap-3">
              {drinkOptions.map((option) => {
                const Icon = option.icon;
                const isSelected = selectedType === option.type;
                return (
                  <button
                    key={option.type}
                    type="button"
                    onClick={() => handleTypeSelect(option.type, option.defaultUnits, option.defaultMl)}
                    className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
                      isSelected 
                        ? 'border-brand-500 bg-brand-50 ring-1 ring-brand-500' 
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <Icon size={24} className={option.color} />
                    <span className="text-xs font-medium text-slate-700">{option.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-slate-700">Cantidad</label>
              <div className="flex bg-slate-100 p-1 rounded-lg">
                <button
                  type="button"
                  onClick={() => setInputMode('unidades')}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                    inputMode === 'unidades' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  Unidades
                </button>
                <button
                  type="button"
                  onClick={() => setInputMode('mililitros')}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                    inputMode === 'mililitros' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  Mililitros
                </button>
              </div>
            </div>
            
            {inputMode === 'unidades' ? (
              <div className="flex items-center gap-4">
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  value={units}
                  onChange={(e) => setUnits(parseFloat(e.target.value) || 0)}
                  className="block w-full rounded-lg border-slate-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm px-4 py-2 border"
                  disabled={selectedType === 'agua' || selectedType === 'mocktail'}
                />
                <span className="text-sm text-slate-500 whitespace-nowrap">
                  {units === 1 ? 'Unidad' : 'Unidades'}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <input
                  type="number"
                  step="10"
                  min="0"
                  value={ml}
                  onChange={(e) => setMl(parseInt(e.target.value) || 0)}
                  className="block w-full rounded-lg border-slate-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm px-4 py-2 border"
                  disabled={selectedType === 'agua' || selectedType === 'mocktail'}
                />
                <span className="text-sm text-slate-500 whitespace-nowrap">
                  ml
                </span>
              </div>
            )}
            
            <p className="mt-2 text-xs text-slate-500">
              {selectedType === 'agua' || selectedType === 'mocktail' 
                ? 'Las bebidas sin alcohol no suman unidades.' 
                : inputMode === 'unidades' 
                  ? 'Una unidad equivale a 10ml de alcohol puro (ej. una caña de cerveza o copa pequeña de vino).'
                  : `Se calcularán las unidades automáticamente según el volumen (${ml}ml).`}
            </p>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-slate-300 shadow-sm text-sm font-medium rounded-lg text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-colors"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
