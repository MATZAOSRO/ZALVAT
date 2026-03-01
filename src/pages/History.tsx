import { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { Trash2, Edit2, Search, Calendar as CalendarIcon, Filter, X } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

export function History() {
  const { consumos, removeConsumo } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('todos');

  const filteredConsumos = useMemo(() => {
    return consumos
      .filter(c => {
        const matchesSearch = c.tipo.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === 'todos' || c.tipo === filterType;
        return matchesSearch && matchesType;
      })
      .sort((a, b) => b.timestamp - a.timestamp); // Newest first
  }, [consumos, searchTerm, filterType]);

  // Group by date
  const groupedConsumos = useMemo(() => {
    const groups: Record<string, typeof filteredConsumos> = {};
    filteredConsumos.forEach(c => {
      if (!groups[c.fecha_formateada]) {
        groups[c.fecha_formateada] = [];
      }
      groups[c.fecha_formateada].push(c);
    });
    return groups;
  }, [filteredConsumos]);

  return (
    <main className="flex-1 overflow-y-auto bg-slate-50 p-6 md:p-10">
      <div className="mx-auto max-w-4xl space-y-8">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900">
              Historial de Consumo
            </h1>
            <p className="mt-2 text-slate-500 text-lg">Revisa y gestiona tus registros pasados.</p>
          </div>
        </header>

        {/* Filters */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Buscar por tipo..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-slate-400" />
            <select 
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 outline-none capitalize"
            >
              <option value="todos">Todos los tipos</option>
              <option value="cerveza">Cerveza</option>
              <option value="vino">Vino</option>
              <option value="coctel">Cóctel</option>
              <option value="destilado">Destilado</option>
              <option value="sidra">Sidra</option>
              <option value="licor">Licor</option>
              <option value="fernet">Fernet</option>
              <option value="vermut">Vermut</option>
              <option value="agua">Agua</option>
              <option value="mocktail">Mocktail</option>
            </select>
          </div>
        </div>

        {/* List */}
        <div className="space-y-6">
          {Object.keys(groupedConsumos).length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-slate-200 border-dashed">
              <p className="text-slate-500">No hay registros que coincidan con tu búsqueda.</p>
            </div>
          ) : (
            Object.entries(groupedConsumos).map(([dateStr, items]) => {
              const dateObj = parseISO(dateStr);
              const formattedDate = format(dateObj, "EEEE, d 'de' MMMM", { locale: es });
              
              return (
                <div key={dateStr} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="bg-slate-50 px-4 py-3 border-b border-slate-100 flex items-center gap-2">
                    <CalendarIcon size={16} className="text-slate-400" />
                    <h3 className="font-semibold text-slate-700 capitalize">{formattedDate}</h3>
                  </div>
                  <ul className="divide-y divide-slate-100">
                    {items.map(item => (
                      <li key={item.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                            item.tipo === 'agua' || item.tipo === 'mocktail' ? 'bg-sky-100 text-sky-600' : 'bg-brand-100 text-brand-600'
                          }`}>
                            {item.unidades}u
                          </div>
                          <div>
                            <p className="font-medium text-slate-900 capitalize">{item.tipo}</p>
                            <p className="text-xs text-slate-500">{format(item.timestamp, 'HH:mm')}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => removeConsumo(item.id)}
                            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })
          )}
        </div>
      </div>
    </main>
  );
}
