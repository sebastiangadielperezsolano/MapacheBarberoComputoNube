import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, CheckCircle, XCircle, AlertCircle, Scissors, User } from 'lucide-react';

const API_BASE = 'http://localhost:8080';

export default function HistorialCliente() {
  const navigate = useNavigate();

  const [usuario] = useState(() => {
    try {
      const sesion = localStorage.getItem('usuarioSesion') || localStorage.getItem('usuario');
      return sesion ? JSON.parse(sesion) : null;
    } catch {
      return null;
    }
  });

  const [turnos, setTurnos] = useState([]);
  const [cargando, setCargando] = useState(true);

  const idClienteSesion = usuario?.idUsuario || usuario?.idCliente || usuario?.id_usuario || usuario?.id;

  useEffect(() => {
    if (!usuario || !idClienteSesion) {
      navigate('/login');
      return;
    }

    const cargarHistorial = async () => {
      setCargando(true);

      const endpointsToTry = [
        `${API_BASE}/api/turnos/cliente/${idClienteSesion}`,
        `${API_BASE}/turnos/cliente/${idClienteSesion}`,
        `${API_BASE}/api/turnos`,
        `${API_BASE}/turnos`
      ];

      let data = null;

      for (const url of endpointsToTry) {
        try {
          const res = await fetch(url);
          if (res.ok) {
            data = await res.json();
            break;
          }
        } catch (e) {
        }
      }

      if (Array.isArray(data)) {
        const targetId = Number(idClienteSesion);

        const misTurnos = data.filter(t => {
          const idClientePlano = Number(t.idCliente);
          const idClienteObjeto = Number(t.cliente?.idCliente || t.cliente?.idUsuario || t.cliente?.id);
          return idClientePlano === targetId || idClienteObjeto === targetId;
        });

        setTurnos(misTurnos.length > 0 ? misTurnos : data);
      }

      setCargando(false);
    };

    cargarHistorial();
  }, [usuario, navigate, idClienteSesion]);

  const renderBadgeEstado = (estado) => {
    const est = (estado || 'PENDIENTE').toUpperCase();
    if (est === 'CONFIRMADO' || est === 'COMPLETADO') {
      return (
          <span className="text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
          <CheckCircle size={12} />
            {est}
        </span>
      );
    } else if (est === 'CANCELADO') {
      return (
          <span className="text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1 bg-red-500/10 text-red-400 border border-red-500/30">
          <XCircle size={12} />
            {est}
        </span>
      );
    } else {
      return (
          <span className="text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1 bg-[#E08A3E]/10 text-[#E08A3E] border border-[#E08A3E]/30">
          <AlertCircle size={12} />
            {est}
        </span>
      );
    }
  };

  return (
      <div className="relative min-h-screen w-full bg-[#111713] text-white font-sans p-6 sm:p-12 overflow-x-hidden flex flex-col justify-between">
        <div className="absolute top-[-150px] right-[-150px] w-[700px] h-[700px] bg-[#1A251D] rounded-full opacity-40 pointer-events-none" />
        <div className="absolute bottom-[-150px] left-[-150px] w-[700px] h-[700px] bg-[#1A251D] rounded-full opacity-40 pointer-events-none" />

        <div className="relative z-10 w-full flex-1 flex flex-col">
          <header className="flex items-center justify-between mb-8 pb-4 border-b border-[#2D3E31] w-full">
            <div className="flex items-center gap-3">
              <button
                  onClick={() => navigate('/cliente')}
                  className="w-10 h-10 bg-[#1A251D] border border-[#2D3E31] rounded-xl flex items-center justify-center hover:bg-[#25352a] text-gray-300 transition-colors cursor-pointer"
                  title="Volver al Panel"
              >
                <ArrowLeft size={18} />
              </button>
              <div className="w-12 h-12 bg-[#1A251D] border border-[#2D3E31] rounded-2xl flex items-center justify-center p-2 shadow-inner">
                <img src="/racoon_1.png" alt="El Mapache Bigotón" className="w-full h-full object-contain" />
              </div>
              <div>
              <span className="block text-[10px] tracking-widest text-[#E08A3E] font-bold uppercase">
                El Mapache Bigotón
              </span>
                <h1 className="text-xl font-bold tracking-tight text-white leading-none">
                  Historial de Turnos
                </h1>
              </div>
            </div>
          </header>

          <div className="mb-6">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">Tus Citas Registradas</h2>
            <p className="text-xs text-gray-400 mt-1">
              Consulta los detalles de tus turnos programados, estado del servicio y barbero asignado.
            </p>
          </div>

          {cargando ? (
              <div className="bg-[#1A251D] border border-[#2D3E31] p-8 rounded-2xl text-center text-xs text-gray-400 w-full">
                Cargando historial de citas...
              </div>
          ) : turnos.length === 0 ? (
              <div className="bg-[#1A251D] border border-[#2D3E31] p-12 rounded-2xl text-center flex flex-col items-center justify-center w-full my-auto">
                <Scissors size={40} className="text-[#E08A3E] mb-3 opacity-60" />
                <h3 className="text-sm font-bold text-white mb-1">Sin turnos en tu historial</h3>
                <p className="text-xs text-gray-400 max-w-sm">
                  Actualmente no cuentas con registros de citas anteriores o agendadas en tu perfil.
                </p>
              </div>
          ) : (
              <div className="flex flex-col gap-4 w-full">
                {turnos.map((t, idx) => {
                  const barberoNombre = t.barbero?.nombreCompleto || t.barberoNombre || 'Barbero asignado';
                  const servicioNombre = t.servicio?.nombreServicio || t.servicioNombre || t.notasCliente || 'Servicio de barbería';
                  const hora = t.horaInicio ? String(t.horaInicio).substring(0, 5) : '09:00';

                  return (
                      <div
                          key={t.idTurno || idx}
                          className="bg-[#1A251D] border border-[#2D3E31] p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-[#E08A3E]/50 transition-colors shadow-lg w-full"
                      >
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-3 mb-2">
                      <span className="font-bold text-white text-sm sm:text-base">
                        {servicioNombre}
                      </span>
                            {renderBadgeEstado(t.estado)}
                          </div>

                          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400 mt-3">
                      <span className="flex items-center gap-1.5 bg-[#111713] border border-[#2D3E31] px-3 py-1 rounded-lg">
                        <Calendar size={13} className="text-[#E08A3E]" />
                        {t.fecha || 'Fecha pendiente'}
                      </span>
                            <span className="flex items-center gap-1.5 bg-[#111713] border border-[#2D3E31] px-3 py-1 rounded-lg">
                        <Clock size={13} className="text-[#E08A3E]" />
                              {hora} hs
                      </span>
                            <span className="text-gray-400">
                        Sucursal: <strong className="text-gray-200">{t.sucursal || 'Centro'}</strong>
                      </span>
                          </div>
                        </div>

                        <div className="text-left sm:text-right border-t sm:border-t-0 border-[#2D3E31] pt-3 sm:pt-0 w-full sm:w-auto flex sm:flex-col justify-between items-center sm:items-end">
                          <span className="text-[10px] text-gray-400 block uppercase tracking-wider">Barbero</span>
                          <span className="text-xs text-[#E08A3E] font-bold flex items-center gap-1">
                      <User size={13} />
                            {barberoNombre}
                    </span>
                        </div>
                      </div>
                  );
                })}
              </div>
          )}
        </div>

        <footer className="relative z-10 p-4 text-center text-xs text-gray-600 mt-8">
          El Mapache Bigotón &copy; BarberApp
        </footer>
      </div>
  );
}