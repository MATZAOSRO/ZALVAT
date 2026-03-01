import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Save, User, Target, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { calculateSuggestedLimit } from '../utils/metrics';

export function Settings() {
  const { user, updateLimite, updateName, updateMetrics, updateContactoEmergencia } = useAuth();
  const [limite, setLimite] = useState(user?.limite_sugerido || 10);
  const [name, setName] = useState(user?.nombre || '');
  const [peso, setPeso] = useState(user?.peso || '');
  const [altura, setAltura] = useState(user?.altura || '');
  const [contactoEmergencia, setContactoEmergencia] = useState(user?.contacto_emergencia || '');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateLimite(limite);
      if (name.trim()) {
        await updateName(name.trim());
      }
      if (contactoEmergencia.trim() !== (user?.contacto_emergencia || '')) {
        await updateContactoEmergencia(contactoEmergencia.trim());
      }
      const pesoNum = parseFloat(peso as string);
      const alturaNum = parseFloat(altura as string);
      if (pesoNum > 0 && alturaNum > 0) {
        await updateMetrics(pesoNum, alturaNum);
      }
      toast.success('Configuración guardada correctamente');
    } catch (error: any) {
      toast.error('Error al guardar la configuración');
    }
  };

  const handleRecalculate = () => {
    const pesoNum = parseFloat(peso as string);
    const alturaNum = parseFloat(altura as string);
    if (pesoNum > 0 && alturaNum > 0) {
      const newLimit = calculateSuggestedLimit(pesoNum, alturaNum);
      setLimite(newLimit);
      toast.success('Límite recalculado según tus métricas');
    } else {
      toast.error('Ingresa tu peso y altura primero');
    }
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
                  <label className="block text-sm font-medium text-slate-700 mb-1">Correo electrónico</label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full bg-slate-100 border border-slate-200 rounded-lg px-3 py-2 text-slate-500 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Peso (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="30"
                    max="300"
                    value={peso}
                    onChange={(e) => setPeso(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:ring-2 focus:ring-brand-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Altura (cm)</label>
                  <input
                    type="number"
                    step="1"
                    min="100"
                    max="250"
                    value={altura}
                    onChange={(e) => setAltura(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:ring-2 focus:ring-brand-500 outline-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Contacto de Emergencia</label>
                  <input
                    type="tel"
                    value={contactoEmergencia}
                    onChange={(e) => setContactoEmergencia(e.target.value)}
                    placeholder="Ej: +57 300 000 0000"
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:ring-2 focus:ring-brand-500 outline-none"
                  />
                  <span className="text-xs text-slate-500 mt-1 block">El asistente ZALVA-T podrá contactar o usar este número en caso de que indiques una emergencia.</span>
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
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
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
                  <button
                    type="button"
                    onClick={handleRecalculate}
                    className="flex items-center gap-2 text-sm font-medium text-brand-600 hover:text-brand-700 bg-brand-50 hover:bg-brand-100 px-3 py-2 rounded-lg transition-colors w-fit"
                  >
                    <RefreshCw size={16} />
                    Recalcular según OMS
                  </button>
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
