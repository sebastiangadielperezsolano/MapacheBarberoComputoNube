import React, { useState, useEffect } from 'react';
import {
    UserPlus,
    Plus,
    Calendar,
    Search,
    Bell,
    DollarSign,
    Settings,
    CalendarX2,
    LogOut
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:8080';

export default function BarberoDashboard() {
    const navigate = useNavigate();

    const sesionRaw = localStorage.getItem('usuarioSesion') || localStorage.getItem('usuario') || '{}';
    const usuarioSesion = JSON.parse(sesionRaw);

    const nombreBarbero =
        usuarioSesion.nombreCompleto ||
        usuarioSesion.nombre ||
        usuarioSesion.usuario?.nombreCompleto ||
        'Barbero';

    const inicialBarbero = nombreBarbero.charAt(0).toUpperCase();

    const [barberos, setBarberos] = useState([]);
    const [turnos, setTurnos] = useState([]);
    const [disponibilidades, setDisponibilidades] = useState([]);
    const [pagos, setPagos] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [servicios, setServicios] = useState([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const cargarDatosDashboard = async () => {
            setLoading(true);
            try {
                const [
                    resBarberos,
                    resTurnos,
                    resDispo,
                    resPagos,
                    resClientes,
                    resServicios
                ] = await Promise.allSettled([
                    fetch(`${API_BASE_URL}/barbero`),
                    fetch(`${API_BASE_URL}/api/turnos`),
                    fetch(`${API_BASE_URL}/api/disponibilidades`),
                    fetch(`${API_BASE_URL}/api/pagos`),
                    fetch(`${API_BASE_URL}/cliente`),
                    fetch(`${API_BASE_URL}/api/servicios`)
                ]);

                if (resBarberos.status === 'fulfilled' && resBarberos.value.ok) {
                    setBarberos(await resBarberos.value.json());
                }
                if (resTurnos.status === 'fulfilled' && resTurnos.value.ok) {
                    setTurnos(await resTurnos.value.json());
                }
                if (resDispo.status === 'fulfilled' && resDispo.value.ok) {
                    setDisponibilidades(await resDispo.value.json());
                }
                if (resPagos.status === 'fulfilled' && resPagos.value.ok) {
                    setPagos(await resPagos.value.json());
                }
                if (resClientes.status === 'fulfilled' && resClientes.value.ok) {
                    setClientes(await resClientes.value.json());
                }
                if (resServicios.status === 'fulfilled' && resServicios.value.ok) {
                    setServicios(await resServicios.value.json());
                }
            } catch (error) {
                console.log('Backend sin conexión activa, mostrando estructura limpia.');
            } finally {
                setLoading(false);
            }
        };

        cargarDatosDashboard();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('usuarioSesion');
        localStorage.removeItem('usuario');
        navigate('/login');
    };

    const turnosCompletados = turnos.filter(t => t.estado === 'COMPLETADO' || t.estado === 'FINALIZADO').length;
    const turnosPendientes = turnos.filter(t => t.estado === 'PENDIENTE' || t.estado === 'CONFIRMADO').length;

    const ingresosDelDia = pagos.reduce((acc, p) => acc + (p.montoTotal || p.monto || 0), 0);
    const pagosPendientes = pagos.filter(p => p.estado === 'PENDIENTE').length;

    return (
        <div className="relative min-h-screen bg-[#111713] text-white font-sans p-4 sm:p-8 overflow-hidden">

            <div className="absolute top-[-100px] right-[-100px] w-[500px] h-[500px] bg-[#1A251D] rounded-full opacity-40 pointer-events-none" />

            <header className="relative z-10 flex flex-wrap items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-[#1A251D] border border-[#2D3E31] rounded-2xl flex items-center justify-center p-2 shadow-inner">
                        <img src="/racoon_1.png" alt="El Mapache Bigotón" className="w-full h-full object-contain" />
                    </div>
                    <div>
                        <span className="block text-[10px] tracking-widest text-[#E08A3E] font-bold uppercase">
                            El Mapache Bigotón
                        </span>
                        <h1 className="text-xl font-bold tracking-tight text-white leading-none">
                            BarberApp
                        </h1>
                    </div>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                    <div className="relative flex items-center">
                        <Search className="absolute left-3 text-gray-400" size={16} />
                        <input
                            type="text"
                            placeholder="Buscar cliente o servicio"
                            className="py-2 pl-9 pr-4 bg-[#1A251D] border border-[#2D3E31] text-xs text-white rounded-xl focus:outline-none focus:border-[#E08A3E] w-48 sm:w-64"
                        />
                    </div>

                    <button
                        onClick={() => navigate('/empleado')}
                        className="py-2 px-4 bg-[#1A251D] hover:bg-[#25352a] text-gray-200 border border-[#2D3E31] font-semibold rounded-xl flex items-center gap-2 transition-all cursor-pointer text-xs"
                    >
                        <UserPlus size={15} className="text-[#E08A3E]" />
                        <span>+ Nuevo barbero</span>
                    </button>

                    <div className="flex items-center gap-2 bg-[#1A251D] border border-[#2D3E31] p-1.5 px-3 rounded-xl">
                        <div className="w-7 h-7 rounded-full bg-[#E08A3E] text-[#111713] font-bold text-xs flex items-center justify-center">
                            {inicialBarbero}
                        </div>
                        <div className="text-left">
                            <span className="block text-xs font-bold leading-none">
                                {nombreBarbero}
                            </span>
                            <span className="text-[10px] text-gray-400 block">
                                Barbero Active
                            </span>
                        </div>
                    </div>

                    <button
                        onClick={handleLogout}
                        title="Cerrar sesión"
                        className="p-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl transition-all cursor-pointer flex items-center justify-center"
                    >
                        <LogOut size={16} />
                    </button>
                </div>
            </header>

            <div className="relative z-10 flex items-center justify-between mb-6 border-b border-[#2D3E31] pb-3 flex-wrap gap-3">
                <div className="flex gap-2">
                    <button className="py-1.5 px-4 bg-[#1A251D] border border-[#2D3E31] text-[#E08A3E] text-xs font-bold rounded-lg cursor-pointer">
                        Inicio
                    </button>
                    <button className="py-1.5 px-4 text-gray-400 hover:text-white text-xs font-medium rounded-lg cursor-pointer">
                        Agenda
                    </button>
                    <button className="py-1.5 px-4 text-gray-400 hover:text-white text-xs font-medium rounded-lg cursor-pointer">
                        Clientes ({clientes.length})
                    </button>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-xs bg-[#1A251D] border border-[#2D3E31] px-3 py-1 rounded-full text-gray-300">
                        {Array.isArray(disponibilidades) && disponibilidades.length > 0
                            ? `Hoy · ${disponibilidades[0]?.diaEntrada || '09:00'} - ${disponibilidades[0]?.diaSalida || '19:00'}`
                            : 'Hoy · 09:00 - 19:00'}
                    </span>
                    <span className="text-xs bg-[#E08A3E]/20 text-[#E08A3E] border border-[#E08A3E]/30 px-3 py-1 rounded-full font-bold">
                        {turnosPendientes} turnos próximos
                    </span>
                </div>
            </div>

            <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h2 className="text-3xl font-extrabold tracking-tight mb-1">
                        Hola, {nombreBarbero}
                    </h2>
                    <p className="text-xs text-gray-400">
                        Gestiona tu agenda, revisa el rendimiento del día y prepara la próxima atención.
                    </p>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button
                        onClick={() => navigate('/agendar')}
                        className="py-2.5 px-5 bg-[#E08A3E] hover:bg-[#c9762e] text-[#111713] font-bold rounded-xl flex items-center gap-2 text-xs transition-all shadow-lg cursor-pointer"
                    >
                        <Plus size={16} />
                        <span>+ Nuevo turno</span>
                    </button>
                </div>
            </div>

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6">

                <div className="lg:col-span-8 flex flex-col gap-6">

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div className="bg-[#1A251D] border border-[#2D3E31] p-4 rounded-2xl">
                            <span className="text-[10px] text-gray-400 block mb-1">Turnos completados</span>
                            <span className="text-2xl font-black">{turnosCompletados}</span>
                            <span className="text-[10px] text-gray-500 block mt-1">{turnosPendientes} pendientes</span>
                        </div>

                        <div className="bg-[#1A251D] border border-[#2D3E31] p-4 rounded-2xl">
                            <span className="text-[10px] text-gray-400 block mb-1">Ingreso del día</span>
                            <span className="text-2xl font-black text-[#E08A3E]">${ingresosDelDia}</span>
                            <span className="text-[10px] text-gray-500 block mt-1">{pagosPendientes} pagos pendientes</span>
                        </div>

                        <div className="bg-[#1A251D] border border-[#2D3E31] p-4 rounded-2xl">
                            <span className="text-[10px] text-gray-400 block mb-1">Clientes</span>
                            <span className="text-2xl font-black">{clientes.length}</span>
                            <span className="text-[10px] text-gray-500 block mt-1">Registrados</span>
                        </div>

                        <div className="bg-[#1A251D] border border-[#2D3E31] p-4 rounded-2xl">
                            <span className="text-[10px] text-gray-400 block mb-1">Total Turnos</span>
                            <span className="text-2xl font-black">{turnos.length}</span>
                            <span className="text-[10px] text-gray-500 block mt-1">En sistema</span>
                        </div>
                    </div>

                    {/* Agenda Diaria */}
                    <div className="bg-[#1A251D] border border-[#2D3E31] rounded-2xl p-6">
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <h3 className="font-bold text-lg">Agenda diaria</h3>
                                <span className="text-xs text-gray-400">
                                    {turnos.length} citas registradas
                                </span>
                            </div>
                        </div>

                        {turnos.length === 0 ? (
                            <div className="bg-[#111713] border border-[#2D3E31] rounded-xl p-8 flex flex-col items-center justify-center text-center my-2">
                                <CalendarX2 size={36} className="text-gray-500 mb-2" />
                                <h4 className="text-sm font-bold text-gray-300">Sin turnos agendados</h4>
                                <p className="text-xs text-gray-500 max-w-sm mt-1 mb-4">
                                    Los turnos agendados desde la base de datos aparecerán automáticamente en esta lista.
                                </p>
                                <button
                                    onClick={() => navigate('/agendar')}
                                    className="py-2 px-4 bg-[#1A251D] border border-[#2D3E31] text-[#E08A3E] font-semibold rounded-xl text-xs hover:border-[#E08A3E] transition-all cursor-pointer"
                                >
                                    + Agendar cita manualmente
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-3">
                                {turnos.map((t, idx) => {
                                    const clienteNombre = t.cliente?.nombreCompleto ||
                                        t.clienteNombre ||
                                        clientes.find(c => (c.idCliente || c.idUsuario) === t.idCliente)?.nombreCompleto ||
                                        'Cliente registrado';

                                    const servicioNombre = t.servicio?.nombreServicio ||
                                        t.servicioNombre ||
                                        servicios.find(s => s.idServicio === t.idServicio)?.nombreServicio ||
                                        'Servicio de barbería';

                                    return (
                                        <div key={t.idTurno || idx} className="flex items-center justify-between p-3 bg-[#111713] border border-[#2D3E31] rounded-xl">
                                            <div className="flex items-center gap-4">
                                                <span className="text-xs font-bold text-gray-400 w-12">
                                                    {t.horaInicio || t.hora || '09:00'}
                                                </span>
                                                <div className="w-8 h-8 bg-[#1A251D] border border-[#2D3E31] rounded-lg flex items-center justify-center text-xs font-bold text-[#E08A3E]">
                                                    {clienteNombre.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <h4 className="text-xs font-bold">{clienteNombre}</h4>
                                                    <p className="text-[10px] text-gray-500">{servicioNombre} • {t.fecha || 'Hoy'}</p>
                                                </div>
                                            </div>
                                            <span className="text-[10px] text-[#E08A3E] bg-[#E08A3E]/10 border border-[#E08A3E]/30 px-3 py-1 rounded-full font-semibold">
                                                {t.estado || 'CONFIRMADO'}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                </div>

                <div className="lg:col-span-4 flex flex-col gap-6">
                    <div className="bg-[#1A251D] border border-[#2D3E31] rounded-2xl p-5">
                        <h3 className="font-bold text-sm mb-4">Gestión rápida</h3>
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                onClick={() => navigate('/agendar')}
                                className="p-3 bg-[#111713] border border-[#2D3E31] text-xs font-medium rounded-xl flex items-center gap-2 hover:border-[#E08A3E] transition-colors cursor-pointer"
                            >
                                <Plus size={14} className="text-[#E08A3E]" />
                                <span>Nuevo turno</span>
                            </button>
                            <button className="p-3 bg-[#111713] border border-[#2D3E31] text-xs font-medium rounded-xl flex items-center gap-2 hover:border-[#E08A3E] transition-colors cursor-pointer">
                                <DollarSign size={14} className="text-[#E08A3E]" />
                                <span>Cobros ({pagos.length})</span>
                            </button>
                        </div>
                    </div>
                </div>

            </div>

        </div>
    );
}