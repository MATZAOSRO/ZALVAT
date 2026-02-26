import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BarChart2, 
  List, 
  Gift,
  Settings,
  Mountain,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import clsx from 'clsx';
import { useAuth } from '../context/AuthContext';
import { ChatbotWidget } from './ChatbotWidget';

const navItems = [
  { path: "/", icon: LayoutDashboard, label: "Panel" },
  { path: "/analytics", icon: BarChart2, label: "Estadísticas" },
  { path: "/history", icon: List, label: "Historial" },
  { path: "/promotions", icon: Gift, label: "Promociones" },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full bg-slate-50 text-slate-900">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 z-30 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-slate-600 to-slate-800 text-white shadow-sm">
            <Mountain size={18} />
          </div>
          <h1 className="font-display text-lg font-bold tracking-tight text-slate-900">ZALVA-T</h1>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(true)}
          className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-slate-900/50 z-40 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={clsx(
        "flex flex-col w-72 justify-between border-r border-slate-200 bg-white p-4 h-screen fixed left-0 top-0 z-50 overflow-y-auto transition-transform duration-300 ease-in-out md:translate-x-0",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col gap-8">
          {/* Logo & Close Button */}
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-slate-600 to-slate-800 text-white shadow-lg shadow-slate-900/20">
                <Mountain size={24} />
              </div>
              <div className="flex flex-col">
                <h1 className="font-display text-lg font-bold tracking-tight text-slate-900">ZALVA-T</h1>
                <span className="text-xs font-medium text-slate-500">Bienestar y Equilibrio</span>
              </div>
            </div>
            <button 
              className="md:hidden p-2 text-slate-400 hover:text-slate-600 rounded-lg"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <X size={20} />
            </button>
          </div>
          
          {/* Navigation Links */}
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={clsx(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors",
                    isActive
                      ? "bg-brand-50 text-brand-700 font-semibold"
                      : "text-slate-600 hover:bg-slate-50"
                  )}
                >
                  <Icon size={20} className={isActive ? "text-brand-600" : ""} />
                  <span className="text-sm">{item.label}</span>
                </Link>
              );
            })}
          </nav>
          
          {/* Secondary Nav */}
          <div className="flex flex-col gap-2 pt-4 border-t border-slate-200">
            <p className="px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Sistema</p>
            <Link 
              to="/settings" 
              onClick={() => setIsMobileMenuOpen(false)}
              className={clsx("flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors w-full text-left", location.pathname === '/settings' ? "bg-brand-50 text-brand-700 font-semibold" : "text-slate-600 hover:bg-slate-50")}
            >
              <Settings size={20} className={location.pathname === '/settings' ? "text-brand-600" : ""} />
              <span className="text-sm font-medium">Configuración</span>
            </Link>
            <button onClick={() => { logout(); setIsMobileMenuOpen(false); }} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-slate-600 hover:bg-slate-50 transition-colors w-full text-left">
              <LogOut size={20} />
              <span className="text-sm font-medium">Cerrar Sesión</span>
            </button>
          </div>
        </div>
        
        {/* User Profile */}
        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 mt-4">
          <div className="h-10 w-10 overflow-hidden rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold text-lg">
            {user?.nombre?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="flex flex-col overflow-hidden">
            <p className="truncate text-sm font-medium text-slate-900">{user?.nombre || 'Usuario'}</p>
            <p className="truncate text-xs text-slate-500">Miembro Activo</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 md:ml-72 flex flex-col min-h-screen pt-16 md:pt-0">
        {children}
      </div>

      {/* Floating Chatbot Widget */}
      <ChatbotWidget />
    </div>
  );
}
