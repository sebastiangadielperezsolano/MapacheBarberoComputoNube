import React from 'react';
import './ClientDashboard.css';

const ClientDashboard = () => {
  return (
    <div className="dashboard-container">
      {/* Encabezado */}
      <header className="dashboard-header">
        <div className="header-info">
          <h2>Hola, Mateo</h2>
          <p>Tu próximo turno ya está confirmado. Revisa tu agenda, accede a tus servicios favoritos y administra tus pagos desde un solo lugar.</p>
        </div>
        <div className="profile-avatar client-avatar">M</div>
      </header>

      {/* Próximo Turno */}
      <section className="next-appointment-section">
        <h3 className="section-title">PRÓXIMO TURNO</h3>
        <div className="appointment-highlight-card">
          <div className="appointment-status">
            <span className="status-dot"></span> Confirmado para hoy
          </div>
          <h2 className="appointment-service">Corte clásico + barba</h2>
          <p className="appointment-barber">Con Bruno • 45 min</p>
          <div className="appointment-details-row">
            <div className="detail-item">
              <span className="icon">🕒</span>
              <span>18:30</span>
            </div>
            <div className="detail-item">
              <span className="icon">📍</span>
              <span>BarberApp Centro</span>
            </div>
          </div>
          
          <div className="appointment-actions">
            <button className="btn-action">
              <span className="icon">💳</span> Pago
            </button>
            <button className="btn-action">
              <span className="icon">🚶</span> Llegada
            </button>
            <button className="btn-action outline">Cancelar</button>
          </div>
        </div>
      </section>

      {/* Resumen */}
      <section className="summary-section">
        <div className="section-header">
          <h3 className="section-title">RESUMEN</h3>
          <span className="update-text">Actualizado hoy</span>
        </div>
        <div className="summary-grid">
          <div className="summary-card">
            <h4>Turnos este mes</h4>
            <p className="highlight">2</p>
          </div>
          <div className="summary-card">
            <h4>Favoritos</h4>
            <p className="highlight">3</p>
          </div>
          <div className="summary-card full-width">
            <h4>Último pago</h4>
            <p className="highlight">$1.250</p>
            <small>Tarjeta terminada en 4242</small>
          </div>
        </div>
      </section>

      {/* Accesos Rápidos */}
      <section className="quick-access-section">
        <h3 className="section-title">ACCESOS RÁPIDOS</h3>
        <div className="access-list">
          <div className="access-item">
            <div className="access-icon">📅</div>
            <div className="access-info">
              <h4>Agendar turno</h4>
              <p>Elige fecha, hora y servicio con un solo clic.</p>
            </div>
            <div className="arrow">➔</div>
          </div>
          <div className="access-item">
            <div className="access-icon">⭐</div>
            <div className="access-info">
              <h4>Mis barberos favoritos</h4>
              <p>Vuelve con Bruno u otros barberos que ya conoces.</p>
            </div>
            <div className="arrow">➔</div>
          </div>
          <div className="access-item">
            <div className="access-icon">📜</div>
            <div className="access-info">
              <h4>Historial de turnos</h4>
              <p>Revisa tus visitas pasadas y el detalle de cada servicio.</p>
            </div>
            <div className="arrow">➔</div>
          </div>
        </div>
      </section>

      {/* Barra de Navegación Inferior */}
      <nav className="bottom-nav">
        <button className="nav-item active">
          <span className="nav-icon">🏠</span>
          <span>Inicio</span>
        </button>
        <button className="nav-item">
          <span className="nav-icon">📅</span>
          <span>Mis turnos</span>
        </button>
        <button className="nav-item">
          <span className="nav-icon">⭐</span>
          <span>Favoritos</span>
        </button>
        <button className="nav-item">
          <span className="nav-icon">⚙️</span>
          <span>Ajustes</span>
        </button>
      </nav>
    </div>
  );
};

export default ClientDashboard;