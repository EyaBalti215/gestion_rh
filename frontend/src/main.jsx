import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Rendre le body visible après que React a monté l'application
if (typeof document !== 'undefined') {
  // nextTick pour s'assurer du montage
  requestAnimationFrame(() => {
    document.body.style.visibility = 'visible';
  });
}
