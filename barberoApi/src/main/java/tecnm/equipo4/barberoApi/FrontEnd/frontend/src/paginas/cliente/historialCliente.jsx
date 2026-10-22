import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Scissors, CheckCircle, XCircle } from 'lucide-react';

const API_BASE = 'http://localhost:8081/api';

export default function HistorialCliente() {
  const navigate = useNavigate();

  const [usuario] = useState(() => {
    try {
      const sesion = localStorage.getItem('usuario');
      return sesion ? JSON.parse(sesion) : null;
    } catch {
      return null;
    }
  });

  const [turnos, setTurnos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (!usuario || !usuario.id_usuario) {
      navigate('/iniciar-sesion');
      return;
    }

    fetch(`${API_BASE}/turnos/cliente/${usuario.id_usuario}`)
      .then(res => res.json())
      .then(data => setTurnos(data))
      .catch(err => console.error('Error al cargar historial:', err))
      .finally(() => setCargando(false));
  }, [usuario, navigate]);

  return (
    <div className="min-h-screen bg-[#0e1411] text-gray-200 p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={() => navigate('/cliente')} 
          className="flex items-center gap-1.5 text-xs text-[#d97706] hover:underline mb-6 inline-flex"
        >
          <ArrowLeft size={14} /> Volver al Panel
        </button>

        <h1 className="text-2xl font-bold text-white mb-1">Historial de Turnos</h1>
        <p className="text-xs text-gray-400 mb-6">Registro de todas tus citas pasadas y activas.</p>

        {cargando ? (
          <p className="text-gray-400 text-xs">Cargando citas de la base de datos...</p>
        ) : turnos.length === 0 ? (
          <div className="bg-[#151d18] border border-[#232f27] p-8 rounded-2xl text-center text-gray-400 text-xs">
            No tienes turnos registrados aún.
          </div>
        ) : (
          <div className="space-y-3">
            {turnos.map((t) => (
              <div 
                key={t.idTurno} 
                className="bg-[#151d18] border border-[#232f27] p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
              >
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-white text-sm">
                      {t.notasCliente || `Turno #${t.idTurno}`}
                    </span>
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                      t.estado === 'CONFIRMADO' 
                        ? 'bg-green-950/80 text-green-400 border border-green-800' 
                        : 'bg-red-950/80 text-red-400 border border-red-800'
                    }`}>
                      {t.estado === 'CONFIRMADO' ? <CheckCircle size={10} /> : <XCircle size={10} />}
                      {t.estado}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-400 mt-2">
                    <span className="flex items-center gap-1"><Calendar size={13} className="text-[#d97706]" /> {t.fecha}</span>
                    <span className="flex items-center gap-1"><Clock size={13} className="text-[#d97706]" /> {t.horaInicio ? String(t.horaInicio).substring(0, 5) : '18:30'}</span>
                    <span>Sucursal: {t.sucursal || 'Centro'}</span>
                  </div>
                </div>

                <div className="text-right text-xs">
                  <span className="text-gray-400 block">Barbero asignado</span>
                  <span className="text-white font-semibold">Bruno</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}