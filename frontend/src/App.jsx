import React, { useState } from 'react';
import Home                   from './components/Home';
import Login                  from './components/Login';
import EmployeeRegistration   from './components/EmployeeRegistration';
import AdminDashboard         from './components/AdminDashboard';
import EmployeeDashboard      from './components/Employeedashboard';
import OtpVerification        from './components/OtpVerification';
import NewPassword            from './components/NewPassword';
import ForgotPassword           from './components/ForgotPassword';
import Inscriptions            from './components/Inscriptions';
// ─────────────────────────────────────────────────────────────
// Vues possibles :
//   'home'         → page d'accueil publique
//   'login'        → connexion (admin + employé)
//   'register'     → formulaire inscription employé
//   'admin'        → tableau de bord administrateur
//   'employee'     → tableau de bord employé
// ─────────────────────────────────────────────────────────────

export default function App() {
  const [view, setView]   = useState('home');
  const [user, setUser]   = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);

  

  // ── Connexion réussie → dispatch selon le rôle ───────────────────────────
  const handleLogin = (userData) => {
    setUser(userData);
    if (userData.role === 'ADMIN') {
      setView('admin');
    } else {
      setView('employee');
    }
  };

  // ── Déconnexion ──────────────────────────────────────────────────────────
  const handleLogout = () => {
    setUser(null);
    setView('home');
    setSelectedRole(null);
  };

  const handleChangePassword = () => {
    setView(user.role === 'ADMIN' ? 'admin' : 'employee');
  };

  // ── Routing ──────────────────────────────────────────────────────────────
  if (view === 'home') {
    return (
      <Home
        onAdminLogin={() => { setSelectedRole('admin'); setView('login'); }}
        onEmployeeLogin={() => { setSelectedRole('employee'); setView('login'); }}
        onEmployeeRegister={() => { setSelectedRole('employee'); setView('register'); }}
      />
    );
  }

  if (view === 'login') {
    return (
      <Login
        role={selectedRole}
        onLogin={handleLogin}
        onCancel={() => {
          setView('home');
          setSelectedRole(null);
        }}
        onRegisterClick={() => { setSelectedRole('employee'); setView('register'); }}
      />
    );
  }

  if (view === 'register') {
    return (
      <EmployeeRegistration
        onCancel={() => setView('home')}
        onSuccess={() => setView('home')}
      />
    );
  }

  if (view === 'admin') {
    return (
      <AdminDashboard
        user={user}
        onLogout={handleLogout}
      />
    );
  }

  if (view === 'employee') {
    return (
      <EmployeeDashboard
        user={user}
        onLogout={handleLogout}
      />
    );
  }

  return null;
}