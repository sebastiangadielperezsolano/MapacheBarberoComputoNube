import React, { useState } from 'react';
import './ClientBooking.css';

const ClientBooking = () => {
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState('HOY');
  const [selectedTime, setSelectedTime] = useState(null);

  const services = [
    { id: 1, name: 'Corte clásico', duration: '45 min', price: '$38' },
    { id: 2, name: 'Corte + barba', duration: '60 min', price: '$48' },
    { id: 3, name: 'Afeitado + corte', duration: '60 min', price: '$52' },
    { id: 4, name: 'Peinado + barba', duration: '50 min', price: '$42' },
    { id: 5, name: 'Corte degradado', duration: '45 min', price: '$40' }
  ];

  const dates = [
    { day: 'HOY', number: '20', month: 'Marzo' },
    { day: 'SAB', number: '21', month: 'Marzo' },
    { day: 'LUN', number: '23', month: 'Marzo' },
    { day: 'MAR', number: '24', month: 'Marzo' }
  ];

  const timesMorning = ['09:00', '09:45', '10:30', '11:15'];
  const timesAfternoon = ['14:00', '15:30', '17:00', '18:30'];

  return (
    <div className="booking-container">
      <header className="booking-header">
        <span className="brand-subtitle">EL MAPACHE BIGOTÓN</span>
        <h2 className="screen-title">NUEVO TURNO</h2>
        <h1 className="main-title">Agendar tu cita</h1>
        <p className="screen-desc">Ingresa tus datos, elige el servicio que deseas y selecciona la hora más conveniente para tu estilo.</p>
      </header>

      <form className="booking-form">
        {/* Datos del cliente */}
        <section className="form-section">
          <div className="input-group">
            <input type="text" placeholder="Nombre completo (Ej. Mateo Ruiz)" className="dark-input" />
            <input type="tel" placeholder="Número de teléfono (Ej. +52 222 123 4567)" className="dark-input" />
          </div>
        </section>

        {/* Selección de Servicio */}
        <section className="form-section">
          <h3 className="section-title">Elige el servicio</h3>
          <p className="section-subtitle">Todos nuestros servicios incluyen lavado de cabello y bebida de cortesía.</p>
          
          <div className="services-grid">
            {services.map(service => (
              <div 
                key={service.id} 
                className={`service-card ${selectedService === service.id ? 'active' : ''}`}
                onClick={() => setSelectedService(service.id)}
              >
                <div className="service-info">
                  <h4>{service.name}</h4>
                  <small>{service.duration}</small>
                </div>
                <div className="service-price">{service.price}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Selección de Fecha y Hora */}
        <section className="form-section">
          <h3 className="section-title">Selección de fecha y hora</h3>
          
          <div className="dates-row">
            {dates.map((date, index) => (
              <div 
                key={index} 
                className={`date-card ${selectedDate === date.day ? 'active' : ''}`}
                onClick={() => setSelectedDate(date.day)}
              >
                <span className="date-day">{date.day}</span>
                <span className="date-number">{date.number}</span>
                <span className="date-month">{date.month}</span>
              </div>
            ))}
          </div>

          <div className="times-container">
            <h4 className="time-period">MAÑANA</h4>
            <div className="times-grid">
              {timesMorning.map(time => (
                <button 
                  type="button" 
                  key={time} 
                  className={`time-btn ${selectedTime === time ? 'active' : ''}`}
                  onClick={() => setSelectedTime(time)}
                >
                  {time}
                </button>
              ))}
            </div>

            <h4 className="time-period">TARDE</h4>
            <div className="times-grid">
              {timesAfternoon.map(time => (
                <button 
                  type="button" 
                  key={time} 
                  className={`time-btn ${selectedTime === time ? 'active' : ''}`}
                  onClick={() => setSelectedTime(time)}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Notas adicionales */}
        <section className="form-section">
          <h3 className="section-title">Atención personalizada</h3>
          <p className="section-subtitle">Si tienes dudas sobre qué corte elegir, tu barbero te guiará al inicio del turno según tus rasgos y objetivos de estilo.</p>
          <textarea 
            className="dark-input textarea-input" 
            placeholder="Detalles adicionales o notas especiales (Ej. Preferencia por navaja tradicional, detalles sobre barba, etc.)"
            rows="4"
          ></textarea>
        </section>

        <button type="button" className="btn-primary submit-btn">Confirmar turno</button>
      </form>
    </div>
  );
};

export default ClientBooking;