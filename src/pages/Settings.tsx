import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Save, User, Target } from 'lucide-react';
import toast from 'react-hot-toast';

export function Settings() {
  const { user, updateLimite, updateName } = useAuth();
  const [limite, setLimite] = useState(user?.limite_sugerido || 10);
  const [name, setName] = useState(user?.nombre || '');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateLimite(limite);
    if (name.trim()) {
      updateName(name.trim());
    }
    toast.success('Configuración guardada correctamente');
  };

  return (
    <main className="flex-1 overflow-y-auto bg-slate-50 p-6 md:p-10">
      <div className="mx-auto max-w-2xl space-y-8">
        <header>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900">
            Configuración
          </h1>
          <p className="mt-2 text-slate-500 text-lg">Ajusta tus preferencias y límites personales.</p>
        </header>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <form onSubmit={handleSave} className="p-6 space-y-6">
            
            {/* Profile Section */}
            <section className="space-y-4">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
                <User size={20} className="text-brand-600" /> Perfil
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Nombre</label>
                  <input 
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:ring-2 focus:ring-brand-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Número de celular</label>
                  <input 
                    type="tel" 
                    value={user?.phone || ''} 
                    disabled 
                    className="w-full bg-slate-100 border border-slate-200 rounded-lg px-3 py-2 text-slate-500 cursor-not-allowed"
                  />
                </div>
              </div>
            </section>

            {/* Goals Section */}
            <section className="space-y-4 pt-4">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
                <Target size={20} className="text-brand-600" /> Límites
              </h2>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Límite Sugerido Semanal (Unidades)</label>
                <div className="flex items-center gap-4">
                  <input 
                    type="number" 
                    min="0"
                    step="1"
                    value={limite}
                    onChange={(e) => setLimite(parseInt(e.target.value) || 0)}
                    className="w-32 bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:ring-2 focus:ring-brand-500 outline-none"
                  />
                  <span className="text-sm text-slate-500">
                    Unidades máximas sugeridas por semana.
                  </span>
                </div>
              </div>
            </section>

            <div className="pt-6 flex justify-end">
              <button 
                type="submit"
                className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-medium py-2 px-6 rounded-lg transition-colors shadow-sm"
              >
                <Save size={18} /> Guardar Cambios
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
