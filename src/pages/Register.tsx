import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mountain } from 'lucide-react';
import toast from 'react-hot-toast';

export function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register, login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim() || !email.trim()) return;

    try {
      // 1. Crear nuevo usuario en Supabase Auth
      await register(email.trim(), password);

      try {
        // 2. Intentar loguearse de una vez (gracias al trigger en la DB de auto-activar emails)
        await login(email.trim(), password);
        toast.success('Cuenta creada exitosamente');
        navigate('/');
      } catch (e) {
        // Fallback si por seguridad el backend igual requiere ir al login normal
        toast.success('Cuenta creada, por favor inicia sesión');
        navigate('/login');
      }
    } catch (error: any) {
      toast.error(error.message || 'Error al registrar la cuenta');
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
          Crea tu cuenta
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          O{' '}
          <Link to="/login" className="font-medium text-brand-600 hover:text-brand-500">
            inicia sesión si ya tienes una
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-slate-200">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                Correo electrónico
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                Contraseña
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-colors"
              >
                Registrarse
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
