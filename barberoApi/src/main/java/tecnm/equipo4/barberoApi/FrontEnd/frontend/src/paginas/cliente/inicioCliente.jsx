import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Calendar, History, CreditCard, Settings, LogOut } from 'lucide-react';
import { API_URL, leerSesion, esActivo, cambiarEstadoTurno, fechaHoraTurno } from '../../api.js';

const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : '');
const hhmm = (h) => (h ? String(h).substring(0, 5) : '');

const NAV = [
  { label: 'Inicio', ruta: '/cliente', Icon: Home, activo: true },
  { label: 'Mis turnos', ruta: '/historialC', Icon: Calendar },
  { label: 'Historial', ruta: '/historialC', Icon: History },
  { label: 'Pagos', ruta: '/historialC', Icon: CreditCard },
  { label: 'Configuración', ruta: '/ajustesc', Icon: Settings },
];

export default function InicioCliente() {
  const navigate = useNavigate();
  const [usuario] = useState(leerSesion);
  const [turnos, setTurnos] = useState([]);
  const [cargando, setCargando] = useState(true);

  const idCliente = usuario?.idCliente || usuario?.idUsuario;
  const emailUsuario = (usuario?.email || '').toLowerCase();
  let avatarsGuardados = {};
  try {
    avatarsGuardados = JSON.parse(localStorage.getItem('avatars_usuarios') || '{}');
  } catch {
    avatarsGuardados = {};
  }
  const fotoCliente = avatarsGuardados[emailUsuario] || usuario?.avatar || usuario?.foto || '/defecto.png';

  const cargarTurnos = useCallback(async (silencioso = false) => {
    if (!silencioso) setCargando(true);
    try {
      const res = await fetch(`${API_URL}/api/turnos?idCliente=${idCliente}`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) setTurnos(data);
      }
    } catch (e) {
      console.error('Error al cargar turnos del cliente', e);
    } finally {
      setCargando(false);
    }
  }, [idCliente]);

  useEffect(() => {
    if (!usuario || !idCliente || usuario.rol === 'BARBERO') {
      localStorage.removeItem('usuarioSesion');
      localStorage.removeItem('usuario');
      navigate('/login');
      return;
    }
    cargarTurnos();
    const timer = setInterval(() => cargarTurnos(true), 15000);
    return () => clearInterval(timer);
  }, [usuario, idCliente, cargarTurnos, navigate]);

  const handleCerrarSesion = () => {
    localStorage.removeItem('usuarioSesion');
    localStorage.removeItem('usuario');
    navigate('/login');
  };

  const handleCancelarTurno = async (idTurno) => {
    if (!window.confirm('¿Deseas cancelar esta cita?')) return;
    try {
      await cambiarEstadoTurno(idTurno, 'CANCELADO', 'CLIENTE', idCliente);
      alert('Cita cancelada correctamente');
      cargarTurnos();
    } catch (err) {
      alert(err.message || 'No se pudo cancelar la cita.');
    }
  };

  const nombreCliente = usuario?.nombreCompleto || 'Cliente';
  const primerNombre = nombreCliente.split(' ')[0];

  const proximoTurno = turnos
      .filter((t) => esActivo(t.estado))
      .sort((a, b) => fechaHoraTurno(a) - fechaHoraTurno(b))[0];

  const turnosEsteMes = turnos.filter((t) => {
    const e = (t.estado || '').toUpperCase();
    return e === 'CONFIRMADO' || e === 'PENDIENTE';
  }).length;

  const estadoProximo = (proximoTurno?.estado || 'PENDIENTE').toUpperCase();

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
                <h1 className="text-xl font-extrabold tracking-tight text-white leading-none">BarberApp</h1>
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
                <h2 className="text-4xl font-black text-white tracking-tight">Hola, {primerNombre}</h2>
                <p className="text-xs text-gray-400 mt-1 max-w-xl">
                  Revisa tu agenda, accede a tus servicios favoritos y administra tus pagos desde un solo lugar.
                </p>
              </section>

              <div className="bg-[#1A251D] border border-[#2D3E31] rounded-3xl p-6 shadow-2xl w-full">
                <div className="flex justify-between items-center mb-3">
                  <div>
                  <span className="text-[10px] font-bold text-[#E08A3E] tracking-widest uppercase block">
                    PRÓXIMO TURNO
                  </span>
                    <h3 className="text-xl font-extrabold text-white">
                      {proximoTurno
                          ? `${cap(estadoProximo)} para ${proximoTurno.fecha || 'hoy'}`
                          : 'Sin turnos agendados'}
                    </h3>
                  </div>
                  {proximoTurno && (
                      <span className="text-xs bg-[#111713] text-gray-300 border border-[#2D3E31] px-4 py-1.5 rounded-full font-medium">
                    {proximoTurno.fecha || 'Hoy'} • {hhmm(proximoTurno.horaInicio)}
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
                              {proximoTurno.servicio?.nombreServicio || proximoTurno.notasCliente || 'Servicio de barbería'}
                            </h4>
                            <p className="text-xs text-gray-400 mt-0.5">
                              Con {proximoTurno.barbero?.nombreCompleto || 'Tu barbero'}
                            </p>
                            <p className="text-[11px] text-gray-500 mt-0.5">
                              {hhmm(proximoTurno.horaInicio)} • {proximoTurno.sucursal || 'BarberApp Centro'}
                              {proximoTurno.servicio?.duracion ? ` • ${proximoTurno.servicio.duracion} min` : ''}
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
                        {cap(estadoProximo)}
                            {estadoProximo === 'PENDIENTE' ? ' · esperando al barbero' : ''}
                      </span>
                        </div>
                        <div className="bg-[#111713] border border-[#2D3E31] p-3.5 rounded-2xl">
                          <span className="text-[10px] text-gray-500 font-medium block mb-1">Pago</span>
                          <span className="text-xs font-bold text-white block">En local</span>
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
                  <span className="text-[10px] font-bold text-[#E08A3E] tracking-widest uppercase">NAVEGACIÓN</span>
                  <div onClick={() => navigate('/ajustesc')} className="flex items-center gap-2 cursor-pointer group">
                    <div className="w-8 h-8 rounded-full bg-[#111713] border border-[#E08A3E] flex items-center justify-center group-hover:scale-105 transition-all overflow-hidden">
                      <img
                          src={fotoCliente}
                          alt={primerNombre}
                          className="w-full h-full object-cover"
                          onError={(e) => { e.target.src = '/defecto.png'; }}
                      />
                    </div>
                    <div className="text-left">
                      <span className="block text-xs font-bold text-white leading-none">{primerNombre}</span>
                      <span className="text-[9px] text-gray-400 block">Cliente</span>
                    </div>
                  </div>
                </div>
                <nav className="flex flex-col gap-2">
                  {NAV.map(({ label, ruta, Icon, activo }) => (
                      <button
                          key={label}
                          onClick={() => navigate(ruta)}
                          className={
                            activo
                                ? 'w-full p-3 bg-[#111713] border border-[#2D3E31] rounded-xl flex items-center gap-3 text-xs font-bold text-white transition-all cursor-pointer'
                                : 'w-full p-3 bg-[#111713] border border-[#2D3E31] hover:border-[#E08A3E] rounded-xl flex items-center gap-3 text-xs font-medium text-gray-300 transition-all cursor-pointer'
                          }
                      >
                        <Icon size={16} className={activo ? 'text-[#E08A3E]' : 'text-gray-400'} />
                        <span>{label}</span>
                      </button>
                  ))}
                </nav>
              </div>

              <div className="bg-[#1A251D] border border-[#2D3E31] rounded-3xl p-6 shadow-xl w-full">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] font-bold text-[#E08A3E] tracking-widest uppercase">RESUMEN</span>
                  <span className="text-[10px] text-gray-500">Actualizado hoy</span>
                </div>
                <div className="space-y-3 text-xs mb-6">
                  <div className="flex justify-between items-center py-1">
                    <span className="text-gray-400">Turnos activos</span>
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