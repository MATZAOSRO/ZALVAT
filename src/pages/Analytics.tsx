import { 
  Calendar, 
  CheckCircle, 
  Flame, 
  PiggyBank, 
  TrendingUp 
} from 'lucide-react';
import { useStats } from '../hooks/useStats';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const COLORS = ['#d41920', '#f59e0b', '#e11d48', '#6366f1', '#c2410c'];

export function Analytics() {
  const stats = useStats();

  return (
    <main className="flex-1 w-full max-w-[1440px] mx-auto p-4 md:p-8 lg:px-10 flex flex-col gap-8 bg-slate-50">
      <section className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-brand-600 text-sm font-medium mb-1">
            <Calendar size={18} />
            <span>Resumen General</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em] text-slate-900">
            Estadísticas y Progreso
          </h1>
          <p className="text-slate-500 text-base max-w-2xl">
            Sigue tus hitos y patrones de consistencia sin juicios. Enfócate en las tendencias.
          </p>
        </div>
      </section>

      {/* KPI Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { title: "Consumo Semanal", val: stats.weeklyUnits, icon: CheckCircle, trend: stats.prevWeeklyUnits > 0 ? `${((stats.weeklyUnits - stats.prevWeeklyUnits) / stats.prevWeeklyUnits * 100).toFixed(0)}%` : '-', trendIcon: TrendingUp, trendCol: stats.weeklyUnits > stats.prevWeeklyUnits ? "text-slate-500" : "text-emerald-500", footer: "vs sem. ant." },
          { title: "Día Mayor Consumo", val: stats.highestDay.units, icon: Flame, footer: stats.highestDay.date },
          { title: "Promedio Diario", val: isNaN(stats.dailyAverage) ? '0.0' : stats.dailyAverage.toFixed(1), icon: TrendingUp, footer: "esta semana" }
        ].map((card, idx) => {
          const Icon = card.icon;
          const TrendIcon = card.trendIcon;
          return (
            <div key={idx} className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Icon size={80} className="text-brand-600" />
              </div>
              <div className="flex flex-col gap-1 z-10">
                <span className="text-slate-500 text-sm font-medium">{card.title}</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold tracking-tight text-slate-900">{card.val}</span>
                  {card.trend && card.trend !== '-' && (
                    <span className={`${card.trendCol} text-sm font-medium flex items-center bg-slate-50 px-1.5 py-0.5 rounded`}>
                      {TrendIcon && <TrendIcon size={14} className="mr-0.5" />}
                      {card.trend}
                    </span>
                  )}
                </div>
                {card.footer && <span className="text-slate-400 text-sm font-normal mt-1">{card.footer}</span>}
              </div>
            </div>
          );
        })}
      </section>

      {/* Main Visualizations */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col">
          <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
            <div>
              <h3 className="text-lg font-bold tracking-tight text-slate-900">Consumo Últimos 7 Días</h3>
              <p className="text-slate-500 text-sm">Unidades de alcohol por día.</p>
            </div>
          </div>
          <div className="flex-1 min-h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.barChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip 
                  cursor={{ fill: '#f1f5f9' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="unidades" fill="#d41920" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Proportion */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col">
          <div className="mb-4">
            <h3 className="text-lg font-bold tracking-tight text-slate-900">Distribución Mensual</h3>
            <p className="text-slate-500 text-sm">Por tipo de bebida</p>
          </div>
          <div className="flex-1 min-h-[240px] relative w-full flex items-center justify-center">
            {stats.pieChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.pieChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {stats.pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-slate-400 text-sm">No hay datos este mes</p>
            )}
          </div>
          {stats.pieChartData.length > 0 && (
            <div className="mt-4 grid grid-cols-2 gap-2">
              {stats.pieChartData.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-2 text-sm text-slate-600 capitalize">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                  {entry.name}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
