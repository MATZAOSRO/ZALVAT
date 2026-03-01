import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mountain } from 'lucide-react';
import toast from 'react-hot-toast';

const COUNTRY_CODES = [
  { code: '+57', country: 'Colombia' },
  { code: '+52', country: 'México' },
  { code: '+54', country: 'Argentina' },
  { code: '+56', country: 'Chile' },
  { code: '+51', country: 'Perú' },
  { code: '+58', country: 'Venezuela' },
  { code: '+593', country: 'Ecuador' },
  { code: '+507', country: 'Panamá' },
  { code: '+506', country: 'Costa Rica' },
  { code: '+34', country: 'España' },
  { code: '+1', country: 'US/Canada' },
  { code: '+55', country: 'Brasil' },
];

export function Onboarding() {
  const { user, updateOnboarding } = useAuth();
  const [nombre, setNombre] = useState(user?.nombre || '');
  const [peso, setPeso] = useState(user?.peso?.toString() || '');
  const [altura, setAltura] = useState(user?.altura?.toString() || '');
  const [phone, setPhone] = useState(user?.phone?.replace(/^\+\d+\s/, '') || '');
  const [countryCode, setCountryCode] = useState('+57');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const pesoNum = parseFloat(peso);
    const alturaNum = parseFloat(altura);

    if (pesoNum > 0 && alturaNum > 0 && nombre.trim() && phone.trim()) {
      try {
        await updateOnboarding(nombre.trim(), pesoNum, alturaNum, `${countryCode} ${phone}`);
        toast.success('Perfil completado');
        navigate('/');
      } catch (error: any) {
        toast.error(error.message || 'Error al guardar la información');
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-slate-600 to-slate-800 text-white shadow-lg shadow-slate-900/20">
            <Mountain size={28} />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900">
          Completa tu perfil
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Para brindarte mejores recomendaciones, necesitamos un par de datos más.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-slate-200">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="nombre" className="block text-sm font-medium text-slate-700">
                Nombre o Apodo
              </label>
              <div className="mt-1">
                <input
                  id="nombre"
                  name="nombre"
                  type="text"
                  required
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
                  placeholder="Ej: Alex"
                />
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-slate-700">
                Número de celular
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-slate-300 bg-slate-50 text-slate-500 sm:text-sm focus:outline-none focus:ring-brand-500 focus:border-brand-500"
                >
                  {COUNTRY_CODES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.code} ({c.country})
                    </option>
                  ))}
                </select>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="300 000 0000"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="flex-1 appearance-none block w-full px-3 py-2 border border-slate-300 rounded-none rounded-r-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="peso" className="block text-sm font-medium text-slate-700">
                Peso (kg)
              </label>
              <div className="mt-1">
                <input
                  id="peso"
                  name="peso"
                  type="number"
                  step="0.1"
                  min="30"
                  max="300"
                  required
                  value={peso}
                  onChange={(e) => setPeso(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
                  placeholder="Ej: 70"
                />
              </div>
            </div>

            <div>
              <label htmlFor="altura" className="block text-sm font-medium text-slate-700">
                Altura (cm)
              </label>
              <div className="mt-1">
                <input
                  id="altura"
                  name="altura"
                  type="number"
                  step="1"
                  min="100"
                  max="250"
                  required
                  value={altura}
                  onChange={(e) => setAltura(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
                  placeholder="Ej: 175"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-slate-800 hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 transition-colors"
              >
                Continuar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
