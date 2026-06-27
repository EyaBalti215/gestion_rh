import React, { useState } from 'react';
import Home                 from './components/Home';
import Login                from './components/Login';
import AdminDashboard       from './components/AdminDashboard';
import EmployeeRegistration from './components/EmployeeRegistration';
import ForgotPassword       from './components/ForgotPassword';
import OtpVerification      from './components/OtpVerification';

/*
  VUES POSSIBLES :
  'home'           → Page d'accueil
  'login'          → Page de connexion
  'forgot'         → Formulaire "Mot de passe oublié"
  'otp'            → Saisie du code OTP
  'adminDashboard' → Tableau de bord admin
  'register'       → Inscription employé
*/

export default function App() {
  const [view, setView]       = useState('home');
  const [user, setUser]       = useState(null);
  const [otpEmail, setOtpEmail] = useState('');

  // ── Handlers ────────────────────────────────────────────────

  const handleLogin = (userData) => {
    setUser(userData);
    setView(userData.role === 'admin' ? 'adminDashboard' : 'home');
  };

  const handleLogout = () => {
    setUser(null);
    setView('home');
  };

  // Depuis Login : clic sur "Mot de passe oublié ?"
  const handleForgotPassword = (prefillEmail = '') => {
    setOtpEmail(prefillEmail);
    setView('forgot');
  };

  // Depuis ForgotPassword : OTP envoyé avec succès
  const handleOtpSent = (email) => {
    setOtpEmail(email);
    setView('otp');
  };

  // Depuis OtpVerification : code validé
  const handleOtpVerified = (email) => {
    // Dans une vraie app : rediriger vers un formulaire "nouveau mot de passe"
    // Pour la démo : on revient à login avec un message de succès
    alert(`✅ Identité vérifiée pour ${email}.\nVous pouvez maintenant vous reconnecter.`);
    setView('login');
  };

  // ── Rendu ────────────────────────────────────────────────────

  if (view === 'home') {
    return (
      <Home
        onLoginClick={() => setView('login')}
        onRegisterClick={() => setView('register')}
      />
    );
  }

  if (view === 'login') {
    return (
      <Login
        onLogin={handleLogin}
        onCancel={() => setView('home')}
        onRegisterClick={() => setView('register')}
        onForgotPassword={handleForgotPassword}   /* ← nouveau prop */
      />
    );
  }

  if (view === 'forgot') {
    return (
      <ForgotPassword
        onBack={() => setView('login')}
        onOtpSent={handleOtpSent}
      />
    );
  }

  if (view === 'otp') {
    return (
      <OtpVerification
        email={otpEmail}
        onBack={() => setView('forgot')}
        onVerified={handleOtpVerified}
      />
    );
  }

  if (view === 'adminDashboard') {
    return (
      <AdminDashboard
        user={user}
        onLogout={handleLogout}
      />
    );
  }

  if (view === 'register') {
    return (
      <EmployeeRegistration
        onBack={() => setView('home')}
        onSuccess={() => setView('login')}
      />
    );
  }

  return null;
}