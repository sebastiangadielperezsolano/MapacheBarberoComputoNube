import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Home,
  Calendar,
  Heart,
  History,
  CreditCard,
  Settings,
  LogOut,
  Plus,
  Scissors
} from 'lucide-react';

const API_BASE = 'http://localhost:8080';

export default function InicioCliente() {
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

  const idCliente = usuario?.idUsuario || usuario?.idCliente || usuario?.id_usuario;

  const emailUsuario = (usuario?.email || usuario?.usuario?.email || '').toLowerCase();
  const avatarsGuardados = JSON.parse(localStorage.getItem('avatars_usuarios') || '{}');
  const fotoCliente = avatarsGuardados[emailUsuario] || usuario?.avatar || usuario?.foto || '/defecto.png';

  useEffect(() => {
    if (!usuario || !idCliente) {
      localStorage.removeItem('usuarioSesion');
      localStorage.removeItem('usuario');
      navigate('/login');
      return;
    }

    cargarTurnos();
  }, []);

  const cargarTurnos = async () => {
    setCargando(true);

    const endpointsToTry = [
      `${API_BASE}/api/turnos`,
      `${API_BASE}/turnos`,
      `${API_BASE}/api/turno`,
      `${API_BASE}/turno`
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
      const idSesionNum = Number(idCliente);

      const misTurnos = data.filter(t => {
        const idEnTurno = t.cliente?.idUsuario || t.cliente?.idCliente || t.idCliente;
        return Number(idEnTurno) === idSesionNum;
      });

      misTurnos.sort((a, b) => (b.idTurno || 0) - (a.idTurno || 0));

      setTurnos(misTurnos);
    }

    setCargando(false);
  };

  const handleCerrarSesion = () => {
    localStorage.removeItem('usuarioSesion');
    localStorage.removeItem('usuario');
    navigate('/login');
  };

  const handleCancelarTurno = async (idTurno) => {
    if (!window.confirm('¿Deseas cancelar esta cita?')) return;

    try {
      const res = await fetch(`${API_BASE}/api/turnos/${idTurno}`, { method: 'DELETE' });
      if (res.ok) {
        alert('Cita cancelada correctamente');
        cargarTurnos();
      } else {
        alert('No se pudo cancelar la cita.');
      }
    } catch (err) {
      alert('Error de conexión con el backend.');
    }
  };

  const nombreCliente = usuario?.nombreCompleto || usuario?.nombre_completo || 'Cliente';
  const primerNombre = nombreCliente.split(' ')[0];

  const proximoTurno = turnos.find(t => {
    const estadoLimpio = (t.estado || '').toUpperCase();
    return estadoLimpio !== 'CANCELADO' && estadoLimpio !== 'FINALIZADO' && estadoLimpio !== 'COMPLETADO';
  });

  const turnosEsteMes = turnos.filter(t => {
    const estadoLimpio = (t.estado || '').toUpperCase();
    return estadoLimpio === 'CONFIRMADO' || estadoLimpio === 'PENDIENTE';
  }).length;

  return (
      <div className="relative min-h-screen w-full bg-[#111713] text-white font-sans p-4 sm:p-8 overflow-x-hidden flex flex-col justify-between">
        <div className="absolute top-[-150px] right-[-150px] w-[700px] h-[700px] bg-[#1A251D] rounded-full opacity-40 pointer-events-none" />

        <div className="relative z-10 w-full max-w-7xl mx-auto flex-1 flex flex-col">
          <header className="flex justify-between items-center mb-8 w-full">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#1A251D] border border-[#2D3E31] rounded-2xl flex items-center justify-center p-2 shadow-inner">
                <img src="/racoon_1.png" alt="El Mapache Bigotón" className="w-full h-full object-contain" />
              </div>
              <div>
              <span className="block text-[10px] tracking-widest text-[#E08A3E] font-bold uppercase">
                EL MAPACHE BIGOTÓN
              </span>
                <h1 className="text-xl font-extrabold tracking-tight text-white leading-none">
                  BarberApp
                </h1>
              </div>
            </div>

            <button
                onClick={handleCerrarSesion}
                className="py-2.5 px-6 bg-[#E08A3E] hover:bg-[#c9762e] text-[#111713] font-bold rounded-2xl transition-all cursor-pointer flex items-center gap-2 text-xs shadow-lg"
            >
              <LogOut size={15} />
              <span>Salir</span>
            </button>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full flex-1">
            <div className="lg:col-span-8 flex flex-col gap-6">
              <section className="mb-2">
              <span className="text-[10px] font-bold text-[#E08A3E] tracking-widest uppercase block mb-1">
                EL MAPACHE BIGOTÓN
              </span>
                <h2 className="text-4xl font-black text-white tracking-tight">
                  Hola, {primerNombre}
                </h2>
                <p className="text-xs text-gray-400 mt-1 max-w-xl">
                  Tu próximo turno ya está registrado. Revisa tu agenda, accede a tus servicios favoritos y administra tus pagos desde un solo lugar.
                </p>
              </section>

              <div className="bg-[#1A251D] border border-[#2D3E31] rounded-3xl p-6 shadow-2xl w-full">
                <div className="flex justify-between items-center mb-3">
                  <div>
                  <span className="text-[10px] font-bold text-[#E08A3E] tracking-widest uppercase block">
                    PRÓXIMO TURNO
                  </span>
                    <h3 className="text-xl font-extrabold text-white">
                      {proximoTurno ? `${(proximoTurno.estado || 'CONFIRMADO').charAt(0).toUpperCase() + (proximoTurno.estado || 'CONFIRMADO').slice(1).toLowerCase()} para ${proximoTurno.fecha || 'hoy'}` : 'Sin turnos agendados'}
                    </h3>
                  </div>
                  {proximoTurno && (
                      <span className="text-xs bg-[#111713] text-gray-300 border border-[#2D3E31] px-4 py-1.5 rounded-full font-medium">
                    {proximoTurno.fecha || 'Hoy'} · {proximoTurno.horaInicio || '18:30'}
                  </span>
                  )}
                </div>

                {cargando ? (
                    <div className="text-center py-8 text-xs text-gray-400">Cargando la información de tus citas...</div>
                ) : proximoTurno ? (
                    <div className="space-y-4">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 py-2">
                        <div className="flex items-center gap-4">
                          <div
                              onClick={() => navigate('/ajustesc')}
                              className="w-14 h-14 rounded-2xl overflow-hidden bg-[#111713] border-2 border-[#E08A3E] flex-shrink-0 cursor-pointer"
                          >
                            <img
                                src={fotoCliente}
                                alt={nombreCliente}
                                className="w-full h-full object-cover"
                                onError={(e) => { e.target.src = '/defecto.png'; }}
                            />
                          </div>
                          <div>
                            <h4 className="font-extrabold text-xl text-white">
                              {proximoTurno.servicio?.nombreServicio || proximoTurno.notasCliente || 'Corte clásico + barba'}
                            </h4>
                            <p className="text-xs text-gray-400 mt-0.5">
                              Con {proximoTurno.barbero?.nombreCompleto || 'Bruno'}
                            </p>
                            <p className="text-[11px] text-gray-500 mt-0.5">
                              {proximoTurno.horaInicio || '18:30'} · {proximoTurno.sucursal || 'BarberApp Centro'} · {proximoTurno.servicio?.duracion || 45} min
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-2 w-full sm:w-auto justify-end">
                          <button
                              onClick={() => navigate('/historialC')}
                              className="py-2.5 px-5 bg-[#E08A3E] hover:bg-[#c9762e] text-[#111713] font-extrabold text-xs rounded-xl transition cursor-pointer shadow-md"
                          >
                            Ver turno
                          </button>
                          <button
                              onClick={() => handleCancelarTurno(proximoTurno.idTurno)}
                              className="py-2.5 px-5 bg-[#111713] hover:bg-[#18221c] text-gray-300 border border-[#2D3E31] text-xs font-semibold rounded-xl transition cursor-pointer"
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                        <div className="bg-[#111713] border border-[#2D3E31] p-3.5 rounded-2xl">
                          <span className="text-[10px] text-gray-500 font-medium block mb-1">Estado</span>
                          <span className="text-xs font-bold text-white block">
                        {(proximoTurno.estado || 'Confirmado').charAt(0).toUpperCase() + (proximoTurno.estado || 'Confirmado').slice(1).toLowerCase()}
                      </span>
                        </div>
                        <div className="bg-[#111713] border border-[#2D3E31] p-3.5 rounded-2xl">
                          <span className="text-[10px] text-gray-500 font-medium block mb-1">Pago</span>
                          <span className="text-xs font-bold text-white block">Tarjeta terminada en 4242</span>
                        </div>
                        <div className="bg-[#111713] border border-[#2D3E31] p-3.5 rounded-2xl">
                          <span className="text-[10px] text-gray-500 font-medium block mb-1">Llegada</span>
                          <span className="text-xs font-bold text-white block">10 min antes</span>
                        </div>
                      </div>
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-400 text-xs flex flex-col items-center">
                      <p className="mb-4">No tienes turnos programados en este momento.</p>
                      <button
                          onClick={() => navigate('/agendar')}
                          className="py-2.5 px-5 bg-[#E08A3E] text-[#111713] font-extrabold rounded-xl text-xs hover:bg-[#c9762e] transition-all cursor-pointer"
                      >
                        + Agendar un turno ahora
                      </button>
                    </div>
                )}
              </div>

              <div className="w-full">
                <div className="flex justify-between items-center mb-3">
                  <div>
                  <span className="text-[10px] font-bold text-[#E08A3E] tracking-widest uppercase block">
                    ACCESOS RÁPIDOS
                  </span>
                    <h3 className="text-xl font-extrabold text-white">Gestiona tu experiencia</h3>
                  </div>
                  <span className="text-[10px] text-gray-500">Última actualización hoy</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                  <div
                      onClick={() => navigate('/agendar')}
                      className="bg-[#1A251D] border border-[#2D3E31] hover:border-[#E08A3E] p-5 rounded-2xl cursor-pointer transition-colors shadow-lg flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-9 h-9 bg-[#111713] rounded-xl flex items-center justify-center text-[#E08A3E] mb-3 border border-[#2D3E31]">
                        <Calendar size={18} />
                      </div>
                      <h4 className="font-extrabold text-sm text-white">Agendar turno</h4>
                      <p className="text-[11px] text-gray-400 mt-1 mb-4 leading-relaxed">
                        Elige fecha, hora y servicio con un solo clic.
                      </p>
                    </div>
                    <button className="py-2 px-4 bg-[#111713] border border-[#2D3E31] text-xs font-bold text-white rounded-xl hover:border-[#E08A3E] transition-all self-start">
                      Agendar
                    </button>
                  </div>


                  <div
                      onClick={() => navigate('/historialC')}
                      className="bg-[#1A251D] border border-[#2D3E31] hover:border-[#E08A3E] p-5 rounded-2xl cursor-pointer transition-colors shadow-lg flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-9 h-9 bg-[#111713] rounded-xl flex items-center justify-center text-[#E08A3E] mb-3 border border-[#2D3E31]">
                        <History size={18} />
                      </div>
                      <h4 className="font-extrabold text-sm text-white">Historial de turnos</h4>
                      <p className="text-[11px] text-gray-400 mt-1 mb-4 leading-relaxed">
                        Revisa tus visitas pasadas y el detalle de cada servicio.
                      </p>
                    </div>
                    <button className="py-2 px-4 bg-[#111713] border border-[#2D3E31] text-xs font-bold text-white rounded-xl hover:border-[#E08A3E] transition-all self-start">
                      Ver historial
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-6">
              <div className="bg-[#1A251D] border border-[#2D3E31] rounded-3xl p-6 shadow-xl w-full">
                <div className="flex justify-between items-center mb-6">
                <span className="text-[10px] font-bold text-[#E08A3E] tracking-widest uppercase">
                  NAVEGACIÓN
                </span>
                  <div
                      onClick={() => navigate('/ajustesc')}
                      className="flex items-center gap-2 cursor-pointer group"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#111713] border border-[#E08A3E] text-white font-bold text-xs flex items-center justify-center group-hover:scale-105 transition-all">
                      {primerNombre.charAt(0).toUpperCase()}
                    </div>
                    <div className="text-left">
                      <span className="block text-xs font-bold text-white leading-none">{primerNombre}</span>
                      <span className="text-[9px] text-gray-400 block">Cliente</span>
                    </div>
                  </div>
                </div>

                <nav className="flex flex-col gap-2">
                  <button
                      onClick={() => navigate('/cliente')}
                      className="w-full p-3 bg-[#111713] border border-[#2D3E31] rounded-xl flex items-center gap-3 text-xs font-bold text-white transition-all cursor-pointer"
                  >
                    <Home size={16} className="text-[#E08A3E]" />
                    <span>Inicio</span>
                  </button>

                  <button
                      onClick={() => navigate('/historialC')}
                      className="w-full p-3 bg-[#111713] border border-[#2D3E31] hover:border-[#E08A3E] rounded-xl flex items-center gap-3 text-xs font-medium text-gray-300 transition-all cursor-pointer"
                  >
                    <Calendar size={16} className="text-gray-400" />
                    <span>Mis turnos</span>
                  </button>

                  <button
                      onClick={() => navigate('/historialC')}
                      className="w-full p-3 bg-[#111713] border border-[#2D3E31] hover:border-[#E08A3E] rounded-xl flex items-center gap-3 text-xs font-medium text-gray-300 transition-all cursor-pointer"
                  >
                    <History size={16} className="text-gray-400" />
                    <span>Historial</span>
                  </button>

                  <button
                      onClick={() => navigate('/historialC')}
                      className="w-full p-3 bg-[#111713] border border-[#2D3E31] hover:border-[#E08A3E] rounded-xl flex items-center gap-3 text-xs font-medium text-gray-300 transition-all cursor-pointer"
                  >
                    <CreditCard size={16} className="text-gray-400" />
                    <span>Pagos</span>
                  </button>

                  <button
                      onClick={() => navigate('/ajustesc')}
                      className="w-full p-3 bg-[#111713] border border-[#2D3E31] hover:border-[#E08A3E] rounded-xl flex items-center gap-3 text-xs font-medium text-gray-300 transition-all cursor-pointer"
                  >
                    <Settings size={16} className="text-gray-400" />
                    <span>Configuración</span>
                  </button>
                </nav>
              </div>

              <div className="bg-[#1A251D] border border-[#2D3E31] rounded-3xl p-6 shadow-xl w-full">
                <div className="flex justify-between items-center mb-4">
                <span className="text-[10px] font-bold text-[#E08A3E] tracking-widest uppercase">
                  RESUMEN
                </span>
                  <span className="text-[10px] text-gray-500">Actualizado hoy</span>
                </div>

                <div className="space-y-3 text-xs mb-6">
                  <div className="flex justify-between items-center py-1">
                    <span className="text-gray-400">Turnos este mes</span>
                    <span className="font-bold text-white">{turnosEsteMes}</span>
                  </div>

                  <div className="flex justify-between items-center py-1">
                    <span className="text-gray-400">Último pago</span>
                    <span className="font-bold text-white">$1.250</span>
                  </div>
                </div>

                <button
                    onClick={() => navigate('/historialC')}
                    className="w-full py-3 bg-[#111713] hover:bg-[#18221c] border border-[#2D3E31] text-gray-300 font-bold rounded-xl text-xs transition-all cursor-pointer text-center block"
                >
                  Ver resumen
                </button>
              </div>
            </div>
          </div>
        </div>

        <footer className="relative z-10 p-4 text-center text-xs text-gray-600 mt-8">
          El Mapache Bigotón &copy; BarberApp
        </footer>
      </div>
  );
}