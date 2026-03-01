import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Analytics } from './pages/Analytics';
import { History } from './pages/History';
import { Promotions } from './pages/Promotions';
import { Settings } from './pages/Settings';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Onboarding } from './pages/Onboarding';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import { Toaster } from 'react-hot-toast';

function ProtectedRoute() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (!user.peso || !user.altura || !user.nombre || !user.phone) return <Navigate to="/onboarding" />;
  return <Layout><Outlet /></Layout>;
}

function OnboardingRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (user.peso && user.altura && user.nombre && user.phone) return <Navigate to="/" />;
  return <>{children}</>;
}

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/onboarding" element={<OnboardingRoute><Onboarding /></OnboardingRoute>} />
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/history" element={<History />} />
              <Route path="/promotions" element={<Promotions />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
          </Routes>
        </Router>
        <Toaster position="top-right" />
      </AppProvider>
    </AuthProvider>
  );
}
