import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Heart, History, CreditCard, Settings, LogOut, Home } from 'lucide-react';

const API_BASE = 'http://localhost:8081/api';

export default function InicioCliente() {
  const navigate = useNavigate();

  // 1. Obtener la sesión real del usuario logueado
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
      localStorage.removeItem('usuario');
      navigate('/iniciar-sesion');
      return;
    }

    cargarTurnos(usuario.id_usuario);
  }, []);

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

  // Seleccionar el turno confirmado más próximo
  const proximoTurno = turnos.find(t => t.estado === 'CONFIRMADO');
  const turnosConfirmados = turnos.filter(t => t.estado === 'CONFIRMADO').length;

  // Formatear texto dinámico de la fecha de la cita
  const obtenerTextoFechaTurno = (fechaStr, horaStr) => {
    if (!fechaStr) return { encabezado: 'Turno programado', badge: '' };

    const partes = fechaStr.split('-');
    const fechaCita = new Date(Number(partes[0]), Number(partes[1]) - 1, Number(partes[2]));
    
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const diferenciaMs = fechaCita.getTime() - hoy.getTime();
    const diferenciaDias = Math.round(diferenciaMs / (1000 * 60 * 60 * 24));

    const horaCorta = horaStr ? String(horaStr).substring(0, 5) : '';

    if (diferenciaDias === 0) {
      return {
        encabezado: 'Confirmado para hoy',
        badge: `Hoy - ${horaCorta}`
      };
    } else if (diferenciaDias === 1) {
      return {
        encabezado: 'Confirmado para mañana',
        badge: `Mañana - ${horaCorta}`
      };
    } else if (diferenciaDias > 1) {
      const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
      const dia = fechaCita.getDate();
      const mes = meses[fechaCita.getMonth()];
      const anio = fechaCita.getFullYear();

      return {
        encabezado: `Confirmado para el ${dia} de ${mes} de ${anio}`,
        badge: `${fechaStr} - ${horaCorta}`
      };
    } else {
      return {
        encabezado: `Cita del ${fechaStr}`,
        badge: `${fechaStr} - ${horaCorta}`
      };
    }
  };

  const infoFecha = proximoTurno ? obtenerTextoFechaTurno(proximoTurno.fecha, proximoTurno.horaInicio) : null;

  return (
    <div className="min-h-screen bg-[#0e1411] text-gray-200 p-8 font-sans relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[550px] h-[550px] bg-[#16291e]/40 rounded-full blur-3xl pointer-events-none -mr-32 -mt-32"></div>

      {/* Header Superior */}
      <header className="flex justify-between items-center mb-10 relative z-10 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#1b2b22] border border-gray-700 flex items-center justify-center text-lg shadow-inner">
            🦝
          </div>
          <div className="leading-tight">
            <span className="text-[10px] font-black tracking-widest text-[#d97706] block uppercase">
              El Mapache Bigotón
            </span>
            <span className="text-lg font-bold text-white tracking-wide">
              BarberApp
            </span>
          </div>
        </div>

        <button 
          onClick={handleCerrarSesion}
          className="flex items-center gap-1.5 bg-[#e07a1e] hover:bg-[#c96914] text-black font-bold px-4 py-1.5 rounded-lg text-xs transition duration-200 shadow-md"
        >
          <LogOut size={14} /> Salir
        </button>
      </header>

      {/* Estructura Principal */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        
        {/* Columna Izquierda */}
        <div className="lg:col-span-8 space-y-6">
          <section>
            <span className="text-[11px] font-extrabold text-[#d97706] tracking-wider uppercase block mb-1">
              El Mapache Bigotón
            </span>
            <h1 className="text-3xl font-extrabold text-white capitalize">
              Hola, {nombreCliente}
            </h1>
            <p className="text-xs text-gray-400 mt-1 max-w-xl">
              Tu próximo turno ya está confirmado. Revisa tu agenda, accede a tus servicios favoritos y administra tus pagos desde un solo lugar.
            </p>
          </section>

          {/* Tarjeta Próximo Turno */}
          <div className="bg-[#151d18]/90 border border-[#232f27] rounded-2xl p-6 backdrop-blur-sm">
            <div className="flex justify-between items-center mb-4">
              <span className="text-[10px] font-extrabold tracking-widest uppercase text-[#d97706]">
                Próximo Turno
              </span>
              {infoFecha && (
                <span className="text-[11px] bg-[#1a251f] text-gray-300 font-medium px-3 py-1 rounded-full border border-gray-700">
                  {infoFecha.badge}
                </span>
              )}
            </div>

            {proximoTurno ? (
              <>
                <h3 className="text-lg font-bold text-white mb-4">
                  {infoFecha.encabezado}
                </h3>
                
                <div className="bg-[#1c2620] border border-[#28372d] p-4 rounded-xl flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-700 flex items-center justify-center border border-gray-600">
                      <span className="text-2xl">🧔🏻</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white">
                        {proximoTurno.notasCliente || 'Corte clásico'}
                      </h4>
                      <p className="text-[11px] text-gray-400">
                        Con Bruno • {proximoTurno.sucursal || 'BarberApp Centro'}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button 
                      onClick={() => navigate('/cliente/historial')}
                      className="bg-[#d97706] hover:bg-[#b45309] text-black text-xs font-bold px-4 py-2 rounded-lg transition"
                    >
                      Ver turno
                    </button>
                    <button 
                      onClick={() => handleCancelarTurno(proximoTurno.idTurno)}
                      className="bg-[#26322a] hover:bg-red-950 hover:text-red-400 text-gray-300 text-xs font-medium px-4 py-2 rounded-lg transition border border-gray-700"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-4 text-xs">
                  <div className="bg-[#18211b] p-3 rounded-xl border border-[#232f27]">
                    <span className="text-[10px] text-gray-500 block mb-0.5">Estado</span>
                    <span className="font-semibold text-green-400">{proximoTurno.estado}</span>
                  </div>
                  <div className="bg-[#18211b] p-3 rounded-xl border border-[#232f27]">
                    <span className="text-[10px] text-gray-500 block mb-0.5">Pago</span>
                    <span className="font-semibold text-white">En sucursal</span>
                  </div>
                  <div className="bg-[#18211b] p-3 rounded-xl border border-[#232f27]">
                    <span className="text-[10px] text-gray-500 block mb-0.5">Llegada</span>
                    <span className="font-semibold text-white">10 min antes</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-gray-400 text-xs">
                No tienes turnos programados en este momento.
              </div>
            )}
          </div>

          {/* Accesos Rápidos */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-[10px] font-extrabold uppercase text-[#d97706] tracking-wider">
                Accesos Rápidos
              </span>
              <span className="text-[10px] text-gray-500">Última actualización hoy</span>
            </div>
            <h3 className="text-base font-bold text-white mb-4">Gestiona tu experiencia</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div 
                onClick={() => navigate('/cliente/agendar')}
                className="bg-[#151d18] border border-[#232f27] hover:border-[#d97706]/40 p-4 rounded-xl cursor-pointer transition"
              >
                <div className="w-7 h-7 bg-[#1e2a22] rounded-lg flex items-center justify-center text-[#d97706] mb-3">
                  <Calendar size={15} />
                </div>
                <h4 className="font-bold text-xs text-white">Agendar turno</h4>
                <p className="text-[11px] text-gray-400 mt-1 mb-3">Elige fecha, hora y servicio con un solo clic.</p>
                <span className="text-[11px] text-[#d97706] font-semibold">Agendar →</span>
              </div>

              <div 
                onClick={() => navigate('/cliente/historial')}
                className="bg-[#151d18] border border-[#232f27] hover:border-[#d97706]/40 p-4 rounded-xl cursor-pointer transition"
              >
                <div className="w-7 h-7 bg-[#1e2a22] rounded-lg flex items-center justify-center text-[#d97706] mb-3">
                  <Heart size={15} />
                </div>
                <h4 className="font-bold text-xs text-white">Mis barberos favoritos</h4>
                <p className="text-[11px] text-gray-400 mt-1 mb-3">Vuelve con Bruno u otros barberos que ya conoces.</p>
                <span className="text-[11px] text-[#d97706] font-semibold">Ver favoritos →</span>
              </div>

              <div 
                onClick={() => navigate('/cliente/historial')}
                className="bg-[#151d18] border border-[#232f27] hover:border-[#d97706]/40 p-4 rounded-xl cursor-pointer transition"
              >
                <div className="w-7 h-7 bg-[#1e2a22] rounded-lg flex items-center justify-center text-[#d97706] mb-3">
                  <History size={15} />
                </div>
                <h4 className="font-bold text-xs text-white">Historial de turnos</h4>
                <p className="text-[11px] text-gray-400 mt-1 mb-3">Revisa tus visitas pasadas y el detalle de cada servicio.</p>
                <span className="text-[11px] text-[#d97706] font-semibold">Ver historial ({turnos.length}) →</span>
              </div>
            </div>
          </div>
        </div>

        {/* Columna Derecha */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#151d18]/90 border border-[#232f27] rounded-2xl p-5">
            <div className="flex justify-between items-center mb-4">
              <span className="text-[10px] font-extrabold uppercase text-[#d97706] tracking-wider">
                Navegación
              </span>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[#243329] border border-gray-600 flex items-center justify-center text-[10px] font-bold text-white">
                  {inicialCliente}
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-white block leading-none capitalize">
                    {nombreCliente}
                  </span>
                  <span className="text-[9px] text-gray-400 capitalize">
                    {usuario?.tipo_usuario?.toLowerCase() || 'cliente'}
                  </span>
                </div>
              </div>
            </div>

            <nav className="space-y-1 text-xs">
              <button 
                onClick={() => navigate('/cliente')} 
                className="w-full flex items-center gap-3 px-3 py-2 text-[#d97706] bg-[#222e26] rounded-xl font-medium"
              >
                <Home size={15} /> Inicio
              </button>
              <button 
                onClick={() => navigate('/cliente/historial')} 
                className="w-full flex items-center gap-3 px-3 py-2 text-gray-400 hover:text-white hover:bg-[#1a251f] rounded-xl transition"
              >
                <Calendar size={15} /> Mis turnos
              </button>
              <button 
                onClick={() => navigate('/cliente/historial')} 
                className="w-full flex items-center gap-3 px-3 py-2 text-gray-400 hover:text-white hover:bg-[#1a251f] rounded-xl transition"
              >
                <Heart size={15} /> Favoritos
              </button>
              <button 
                onClick={() => navigate('/cliente/historial')} 
                className="w-full flex items-center gap-3 px-3 py-2 text-gray-400 hover:text-white hover:bg-[#1a251f] rounded-xl transition"
              >
                <History size={15} /> Historial
              </button>
              <button 
                onClick={() => navigate('/cliente/historial')} 
                className="w-full flex items-center gap-3 px-3 py-2 text-gray-400 hover:text-white hover:bg-[#1a251f] rounded-xl transition"
              >
                <CreditCard size={15} /> Pagos
              </button>
              <button 
                onClick={() => navigate('/cliente')} 
                className="w-full flex items-center gap-3 px-3 py-2 text-gray-400 hover:text-white hover:bg-[#1a251f] rounded-xl transition"
              >
                <Settings size={15} /> Configuración
              </button>
            </nav>
          </div>

          <div className="bg-[#151d18]/90 border border-[#232f27] rounded-2xl p-5">
            <div className="flex justify-between items-center mb-4">
              <span className="text-[10px] font-extrabold uppercase text-[#d97706] tracking-wider">
                Resumen
              </span>
              <span className="text-[10px] text-gray-500">Actualizado hoy</span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Turnos activos</span>
                <span className="font-bold text-white">{turnosConfirmados}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Favoritos</span>
                <span className="font-bold text-white">1</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Total historial</span>
                <span className="font-bold text-white">{turnos.length}</span>
              </div>
            </div>

            <button 
              onClick={() => navigate('/cliente/historial')}
              className="w-full mt-5 bg-[#1a251f] hover:bg-[#233129] border border-[#2b3a30] text-gray-200 text-xs font-semibold py-2 rounded-xl transition"
            >
              Ver resumen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 