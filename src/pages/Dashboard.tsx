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
    <main className="flex-1 overflow-y-auto p-6 md:p-10 bg-transparent">
      <div className="mx-auto max-w-6xl space-y-8 animate-in fade-in duration-500">
        {/* Header Section */}
        <header className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="font-display text-3xl font-black tracking-tight md:text-5xl text-slate-800 drop-shadow-sm">
              Buenas noches,<br /> <span className="text-gradient drop-shadow-sm">{user?.nombre || 'Usuario'}</span>
            </h2>
            <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4 text-slate-600 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-xl inline-flex border border-white/60 shadow-sm">
              <div className="flex items-center gap-2">
                <Flame className="text-orange-500 drop-shadow-md" size={20} />
                <span className="text-sm font-medium">
                  Tu límite sugerido es <span className="text-slate-900 font-bold text-base">{stats.limiteSemanal} u</span>.
                </span>
              </div>
              {user?.peso && user?.altura && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="hidden sm:inline text-slate-300">•</span>
                  <span>Peso: <strong className="text-slate-700">{user.peso} kg</strong></span>
                  <span className="text-slate-300">•</span>
                  <span>Altura: <strong className="text-slate-700">{user.altura} cm</strong></span>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/history" className="flex items-center gap-2 rounded-xl border border-white/60 bg-white/60 backdrop-blur-md px-5 py-2.5 text-sm font-semibold text-slate-700 premium-shadow hover:bg-white/80 transition-all hover:-translate-y-0.5">
              <Calendar size={18} className="text-slate-500" />
              <span>Historial</span>
            </Link>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-brand-700 px-5 py-2.5 text-sm font-semibold text-white premium-shadow hover:from-brand-500 hover:to-brand-600 transition-all hover:-translate-y-0.5 hover:shadow-brand-500/30"
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
<<<<<<< HEAD

  {/* Impact Monitor */ }
  <section>
    <h3 className="mb-4 px-1 font-display text-2xl font-black text-slate-800">Impacto en tu Bienestar</h3>
    <div className="relative overflow-hidden rounded-3xl glass-panel p-8">
      <div className="absolute inset-0 bg-gradient-to-br from-white/90 to-white/40" />
      <div className="relative z-10 flex flex-col justify-between h-full gap-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-500 shadow-inner">
            <TrendingUp size={24} />
          </div>
          <p className="text-sm font-bold tracking-wide text-slate-500 uppercase">Promedio Diario</p>
=======

            {/* Impact Monitor */}
          <section>
            <h3 className="mb-4 px-1 font-display text-xl font-bold text-slate-900">Impacto en tu Bienestar</h3>
        </div>
        <p className="mt-1 text-sm text-slate-500">
          Esta semana
        </p>
      </div>
    </div>
<<<<<<< HEAD
                  <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none"></div>
                  <div className="absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-sky-500/10 blur-3xl pointer-events-none"></div>
=======
                  <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-indigo-500/5 blur-2xl"></div>
>>>>>>> 6ca0af1275529facdca2751a9f053724fe6d202a
                </div >
              </div >
            </section >

    {/* Quick Stats */ }
<<<<<<< HEAD
    < section className = "rounded-3xl glass-panel p-6 sm:p-8" >
              <div className="mb-6 flex items-center justify-between border-b border-slate-200/50 pb-4">
                <div>
                  <h3 className="font-display text-xl font-bold text-slate-800">Resumen Rápido</h3>
                  <p className="text-sm text-slate-500 font-medium">Tu progreso en números.</p>
                </div>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 bg-white/50 backdrop-blur-sm rounded-2xl border border-white shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
                  <p className="text-xs font-bold text-brand-500 uppercase tracking-wider">Hoy</p>
                  <p className="text-3xl font-black text-slate-800 mt-2">{stats.dailyUnits} <span className="text-base font-semibold text-slate-400">u</span></p>
                </div>
                <div className="p-5 bg-white/50 backdrop-blur-sm rounded-2xl border border-white shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
                  <p className="text-xs font-bold text-brand-500 uppercase tracking-wider">Mes</p>
                  <p className="text-3xl font-black text-slate-800 mt-2">{stats.monthlyUnits} <span className="text-base font-semibold text-slate-400">u</span></p>
                </div>
                <div className="p-5 bg-white/50 backdrop-blur-sm rounded-2xl border border-white shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
                  <p className="text-xs font-bold text-brand-500 uppercase tracking-wider">Sem. Ant.</p>
                  <p className="text-3xl font-black text-slate-800 mt-2">{stats.prevWeeklyUnits} <span className="text-base font-semibold text-slate-400">u</span></p>
                </div>
                <div className="p-5 bg-linear-to-br from-brand-600 to-brand-800 rounded-2xl border border-brand-500/30 premium-shadow hover:-translate-y-1 transition-all">
                  <p className="text-xs font-bold text-brand-200 uppercase tracking-wider">Frecuente</p>
                  <p className="text-xl font-bold text-white mt-3 capitalize truncate">{stats.mostConsumedType === 'todas' ? '-' : stats.mostConsumedType}</p>
=======
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
>>>>>>> 6ca0af1275529facdca2751a9f053724fe6d202a
              </div>
            </div>
          </section>
        </div>

        {/* Right Column (4 cols) */}
<<<<<<< HEAD
  <div className="space-y-6 lg:col-span-4 lg:mt-12">
    {/* Weekly Goal Progress */}
    <div className="rounded-3xl glass-card p-6 sm:p-8">
      <h3 className="font-display text-xl font-bold text-slate-800">Objetivo Semanal</h3>
      <p className="mb-8 text-sm font-medium text-slate-500">Se reinicia el domingo</p>
      <div className="flex flex-col items-center">
        <div className="relative flex h-64 w-64 items-center justify-center">
          <svg className="h-full w-full rotate-[-90deg] drop-shadow-md" viewBox="0 0 100 100">
            <circle className="text-slate-200/50" cx="50" cy="50" fill="transparent" r="40" stroke="currentColor" strokeWidth="8"></circle>
            <circle className={isOverLimit ? "text-slate-500" : "text-brand-500"} cx="50" cy="50" fill="transparent" r="40" stroke="url(#gradient)" strokeDasharray="251.2" strokeDashoffset={progressOffset} strokeLinecap="round" strokeWidth="8" style={{ transition: 'stroke-dashoffset 1s ease-out' }}></circle>
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={isOverLimit ? "#64748b" : "#64748b"} />
                <stop offset="100%" stopColor={isOverLimit ? "#475569" : "#334155"} />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute flex flex-col items-center text-center">
            <span className={`font-display text-5xl font-black ${isOverLimit ? 'text-slate-600' : 'text-slate-800'}`}>{stats.weeklyUnits}</span>
            <span className="text-sm font-bold text-slate-400 mt-1">de {stats.limiteSemanal} Unidades</span>
          </div>
        </div>
        <div className="mt-8 w-full space-y-4 rounded-2xl bg-white/50 p-4 border border-white/60">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500 font-medium">Restantes</span>
            <span className="font-bold text-slate-800 text-base bg-white px-3 py-1 rounded-lg border border-slate-100 shadow-sm">{remainingUnits} u</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500 font-medium">Estado</span>
            <span className={`font-bold px-3 py-1 rounded-lg text-white premium-shadow text-xs ${isOverLimit ? 'bg-slate-500' : 'bg-brand-500'}`}>
=======
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
>>>>>>> 6ca0af1275529facdca2751a9f053724fe6d202a
                          {isOverLimit ? 'Límite Superado' : 'En Camino'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
<<<<<<< HEAD

  {/* Promotions Teaser */ }
  <div className="relative overflow-hidden rounded-3xl premium-shadow bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 text-white group hover:scale-[1.02] transition-transform duration-300">
    <div className="relative z-10 flex flex-col items-start h-full justify-between gap-4">
      <div>
        <h3 className="mb-2 font-display text-2xl font-black text-white drop-shadow-md">Alternativas y Promos</h3>
        <p className="text-sm text-slate-300 font-medium leading-relaxed">Descubre opciones sin alcohol con descuentos exclusivos para ti.</p>
      </div>
      <Link to="/promotions" className="rounded-xl bg-white text-slate-900 px-5 py-2.5 text-sm font-bold hover:bg-brand-50 hover:shadow-lg hover:shadow-white/20 transition-all inline-flex items-center gap-2 mt-2">
        Ver Promociones <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>
    <div className="absolute -bottom-10 -right-10 h-48 w-48 rounded-full bg-brand-400/20 blur-3xl pointer-events-none transition-all duration-500 group-hover:bg-brand-300/30 group-hover:scale-150"></div>
    <div className="absolute -top-10 -left-10 h-32 w-32 rounded-full bg-indigo-400/10 blur-2xl pointer-events-none"></div>
=======

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
>>>>>>> 6ca0af1275529facdca2751a9f053724fe6d202a
    </div>
  </div>
        </div >
      </div >
    <AddDrinkModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </main >
  );
}
