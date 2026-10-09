import React from 'react';
import './WelcomeScreen.css';

const WelcomeScreen = () => {
  return (
    <div className="welcome-container">
      <div className="welcome-content">
        <h2 className="brand-subtitle">EL MAPACHE BIGOTÓN</h2>
        
        <div className="welcome-text">
          <h3>Bienvenido al<br/>Mapache Bigotón</h3>
          <p>Tu estilo, tu tiempo.</p>
        </div>

        <div className="action-buttons">
          <button className="btn-primary">
            <span className="icon">→]</span> Iniciar sesión
          </button>
          <button className="btn-secondary">
            <span className="icon">👤+</span> Registrarse
          </button>
        </div>

        <p className="terms-text">
          Al continuar aceptas nuestros términos y política de privacidad.
        </p>
      </div>
    </div>
  );
};

export default WelcomeScreen;