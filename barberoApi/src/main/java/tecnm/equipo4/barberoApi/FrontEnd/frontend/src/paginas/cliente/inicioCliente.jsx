import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, History, CreditCard, Settings, LogOut, Home } from 'lucide-react';

const API_BASE = 'http://localhost:8081/api';

export default function InicioCliente() {
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState(() => {
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
      localStorage.removeItem('usuario');
      navigate('/iniciar-sesion');
      return;
    }

    if (usuario.tipo_usuario === 'BARBERO') {
      navigate('/barbero');
      return;
    }

    cargarTurnos(usuario.id_usuario);
    cargarFotoPerfil(usuario.id_usuario);
  }, [usuario, navigate]);

  const cargarTurnos = async (idUsuario) => {
    try {
      const res = await fetch(`${API_BASE}/turnos/cliente/${idUsuario}`);
      if (res.ok) {
        const data = await res.json();
        setTurnos(data);
      }
    } catch (err) {
      console.error('Error al cargar turnos:', err);
    } finally {
      setCargando(false);
    }
  };

  const cargarFotoPerfil = async (idUsuario) => {
    try {
      const res = await fetch(`${API_BASE}/usuarios/${idUsuario}`);
      if (res.ok) {
        const data = await res.json();
        if (data.foto) {
          setUsuario(prev => ({ ...prev, foto: data.foto }));
          const sesion = JSON.parse(localStorage.getItem('usuario') || '{}');
          localStorage.setItem('usuario', JSON.stringify({ ...sesion, foto: data.foto }));
        }
      }
    } catch (err) {
      console.error('Error al cargar avatar:', err);
    }
  };

  const handleCerrarSesion = () => {
    localStorage.removeItem('usuario');
    navigate('/iniciar-sesion');
  };

  const handleCancelarTurno = async (idTurno) => {
    if (!window.confirm('¿Deseas cancelar esta cita?')) return;
    try {
      const res = await fetch(`${API_BASE}/turnos/${idTurno}/cancelar`, { method: 'PUT' });
      if (res.ok) {
        alert('Cita cancelada correctamente');
        if (usuario?.id_usuario) cargarTurnos(usuario.id_usuario);
      } else {
        alert('No se pudo cancelar la cita.');
      }
    } catch (err) {
      alert('Error de conexión con el backend.');
    }
  };

  const nombreCliente = usuario?.nombre_completo || usuario?.nombreCompleto || 'Cliente';
  const inicialCliente = (nombreCliente[0] || 'C').toUpperCase();

  const proximoTurno = turnos.find(t => t.estado === 'CONFIRMADO');
  const turnosConfirmados = turnos.filter(t => t.estado === 'CONFIRMADO').length;

  const obtenerTextoFechaTurno = (fechaStr, horaStr) => {
    if (!fechaStr) return { encabezado: 'Turno programado', badge: '' };

    const partes = fechaStr.split('-');
    const fechaCita = new Date(Number(partes[0]), Number(partes[1]) - 1, Number(partes[2]));
    
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const diferenciaMs = fechaCita.getTime() - hoy.getTime();
    const diferenciaDias = Math.round(diferenciaMs / (1000 * 60 * 60 * 24));
    const horaCorta = horaStr ? String(horaStr).substring(0, 5) : '18:30';

    if (diferenciaDias === 0) {
      return { encabezado: 'Confirmado para hoy', badge: `Hoy · ${horaCorta}` };
    } else if (diferenciaDias === 1) {
      return { encabezado: 'Confirmado para mañana', badge: `Mañana · ${horaCorta}` };
    } else {
      const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
      return {
        encabezado: `Confirmado para el ${fechaCita.getDate()} de ${meses[fechaCita.getMonth()]} de ${fechaCita.getFullYear()}`,
        badge: `${fechaStr} · ${horaCorta}`
      };
    }
  };

  const infoFecha = proximoTurno ? obtenerTextoFechaTurno(proximoTurno.fecha, proximoTurno.horaInicio) : null;

  return (
    <div className="min-h-screen bg-[#111613] text-gray-200 p-6 md:p-10 font-sans relative overflow-hidden select-none">
      
      {/* Círculos sólidos de Figma */}
      <div className="absolute -top-44 -right-32 w-[550px] h-[550px] bg-[#18221b] rounded-full pointer-events-none z-0"></div>
      <div className="absolute -bottom-48 -left-32 w-[480px] h-[480px] bg-[#18221b] rounded-full pointer-events-none z-0"></div>

      <header className="flex justify-between items-center mb-10 relative z-10 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#213026] border border-[#2d4034] rounded-2xl flex items-center justify-center shadow-lg shadow-black/30">
            <span className="text-2xl filter drop-shadow">🦝</span>
          </div>
          <div className="leading-tight">
            <span className="text-[10px] font-black tracking-widest text-[#d97706] uppercase block">
              El Mapache Bigotón
            </span>
            <span className="text-xl font-extrabold text-white tracking-wide">
              BarberApp
            </span>
          </div>
        </div>

        <button 
          onClick={handleCerrarSesion}
          className="flex items-center gap-2 bg-[#ea8536] hover:bg-[#d97528] text-[#121814] font-extrabold px-5 py-2.5 rounded-xl text-xs transition duration-200 shadow-md shadow-black/30"
        >
          <LogOut size={15} className="rotate-180" /> Salir
        </button>
      </header>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        
        <div className="lg:col-span-8 space-y-6">
          <section>
            <span className="text-[11px] font-extrabold text-[#d97706] tracking-wider uppercase block mb-1">
              El Mapache Bigotón
            </span>
            <h1 className="text-4xl font-black text-white capitalize tracking-tight">
              Hola, {nombreCliente}
            </h1>
            <p className="text-xs text-gray-400 mt-1 max-w-xl leading-relaxed">
              Tu próximo turno ya está confirmado. Revisa tu agenda, accede a tus servicios y administra tus citas desde un solo lugar.
            </p>
          </section>

          <div className="bg-[#18211b]/95 border border-[#25332a] rounded-3xl p-7 backdrop-blur-md shadow-2xl">
            <div className="flex justify-between items-center mb-5">
              <span className="text-[10px] font-black tracking-widest uppercase text-[#d97706]">
                Próximo Turno
              </span>
              {infoFecha && (
                <span className="text-[11px] bg-[#121914] text-gray-300 font-semibold px-3.5 py-1.5 rounded-full border border-[#2b3a30]">
                  {infoFecha.badge}
                </span>
              )}
            </div>

            {proximoTurno ? (
              <>
                <h3 className="text-xl font-bold text-white mb-5 tracking-wide">
                  {infoFecha.encabezado}
                </h3>
                
                <div className="bg-[#1e2a22] border border-[#2e3e33] p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-13 h-13 rounded-2xl overflow-hidden bg-[#2a3a30] border-2 border-[#ea8536] flex items-center justify-center shadow-inner flex-shrink-0">
                      {usuario?.foto ? (
                        <img 
                          src={usuario.foto} 
                          alt={nombreCliente} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-base font-black text-white">
                          {inicialCliente}
                        </span>
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-base text-white tracking-wide">
                        {proximoTurno.notasCliente || 'Corte clásico + barba'}
                      </h4>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Con {proximoTurno.nombreBarbero || 'tu barbero'} • {proximoTurno.sucursal || 'BarberApp Centro'} • 45 min
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <button 
                      onClick={() => navigate('/cliente/historial')}
                      className="bg-[#ea8536] hover:bg-[#d97528] text-[#121814] text-xs font-black px-5 py-2.5 rounded-xl transition shadow"
                    >
                      Ver turno
                    </button>
                    <button 
                      onClick={() => handleCancelarTurno(proximoTurno.idTurno)}
                      className="bg-[#243329] hover:bg-red-950/80 hover:text-red-400 text-gray-300 text-xs font-semibold px-4 py-2.5 rounded-xl transition border border-[#334538]"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-5 text-xs">
                  <div className="bg-[#141b16] p-4 rounded-2xl border border-[#243128]">
                    <span className="text-[10px] uppercase font-bold text-gray-500 block mb-1">Estado</span>
                    <span className="font-bold text-emerald-400">{proximoTurno.estado}</span>
                  </div>
                  <div className="bg-[#141b16] p-4 rounded-2xl border border-[#243128]">
                    <span className="text-[10px] uppercase font-bold text-gray-500 block mb-1">Pago</span>
                    <span className="font-bold text-white">En sucursal</span>
                  </div>
                  <div className="bg-[#141b16] p-4 rounded-2xl border border-[#243128]">
                    <span className="text-[10px] uppercase font-bold text-gray-500 block mb-1">Llegada</span>
                    <span className="font-bold text-white">10 min antes</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-10 text-gray-400 text-xs">
                No tienes turnos programados en este momento.
              </div>
            )}
          </div>

          <div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-[10px] font-black uppercase text-[#d97706] tracking-wider">
                Accesos Rápidos
              </span>
              <span className="text-[10px] text-gray-500">Última actualización hoy</span>
            </div>
            <h3 className="text-base font-bold text-white mb-4">Gestiona tu experiencia</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div 
                onClick={() => navigate('/cliente/agendar')}
                className="bg-[#18211b] border border-[#25332a] hover:border-[#ea8536]/50 p-6 rounded-2xl cursor-pointer transition duration-200 group shadow-lg"
              >
                <div className="w-10 h-10 bg-[#212d25] rounded-xl flex items-center justify-center text-[#ea8536] mb-4 group-hover:scale-105 transition">
                  <Calendar size={20} />
                </div>
                <h4 className="font-bold text-sm text-white">Agendar turno</h4>
                <p className="text-xs text-gray-400 mt-1 mb-4 leading-relaxed">
                  Elige fecha, hora y servicio con un solo clic.
                </p>
                <span className="text-xs text-[#ea8536] font-bold inline-flex items-center gap-1">
                  Agendar →
                </span>
              </div>

              <div 
                onClick={() => navigate('/cliente/historial')}
                className="bg-[#18211b] border border-[#25332a] hover:border-[#ea8536]/50 p-6 rounded-2xl cursor-pointer transition duration-200 group shadow-lg"
              >
                <div className="w-10 h-10 bg-[#212d25] rounded-xl flex items-center justify-center text-[#ea8536] mb-4 group-hover:scale-105 transition">
                  <History size={20} />
                </div>
                <h4 className="font-bold text-sm text-white">Historial de turnos</h4>
                <p className="text-xs text-gray-400 mt-1 mb-4 leading-relaxed">
                  Revisa tus visitas pasadas y el detalle de cada servicio.
                </p>
                <span className="text-xs text-[#ea8536] font-bold inline-flex items-center gap-1">
                  Ver historial ({turnos.length}) →
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#18211b]/95 border border-[#25332a] rounded-3xl p-6 shadow-xl backdrop-blur-md">
            <div className="flex justify-between items-center mb-5">
              <span className="text-[10px] font-black uppercase text-[#d97706] tracking-wider">
                Navegación
              </span>
              <div className="flex items-center gap-2.5">
                {usuario?.foto ? (
                  <img 
                    src={usuario.foto} 
                    alt="Perfil" 
                    className="w-8 h-8 rounded-full object-cover border-2 border-[#ea8536]"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-[#27382d] border border-[#3b4f42] flex items-center justify-center text-xs font-black text-white shadow-inner">
                    {inicialCliente}
                  </div>
                )}
                <div className="text-right">
                  <span className="text-xs font-bold text-white block leading-tight capitalize">
                    {nombreCliente}
                  </span>
                  <span className="text-[10px] text-gray-400 capitalize">
                    {usuario?.tipo_usuario?.toLowerCase() || 'cliente'}
                  </span>
                </div>
              </div>
            </div>

            <nav className="space-y-1.5 text-xs">
              <button 
                onClick={() => navigate('/cliente')} 
                className="w-full flex items-center gap-3 px-3.5 py-2.5 text-[#ea8536] bg-[#222e26] rounded-xl font-bold"
              >
                <Home size={16} /> Inicio
              </button>
              <button 
                onClick={() => navigate('/cliente/historial')} 
                className="w-full flex items-center gap-3 px-3.5 py-2.5 text-gray-400 hover:text-white hover:bg-[#202c23] rounded-xl transition font-medium"
              >
                <History size={16} /> Historial
              </button>
              <button 
                onClick={() => navigate('/cliente/historial')} 
                className="w-full flex items-center gap-3 px-3.5 py-2.5 text-gray-400 hover:text-white hover:bg-[#202c23] rounded-xl transition font-medium"
              >
                <CreditCard size={16} /> Pagos
              </button>
              <button 
                onClick={() => navigate('/cliente/configuracion')} 
                className="w-full flex items-center gap-3 px-3.5 py-2.5 text-gray-400 hover:text-white hover:bg-[#202c23] rounded-xl transition font-medium"
              >
                <Settings size={16} /> Configuración
              </button>
            </nav>
          </div>

          <div className="bg-[#18211b]/95 border border-[#25332a] rounded-3xl p-6 shadow-xl backdrop-blur-md">
            <div className="flex justify-between items-center mb-5">
              <span className="text-[10px] font-black uppercase text-[#d97706] tracking-wider">
                Resumen
              </span>
              <span className="text-[10px] text-gray-500">Actualizado hoy</span>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Turnos activos</span>
                <span className="font-bold text-white text-sm">{turnosConfirmados}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Total historial</span>
                <span className="font-bold text-white text-sm">{turnos.length}</span>
              </div>
            </div>

            <button 
              onClick={() => navigate('/cliente/historial')}
              className="w-full mt-6 bg-[#212c24] hover:bg-[#2a382e] border border-[#2e3e33] text-gray-200 text-xs font-bold py-2.5 rounded-xl transition"
            >
              Ver resumen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}