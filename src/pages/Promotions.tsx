import { Gift, Tag, ExternalLink } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useStats } from '../hooks/useStats';

export function Promotions() {
  const { promociones } = useAppContext();
  const { mostConsumedType } = useStats();

  // Sort promotions to show the ones related to the most consumed type first
  const sortedPromociones = [...promociones].sort((a, b) => {
    if (a.tipo_bebida === mostConsumedType && b.tipo_bebida !== mostConsumedType) return -1;
    if (a.tipo_bebida !== mostConsumedType && b.tipo_bebida === mostConsumedType) return 1;
    return 0;
  });

  return (
    <main className="flex-1 overflow-y-auto bg-slate-50 p-6 md:p-10">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-brand-600 text-sm font-medium mb-1">
            <Gift size={18} />
            <span>Beneficios Exclusivos</span>
          </div>
          <h1 className="font-display text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
            Promociones y Alternativas
          </h1>
          <p className="text-slate-500 text-lg max-w-2xl">
            Descubre opciones deliciosas y responsables. Aprovecha estos descuentos en bebidas sin alcohol y alternativas saludables para tus salidas.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedPromociones.map(offer => (
            <div key={offer.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex flex-col group hover:shadow-md transition-shadow">
              <div className="h-48 bg-slate-200 relative overflow-hidden">
                <img 
                  src={offer.imagen} 
                  alt={offer.titulo} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-slate-900 flex items-center gap-1">
                  <Tag size={12} /> {offer.marca}
                </div>
                {offer.tipo_bebida === mostConsumedType && (
                  <div className="absolute top-3 right-3 bg-brand-500 text-white px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider">
                    Recomendado
                  </div>
                )}
              </div>
              <div className="p-6 flex flex-col flex-1">
                <h3 className="font-bold text-lg text-slate-900 mb-2 leading-tight">{offer.titulo}</h3>
                <p className="text-slate-600 text-sm mb-6 flex-1">{offer.descripcion}</p>
                
                <div className="mt-auto">
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 flex justify-between items-center mb-3">
                    <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Código</span>
                    <span className="font-mono font-bold text-brand-600">{offer.codigo}</span>
                  </div>
                  <button className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-medium py-2.5 rounded-lg transition-colors text-sm">
                    Canjear Oferta <ExternalLink size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
