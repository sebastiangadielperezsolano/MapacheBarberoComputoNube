import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Phone, FileText, Check, ArrowLeft, Scissors, UserCheck } from 'lucide-react';

const API_BASE_URL = 'http://localhost:8080';

export default function AgendarCita() {
  const navigate = useNavigate();

  const sesionRaw = localStorage.getItem('usuarioSesion') || localStorage.getItem('usuario') || '{}';
  const usuarioSesion = JSON.parse(sesionRaw);

  const [barberos, setBarberos] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [cargando, setCargando] = useState(true);

  const [nombreCliente, setNombreCliente] = useState(
      usuarioSesion.nombreCompleto || usuarioSesion.nombre || ''
  );
  const [telefonoCliente, setTelefonoCliente] = useState(
      usuarioSesion.telefono || ''
  );
  const [idBarberoElegido, setIdBarberoElegido] = useState('');
  const [servicioSeleccionado, setServicioSeleccionado] = useState(null);
  const [fechaSeleccionada, setFechaSeleccionada] = useState('2026-03-20');
  const [horaSeleccionada, setHoraSeleccionada] = useState('18:30');
  const [notas, setNotas] = useState('');
  const [enviando, setEnviando] = useState(false);



  const diasRapidos = [
    { label: 'HOY', diaNum: '20', mes: 'Marzo', valorIso: '2026-03-20' },
    { label: 'SÁB', diaNum: '21', mes: 'Marzo', valorIso: '2026-03-21' },
    { label: 'LUN', diaNum: '23', mes: 'Marzo', valorIso: '2026-03-23' },
    { label: 'MAR', diaNum: '24', mes: 'Marzo', valorIso: '2026-03-24' }
  ];

  const horasManana = ['09:00', '09:45', '10:30', '11:15'];
  const horasTarde = ['14:00', '15:30', '17:00', '18:30'];

  useEffect(() => {
    const cargarCatalogos = async () => {
      setCargando(true);
      try {
        const [resBarberos, resServicios] = await Promise.allSettled([
          fetch(`${API_BASE_URL}/barbero`),
          fetch(`${API_BASE_URL}/api/servicios`)
        ]);

        if (resBarberos.status === 'fulfilled' && resBarberos.value.ok) {
          const dataBarberos = await resBarberos.value.json();
          setBarberos(dataBarberos);
          if (dataBarberos.length > 0) {
            setIdBarberoElegido(dataBarberos[0].idUsuario || dataBarberos[0].idBarbero || 1);
          }
        }

        if (resServicios.status === 'fulfilled' && resServicios.value.ok) {
          const dataServicios = await resServicios.value.json();
          setServicios(dataServicios);
          if (dataServicios.length > 0) {
            setServicioSeleccionado(dataServicios[0]);
          }
        } else {
          setServicios([
            { idServicio: 1, nombreServicio: 'Corte clásico', duracion: 45, precio: 38 },
            { idServicio: 2, nombreServicio: 'Corte + barba', duracion: 60, precio: 48 },
            { idServicio: 3, nombreServicio: 'Afeitado + corte', duracion: 60, precio: 52 },
            { idServicio: 4, nombreServicio: 'Peinado + barba', duracion: 50, precio: 42 },
            { idServicio: 5, nombreServicio: 'Corte degradado', duracion: 45, precio: 40 }
          ]);
        }
      } catch (err) {
        console.log('Cargando datos locales de reserva.');
      } finally {
        setCargando(false);
      }
    };

    cargarCatalogos();
  }, []);

  const handleAgendarTurno = async (e) => {
    e.preventDefault();

    if (!servicioSeleccionado) {
      alert('Por favor selecciona un servicio.');
      return;
    }

    setEnviando(true);

    const nuevoTurno = {
      fecha: fechaSeleccionada,
      horaInicio: horaSeleccionada.length === 5 ? `${horaSeleccionada}:00` : horaSeleccionada,
      estado: 'PENDIENTE',
      sucursal: 'BarberApp Centro',
      notasCliente: notas || 'Sin notas especiales',
      idCliente: Number(usuarioSesion.idUsuario || usuarioSesion.idCliente || 1),
      idBarbero: Number(idBarberoElegido || 1),
      idServicio: Number(servicioSeleccionado.idServicio || 1)
    };

    try {
      const res = await fetch(`${API_BASE_URL}/api/turnos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoTurno)
      });

      if (res.ok) {
        alert('¡Cita solicitada! Tu turno quedó en estado PENDIENTE de confirmación.');
        navigate('/cliente');
      } else {
        alert('No se pudo agendar la cita. Revisa el servidor.');
      }
    } catch (error) {
      alert('Error al conectar con la API.');
    } finally {
      setEnviando(false);
    }
  };

  return (
      <div className="relative min-h-screen w-full bg-[#111713] text-white font-sans p-4 sm:p-8 overflow-x-hidden flex flex-col justify-between">
        <div className="absolute top-[-150px] right-[-150px] w-[600px] h-[600px] bg-[#1A251D] rounded-full opacity-40 pointer-events-none" />

        <div className="relative z-10 w-full max-w-7xl mx-auto flex-1 flex flex-col">
          <header className="flex items-center justify-between mb-6 pb-2 border-b border-[#2D3E31]/40">
            <div className="flex items-center gap-3">
              <button
                  onClick={() => navigate('/cliente')}
                  className="w-10 h-10 bg-[#1A251D] border border-[#2D3E31] rounded-xl flex items-center justify-center hover:bg-[#25352a] text-gray-300 transition-colors cursor-pointer"
              >
                <ArrowLeft size={18} />
              </button>
              <div className="w-11 h-11 bg-[#1A251D] border border-[#2D3E31] rounded-2xl flex items-center justify-center p-2 shadow-inner">
                <img src="/racoon_1.png" alt="El Mapache Bigotón" className="w-full h-full object-contain" />
              </div>
              <div>
                            <span className="block text-[10px] tracking-widest text-[#E08A3E] font-bold uppercase">
                                El Mapache Bigotón
                            </span>
                <h1 className="text-xl font-extrabold tracking-tight text-white leading-none">
                  BarberApp
                </h1>
              </div>
            </div>
          </header>

          <form onSubmit={handleAgendarTurno} className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">

            <div className="lg:col-span-7 bg-[#1A251D] border border-[#2D3E31] p-6 sm:p-8 rounded-3xl flex flex-col justify-between shadow-2xl">
              <div className="space-y-5">
                <div>
                                <span className="text-[10px] font-extrabold text-[#E08A3E] tracking-widest uppercase block mb-1">
                                    NUEVO TURNO
                                </span>
                  <h2 className="text-3xl font-black text-white tracking-tight">
                    Agendar tu cita
                  </h2>
                  <p className="text-xs text-gray-400 mt-1">
                    Ingresa tus datos, elige el servicio que deseas y selecciona la hora más conveniente para tu estilo.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Nombre completo
                  </label>
                  <div className="relative flex items-center">
                    <User className="absolute left-4 text-gray-400" size={16} />
                    <input
                        type="text"
                        required
                        placeholder="Ej. Mateo Ruiz"
                        value={nombreCliente}
                        onChange={(e) => setNombreCliente(e.target.value)}
                        className="w-full py-3 pl-11 pr-4 bg-[#111713] border border-[#2D3E31] text-white rounded-2xl focus:outline-none focus:border-[#E08A3E] text-xs font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Número de teléfono
                  </label>
                  <div className="relative flex items-center">
                    <Phone className="absolute left-4 text-gray-400" size={16} />
                    <input
                        type="tel"
                        required
                        placeholder="Ej. +54 9 11 1234-5678"
                        value={telefonoCliente}
                        onChange={(e) => setTelefonoCliente(e.target.value)}
                        className="w-full py-3 pl-11 pr-4 bg-[#111713] border border-[#2D3E31] text-white rounded-2xl focus:outline-none focus:border-[#E08A3E] text-xs font-medium"
                    />
                  </div>
                </div>

                {barberos.length > 0 && (
                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                        Barbero de preferencia
                      </label>
                      <div className="relative flex items-center">
                        <UserCheck className="absolute left-4 text-gray-400" size={16} />
                        <select
                            value={idBarberoElegido}
                            onChange={(e) => setIdBarberoElegido(e.target.value)}
                            className="w-full py-3 pl-11 pr-4 bg-[#111713] border border-[#2D3E31] text-white rounded-2xl focus:outline-none focus:border-[#E08A3E] text-xs font-medium"
                        >
                          {barberos.map((b) => (
                              <option key={b.idUsuario || b.idBarbero} value={b.idUsuario || b.idBarbero}>
                                {b.nombreCompleto || b.nombre} {b.tituloRol ? `(${b.tituloRol})` : ''}
                              </option>
                          ))}
                        </select>
                      </div>
                    </div>
                )}

                <div className="space-y-3 pt-2">
                  <label className="block text-xs font-semibold text-gray-300">
                    Selección de fecha y hora
                  </label>

                  <div className="grid grid-cols-4 gap-2.5">
                    {diasRapidos.map((d) => {
                      const isSelected = fechaSeleccionada === d.valorIso;
                      return (
                          <button
                              key={d.valorIso}
                              type="button"
                              onClick={() => setFechaSeleccionada(d.valorIso)}
                              className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                                  isSelected
                                      ? 'bg-[#111713] border-[#E08A3E] text-white'
                                      : 'bg-[#111713] border-[#2D3E31] text-gray-400 hover:border-gray-500'
                              }`}
                          >
                            <span className="block text-[10px] font-bold tracking-wider">{d.label}</span>
                            <span className="block text-lg font-black leading-none my-0.5">{d.diaNum}</span>
                            <span className="block text-[9px] text-gray-500">{d.mes}</span>
                          </button>
                      );
                    })}
                  </div>

                  <div>
                                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1.5">
                                        MAÑANA
                                    </span>
                    <div className="grid grid-cols-4 gap-2.5">
                      {horasManana.map((h) => {
                        const isSelected = horaSeleccionada === h;
                        return (
                            <button
                                key={h}
                                type="button"
                                onClick={() => setHoraSeleccionada(h)}
                                className={`py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                                    isSelected
                                        ? 'bg-[#E08A3E] text-[#111713] border-[#E08A3E]'
                                        : 'bg-[#111713] border-[#2D3E31] text-gray-300 hover:border-gray-500'
                                }`}
                            >
                              {h}
                            </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1.5">
                                        TARDE
                                    </span>
                    <div className="grid grid-cols-4 gap-2.5">
                      {horasTarde.map((h) => {
                        const isSelected = horaSeleccionada === h;
                        return (
                            <button
                                key={h}
                                type="button"
                                onClick={() => setHoraSeleccionada(h)}
                                className={`py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                                    isSelected
                                        ? 'bg-[#E08A3E] text-[#111713] border-[#E08A3E]'
                                        : 'bg-[#111713] border-[#2D3E31] text-gray-300 hover:border-gray-500'
                                }`}
                            >
                              {h}
                            </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Detalles adicionales o notas especiales
                  </label>
                  <div className="relative flex items-center">
                    <FileText className="absolute left-4 text-gray-400" size={16} />
                    <input
                        type="text"
                        placeholder="Ej. Preferencia por navaja tradicional, detalles sobre barba, etc."
                        value={notas}
                        onChange={(e) => setNotas(e.target.value)}
                        className="w-full py-3 pl-11 pr-4 bg-[#111713] border border-[#2D3E31] text-white rounded-2xl focus:outline-none focus:border-[#E08A3E] text-xs font-medium"
                    />
                  </div>
                </div>
              </div>

              <button
                  type="submit"
                  disabled={enviando}
                  className="w-full mt-6 py-4 bg-[#E08A3E] hover:bg-[#c9762e] text-[#111713] font-black rounded-2xl transition-all shadow-xl cursor-pointer text-sm flex items-center justify-center gap-2"
              >
                {enviando ? 'Procesando cita...' : 'Confirmar y Solicitar Cita'}
              </button>
            </div>

            <div className="lg:col-span-5 bg-[#1A251D] border border-[#2D3E31] p-6 sm:p-8 rounded-3xl flex flex-col justify-between shadow-2xl">
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-white tracking-tight">
                    Elige el servicio
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">
                    Todos nuestros servicios incluyen lavado de cabello y bebida de cortesía.
                  </p>
                </div>

                <div className="space-y-3">
                  {servicios.map((s) => {
                    const isSelected = servicioSeleccionado?.idServicio === s.idServicio || servicioSeleccionado?.nombreServicio === s.nombreServicio;

                    return (
                        <div
                            key={s.idServicio}
                            onClick={() => setServicioSeleccionado(s)}
                            className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                                isSelected
                                    ? 'bg-[#111713] border-[#E08A3E] shadow-lg'
                                    : 'bg-[#111713] border-[#2D3E31] hover:border-gray-500'
                            }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                                isSelected ? 'border-[#E08A3E] bg-[#E08A3E] text-[#111713]' : 'border-gray-500'
                            }`}>
                              {isSelected && <Check size={12} strokeWidth={3} />}
                            </div>
                            <div>
                              <h4 className="text-xs font-bold text-white">{s.nombreServicio}</h4>
                              <span className="text-[10px] text-gray-500">{s.duracion} min</span>
                            </div>
                          </div>

                          <span className="text-sm font-black text-white">${s.precio}</span>
                        </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-6 p-4 bg-[#111713] border border-[#2D3E31] rounded-2xl flex items-start gap-3">
                <Scissors size={18} className="text-[#E08A3E] flex-shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-xs font-bold text-gray-300">Atención personalizada</h5>
                  <p className="text-[10px] text-gray-500 mt-0.5 leading-relaxed">
                    Si tienes dudas sobre qué corte elegir, tu barbero te me guiará al inicio del turno según tus rasgos y objetivos de estilo.
                  </p>
                </div>
              </div>
            </div>

          </form>
        </div>

        <footer className="relative z-10 p-4 text-center text-xs text-gray-600 mt-6">
          El Mapache Bigotón &copy; BarberApp
        </footer>
      </div>
  );
}