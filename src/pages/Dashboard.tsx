import { useState } from 'react';
import { 
  Flame, 
  Calendar, 
  Plus, 
  Droplets, 
  PiggyBank, 
  TrendingUp,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useStats } from '../hooks/useStats';
import { AddDrinkModal } from '../components/AddDrinkModal';

export function Dashboard() {
  const { user } = useAuth();
  const stats = useStats();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const remainingUnits = Math.max(0, stats.limiteSemanal - stats.weeklyUnits);
  const progressOffset = stats.limiteSemanal > 0 
    ? 251.2 - (251.2 * Math.min(stats.weeklyUnits, stats.limiteSemanal)) / stats.limiteSemanal
    : 251.2;
  const isOverLimit = stats.isOverLimit;

  return (
    <main className="flex-1 overflow-y-auto bg-slate-50 p-6 md:p-10">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Header Section */}
        <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="font-display text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
              Buenas noches, {user?.nombre || 'Usuario'}
            </h2>
            <div className="mt-2 flex items-center gap-2 text-slate-500">
              <Flame className="text-orange-500" size={20} />
              <span className="text-base font-medium">
                Tu límite sugerido es de <span className="text-slate-900 font-bold">{stats.limiteSemanal} unidades</span>.
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/history" className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 transition-colors">
              <Calendar size={18} />
              <span>Ver Historial</span>
            </Link>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white shadow-sm shadow-brand-500/20 hover:bg-brand-700 transition-colors"
            >
              <Plus size={18} />
              <span>Registrar Bebida</span>
            </button>
          </div>
        </header>
        
        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left Column (8 cols) */}
          <div className="space-y-6 lg:col-span-8">
            
            {/* Impact Monitor */}
            <section>
              <h3 className="mb-4 px-1 font-display text-xl font-bold text-slate-900">Impacto en tu Bienestar</h3>
              <div className="grid grid-cols-1 gap-4">
                <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6">
                  <div className="relative z-10 flex flex-col justify-between h-full gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                        <TrendingUp size={20} />
                      </div>
                      <p className="text-sm font-medium text-slate-500">Promedio Diario</p>
                    </div>
                    <div>
                      <div className="flex items-end gap-2">
                        <p className="font-display text-4xl font-bold tracking-tight text-slate-900">{isNaN(stats.dailyAverage) ? '0.0' : stats.dailyAverage.toFixed(1)}</p>
                        <p className="mb-1 text-sm font-medium text-slate-500">Unidades</p>
                      </div>
                      <p className="mt-1 text-sm text-slate-500">
                        Esta semana
                      </p>
                    </div>
                  </div>
                  <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-indigo-500/5 blur-2xl"></div>
                </div>
              </div>
            </section>

            {/* Quick Stats */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6">
               <div className="mb-5 border-b border-slate-100 pb-4">
                <h3 className="font-display text-lg font-bold text-slate-900">Resumen Rápido</h3>
                <p className="text-sm text-slate-500">Tu progreso en números.</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-xs font-semibold text-slate-500 uppercase">Hoy</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{stats.dailyUnits} <span className="text-sm font-normal text-slate-500">u</span></p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-xs font-semibold text-slate-500 uppercase">Mes</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{stats.monthlyUnits} <span className="text-sm font-normal text-slate-500">u</span></p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-xs font-semibold text-slate-500 uppercase">Semana Ant.</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{stats.prevWeeklyUnits} <span className="text-sm font-normal text-slate-500">u</span></p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-xs font-semibold text-slate-500 uppercase">Bebida Frecuente</p>
                  <p className="text-lg font-bold text-slate-900 mt-1 capitalize truncate">{stats.mostConsumedType === 'todas' ? '-' : stats.mostConsumedType}</p>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column (4 cols) */}
          <div className="space-y-6 lg:col-span-4">
            {/* Weekly Goal Progress */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="font-display text-lg font-bold text-slate-900">Objetivo Semanal</h3>
              <p className="mb-6 text-sm text-slate-500">Se reinicia el domingo</p>
              <div className="flex flex-col items-center">
                <div className="relative flex h-64 w-64 items-center justify-center">
                  <svg className="h-full w-full rotate-[-90deg]" viewBox="0 0 100 100">
                    <circle className="text-slate-100" cx="50" cy="50" fill="transparent" r="40" stroke="currentColor" strokeWidth="8"></circle>
                    <circle className={isOverLimit ? "text-slate-500" : "text-brand-500"} cx="50" cy="50" fill="transparent" r="40" stroke="currentColor" strokeDasharray="251.2" strokeDashoffset={progressOffset} strokeLinecap="round" strokeWidth="8" style={{ transition: 'stroke-dashoffset 0.5s ease' }}></circle>
                  </svg>
                  <div className="absolute flex flex-col items-center text-center">
                    <span className={`text-4xl font-black ${isOverLimit ? 'text-slate-600' : 'text-slate-900'}`}>{stats.weeklyUnits}</span>
                    <span className="text-sm font-medium text-slate-500">de {stats.limiteSemanal} Unidades</span>
                  </div>
                </div>
                <div className="mt-6 w-full space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Restantes</span>
                    <span className="font-bold text-slate-900">{remainingUnits} Unidades</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Estado</span>
                    <span className={`font-bold ${isOverLimit ? 'text-slate-500' : 'text-emerald-500'}`}>
                      {isOverLimit ? 'Límite Superado' : 'En Camino'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Promotions Teaser */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 p-6 text-white">
              <div className="relative z-10">
                <h3 className="mb-2 font-display text-lg font-bold">Alternativas y Promos</h3>
                <p className="mb-4 text-sm text-slate-300">Descubre opciones sin alcohol con descuentos exclusivos.</p>
                <Link to="/promotions" className="rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm hover:bg-white/20 transition-colors inline-flex items-center gap-2">
                  Ver Promociones <ArrowRight size={16} />
                </Link>
              </div>
              <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-brand-500/20 blur-3xl"></div>
            </div>
          </div>
        </div>
      </div>
      <AddDrinkModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </main>
  );
}
