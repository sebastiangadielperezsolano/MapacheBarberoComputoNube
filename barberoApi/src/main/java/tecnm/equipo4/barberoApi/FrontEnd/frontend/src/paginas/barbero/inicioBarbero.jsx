import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Search, LogOut, CheckCircle, Clock, Phone, Plus, Bell, Scissors, BarChart3, X, User } from 'lucide-react';

const API_BASE = 'http://localhost:8081/api';

export default function InicioBarbero() {
  const navigate = useNavigate();

  const [usuario] = useState(() => {
    try {
      const sesion = localStorage.getItem('usuario');
      return sesion ? JSON.parse(sesion) : { id_usuario: 2, nombre_completo: 'Barbero' };
    } catch {
      return { id_usuario: 2, nombre_completo: 'Barbero' };
    }
  });

  const [turnos, setTurnos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [filtroRecordatorio, setFiltroRecordatorio] = useState(false);

  // Estados para Modal de Nuevo Turno
  const [mostrarModalNuevo, setMostrarModalNuevo] = useState(false);
  const [clientesDisponibles, setClientesDisponibles] = useState([]);
  const [nuevoTurnoData, setNuevoTurnoData] = useState({
    idCliente: '',
    servicio: 'Corte clásico',
    fecha: new Date().toISOString().split('T')[0],
    hora: '14:00'
  });

  // Modal para ver teléfono de llamada
  const [modalLlamada, setModalLlamada] = useState(null);

  useEffect(() => {
    cargarAgenda();
    cargarClientes();
  }, []);

  const cargarAgenda = async () => {
    setCargando(true);
    try {
      const id = usuario?.id_usuario || 2;
      const res = await fetch(`${API_BASE}/turnos/barbero/${id}`);
      if (res.ok) {
        const data = await res.json();
        setTurnos(data);
      }
    } catch (err) {
      console.error('Error al cargar agenda del barbero:', err);
    } finally {
      setCargando(false);
    }
  };

  const cargarClientes = async () => {
    try {
      const res = await fetch(`${API_BASE}/usuarios/clientes`);
      if (res.ok) {
        const data = await res.json();
        setClientesDisponibles(data);
        if (data.length > 0) {
          setNuevoTurnoData(prev => ({ ...prev, idCliente: data[0].idUsuario || data[0].id_usuario }));
        }
      }
    } catch (err) {
      console.error('Error cargando clientes:', err);
    }
  };

  const handleCerrarSesion = () => {
    localStorage.removeItem('usuario');
    navigate('/iniciar-sesion');
  };

  // Confirmar cita desde la tarjeta Próxima Cita
  const handleConfirmarCita = async (idTurno) => {
    try {
      const res = await fetch(`${API_BASE}/turnos/${idTurno}/confirmar`, { method: 'PUT' });
      if (res.ok) {
        alert('¡Cita confirmada en la base de datos!');
        cargarAgenda();
      } else {
        alert('No se pudo confirmar la cita.');
      }
    } catch (err) {
      alert('Error de conexión con el servidor.');
    }
  };

  // Guardar Nuevo Turno agendado por el Barbero
  const handleCrearTurno = async (e) => {
    e.preventDefault();
    if (!nuevoTurnoData.idCliente) {
      alert('Selecciona un cliente válido.');
      return;
    }

    const payload = {
      idCliente: Number(nuevoTurnoData.idCliente),
      idBarbero: Number(usuario?.id_usuario || 2),
      idServicio: 1,
      fecha: nuevoTurnoData.fecha,
      horaInicio: nuevoTurnoData.hora.length === 5 ? `${nuevoTurnoData.hora}:00` : nuevoTurnoData.hora,
      notasCliente: nuevoTurnoData.servicio,
      sucursal: 'BarberApp Centro',
      estado: 'CONFIRMADO'
    };

    try {
      const res = await fetch(`${API_BASE}/turnos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        alert('¡Turno registrado y añadido a tu agenda!');
        setMostrarModalNuevo(false);
        cargarAgenda();
      } else {
        alert('Error al registrar el turno.');
      }
    } catch (err) {
      alert('Error de conexión con el servidor.');
    }
  };

  // Filtrado de citas (por búsqueda o por recordatorio de 1 día antes)
  const fechaManana = new Date();
  fechaManana.setDate(fechaManana.getDate() + 1);
  const mananaIso = fechaManana.toISOString().split('T')[0];

  const turnosFiltrados = turnos.filter(t => {
    const coincideTexto = (t.nombreCliente?.toLowerCase().includes(busqueda.toLowerCase()) || 
                           t.notasCliente?.toLowerCase().includes(busqueda.toLowerCase()));
    if (filtroRecordatorio) {
      return coincideTexto && t.fecha === mananaIso;
    }
    return coincideTexto;
  });

  const proximaCita = turnos.find(t => t.estado === 'CONFIRMADO') || turnos[0];
  const nombreBarbero = usuario?.nombre_completo || 'Barbero';

  return (
    <div className="min-h-screen bg-[#111613] text-gray-200 p-6 md:p-10 font-sans relative overflow-hidden select-none">
      
      {/* Círculos sólidos de fondo Figma */}
      <div className="absolute -top-44 -right-32 w-[550px] h-[550px] bg-[#18221b] rounded-full pointer-events-none z-0"></div>
      <div className="absolute -bottom-48 -left-32 w-[480px] h-[480px] bg-[#18221b] rounded-full pointer-events-none z-0"></div>

      {/* HEADER SUPERIOR FIGMA */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 relative z-10 max-w-7xl mx-auto">
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

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search size={14} className="absolute left-3.5 top-3 text-gray-500" />
            <input
              type="text"
              placeholder="Buscar cliente o servicio..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full bg-[#18211b] border border-[#25332a] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-gray-600 outline-none focus:border-[#ea8536]"
            />
          </div>

          <div className="flex items-center gap-2 bg-[#18211b] border border-[#25332a] px-3 py-1.5 rounded-xl text-xs">
            <div className="w-6 h-6 rounded-full bg-[#27382d] flex items-center justify-center text-[10px] font-bold text-white">
              {(nombreBarbero[0] || 'B').toUpperCase()}
            </div>
            <span className="font-bold text-white capitalize text-xs">{nombreBarbero}</span>
          </div>

          <button 
            onClick={handleCerrarSesion}
            className="flex items-center gap-1.5 bg-[#ea8536] hover:bg-[#d97528] text-[#121814] font-black px-4 py-2 rounded-xl text-xs transition shadow-md"
          >
            <LogOut size={14} className="rotate-180" /> Salir
          </button>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <div className="max-w-7xl mx-auto space-y-7 relative z-10">
        
        {/* BANNER BIENVENIDA */}
        <div className="bg-[#18211b]/95 border border-[#25332a] rounded-3xl p-7 shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-5 backdrop-blur-md">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl overflow-hidden bg-[#243328] border-2 border-[#ea8536] flex items-center justify-center text-3xl shadow-lg">
              💈
            </div>
            <div>
              <h1 className="text-3xl font-black text-white capitalize tracking-tight">
                Hola, {nombreBarbero}
              </h1>
              <p className="text-xs text-gray-400 mt-1">
                Gestiona tu agenda, revisa el rendimiento del día y prepara la próxima atención desde un solo lugar.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => { setFiltroRecordatorio(false); setBusqueda(''); cargarAgenda(); }}
              className={`border text-xs font-bold px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 ${
                !filtroRecordatorio ? 'bg-[#ea8536] text-[#121814] border-[#ea8536]' : 'bg-[#212c24] text-gray-200 border-[#2e3e33]'
              }`}
            >
              <Calendar size={14} /> Ver agenda
            </button>
            <button 
              onClick={() => setMostrarModalNuevo(true)}
              className="bg-[#ea8536] hover:bg-[#d97528] text-[#121814] text-xs font-black px-4 py-2.5 rounded-xl transition shadow flex items-center gap-1.5"
            >
              <Plus size={14} /> + Nuevo turno
            </button>
          </div>
        </div>

        {/* 4 TARJETAS DE MÉTRICAS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#18211b]/95 border border-[#25332a] rounded-2xl p-5 shadow-lg">
            <span className="text-[10px] font-bold uppercase text-gray-500 block mb-1">Turnos registrados</span>
            <span className="text-2xl font-black text-white">{turnos.length}</span>
            <span className="text-[10px] text-gray-500 block mt-1">En tu agenda personal</span>
          </div>

          <div className="bg-[#18211b]/95 border border-[#25332a] rounded-2xl p-5 shadow-lg">
            <span className="text-[10px] font-bold uppercase text-gray-500 block mb-1">Ingresos estimados</span>
            <span className="text-2xl font-black text-[#ea8536]">${turnos.length * 150}</span>
            <span className="text-[10px] text-gray-500 block mt-1">Promedio por servicios</span>
          </div>

          <div className="bg-[#18211b]/95 border border-[#25332a] rounded-2xl p-5 shadow-lg">
            <span className="text-[10px] font-bold uppercase text-gray-500 block mb-1">Clientes registrados</span>
            <span className="text-2xl font-black text-white">{clientesDisponibles.length}</span>
            <span className="text-[10px] text-gray-500 block mt-1">Disponibles en el sistema</span>
          </div>

          <div className="bg-[#18211b]/95 border border-[#25332a] rounded-2xl p-5 shadow-lg">
            <span className="text-[10px] font-bold uppercase text-gray-500 block mb-1">Recordatorios (Mañana)</span>
            <span className="text-2xl font-black text-emerald-400">
              {turnos.filter(t => t.fecha === mananaIso).length}
            </span>
            <span className="text-[10px] text-gray-500 block mt-1">Citas a 1 día de realizarse</span>
          </div>
        </div>

        {/* DOS COLUMNAS: AGENDA DIARIA Y GESTIÓN RÁPIDA */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
          
          {/* AGENDA DIARIA */}
          <div className="lg:col-span-8 bg-[#18211b]/95 border border-[#25332a] rounded-3xl p-7 shadow-2xl space-y-5">
            <div className="flex justify-between items-center border-b border-[#25332a] pb-4">
              <div>
                <h3 className="font-bold text-base text-white">
                  {filtroRecordatorio ? 'Recordatorios (Citas de Mañana)' : 'Agenda de Clientes'}
                </h3>
                <span className="text-[11px] text-gray-400">
                  {turnosFiltrados.length} turnos encontrados para este barbero
                </span>
              </div>
              <span className="text-[11px] bg-[#121914] text-gray-300 font-semibold px-3 py-1.5 rounded-full border border-[#2b3a30]">
                {filtroRecordatorio ? `Mañana (${mananaIso})` : 'Todos los turnos'}
              </span>
            </div>

            {/* Listado dinámico de turnos */}
            <div className="space-y-3">
              {cargando ? (
                <p className="text-xs text-gray-400 py-4">Cargando turnos de MySQL...</p>
              ) : turnosFiltrados.length === 0 ? (
                <div className="text-center py-10 text-xs text-gray-500">
                  {filtroRecordatorio 
                    ? 'No hay citas agendadas exactamente para mañana.' 
                    : 'Aún ningún cliente ha agendado una cita con este barbero.'}
                </div>
              ) : (
                turnosFiltrados.map((t) => (
                  <div 
                    key={t.idTurno} 
                    className="p-4 bg-[#141b16] border border-[#243128] hover:border-[#ea8536]/40 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 transition"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-xs font-black text-[#ea8536] w-14">
                        {t.horaInicio ? String(t.horaInicio).substring(0, 5) : '10:00'}
                      </span>
                      <div className="w-9 h-9 rounded-xl bg-[#212c24] border border-[#2e3e33] flex items-center justify-center text-xs font-bold text-white uppercase">
                        {(t.nombreCliente ? t.nombreCliente[0] : 'C')}
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-white capitalize">
                          {t.nombreCliente || `Cliente #${t.idCliente}`}
                        </h4>
                        <span className="text-[11px] text-gray-400 block mt-0.5">
                          {t.notasCliente || 'Corte'} • {t.fecha} • {t.telefonoCliente}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-3 py-1 rounded-full ${
                        t.estado === 'CONFIRMADO' 
                          ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800' 
                          : 'bg-red-950/80 text-red-400 border border-red-800'
                      }`}>
                        {t.estado}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* GESTIÓN RÁPIDA & PRÓXIMA CITA */}
          <div className="lg:col-span-4 space-y-6">
            
            <div className="bg-[#18211b]/95 border border-[#25332a] rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-bold text-sm text-white">Gestión rápida</h4>
                <span className="text-[10px] text-gray-500">Acciones</span>
              </div>

              <div className="grid grid-cols-2 gap-2.5 text-xs">
                <button 
                  onClick={() => setMostrarModalNuevo(true)}
                  className="bg-[#141b16] hover:bg-[#1e2a22] border border-[#243128] p-3 rounded-xl flex items-center gap-2 text-gray-300 font-semibold transition"
                >
                  <Plus size={14} className="text-[#ea8536]" /> + Nuevo turno
                </button>
                <button 
                  onClick={() => setFiltroRecordatorio(!filtroRecordatorio)}
                  className={`border p-3 rounded-xl flex items-center gap-2 font-semibold transition ${
                    filtroRecordatorio 
                      ? 'bg-[#ea8536] text-[#121814] border-[#ea8536]' 
                      : 'bg-[#141b16] text-gray-300 border-[#243128] hover:bg-[#1e2a22]'
                  }`}
                >
                  <Bell size={14} className={filtroRecordatorio ? 'text-[#121814]' : 'text-[#ea8536]'} /> Recordatorios
                </button>
                <button 
                  onClick={() => alert('Servicios activos: Corte clásico, Corte + barba, Afeitado, Peinado, Degradado.')}
                  className="bg-[#141b16] hover:bg-[#1e2a22] border border-[#243128] p-3 rounded-xl flex items-center gap-2 text-gray-300 font-semibold transition"
                >
                  <Scissors size={14} className="text-[#ea8536]" /> Servicios
                </button>
                <button 
                  onClick={() => alert(`Reporte del barbero ${nombreBarbero}: ${turnos.length} turnos completados y activos en MySQL.`)}
                  className="bg-[#141b16] hover:bg-[#1e2a22] border border-[#243128] p-3 rounded-xl flex items-center gap-2 text-gray-300 font-semibold transition"
                >
                  <BarChart3 size={14} className="text-[#ea8536]" /> Reportes
                </button>
              </div>
            </div>

            {/* PRÓXIMA CITA */}
            <div className="bg-[#18211b]/95 border border-[#25332a] rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-bold text-sm text-white">Próxima cita</h4>
                <span className="text-[10px] text-[#ea8536] font-bold">Atención prioritaria</span>
              </div>

              {proximaCita ? (
                <div className="bg-[#141b16] border border-[#243128] p-4 rounded-2xl space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#27382d] flex items-center justify-center text-xs font-black text-white uppercase">
                      {(proximaCita.nombreCliente ? proximaCita.nombreCliente[0] : 'C')}
                    </div>
                    <div>
                      <h5 className="font-bold text-xs text-white capitalize">
                        {proximaCita.nombreCliente || `Cliente #${proximaCita.idCliente}`}
                      </h5>
                      <span className="text-[10px] text-gray-400 block mt-0.5">
                        {proximaCita.notasCliente} • {proximaCita.fecha} ({String(proximaCita.horaInicio).substring(0, 5)})
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <button 
                      onClick={() => setModalLlamada({
                        nombre: proximaCita.nombreCliente,
                        telefono: proximaCita.telefonoCliente || '+52 231 112 6081'
                      })}
                      className="bg-[#212c24] hover:bg-[#2b3a2f] border border-[#2e3e33] text-gray-300 text-xs font-bold py-2 rounded-xl transition flex items-center justify-center gap-1.5"
                    >
                      <Phone size={12} /> Llamar
                    </button>
                    <button 
                      onClick={() => handleConfirmarCita(proximaCita.idTurno)}
                      className="bg-[#ea8536] hover:bg-[#d97528] text-[#121814] text-xs font-black py-2 rounded-xl transition flex items-center justify-center gap-1.5 shadow"
                    >
                      <CheckCircle size={12} /> Confirmar
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 text-xs text-gray-500">
                  No hay citas próximas en tu lista.
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* MODAL 1: NUEVO TURNO AGENDADO POR EL BARBERO */}
      {mostrarModalNuevo && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-[#18211b] border border-[#25332a] w-full max-w-md p-6 rounded-3xl shadow-2xl relative">
            <button 
              onClick={() => setMostrarModalNuevo(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-white"
            >
              <X size={18} />
            </button>

            <h3 className="text-lg font-bold text-white mb-1">Registrar Nuevo Turno</h3>
            <p className="text-xs text-gray-400 mb-5">Asigna una cita eligiendo a un cliente registrado en la base de datos.</p>

            <form onSubmit={handleCrearTurno} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">Cliente</label>
                <select
                  value={nuevoTurnoData.idCliente}
                  onChange={(e) => setNuevoTurnoData({ ...nuevoTurnoData, idCliente: e.target.value })}
                  className="w-full bg-[#121914] border border-[#243328] rounded-xl p-2.5 text-xs text-white outline-none focus:border-[#ea8536]"
                >
                  {clientesDisponibles.map(c => (
                    <option key={c.idUsuario || c.id_usuario} value={c.idUsuario || c.id_usuario}>
                      {c.nombreCompleto || c.nombre_completo} ({c.email})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">Servicio</label>
                <select
                  value={nuevoTurnoData.servicio}
                  onChange={(e) => setNuevoTurnoData({ ...nuevoTurnoData, servicio: e.target.value })}
                  className="w-full bg-[#121914] border border-[#243328] rounded-xl p-2.5 text-xs text-white outline-none focus:border-[#ea8536]"
                >
                  <option value="Corte clásico">Corte clásico — $150</option>
                  <option value="Corte + barba">Corte + barba — $250</option>
                  <option value="Afeitado clásico">Afeitado clásico — $200</option>
                  <option value="Corte degradado">Corte degradado — $160</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">Fecha</label>
                  <input
                    type="date"
                    required
                    value={nuevoTurnoData.fecha}
                    onChange={(e) => setNuevoTurnoData({ ...nuevoTurnoData, fecha: e.target.value })}
                    className="w-full bg-[#121914] border border-[#243328] rounded-xl p-2 text-xs text-white outline-none focus:border-[#ea8536]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">Hora</label>
                  <input
                    type="time"
                    required
                    value={nuevoTurnoData.hora}
                    onChange={(e) => setNuevoTurnoData({ ...nuevoTurnoData, hora: e.target.value })}
                    className="w-full bg-[#121914] border border-[#243328] rounded-xl p-2 text-xs text-white outline-none focus:border-[#ea8536]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-3 bg-[#ea8536] hover:bg-[#d97528] text-[#121814] font-black py-2.5 rounded-xl text-xs transition"
              >
                Confirmar y Agendar
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: LLAMAR AL CLIENTE */}
      {modalLlamada && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-[#18211b] border border-[#25332a] w-full max-w-sm p-6 rounded-3xl shadow-2xl text-center relative">
            <button 
              onClick={() => setModalLlamada(null)}
              className="absolute top-5 right-5 text-gray-400 hover:text-white"
            >
              <X size={18} />
            </button>

            <div className="w-14 h-14 bg-[#243328] border-2 border-[#ea8536] rounded-2xl flex items-center justify-center text-2xl mx-auto mb-3">
              📞
            </div>

            <h3 className="text-base font-bold text-white capitalize">{modalLlamada.nombre}</h3>
            <p className="text-sm font-black text-[#ea8536] mt-2 mb-4 tracking-wider">
              {modalLlamada.telefono}
            </p>

            <div className="flex gap-2">
              <a 
                href={`tel:${modalLlamada.telefono}`}
                className="flex-1 bg-[#ea8536] hover:bg-[#d97528] text-[#121814] text-xs font-black py-2.5 rounded-xl transition flex items-center justify-center gap-1.5"
              >
                <Phone size={13} /> Marcar ahora
              </a>
              <button 
                onClick={() => setModalLlamada(null)}
                className="bg-[#243329] text-gray-300 text-xs font-semibold px-4 py-2.5 rounded-xl transition border border-[#334538]"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}