import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Phone, Scissors, UserCheck } from 'lucide-react';

const API_BASE = 'http://localhost:8081/api';

export default function RegistroCita() {
  const navigate = useNavigate();

  const [usuario] = useState(() => {
    try {
      const sesion = localStorage.getItem('usuario');
      return sesion ? JSON.parse(sesion) : { id_usuario: 1, nombre_completo: 'wicho' };
    } catch {
      return { id_usuario: 1, nombre_completo: 'wicho' };
    }
  });

  const serviciosCatalogo = [
    { id: 1, nombre: 'Corte clásico', precio: 150, duracion: '45 min' },
    { id: 2, nombre: 'Corte + barba', precio: 250, duracion: '60 min' },
    { id: 3, nombre: 'Afeitado + corte', precio: 200, duracion: '60 min' },
    { id: 4, nombre: 'Peinado + barba', precio: 180, duracion: '50 min' },
    { id: 5, nombre: 'Corte degradado', precio: 160, duracion: '45 min' }
  ];

  const hoy = new Date();
  const diasOpciones = [0, 1, 2, 3].map(offset => {
    const d = new Date();
    d.setDate(hoy.getDate() + offset);
    const nombresDias = ['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'];
    const nombresMeses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const isoFecha = d.toISOString().split('T')[0];
    return {
      label: offset === 0 ? 'HOY' : nombresDias[d.getDay()],
      numero: d.getDate(),
      mes: nombresMeses[d.getMonth()],
      fechaIso: isoFecha
    };
  });

  const horariosManana = ['09:00', '09:45', '10:30', '11:15'];
  const horariosTarde = ['14:00', '15:30', '17:00', '18:30'];

  const [barberos, setBarberos] = useState([]);
  const [idBarberoSeleccionado, setIdBarberoSeleccionado] = useState('');
  const [servicioSeleccionado, setServicioSeleccionado] = useState(serviciosCatalogo[0]);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(diasOpciones[0].fechaIso);
  const [horaSeleccionada, setHoraSeleccionada] = useState('14:00');
  const [telefono, setTelefono] = useState(usuario?.telefono || '+52 231 112 6081');
  const [notas, setNotas] = useState('');
  const [cargando, setCargando] = useState(false);

  // Consulta dinámica: Carga todos los barberos registrados en tiempo real
  useEffect(() => {
    fetch(`${API_BASE}/barberos`)
      .then(res => res.json())
      .then(data => {
        setBarberos(data);
        if (data.length > 0) {
          setIdBarberoSeleccionado(data[0].idBarbero);
        }
      })
      .catch(err => console.error('Error al obtener barberos:', err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!idBarberoSeleccionado) {
      alert('Por favor selecciona un barbero.');
      return;
    }
    setCargando(true);

    const horaNormalizada = horaSeleccionada.length === 5 ? `${horaSeleccionada}:00` : horaSeleccionada;

    const bodyTurno = {
      idCliente: Number(usuario?.id_usuario || 1),
      idBarbero: Number(idBarberoSeleccionado),
      idServicio: Number(servicioSeleccionado.id || 1),
      fecha: fechaSeleccionada,
      horaInicio: horaNormalizada,
      notasCliente: servicioSeleccionado.nombre + (notas ? ` - ${notas}` : ''),
      sucursal: 'BarberApp Centro',
      estado: 'CONFIRMADO'
    };

    try {
      const res = await fetch(`${API_BASE}/turnos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyTurno)
      });

      if (res.ok) {
        alert('¡Turno confirmado y asignado al barbero exitosamente!');
        navigate('/cliente');
      } else {
        const errorText = await res.text();
        console.error('Error del servidor:', errorText);
        alert('Error en el servidor al registrar el turno: ' + errorText);
      }
    } catch (err) {
      console.error(err);
      alert('Error de conexión con el backend.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#111613] text-gray-200 p-6 md:p-10 font-sans relative overflow-hidden select-none">
      
      {/* Círculos sólidos de fondo Figma */}
      <div className="absolute -top-44 -right-32 w-[550px] h-[550px] bg-[#18221b] rounded-full pointer-events-none z-0"></div>
      <div className="absolute -bottom-48 -left-32 w-[480px] h-[480px] bg-[#18221b] rounded-full pointer-events-none z-0"></div>

      <header className="flex justify-between items-center mb-8 max-w-6xl mx-auto relative z-10">
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
      </header>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        
        {/* Columna Izquierda */}
        <div className="lg:col-span-7 bg-[#18211b]/95 border border-[#25332a] rounded-3xl p-7 shadow-2xl space-y-6 backdrop-blur-md">
          <div>
            <span className="text-[10px] font-black uppercase text-[#d97706] tracking-wider block mb-1">
              Nuevo Turno
            </span>
            <h2 className="text-2xl font-black text-white">Agendar tu cita</h2>
            <p className="text-xs text-gray-400 mt-1">
              Ingresa tus datos, elige con qué barbero deseas atenderte y selecciona fecha y hora.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1.5">Nombre completo</label>
              <div className="relative">
                <User size={15} className="absolute left-3.5 top-3 text-gray-500" />
                <input 
                  type="text" 
                  disabled
                  value={usuario?.nombre_completo || 'wicho'} 
                  className="w-full bg-[#121914] border border-[#243328] rounded-xl pl-10 pr-4 py-2.5 text-xs text-gray-200 capitalize outline-none"
                />
              </div>
            </div>

            {/* Selector de barbero: Renderiza TODOS los que existan en la BD */}
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1.5">Seleccionar Barbero</label>
              <div className="relative">
                <UserCheck size={15} className="absolute left-3.5 top-3 text-[#ea8536]" />
                <select
                  value={idBarberoSeleccionado}
                  onChange={(e) => setIdBarberoSeleccionado(e.target.value)}
                  className="w-full bg-[#121914] border border-[#243328] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:border-[#ea8536] outline-none capitalize"
                >
                  {barberos.length === 0 ? (
                    <option value="">Cargando barberos disponibles...</option>
                  ) : (
                    barberos.map(b => (
                      <option key={b.idBarbero} value={b.idBarbero}>
                        {b.nombreCompleto} — ({b.tituloRol || 'Barbero'} • {b.experiencia || 1} años exp.)
                      </option>
                    ))
                  )}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1.5">Número de teléfono</label>
              <div className="relative">
                <Phone size={15} className="absolute left-3.5 top-3 text-gray-500" />
                <input 
                  type="text" 
                  value={telefono} 
                  onChange={(e) => setTelefono(e.target.value)}
                  className="w-full bg-[#121914] border border-[#243328] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white outline-none focus:border-[#ea8536]"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-300 mb-2">Selección de fecha</label>
            <div className="grid grid-cols-4 gap-2.5">
              {diasOpciones.map((dia) => {
                const seleccionada = fechaSeleccionada === dia.fechaIso;
                return (
                  <button
                    key={dia.fechaIso}
                    type="button"
                    onClick={() => setFechaSeleccionada(dia.fechaIso)}
                    className={`py-3 px-2 rounded-2xl border text-center transition ${
                      seleccionada
                        ? 'border-[#ea8536] bg-[#222e25] text-white'
                        : 'border-[#243328] bg-[#121914] text-gray-400 hover:border-gray-600'
                    }`}
                  >
                    <span className="text-[10px] font-bold block text-gray-400 uppercase">{dia.label}</span>
                    <span className="text-lg font-black block my-0.5">{dia.numero}</span>
                    <span className="text-[10px] text-gray-500 block">{dia.mes}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <span className="text-[10px] font-black uppercase text-gray-500 tracking-wider block mb-2">Mañana</span>
              <div className="grid grid-cols-4 gap-2">
                {horariosManana.map(h => (
                  <button
                    key={h}
                    type="button"
                    onClick={() => setHoraSeleccionada(h)}
                    className={`py-2 rounded-xl text-xs font-bold border transition ${
                      horaSeleccionada === h 
                        ? 'bg-[#ea8536] text-[#121814] border-[#ea8536]' 
                        : 'bg-[#121914] text-gray-300 border-[#243328] hover:border-gray-600'
                    }`}
                  >
                    {h}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="text-[10px] font-black uppercase text-gray-500 tracking-wider block mb-2">Tarde</span>
              <div className="grid grid-cols-4 gap-2">
                {horariosTarde.map(h => (
                  <button
                    key={h}
                    type="button"
                    onClick={() => setHoraSeleccionada(h)}
                    className={`py-2 rounded-xl text-xs font-bold border transition ${
                      horaSeleccionada === h 
                        ? 'bg-[#ea8536] text-[#121814] border-[#ea8536]' 
                        : 'bg-[#121914] text-gray-300 border-[#243328] hover:border-gray-600'
                    }`}
                  >
                    {h}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-300 mb-1.5">Detalles adicionales o notas especiales</label>
            <input 
              type="text" 
              placeholder="Ej. Preferencia por navaja tradicional, detalles sobre barba, etc." 
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              className="w-full bg-[#121914] border border-[#243328] rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-600 outline-none focus:border-[#ea8536]"
            />
          </div>
        </div>

        {/* Columna Derecha */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#18211b]/95 border border-[#25332a] rounded-3xl p-7 shadow-2xl backdrop-blur-md">
            <h3 className="font-bold text-base text-white">Elige el servicio</h3>
            <p className="text-xs text-gray-400 mt-1 mb-5">
              Todos nuestros servicios incluyen lavado de cabello y bebida de cortesía.
            </p>

            <div className="space-y-3">
              {serviciosCatalogo.map((serv) => {
                const activo = servicioSeleccionado.id === serv.id;
                return (
                  <div
                    key={serv.id}
                    onClick={() => setServicioSeleccionado(serv)}
                    className={`p-4 rounded-2xl border cursor-pointer flex justify-between items-center transition ${
                      activo 
                        ? 'border-[#ea8536] bg-[#222e25]' 
                        : 'border-[#243328] bg-[#121914] hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        activo ? 'border-[#ea8536] bg-[#ea8536]' : 'border-gray-600'
                      }`}>
                        {activo && <div className="w-1.5 h-1.5 bg-black rounded-full" />}
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-white">{serv.nombre}</h4>
                        <span className="text-[10px] text-gray-400">{serv.duracion}</span>
                      </div>
                    </div>
                    <span className="font-black text-sm text-[#ea8536]">${serv.precio}</span>
                  </div>
                );
              })}
            </div>

            <div className="bg-[#141b16] border border-[#25332a] p-4 rounded-2xl mt-5">
              <span className="text-xs font-bold text-[#ea8536] flex items-center gap-1.5 mb-1">
                <Scissors size={14} /> Atención personalizada
              </span>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                Tu barbero seleccionado preparará su estación para recibirte puntualmente.
              </p>
            </div>

            <button
              onClick={handleSubmit}
              disabled={cargando}
              className="w-full mt-6 bg-[#ea8536] hover:bg-[#d97528] text-[#121814] font-black py-3 rounded-xl text-xs transition duration-200 shadow-xl"
            >
              {cargando ? 'Registrando cita...' : 'Confirmar Reserva'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}