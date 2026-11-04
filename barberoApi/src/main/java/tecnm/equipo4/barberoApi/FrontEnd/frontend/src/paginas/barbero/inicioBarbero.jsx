import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LogOut, Calendar, Clock, User, Phone, MapPin, CheckCircle, XCircle, AlertCircle,
  Scissors, UserPlus, ShieldCheck, Settings, Plus, CreditCard, PieChart
} from 'lucide-react';
import { API_URL, leerSesion, fechaLocalISO, fechaHoraTurno, cambiarEstadoTurno } from '../../api.js';

const hhmm = (h) => (h ? String(h).substring(0, 5) : '');

const AvatarLetras = ({ nombre }) => {
  const iniciales = nombre ? nombre.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'CL';
  return (
      <div className="w-10 h-10 rounded-full bg-[#2D3E31] text-gray-300 flex items-center justify-center font-bold text-xs flex-shrink-0">
        {iniciales}
      </div>
  );
};

export default function InicioBarbero() {
  const navigate = useNavigate();
  const [usuario] = useState(leerSesion);
  const [turnos, setTurnos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [vista, setVista] = useState('todos');
  const [procesando, setProcesando] = useState(null);

  const idBarbero = usuario?.idBarbero || usuario?.idUsuario;
  const nombreBarbero = usuario?.nombreCompleto || usuario?.nombre || 'Barbero';
  const rolBarbero = usuario?.tituloRol || 'Barbero principal';

  const emailBarbero = (usuario?.email || '').toLowerCase();
  let avatarsGuardados = {};
  try {
    avatarsGuardados = JSON.parse(localStorage.getItem('avatars_usuarios') || '{}');
  } catch {
    avatarsGuardados = {};
  }
  const fotoBarbero = avatarsGuardados[emailBarbero] || usuario?.avatar || usuario?.foto || '/defecto.jpg';

  const cargarTurnos = useCallback(async (silencioso = false) => {
    if (!silencioso) setCargando(true);
    try {
      const [rt, rc] = await Promise.allSettled([
        fetch(`${API_URL}/api/turnos?idBarbero=${idBarbero}`),
        fetch(`${API_URL}/cliente-barbero`)
      ]);
      if (rt.status === 'fulfilled' && rt.value.ok) {
        const data = await rt.value.json();
        if (Array.isArray(data)) setTurnos(data);
      }
      if (rc.status === 'fulfilled' && rc.value.ok) {
        const data = await rc.value.json();
        setClientes(data.filter((x) => x.estatus !== false && x.cliente));
      }
    } catch (e) {
      console.error('Error al cargar las citas del barbero', e);
    } finally {
      setCargando(false);
    }
  }, [idBarbero]);

  useEffect(() => {
    if (!usuario || !idBarbero || usuario.rol === 'CLIENTE') {
      localStorage.removeItem('usuarioSesion');
      localStorage.removeItem('usuario');
      navigate('/login');
      return;
    }
    cargarTurnos();
    const timer = setInterval(() => cargarTurnos(true), 15000);
    return () => clearInterval(timer);
  }, [usuario, idBarbero, cargarTurnos, navigate]);

  const cerrarSesion = () => {
    localStorage.removeItem('usuarioSesion');
    localStorage.removeItem('usuario');
    navigate('/login');
  };

  const actualizar = async (t, nuevoEstado, pregunta) => {
    if (pregunta && !window.confirm(pregunta)) return;
    setProcesando(t.idTurno);
    try {
      await cambiarEstadoTurno(t.idTurno, nuevoEstado, 'BARBERO', idBarbero);
      await cargarTurnos(true);
    } catch (err) {
      alert(err.message || 'No se pudo actualizar la cita.');
    } finally {
      setProcesando(null);
    }
  };

  const estadoDe = (t) => (t.estado || 'PENDIENTE').toUpperCase();
  const pendientes = turnos.filter((t) => estadoDe(t) === 'PENDIENTE');
  const confirmadas = turnos.filter((t) => estadoDe(t) === 'CONFIRMADO');
  const historial = turnos.filter((t) => ['FINALIZADO', 'COMPLETADO', 'CANCELADO'].includes(estadoDe(t)));
  const confirmadasHoy = confirmadas.filter((t) => t.fecha === fechaLocalISO()).length;
  const completadasHoy = turnos.filter((t) => (estadoDe(t) === 'FINALIZADO' || estadoDe(t) === 'COMPLETADO') && t.fecha === fechaLocalISO()).length;

  const porFecha = (a, b) => fechaHoraTurno(a) - fechaHoraTurno(b);
  const lista =
      vista === 'pendientes' ? [...pendientes].sort(porFecha)
          : vista === 'confirmadas' ? [...confirmadas].sort(porFecha)
              : vista === 'historial' ? [...historial].sort(porFecha)
                  : [...turnos].sort(porFecha);

  const proximaCita = [...confirmadas].sort(porFecha)[0];

  return (
      <div className="relative min-h-screen w-full bg-[#111713] text-white font-sans p-4 sm:p-6 lg:p-8 flex flex-col justify-between selection:bg-[#E08A3E] selection:text-[#111713] overflow-x-hidden">


        <div className="absolute top-[-150px] right-[-150px] w-[700px] h-[700px] bg-[#1A251D] rounded-full opacity-40 pointer-events-none" />
        <div className="absolute bottom-[-150px] left-[-150px] w-[700px] h-[700px] bg-[#1A251D] rounded-full opacity-40 pointer-events-none" />

        <div className="relative z-10 w-full max-w-[1400px] mx-auto flex-1 flex flex-col gap-6">

          <header className="w-full flex items-center justify-between gap-4 bg-[#161F1A] border border-[#2D3E31]/60 px-6 py-4 rounded-3xl shadow-xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#1A251D] border border-[#2D3E31] rounded-2xl flex items-center justify-center p-2 shadow-inner">
                <img src="/racoon_1.png" alt="El Mapache Bigotón" className="w-full h-full object-contain" />
              </div>
              <div>
              <span className="block text-[9px] tracking-widest text-[#E08A3E] font-extrabold uppercase">
                EL MAPACHE BIGOTÓN
              </span>
                <h1 className="text-xl font-bold tracking-tight text-white leading-none">BarberApp</h1>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                  onClick={() => navigate('/registrol')}
                  className="hidden sm:flex items-center gap-2 py-2.5 px-6 bg-[#E08A3E] hover:bg-[#c9762e] text-[#111713] font-bold rounded-full transition-all text-xs shadow-md cursor-pointer"
              >
                <Plus size={16} strokeWidth={3} />
                <span>Nuevo turno</span>
              </button>

              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <span className="block text-xs font-bold text-white leading-tight">{nombreBarbero}</span>
                  <span className="text-[10px] text-gray-400 block">{rolBarbero}</span>
                </div>
                <div
                    className="w-10 h-10 rounded-full overflow-hidden border border-[#E08A3E] bg-[#1A251D] cursor-pointer hover:scale-105 transition-all"
                    onClick={() => navigate('/ajustesb')}
                >
                  <img src={fotoBarbero} alt={nombreBarbero} className="w-full h-full object-cover" onError={(e) => { e.target.src = '/defecto.jpg'; }} />
                </div>
                <button
                    onClick={cerrarSesion}
                    title="Cerrar sesión"
                    className="w-10 h-10 bg-[#1A251D] border border-[#2D3E31] hover:border-red-500/50 hover:text-red-400 text-gray-300 rounded-2xl flex items-center justify-center transition cursor-pointer shadow-inner ml-1"
                >
                  <LogOut size={16} />
                </button>
              </div>
            </div>
          </header>

          <div className="w-full flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              {['todos', 'pendientes', 'confirmadas', 'historial'].map((tab) => (
                  <button
                      key={tab}
                      onClick={() => setVista(tab)}
                      className={`py-2 px-5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                          vista === tab ? 'bg-[#2D3E31] text-white border border-[#2D3E31]' : 'bg-transparent text-gray-400 hover:text-white'
                      }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
              ))}
            </div>

            <div className="flex items-center gap-3 text-xs">
            <span className="bg-[#161F1A] border border-[#2D3E31] px-4 py-2 rounded-full text-gray-300 font-medium">
              Hoy · 09:00-19:00
            </span>
              <span className="bg-[#E08A3E]/10 text-[#E08A3E] border border-[#E08A3E]/30 px-4 py-2 rounded-full font-bold">
              {turnos.length} turnos totales
            </span>
            </div>
          </div>

          <div className="bg-[#161F1A] border border-[#2D3E31] p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-6 w-full">
              <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-[#E08A3E] bg-[#111713] flex-shrink-0 shadow-lg">
                <img src={fotoBarbero} alt={nombreBarbero} className="w-full h-full object-cover" onError={(e) => { e.target.src = '/defecto.jpg'; }} />
              </div>
              <div>
              <span className="text-[10px] font-bold text-[#E08A3E] tracking-widest uppercase block mb-1">
                PANEL PROFESIONAL {usuario?.sucursal ? `• ${usuario.sucursal}` : ''}
              </span>
                <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">Hola, {nombreBarbero}</h2>
                <p className="text-xs text-gray-400 mt-1">
                  Gestiona tu agenda, revisa el rendimiento del día y prepara la próxima atención desde un solo lugar.
                </p>
              </div>
            </div>

            <div className="flex-shrink-0 w-full md:w-auto">
              <button
                  onClick={() => navigate('/ajustesb')}
                  className="w-full md:w-auto py-3 px-6 bg-[#111713] hover:bg-[#25352a] text-gray-300 border border-[#2D3E31] font-bold text-xs rounded-2xl transition cursor-pointer flex items-center justify-center gap-2 shadow-inner"
              >
                <Settings size={15} className="text-[#E08A3E]" />
                <span>Ver agenda / Perfil</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Turnos completados', value: completadasHoy, sub: `${pendientes.length} pendientes por confirmar`, icon: CheckCircle, col: 'text-emerald-400' },
              { label: 'Ingreso estimado', value: `$${completadasHoy * 180}`, sub: 'Calculado sobre servicios', icon: CreditCard, col: 'text-[#E08A3E]' },
              { label: 'Citas hoy', value: confirmadasHoy + pendientes.length, sub: 'Clientes programados', icon: User, col: 'text-[#E08A3E]' },
              { label: 'Ocupación', value: '85%', sub: 'Alta demanda en sucursal', icon: PieChart, col: 'text-blue-400' }
            ].map((stat, i) => (
                <div key={i} className="bg-[#161F1A] border border-[#2D3E31] p-5 rounded-3xl shadow-lg flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{stat.label}</span>
                    <div className="w-8 h-8 rounded-xl bg-[#111713] border border-[#2D3E31] flex items-center justify-center">
                      <stat.icon size={16} className={stat.col} />
                    </div>
                  </div>
                  <div>
                    <span className="text-3xl font-black text-white block mb-1">{stat.value}</span>
                    <p className="text-[10px] text-gray-400">{stat.sub}</p>
                  </div>
                </div>
            ))}
          </div>


          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">


            <div className="lg:col-span-8 bg-[#161F1A] border border-[#2D3E31] rounded-3xl p-6 shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-black text-white tracking-tight">Agenda diaria</h3>
                  <p className="text-xs text-gray-400 mt-0.5">{turnos.length} clientes programados en turnos próximos.</p>
                </div>
                <span className="text-xs text-[#E08A3E] bg-[#111713] border border-[#2D3E31] px-3.5 py-1.5 rounded-xl font-bold">
                Hoy • 09:00 - 19:00
              </span>
              </div>

              {cargando ? (
                  <div className="p-12 text-center text-xs text-gray-400">Sincronizando agenda...</div>
              ) : lista.length === 0 ? (
                  <div className="p-12 text-center flex flex-col items-center">
                    <Scissors size={40} className="text-[#E08A3E] mb-3 opacity-60" />
                    <p className="text-xs text-gray-400">No hay turnos registrados en esta vista.</p>
                  </div>
              ) : (
                  <div className="flex flex-col gap-3">
                    {lista.map((t) => {
                      const est = estadoDe(t);
                      const ocupado = procesando === t.idTurno;
                      const horaCorta = hhmm(t.horaInicio);

                      return (
                          <div key={t.idTurno} className="bg-[#111713] border border-[#2D3E31] p-4 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-[#E08A3E]/40 transition shadow-md">
                            <div className="flex items-center gap-4 flex-1">
                              <div className="w-16 text-center flex-shrink-0">
                                <span className="text-xs font-black text-[#E08A3E] block">{horaCorta}</span>
                                <span className="text-[9px] text-gray-500 block uppercase font-bold tracking-wider">Hrs</span>
                              </div>
                              <div className="w-px h-10 bg-[#2D3E31] hidden sm:block" />
                              <div className="flex items-center gap-3">
                                <AvatarLetras nombre={t.cliente?.nombreCompleto} />
                                <div>
                                  <div className="flex items-center gap-2 mb-0.5">
                                    <span className="font-bold text-white text-sm">{t.cliente?.nombreCompleto || 'Cliente'}</span>
                                  </div>
                                  <p className="text-xs text-gray-400">
                                    {t.servicio?.nombreServicio || 'Servicio de barbería'} {t.servicio?.duracion ? `• ${t.servicio.duracion} min` : ''}
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                              {est === 'PENDIENTE' && (
                                  <>
                                    <button disabled={ocupado} onClick={() => actualizar(t, 'CONFIRMADO')} className="py-2 px-4 bg-[#E08A3E] hover:bg-[#c9762e] text-[#111713] font-extrabold text-xs rounded-xl transition cursor-pointer shadow">
                                      Aceptar
                                    </button>
                                    <button disabled={ocupado} onClick={() => actualizar(t, 'CANCELADO', '¿Rechazar este turno?')} className="py-2 px-4 bg-[#161F1A] border border-[#2D3E31] text-gray-300 text-xs font-semibold rounded-xl transition cursor-pointer">
                                      Rechazar
                                    </button>
                                  </>
                              )}
                              {est === 'CONFIRMADO' && (
                                  <>
                                    <button disabled={ocupado} onClick={() => actualizar(t, 'FINALIZADO', '¿Marcar como atendido y finalizado?')} className="py-2 px-4 bg-[#E08A3E] hover:bg-[#c9762e] text-[#111713] font-extrabold text-xs rounded-xl transition cursor-pointer shadow">
                                      Finalizar
                                    </button>
                                    <button disabled={ocupado} onClick={() => actualizar(t, 'CANCELADO', '¿Cancelar esta cita?')} className="py-2 px-4 bg-[#161F1A] border border-[#2D3E31] text-gray-300 text-xs font-semibold rounded-xl transition cursor-pointer">
                                      Cancelar
                                    </button>
                                  </>
                              )}
                              {est !== 'PENDIENTE' && est !== 'CONFIRMADO' && (
                                  <span className="text-xs font-bold px-3 py-1 bg-[#161F1A] border border-[#2D3E31] text-gray-400 rounded-xl">
                            {est}
                          </span>
                              )}
                            </div>
                          </div>
                      );
                    })}
                  </div>
              )}
            </div>

            <div className="lg:col-span-4 flex flex-col gap-6">

              <div className="bg-[#161F1A] border border-[#2D3E31] rounded-3xl p-6 shadow-xl">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] font-bold text-[#E08A3E] tracking-widest uppercase">Gestión rápida</span>
                  <span className="text-[10px] text-gray-500">Acceso directos</span>
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  <button onClick={() => navigate('/registrol')} className="p-3 bg-[#111713] border border-[#2D3E31] hover:border-[#E08A3E] rounded-2xl text-left transition cursor-pointer flex flex-col gap-1">
                    <Plus size={16} className="text-[#E08A3E]" />
                    <span className="text-xs font-bold text-white">Nuevo turno</span>
                  </button>
                  <button onClick={() => navigate('/empleado')} className="p-3 bg-[#111713] border border-[#2D3E31] hover:border-[#E08A3E] rounded-2xl text-left transition cursor-pointer flex flex-col gap-1">
                    <ShieldCheck size={16} className="text-[#E08A3E]" />
                    <span className="text-xs font-bold text-white">Barberos</span>
                  </button>
                  <button onClick={() => navigate('/ajustesb')} className="p-3 bg-[#111713] border border-[#2D3E31] hover:border-[#E08A3E] rounded-2xl text-left transition cursor-pointer flex flex-col gap-1">
                    <Settings size={16} className="text-[#E08A3E]" />
                    <span className="text-xs font-bold text-white">Configurar</span>
                  </button>
                  <button onClick={() => navigate('/registrol')} className="p-3 bg-[#111713] border border-[#2D3E31] hover:border-[#E08A3E] rounded-2xl text-left transition cursor-pointer flex flex-col gap-1">
                    <UserPlus size={16} className="text-[#E08A3E]" />
                    <span className="text-xs font-bold text-white">Clientes</span>
                  </button>
                </div>
              </div>

              <div className="bg-[#161F1A] border border-[#2D3E31] rounded-3xl p-6 shadow-xl">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] font-bold text-[#E08A3E] tracking-widest uppercase">Próxima cita</span>
                  <span className="text-[10px] bg-[#E08A3E]/20 text-[#E08A3E] border border-[#E08A3E]/30 px-2 py-0.5 rounded-full font-bold">
                  En puerta
                </span>
                </div>

                {proximaCita ? (
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-black text-base text-white">{proximaCita.servicio?.nombreServicio || 'Servicio de barbería'}</h4>
                        <p className="text-xs text-gray-400 mt-0.5">Cliente: <strong className="text-white">{proximaCita.cliente?.nombreCompleto}</strong></p>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-[#111713] border border-[#2D3E31] p-2.5 rounded-xl">
                          <span className="text-[9px] text-gray-500 block">Horario</span>
                          <strong className="text-white">{hhmm(proximaCita.horaInicio)} hs</strong>
                        </div>
                        <div className="bg-[#111713] border border-[#2D3E31] p-2.5 rounded-xl">
                          <span className="text-[9px] text-gray-500 block">Sucursal</span>
                          <strong className="text-white truncate block">{proximaCita.sucursal || 'Matriz'}</strong>
                        </div>
                      </div>
                      <button
                          onClick={() => actualizar(proximaCita, 'FINALIZADO', '¿Marcar como atendida esta cita?')}
                          className="w-full py-3 bg-[#E08A3E] hover:bg-[#c9762e] text-[#111713] font-extrabold rounded-xl text-xs transition cursor-pointer shadow-md"
                      >
                        Finalizar atención
                      </button>
                    </div>
                ) : (
                    <p className="text-xs text-gray-400 py-4 text-center">No hay citas confirmadas pendientes de atención inmediata.</p>
                )}
              </div>

            </div>

          </div>
        </div>

        <footer className="relative z-10 w-full max-w-[1400px] mx-auto text-center text-xs text-gray-600 mt-12 py-4 border-t border-[#2D3E31]/40">
          El Mapache Bigotón &copy; BarberApp Dashboard
        </footer>
      </div>
  );
}