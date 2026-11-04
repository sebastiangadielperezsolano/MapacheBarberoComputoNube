import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Phone, FileText, Check, ArrowLeft, Scissors, UserCheck, MapPin } from 'lucide-react';
import { API_URL, leerSesion, fechaLocalISO, leerError } from '../../api.js';

const HORAS_MANANA = ['09:00', '09:45', '10:30', '11:15'];
const HORAS_TARDE = ['14:00', '15:30', '17:00', '18:30'];

const idDe = (b) => String(b.idBarbero ?? b.idUsuario ?? '');

export default function AgendarCita() {
    const navigate = useNavigate();
    const [usuarioSesion] = useState(() => leerSesion() || {});
    const idCliente = usuarioSesion.idCliente || usuarioSesion.idUsuario;

    const [barberos, setBarberos] = useState([]);
    const [servicios, setServicios] = useState([]);
    const [preferidos, setPreferidos] = useState([]);
    const [sucursales, setSucursales] = useState([]);
    const [cargando, setCargando] = useState(true);

    const [nombreCliente, setNombreCliente] = useState(usuarioSesion.nombreCompleto || usuarioSesion.nombre || '');
    const [telefonoCliente, setTelefonoCliente] = useState(usuarioSesion.telefono || '');
    const [sucursalElegida, setSucursalElegida] = useState('');
    const [idBarberoElegido, setIdBarberoElegido] = useState('');
    const [guardarPreferido, setGuardarPreferido] = useState(false);
    const [servicioSeleccionado, setServicioSeleccionado] = useState(null);

    const diasRapidos = useMemo(() => {
        const nombresDias = ['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'];
        const nombresMeses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        return Array.from({ length: 4 }, (_, i) => {
            const f = new Date();
            f.setDate(f.getDate() + i);
            return {
                label: i === 0 ? 'HOY' : nombresDias[f.getDay()],
                diaNum: String(f.getDate()).padStart(2, '0'),
                mes: nombresMeses[f.getMonth()],
                valorIso: fechaLocalISO(f),
            };
        });
    }, []);

    const [fechaSeleccionada, setFechaSeleccionada] = useState(diasRapidos[0].valorIso);
    const [horaSeleccionada, setHoraSeleccionada] = useState('18:30');
    const [ocupadas, setOcupadas] = useState([]);
    const [notas, setNotas] = useState('');
    const [enviando, setEnviando] = useState(false);

    useEffect(() => {
        if (!idCliente || usuarioSesion.rol === 'BARBERO') {
            navigate('/login');
            return;
        }
        const cargarCatalogos = async () => {
            setCargando(true);
            try {
                const [rb, rs, rp, rsuc] = await Promise.allSettled([
                    fetch(`${API_URL}/barbero`),
                    fetch(`${API_URL}/api/servicios`),
                    fetch(`${API_URL}/cliente-barbero`),
                    fetch(`${API_URL}/api/sucursales`)
                ]);

                if (rb.status === 'fulfilled' && rb.value.ok) {
                    const datosBarberos = await rb.value.json();
                    const listaBarberos = Array.isArray(datosBarberos) ? datosBarberos : (datosBarberos.data || []);
                    setBarberos(listaBarberos);
                }

                if (rs.status === 'fulfilled' && rs.value.ok) {
                    const data = await rs.value.json();
                    setServicios(data);
                    if (data.length > 0) setServicioSeleccionado(data[0]);
                }

                if (rp.status === 'fulfilled' && rp.value.ok) {
                    const data = await rp.value.json();
                    setPreferidos(
                        data
                            .filter((x) => x.cliente?.idCliente === Number(idCliente) && x.estatus !== false && x.barbero)
                            .map((x) => String(x.barbero.idBarbero))
                    );
                }

                if (rsuc.status === 'fulfilled' && rsuc.value.ok) {
                    const listaSuc = await rsuc.value.json();
                    setSucursales(listaSuc);
                    if (listaSuc.length > 0) {
                        setSucursalElegida(String(listaSuc[0].idSucursal));
                    }
                }
            } catch {

            } finally {
                setCargando(false);
            }
        };
        cargarCatalogos();
    }, [idCliente, usuarioSesion.rol, navigate]);

    const enSucursal = (b) => {
        if (!sucursalElegida) return true;

        const sucElegidaObj = sucursales.find((s) => String(s.idSucursal) === String(sucursalElegida));
        const nombreSucElegida = sucElegidaObj?.nombreSucursal?.toLowerCase().trim();

        if (!b.sucursal) return false;

        if (typeof b.sucursal === 'object') {
            const idSuc = b.sucursal.idSucursal ?? b.sucursal.id_sucursal;
            if (idSuc && String(idSuc) === String(sucursalElegida)) return true;

            const nombreSuc = b.sucursal.nombreSucursal?.toLowerCase().trim();
            if (nombreSucElegida && nombreSuc && nombreSucElegida === nombreSuc) return true;
        }

        if (String(b.sucursal) === String(sucursalElegida)) return true;

        if (nombreSucElegida && String(b.sucursal).toLowerCase().trim() === nombreSucElegida) return true;

        return false;
    };

    const barberosDisponibles = barberos
        .filter(enSucursal)
        .sort((a, b) => Number(preferidos.includes(idDe(b))) - Number(preferidos.includes(idDe(a))));

    useEffect(() => {
        const lista = barberos
            .filter(enSucursal)
            .sort((a, b) => Number(preferidos.includes(idDe(b))) - Number(preferidos.includes(idDe(a))));
        setIdBarberoElegido(lista.length > 0 ? idDe(lista[0]) : '');
        setGuardarPreferido(false);
    }, [sucursalElegida, barberos, preferidos, sucursales]);

    useEffect(() => {
        if (!idBarberoElegido) {
            setOcupadas([]);
            return;
        }
        let cancelado = false;
        fetch(`${API_URL}/api/turnos/ocupados?idBarbero=${idBarberoElegido}&fecha=${fechaSeleccionada}`)
            .then((r) => (r.ok ? r.json() : []))
            .then((d) => { if (!cancelado) setOcupadas(Array.isArray(d) ? d : []); })
            .catch(() => { if (!cancelado) setOcupadas([]); });
        return () => { cancelado = true; };
    }, [idBarberoElegido, fechaSeleccionada]);

    const ahora = new Date();
    const hoyISO = fechaLocalISO(ahora);
    const horaActual = `${String(ahora.getHours()).padStart(2, '0')}:${String(ahora.getMinutes()).padStart(2, '0')}`;
    const horaNoDisponible = (h) => ocupadas.includes(h) || (fechaSeleccionada === hoyISO && h <= horaActual);

    useEffect(() => {
        if (horaSeleccionada && !horaNoDisponible(horaSeleccionada)) return;
        const libre = [...HORAS_MANANA, ...HORAS_TARDE].find((h) => !horaNoDisponible(h));
        setHoraSeleccionada(libre || '');
    }, [ocupadas, fechaSeleccionada]);

    const handleAgendarTurno = async (e) => {
        e.preventDefault();
        if (!servicioSeleccionado) {
            alert('Por favor selecciona un servicio.');
            return;
        }
        if (!idBarberoElegido) {
            alert('No hay barberos disponibles en esta sucursal.');
            return;
        }
        if (!horaSeleccionada) {
            alert('No hay horarios disponibles ese día. Elige otra fecha.');
            return;
        }

        setEnviando(true);

        const nuevoTurno = {
            fecha: fechaSeleccionada,
            horaInicio: `${horaSeleccionada}:00`,
            estado: 'PENDIENTE',
            notasCliente: notas || 'Sin notas especiales',
            idCliente: Number(idCliente),
            idBarbero: Number(idBarberoElegido),
            idServicio: Number(servicioSeleccionado.idServicio),
            idSucursal: Number(sucursalElegida)
        };

        try {
            const res = await fetch(`${API_URL}/api/turnos`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(nuevoTurno),
            });
            if (res.ok) {
                if (guardarPreferido) {
                    try {
                        await fetch(`${API_URL}/cliente-barbero`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                cliente: { idCliente: Number(idCliente) },
                                barbero: { idBarbero: Number(idBarberoElegido) },
                                estatus: true,
                            }),
                        });
                    } catch (_) { }
                }
                alert('¡Cita solicitada! Tu turno quedó en estado PENDIENTE hasta que el barbero lo confirme.');
                navigate('/cliente');
            } else {
                alert(await leerError(res, 'No se pudo agendar la cita.'));
            }
        } catch {
            alert('Error al conectar con la API.');
        } finally {
            setEnviando(false);
        }
    };

    const botonHora = (h) => {
        const isSelected = horaSeleccionada === h;
        const bloqueada = horaNoDisponible(h);
        return (
            <button
                key={h}
                type="button"
                disabled={bloqueada}
                onClick={() => setHoraSeleccionada(h)}
                className={`py-2.5 rounded-xl border text-xs font-bold transition-all ${
                    bloqueada
                        ? 'bg-[#111713] border-[#2D3E31] text-gray-600 line-through cursor-not-allowed opacity-50'
                        : isSelected
                            ? 'bg-[#E08A3E] text-[#111713] border-[#E08A3E] cursor-pointer'
                            : 'bg-[#111713] border-[#2D3E31] text-gray-300 hover:border-gray-500 cursor-pointer'
                }`}
            >
                {h}
            </button>
        );
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
                            <h1 className="text-xl font-extrabold tracking-tight text-white leading-none">BarberApp</h1>
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
                                <h2 className="text-3xl font-black text-white tracking-tight">Agendar tu cita</h2>
                                <p className="text-xs text-gray-400 mt-1">
                                    Ingresa tus datos, elige la sucursal y selecciona a tu barbero.
                                </p>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-300 mb-1.5">Nombre completo</label>
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
                                <label className="block text-xs font-semibold text-gray-300 mb-1.5">Número de teléfono</label>
                                <div className="relative flex items-center">
                                    <Phone className="absolute left-4 text-gray-400" size={16} />
                                    <input
                                        type="tel"
                                        required
                                        placeholder="Ej. +52 231 000 0000"
                                        value={telefonoCliente}
                                        onChange={(e) => setTelefonoCliente(e.target.value)}
                                        className="w-full py-3 pl-11 pr-4 bg-[#111713] border border-[#2D3E31] text-white rounded-2xl focus:outline-none focus:border-[#E08A3E] text-xs font-medium"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-300 mb-1.5">Sucursal</label>
                                <div className="relative flex items-center">
                                    <MapPin className="absolute left-4 text-gray-400" size={16} />
                                    <select
                                        value={sucursalElegida}
                                        onChange={(e) => setSucursalElegida(e.target.value)}
                                        className="w-full py-3 pl-11 pr-4 bg-[#111713] border border-[#2D3E31] text-white rounded-2xl focus:outline-none focus:border-[#E08A3E] text-xs font-medium appearance-none cursor-pointer"
                                    >
                                        {sucursales.length > 0 ? (
                                            sucursales.map((s) => (
                                                <option key={s.idSucursal} value={s.idSucursal}>
                                                    {s.nombreSucursal}
                                                </option>
                                            ))
                                        ) : (
                                            <option value="">Cargando sucursales disponibles...</option>
                                        )}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-300 mb-1.5">Barbero de preferencia</label>
                                <div className="relative flex items-center">
                                    <UserCheck className="absolute left-4 text-gray-400" size={16} />
                                    <select
                                        value={idBarberoElegido}
                                        onChange={(e) => { setIdBarberoElegido(e.target.value); setGuardarPreferido(false); }}
                                        className="w-full py-3 pl-11 pr-4 bg-[#111713] border border-[#2D3E31] text-white rounded-2xl focus:outline-none focus:border-[#E08A3E] text-xs font-medium appearance-none cursor-pointer"
                                        disabled={barberosDisponibles.length === 0}
                                    >
                                        {barberosDisponibles.length > 0 ? (
                                            barberosDisponibles.map((b) => (
                                                <option key={idDe(b)} value={idDe(b)}>
                                                    {preferidos.includes(idDe(b)) ? '★ ' : ''}
                                                    {b.nombreCompleto || b.nombre} {b.tituloRol ? `(${b.tituloRol})` : ''}
                                                </option>
                                            ))
                                        ) : (
                                            <option value="">No hay barberos asignados en esta sucursal</option>
                                        )}
                                    </select>
                                </div>
                                {idBarberoElegido && !preferidos.includes(idBarberoElegido) && (
                                    <label className="flex items-center gap-2 mt-2 px-1 text-[11px] text-gray-400 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={guardarPreferido}
                                            onChange={(e) => setGuardarPreferido(e.target.checked)}
                                            className="accent-[#E08A3E] cursor-pointer"
                                        />
                                        Guardar como mi barbero de preferencia
                                    </label>
                                )}
                            </div>

                            <div className="space-y-3 pt-2">
                                <label className="block text-xs font-semibold text-gray-300">Selección de fecha y hora</label>
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
                                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1.5">MAÑANA</span>
                                    <div className="grid grid-cols-4 gap-2.5">{HORAS_MANANA.map(botonHora)}</div>
                                </div>
                                <div>
                                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1.5">TARDE</span>
                                    <div className="grid grid-cols-4 gap-2.5">{HORAS_TARDE.map(botonHora)}</div>
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
                                        placeholder="Ej. Preferencia por navaja tradicional..."
                                        value={notas}
                                        onChange={(e) => setNotas(e.target.value)}
                                        className="w-full py-3 pl-11 pr-4 bg-[#111713] border border-[#2D3E31] text-white rounded-2xl focus:outline-none focus:border-[#E08A3E] text-xs font-medium"
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={enviando || cargando}
                            className="w-full mt-6 py-4 bg-[#E08A3E] hover:bg-[#c9762e] disabled:bg-gray-600 text-[#111713] font-black rounded-2xl transition-all shadow-xl cursor-pointer text-sm flex items-center justify-center gap-2"
                        >
                            {enviando ? 'Procesando cita...' : 'Confirmar y Solicitar Cita'}
                        </button>
                    </div>

                    <div className="lg:col-span-5 bg-[#1A251D] border border-[#2D3E31] p-6 sm:p-8 rounded-3xl flex flex-col justify-between shadow-2xl">
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-xl font-bold text-white tracking-tight">Elige el servicio</h3>
                                <p className="text-xs text-gray-400 mt-1">
                                    Todos nuestros servicios incluyen lavado de cabello y bebida de cortesía.
                                </p>
                            </div>

                            <div className="space-y-3">
                                {servicios.length === 0 && !cargando && (
                                    <p className="text-xs text-gray-500">No hay servicios disponibles por el momento.</p>
                                )}
                                {servicios.map((s) => {
                                    const isSelected = servicioSeleccionado?.idServicio === s.idServicio;
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
                                                <div
                                                    className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                                                        isSelected ? 'border-[#E08A3E] bg-[#E08A3E] text-[#111713]' : 'border-gray-500'
                                                    }`}
                                                >
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
                                    Si tienes dudas sobre qué corte elegir, tu barbero te guiará al inicio del turno según tus rasgos y
                                    objetivos de estilo.
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