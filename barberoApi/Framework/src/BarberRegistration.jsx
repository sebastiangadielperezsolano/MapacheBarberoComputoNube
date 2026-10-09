import React, { useState } from 'react';
import './BarberRegistration.css';

const BarberRegistration = () => {
  const [selectedDays, setSelectedDays] = useState(['LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SAB']);
  
  const toggleDay = (day) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter(d => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const specialties = [
    'Corte clásico',
    'Corte degradado',
    'Corte + barba',
    'Afeitado clásico',
    'Peinado barba',
    'Diseño de barba',
    'Tinte/Decoloración'
  ];

  return (
    <div className="registration-container">
      <header className="registration-header">
        <span className="brand-subtitle">EL MAPACHE BIGOTÓN</span>
        <h1 className="brand-title">BarberApp</h1>
        <h2 className="screen-title">Registro de Barbero</h2>
        <p className="screen-desc">Completa tu perfil profesional para unirte al equipo.</p>
      </header>

      <form className="registration-form">
        {/* Sección: Datos Personales */}
        <section className="form-section">
          <h3 className="section-title">DATOS PERSONALES</h3>
          <div className="input-group">
            <input type="text" placeholder="Nombre completo" className="dark-input" />
            <input type="email" placeholder="Correo electrónico" className="dark-input" />
            <input type="tel" placeholder="Teléfono" className="dark-input" />
            <input type="number" placeholder="Años de experiencia" className="dark-input" />
          </div>
        </section>

        {/* Sección: Disponibilidad Horaria */}
        <section className="form-section">
          <h3 className="section-title">DISPONIBILIDAD HORARIA</h3>
          <div className="days-selector">
            {['LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SAB'].map(day => (
              <button 
                type="button" 
                key={day} 
                className={`day-btn ${selectedDays.includes(day) ? 'active' : ''}`}
                onClick={() => toggleDay(day)}
              >
                {day}
              </button>
            ))}
          </div>
          <div className="time-inputs">
            <div className="time-field">
              <label>Hora de entrada</label>
              <input type="time" defaultValue="08:00" className="dark-input time-input" />
            </div>
            <div className="time-field">
              <label>Hora de salida</label>
              <input type="time" defaultValue="18:00" className="dark-input time-input" />
            </div>
          </div>
        </section>

        {/* Sección: Especialidades */}
        <section className="form-section">
          <h3 className="section-title">ESPECIALIDADES / CORTES CON EXPERIENCIA</h3>
          <p className="section-subtitle">Selecciona los cortes o servicios más frecuentes</p>
          <div className="specialties-list">
            {specialties.map(service => (
              <label key={service} className="specialty-item">
                <span>{service}</span>
                <input type="checkbox" className="custom-checkbox" />
              </label>
            ))}
          </div>
        </section>

        <button type="button" className="btn-primary submit-btn">
          Crear cuenta de barbero
        </button>
      </form>
    </div>
  );
};

export default BarberRegistration;