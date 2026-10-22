import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Páginas públicas
import Inicio from './paginas/publica/inicio';
import InicioSesion from './paginas/publica/inicioSesion';
import Registro from './paginas/publica/registro';

// Páginas del Cliente
import InicioCliente from './paginas/cliente/inicioCliente';
import RegistroCita from './paginas/cliente/registroCita';
import HistorialCliente from './paginas/cliente/historialCliente';
import ConfiguracionCliente from './paginas/cliente/configuracionCliente';

// Páginas del Barbero
import InicioBarbero from './paginas/barbero/inicioBarbero';
import RegistroBarbero from './paginas/barbero/registroBarbero';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Rutas Públicas */}
        <Route path="/" element={<Inicio />} />
        <Route path="/iniciar-sesion" element={<InicioSesion />} />
        <Route path="/registro" element={<Registro />} />

        {/* Rutas Cliente */}
        <Route path="/cliente" element={<InicioCliente />} />
        <Route path="/cliente/agendar" element={<RegistroCita />} />
        <Route path="/cliente/historial" element={<HistorialCliente />} />
        <Route path="/cliente/configuracion" element={<ConfiguracionCliente />} />

        {/* Rutas Barbero */}
        <Route path="/barbero" element={<InicioBarbero />} />
        <Route path="/barbero/registro" element={<RegistroBarbero />} />

        {/* Redirección por defecto */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}