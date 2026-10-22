import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, CheckCircle, XCircle } from 'lucide-react';

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
    <div className="min-h-screen bg-[#111613] text-gray-200 p-6 md:p-10 font-sans relative overflow-hidden select-none">
      
      {/* Círculos sólidos de fondo Figma */}
      <div className="absolute -top-44 -right-32 w-[550px] h-[550px] bg-[#18221b] rounded-full pointer-events-none z-0"></div>
      <div className="absolute -bottom-48 -left-32 w-[480px] h-[480px] bg-[#18221b] rounded-full pointer-events-none z-0"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* Header con botón y logo */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/cliente')}>
            <div className="w-12 h-12 bg-[#213026] border border-[#2d4034] rounded-2xl flex items-center justify-center shadow-lg shadow-black/30">
              <span className="text-2xl filter drop-shadow">🦝</span>
            </div>
            <div>
              <span className="text-[10px] font-black tracking-widest text-[#d97706] uppercase block">
                El Mapache Bigotón
              </span>
              <span className="text-xl font-extrabold text-white tracking-wide">
                BarberApp
              </span>
            </div>
          </div>

          <button 
            onClick={() => navigate('/cliente')} 
            className="flex items-center gap-1.5 text-xs text-[#d97706] hover:underline"
          >
            <ArrowLeft size={14} /> Volver al panel
          </button>
        </div>

        {/* Título de la sección */}
        <div className="mb-6">
          <span className="text-[10px] font-black uppercase text-[#d97706] tracking-wider block mb-1">
            Mis Citas
          </span>
          <h1 className="text-3xl font-black text-white tracking-tight">Historial de Turnos</h1>
          <p className="text-xs text-gray-400 mt-1">
            Registro de todas tus citas pasadas y activas sincronizadas con la barbería.
          </p>
        </div>

        {/* Lista de citas */}
        {cargando ? (
          <p className="text-gray-400 text-xs">Cargando citas de la base de datos...</p>
        ) : turnos.length === 0 ? (
          <div className="bg-[#18211b]/95 border border-[#25332a] p-10 rounded-3xl text-center text-gray-400 text-xs shadow-2xl backdrop-blur-md">
            No tienes turnos registrados aún.
          </div>
        ) : (
          <div className="space-y-4">
            {turnos.map((t) => (
              <div 
                key={t.idTurno} 
                className="bg-[#18211b]/95 border border-[#25332a] hover:border-[#ea8536]/40 p-6 rounded-3xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition shadow-xl backdrop-blur-md"
              >
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-white text-base">
                      {t.notasCliente || `Turno #${t.idTurno}`}
                    </span>
                    <span className={`text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5 ${
                      t.estado === 'CONFIRMADO' 
                        ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800' 
                        : 'bg-red-950/80 text-red-400 border border-red-800'
                    }`}>
                      {t.estado === 'CONFIRMADO' ? <CheckCircle size={11} /> : <XCircle size={11} />}
                      {t.estado}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-400 mt-2.5">
                    <span className="flex items-center gap-1.5">
                      <Calendar size={13} className="text-[#ea8536]" /> {t.fecha}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock size={13} className="text-[#ea8536]" /> {t.horaInicio ? String(t.horaInicio).substring(0, 5) : '18:30'}
                    </span>
                    <span>Sucursal: {t.sucursal || 'Centro'}</span>
                  </div>
                </div>

                {/* Mostrar el barbero real asignado a la cita */}
                <div className="text-right text-xs bg-[#141b16] border border-[#25332a] px-4 py-2.5 rounded-2xl self-end sm:self-center">
                  <span className="text-gray-500 block text-[10px] uppercase font-bold">Barbero</span>
                  <span className="text-white font-bold text-xs capitalize">
                    {t.nombreBarbero || 'Barbero Asignado'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}