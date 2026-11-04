import React, { useState, useEffect } from 'react';
import { User, Phone, Mail, Lock, ArrowLeft, CheckCircle2, ShieldCheck, UserPlus, Scissors } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { API_URL, normalizarTelefono, leerError } from '../../api.js';

export default function RegistroLocal() {
    const navigate = useNavigate();
    const sesionRaw = localStorage.getItem('usuarioSesion') || localStorage.getItem('usuario') || '{}';
    const usuarioSesion = JSON.parse(sesionRaw);

    const [barberos, setBarberos] = useState([]);
    const [formData, setFormData] = useState({
        nombreCompleto: '',
        telefono: '',
        email: '',
        password: '',
        tipoUsuario: 'CLIENTE',
        idBarbero: usuarioSesion.idUsuario || usuarioSesion.idCliente || usuarioSesion.idBarbero || 1
    });

    const [loading, setLoading] = useState(false);
    const [mensajeEstado, setMensajeEstado] = useState({ tipo: '', texto: '' });

    useEffect(() => {
        const cargarBarberos = async () => {
            try {
                const res = await fetch(`${API_URL}/barbero`);
                if (res.ok) {
                    const data = await res.json();
                    setBarberos(data);
                }
            } catch (err) {
                console.log('Error al cargar la lista de barberos.');
            }
        };
        cargarBarberos();
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMensajeEstado({ tipo: '', texto: '' });

        const passwordRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!]).{8,}$/;
        if (!passwordRegex.test(formData.password)) {
            setMensajeEstado({
                tipo: 'error',
                texto: 'La contraseña requiere: 8 caracteres, 1 mayúscula, 1 minúscula, 1 número y 1 carácter especial (@#$%^&+=!).'
            });
            setLoading(false);
            return;
        }

        const telefonoLimpio = normalizarTelefono(formData.telefono);
        if (telefonoLimpio.length < 10) {
            setMensajeEstado({
                tipo: 'error',
                texto: 'El teléfono debe tener al menos 10 dígitos.'
            });
            setLoading(false);
            return;
        }

        const clientePayload = {
            nombreCompleto: formData.nombreCompleto.trim(),
            telefono: telefonoLimpio,
            email: formData.email.trim(),
            password: formData.password,
            tipoUsuario: 'CLIENTE'
        };

        try {
            const responseCliente = await fetch(`${API_URL}/cliente`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(clientePayload),
            });

            if (responseCliente.ok || responseCliente.status === 201) {
                const clienteCreado = await responseCliente.json().catch(() => null);

                if (clienteCreado && formData.idBarbero) {
                    try {
                        await fetch(`${API_URL}/cliente-barbero`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                cliente: { idCliente: Number(clienteCreado.idCliente) },
                                barbero: { idBarbero: Number(formData.idBarbero) },
                                estatus: true
                            })
                        });
                    } catch (_) {
                        console.log('Cliente guardado, pero no se pudo asociar como frecuente.');
                    }
                }

                setMensajeEstado({
                    tipo: 'exito',
                    texto: '¡Cliente registrado y enlazado con éxito! Redirigiendo al dashboard...'
                });

                setTimeout(() => {
                    navigate('/barbero');
                }, 1500);
            } else {
                const errorTexto = await leerError(responseCliente, 'Verifica el formato del correo y teléfono.');
                setMensajeEstado({
                    tipo: 'error',
                    texto: `Error: ${errorTexto}`
                });
            }
        } catch (error) {
            console.error('Error de conexión:', error);
            setMensajeEstado({
                tipo: 'error',
                texto: 'No se pudo conectar con el servidor.'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen bg-[#111713] text-white font-sans p-4 sm:p-8 overflow-hidden flex flex-col justify-between">
            <div className="absolute top-[-100px] right-[-100px] w-[500px] h-[500px] bg-[#1A251D] rounded-full opacity-40 pointer-events-none" />
            <div className="absolute bottom-[-100px] left-[-100px] w-[500px] h-[500px] bg-[#1A251D] rounded-full opacity-40 pointer-events-none" />

            <header className="relative z-10 flex items-center justify-between max-w-4xl mx-auto w-full mb-6">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate('/barbero')}
                        className="w-10 h-10 bg-[#1A251D] border border-[#2D3E31] rounded-xl flex items-center justify-center hover:bg-[#25352a] transition-colors cursor-pointer"
                    >
                        <ArrowLeft size={18} />
                    </button>
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
                <div className="hidden sm:flex items-center gap-2 bg-[#1A251D] border border-[#2D3E31] px-3 py-1.5 rounded-xl text-xs text-gray-300">
                    <ShieldCheck size={16} className="text-[#E08A3E]" />
                    <span>Módulo de Barbero</span>
                </div>
            </header>

            <main className="relative z-10 max-w-xl mx-auto w-full my-auto">
                <div className="bg-[#1A251D] border border-[#2D3E31] rounded-2xl p-6 sm:p-8 shadow-2xl">
                    <div className="text-center mb-6">
                        <span className="text-[10px] tracking-widest text-[#E08A3E] font-bold uppercase block mb-1">
                            Atención en Barbería
                        </span>
                        <h2 className="text-2xl font-black text-white flex items-center justify-center gap-2">
                            <UserPlus size={24} className="text-[#E08A3E]" />
                            <span>Registro Local de Cliente</span>
                        </h2>
                    </div>

                    {mensajeEstado.texto && (
                        <div className={`mb-6 p-3.5 rounded-xl text-xs font-semibold text-center border ${
                            mensajeEstado.tipo === 'exito'
                                ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                                : 'bg-red-500/20 border-red-500/50 text-red-300'
                        }`}>
                            {mensajeEstado.texto}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-300 mb-1.5">Barbero que Atiende</label>
                            <div className="relative flex items-center">
                                <Scissors className="absolute left-3 text-gray-400" size={18} />
                                <select
                                    name="idBarbero"
                                    value={formData.idBarbero}
                                    onChange={handleChange}
                                    className="w-full py-3 pl-10 pr-4 bg-[#111713] border border-[#2D3E31] text-white rounded-xl focus:outline-none focus:border-[#E08A3E] text-sm font-medium cursor-pointer appearance-none"
                                >
                                    {barberos.length > 0 ? (
                                        barberos.map((b) => (
                                            <option key={b.idBarbero} value={b.idBarbero}>
                                                {b.nombreCompleto} {b.tituloRol ? `(${b.tituloRol})` : ''}
                                            </option>
                                        ))
                                    ) : (
                                        <option value={formData.idBarbero}>Barbero en Sesión</option>
                                    )}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-300 mb-1.5">Nombre Completo</label>
                            <div className="relative flex items-center">
                                <User className="absolute left-3 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    name="nombreCompleto"
                                    required
                                    value={formData.nombreCompleto}
                                    onChange={handleChange}
                                    placeholder="Ej. Mateo Ruiz"
                                    className="w-full py-3 pl-10 pr-4 bg-[#111713] border border-[#2D3E31] text-white rounded-xl focus:outline-none focus:border-[#E08A3E] text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-300 mb-1.5">Teléfono de Contacto</label>
                            <div className="relative flex items-center">
                                <Phone className="absolute left-3 text-gray-400" size={18} />
                                <input
                                    type="tel"
                                    name="telefono"
                                    required
                                    value={formData.telefono}
                                    onChange={handleChange}
                                    placeholder="Ej. 231 000 0000"
                                    className="w-full py-3 pl-10 pr-4 bg-[#111713] border border-[#2D3E31] text-white rounded-xl focus:outline-none focus:border-[#E08A3E] text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-300 mb-1.5">Correo Electrónico</label>
                            <div className="relative flex items-center">
                                <Mail className="absolute left-3 text-gray-400" size={18} />
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="cliente@correo.com"
                                    className="w-full py-3 pl-10 pr-4 bg-[#111713] border border-[#2D3E31] text-white rounded-xl focus:outline-none focus:border-[#E08A3E] text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-300 mb-1.5">Contraseña Temporal</label>
                            <div className="relative flex items-center">
                                <Lock className="absolute left-3 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    name="password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Ej. Cliente123!"
                                    className="w-full py-3 pl-10 pr-4 bg-[#111713] border border-[#2D3E31] text-white rounded-xl focus:outline-none focus:border-[#E08A3E] text-sm font-mono"
                                />
                            </div>
                        </div>

                        <div className="mt-4 flex gap-3">
                            <button
                                type="button"
                                onClick={() => navigate('/barbero')}
                                className="w-1/3 py-3 px-4 bg-[#111713] hover:bg-[#18221c] border border-[#2D3E31] text-gray-300 font-bold rounded-xl text-xs transition-all cursor-pointer"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-2/3 py-3 px-6 bg-[#E08A3E] hover:bg-[#c9762e] disabled:bg-gray-600 text-[#111713] font-extrabold rounded-xl text-xs transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                            >
                                <CheckCircle2 size={16} />
                                <span>{loading ? 'Guardando...' : 'Guardar y Volver'}</span>
                            </button>
                        </div>
                    </form>
                </div>
            </main>

            <footer className="relative z-10 p-4 text-center text-xs text-gray-500">
                El Mapache Bigotón &copy; BarberApp Local Module
            </footer>
        </div>
    );
}