import React, { useState } from 'react';
import { Building2, MapPin, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { API_URL, leerError } from '../../api.js';

export default function NuevoLocal() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        nombreSucursal: '',
        direccion: ''
    });

    const [loading, setLoading] = useState(false);
    const [mensajeEstado, setMensajeEstado] = useState({ tipo: '', texto: '' });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMensajeEstado({ tipo: '', texto: '' });

        if (!formData.nombreSucursal.trim()) {
            setMensajeEstado({
                tipo: 'error',
                texto: 'El nombre del local o sucursal es obligatorio.'
            });
            setLoading(false);
            return;
        }

        const payload = {
            nombreSucursal: formData.nombreSucursal.trim(),
            direccion: formData.direccion.trim()
        };

        try {
            const response = await fetch(`${API_URL}/api/sucursales`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok || response.status === 201) {
                setMensajeEstado({
                    tipo: 'exito',
                    texto: '¡Nuevo local registrado con éxito! Redirigiendo...'
                });

                setTimeout(() => {
                    navigate('/barbero');
                }, 1500);
            } else {
                const errorTexto = await leerError(response, 'No se pudo registrar el nuevo local.');
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

            <header className="relative z-10 flex items-center justify-between w-full mb-6">
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
            </header>

            <main className="relative z-10 max-w-md mx-auto w-full my-auto">
                <div className="bg-[#1A251D] border border-[#2D3E31] rounded-2xl p-6 sm:p-8 shadow-2xl">
                    <div className="text-center mb-6">
                        <span className="text-[10px] tracking-widest text-[#E08A3E] font-bold uppercase block mb-1">
                            Administración
                        </span>
                        <h2 className="text-2xl font-black text-white flex items-center justify-center gap-2">
                            <Building2 size={24} className="text-[#E08A3E]" />
                            <span>Crear Nuevo Local</span>
                        </h2>
                        <p className="text-xs text-gray-400 mt-1">
                            Añade una nueva sucursal para asignar barberos y agendar citas.
                        </p>
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
                            <label className="block text-xs font-medium text-gray-300 mb-1.5">Nombre del Local / Sucursal</label>
                            <div className="relative flex items-center">
                                <Building2 className="absolute left-3 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    name="nombreSucursal"
                                    required
                                    value={formData.nombreSucursal}
                                    onChange={handleChange}
                                    placeholder="Ej. Sucursal Poniente"
                                    className="w-full py-3 pl-10 pr-4 bg-[#111713] border border-[#2D3E31] text-white rounded-xl focus:outline-none focus:border-[#E08A3E] text-sm font-medium"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-300 mb-1.5">Dirección Ubicación</label>
                            <div className="relative flex items-center">
                                <MapPin className="absolute left-3 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    name="direccion"
                                    required
                                    value={formData.direccion}
                                    onChange={handleChange}
                                    placeholder="Ej. Av. Universidad #402, Col. Lindavista"
                                    className="w-full py-3 pl-10 pr-4 bg-[#111713] border border-[#2D3E31] text-white rounded-xl focus:outline-none focus:border-[#E08A3E] text-sm"
                                />
                            </div>
                        </div>

                        <div className="mt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 px-6 bg-[#E08A3E] hover:bg-[#c9762e] disabled:bg-gray-600 text-[#111713] font-extrabold rounded-xl text-xs transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                            >
                                <span>{loading ? 'Guardando...' : 'Crear Local'}</span>
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