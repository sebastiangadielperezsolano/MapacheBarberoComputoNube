import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Inicio from './paginas/publica/inicio';
import InicioSesion from './paginas/publica/inicioSesion';
import Registro from './paginas/publica/registro';

import InicioCliente from './paginas/cliente/inicioCliente';
import RegistroCita from './paginas/cliente/registroCita';
import HistorialCliente from './paginas/cliente/historialCliente';
import ConfiguracionCliente from './paginas/cliente/configuracionCliente';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/iniciar-sesion" element={<InicioSesion />} />
        <Route path="/registro" element={<Registro />} />

        {/* Módulo Cliente */}
        <Route path="/cliente" element={<InicioCliente />} />
        <Route path="/cliente/agendar" element={<RegistroCita />} />
        <Route path="/cliente/historial" element={<HistorialCliente />} />
        <Route path="/cliente/configuracion" element={<ConfiguracionCliente />} />

        <Route path="*" element={<Navigate to="/iniciar-sesion" replace />} />
      </Routes>
    </Router>
  );
}