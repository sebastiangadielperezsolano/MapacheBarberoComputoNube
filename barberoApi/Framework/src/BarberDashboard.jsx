import React from 'react';
import './BarberDashboard.css';

const BarberDashboard = () => {
  // Datos simulados basados en el prototipo de Figma
  const appointments = [
    { time: '09:00', name: 'Lucas Cruz', initials: 'LC', service: 'Corte clásico', duration: '45 min' },
    { time: '09:45', name: 'Mateo Ruiz', initials: 'MR', service: 'Afeitado + corte', duration: '60 min' },
    { time: '10:45', name: 'Sofía Gómez', initials: 'SG', service: 'Peinado barba', duration: '75 min' }
  ];

  return (
    <div className="dashboard-container">
      {/* Encabezado */}
      <header className="dashboard-header">
        <div className="header-info">
          <h2>Hola, Vieja confiable</h2>
          <p>Gestiona tu agenda, revisa el rendimiento del día y prepara la próxima atención desde un solo lugar.</p>
        </div>
        <div className="profile-avatar">B</div>
      </header>

      {/* Grid de Métricas */}
      <section className="metrics-grid">
        <div className="metric-card">
          <span className="icon">✓</span>
          <div className="metric-info">
            <h4>Turnos completados</h4>
            <p className="highlight">8</p>
            <small>2 pendientes por confirmar</small>
          </div>
        </div>
        <div className="metric-card">
          <span className="icon">📅</span>
          <div className="metric-info">
            <h4>Agenda diaria</h4>
            <p className="highlight">12 clientes programados</p>
            <small>2 turnos próximos</small>
          </div>
        </div>
        <div className="metric-card">
          <span className="icon">💰</span>
          <div className="metric-info">
            <h4>Ingreso del día</h4>
            <p className="highlight">$184</p>
            <small>3 pagos pendientes</small>
          </div>
        </div>
        <div className="metric-card">
          <span className="icon">👥</span>
          <div className="metric-info">
            <h4>Clientes hoy</h4>
            <p className="highlight">12</p>
            <small>4 nuevos registros</small>
          </div>
        </div>
        <div className="metric-card full-width">
          <span className="icon">📊</span>
          <div className="metric-info">
            <h4>Ocupación</h4>
            <p className="highlight">82%</p>
            <small>2 franjas disponibles</small>
          </div>
        </div>
      </section>

      {/* Sección de Agenda Rápida */}
      <section className="agenda-section">
        <div className="agenda-header">
          <div>
            <h3>Hoy 09:00 - 19:00</h3>
            <p>2 turnos próximos</p>
          </div>
          <div className="agenda-actions">
            <button className="btn-text">Ver agenda</button>
            <button className="btn-primary-small">+ Nuevo turno</button>
          </div>
        </div>

        <div className="appointments-list">
          {appointments.map((apt, index) => (
            <div className="appointment-card" key={index}>
              <div className="appointment-time">{apt.time}</div>
              <div className="appointment-avatar">{apt.initials}</div>
              <div className="appointment-details">
                <h4>{apt.name}</h4>
                <p>{apt.service} • {apt.duration}</p>
              </div>
            </div>
          ))}
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
          <span>Agenda</span>
        </button>
        <button className="nav-item">
          <span className="nav-icon">👥</span>
          <span>Clientes</span>
        </button>
        <button className="nav-item">
          <span className="nav-icon">👤</span>
          <span>Perfil</span>
        </button>
      </nav>
    </div>
  );
};

export default BarberDashboard;