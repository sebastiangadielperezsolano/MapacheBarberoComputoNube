import React, { useState } from 'react';
import { User, Mail, Lock, Phone, ArrowLeft, ShieldCheck, Scissors, Award, Briefcase } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:8080';

export default function RegistroBarbero() {
    const navigate = useNavigate();


    const [formData, setFormData] = useState({
        nombreCompleto: '',
        email: '',
        telefono: '',
        password: '',
        experiencia: 1,
        tituloRol: 'Barbero Principal', // String exigido por Barbero
        tipoUsuario: 'BARBERO',         // Exigido por Usuario
        perfil: 'BARBERO'               // Exigido por Usuario (columna NOT NULL)
    });
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: name === 'experiencia' ? parseInt(value) || 0 : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg('');

        try {
            const response = await fetch(`${API_URL}/barbero`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok || response.status === 201) {
                alert('¡Barbero registrado con éxito!');
                navigate('/barbero');
            } else {
                const errorData = await response.json().catch(() => null);
                setErrorMsg(errorData?.message || 'Error 400: Faltan campos requeridos en el servidor.');
            }
        } catch (error) {
            console.error('Error de red:', error);
            setErrorMsg('No se pudo conectar con el servidor.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen bg-[#111713] text-white flex flex-col justify-between overflow-hidden font-sans">
            <div className="absolute top-[-100px] right-[-100px] w-96 h-96 bg-[#1A251D] rounded-full opacity-60 pointer-events-none" />

            <header className="relative z-10 p-6 flex items-center justify-between max-w-4xl mx-auto w-full">
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

            <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-8">
                <div className="w-full max-w-md bg-[#1A251D] border border-[#2D3E31] rounded-2xl p-8 shadow-2xl">
                    <div className="text-center mb-6">
                        <span className="text-xs tracking-widest text-[#E08A3E] font-bold uppercase mb-1 block">
                            Administración de personal
                        </span>
                        <h2 className="text-3xl font-extrabold tracking-tight">
                            Registrar Barbero
                        </h2>
                    </div>

                    {errorMsg && (
                        <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 text-red-300 text-xs rounded-xl text-center">
                            {errorMsg}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-300 mb-1.5">Nombre completo</label>
                            <div className="relative flex items-center">
                                <User className="absolute left-3 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    name="nombreCompleto"
                                    required
                                    placeholder="Ej. Bruno Martínez"
                                    value={formData.nombreCompleto}
                                    onChange={handleChange}
                                    className="w-full py-3 pl-10 pr-4 bg-[#111713] border border-[#2D3E31] text-white rounded-xl focus:outline-none focus:border-[#E08A3E] text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-300 mb-1.5">Correo profesional</label>
                            <div className="relative flex items-center">
                                <Mail className="absolute left-3 text-gray-400" size={18} />
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    placeholder="barbero@mapache.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full py-3 pl-10 pr-4 bg-[#111713] border border-[#2D3E31] text-white rounded-xl focus:outline-none focus:border-[#E08A3E] text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-300 mb-1.5">Teléfono de contacto</label>
                            <div className="relative flex items-center">
                                <Phone className="absolute left-3 text-gray-400" size={18} />
                                <input
                                    type="tel"
                                    name="telefono"
                                    required
                                    placeholder="+52 231 000 0000"
                                    value={formData.telefono}
                                    onChange={handleChange}
                                    className="w-full py-3 pl-10 pr-4 bg-[#111713] border border-[#2D3E31] text-white rounded-xl focus:outline-none focus:border-[#E08A3E] text-sm"
                                />
                            </div>
                        </div>

                        {/* Campo Experiencia */}
                        <div>
                            <label className="block text-xs font-medium text-gray-300 mb-1.5">Años de Experiencia</label>
                            <div className="relative flex items-center">
                                <Award className="absolute left-3 text-gray-400" size={18} />
                                <input
                                    type="number"
                                    name="experiencia"
                                    min="0"
                                    required
                                    value={formData.experiencia}
                                    onChange={handleChange}
                                    className="w-full py-3 pl-10 pr-4 bg-[#111713] border border-[#2D3E31] text-white rounded-xl focus:outline-none focus:border-[#E08A3E] text-sm"
                                />
                            </div>
                        </div>

                        {/* Campo Título o Rol */}
                        <div>
                            <label className="block text-xs font-medium text-gray-300 mb-1.5">Título / Rol en Barbería</label>
                            <div className="relative flex items-center">
                                <Briefcase className="absolute left-3 text-gray-400" size={18} />
                                <select
                                    name="tituloRol"
                                    value={formData.tituloRol}
                                    onChange={handleChange}
                                    className="w-full py-3 pl-10 pr-4 bg-[#111713] border border-[#2D3E31] text-white rounded-xl focus:outline-none focus:border-[#E08A3E] text-sm appearance-none cursor-pointer"
                                >
                                    <option value="Barbero Principal">Barbero Principal</option>
                                    <option value="Especialista en Diseños">Especialista en Diseños</option>
                                    <option value="Colorista">Colorista</option>
                                    <option value="Asistente de Barbería">Asistente de Barbería</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-300 mb-1.5">Contraseña de acceso</label>
                            <div className="relative flex items-center">
                                <Lock className="absolute left-3 text-gray-400" size={18} />
                                <input
                                    type="password"
                                    name="password"
                                    required
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full py-3 pl-10 pr-4 bg-[#111713] border border-[#2D3E31] text-white rounded-xl focus:outline-none focus:border-[#E08A3E] text-sm"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full mt-3 py-3 px-6 bg-[#E08A3E] hover:bg-[#c9762e] disabled:bg-gray-600 text-[#111713] font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg cursor-pointer text-sm"
                        >
                            <ShieldCheck size={18} />
                            <span>{loading ? 'Guardando...' : 'Guardar y Dar de Alta'}</span>
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
}