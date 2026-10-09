import React, { useState } from 'react';
import { User, Mail, Lock, Phone, Scissors, ArrowLeft, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function RegistroBarbero() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        telefono: '',
        especialidad: 'Corte clásico y barba',
        password: '',
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Nuevo barbero registrado:', formData);
        alert('¡Barbero registrado con éxito!');
        navigate('/barbero');
    };

    return (
        <div className="relative min-h-screen bg-[#111713] text-white flex flex-col justify-between overflow-hidden font-sans">

            <div className="absolute top-[-100px] right-[-100px] w-96 h-96 bg-[#1A251D] rounded-full opacity-60 pointer-events-none" />
            <div className="absolute bottom-[-100px] left-[-100px] w-96 h-96 bg-[#1A251D] rounded-full opacity-60 pointer-events-none" />


            <header className="relative z-10 p-6 flex items-center justify-between max-w-4xl mx-auto w-full">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate('/barbero')}
                        className="w-10 h-10 bg-[#1A251D] border border-[#2D3E31] rounded-xl flex items-center justify-center hover:bg-[#25352a] transition-colors"
                    >
                        <ArrowLeft size={18} />
                    </button>
                    <div className="w-12 h-12 bg-[#1A251D] border border-[#2D3E31] rounded-2xl flex items-center justify-center p-2 shadow-inner">
                        <img src="/racoon.png" alt="El Mapache Bigotón" className="w-full h-full object-contain" />
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
                        <p className="text-gray-400 text-xs mt-1">
                            Crea una cuenta para un nuevo empleado del equipo
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-300 mb-1.5">Nombre completo</label>
                            <div className="relative flex items-center">
                                <User className="absolute left-3 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    name="nombre"
                                    required
                                    placeholder="Ej. Bruno Martínez"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                    className="w-full py-3 pl-10 pr-4 bg-[#111713] border border-[#2D3E31] text-white rounded-xl focus:outline-none focus:border-[#E08A3E] text-sm placeholder-gray-500"
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
                                    className="w-full py-3 pl-10 pr-4 bg-[#111713] border border-[#2D3E31] text-white rounded-xl focus:outline-none focus:border-[#E08A3E] text-sm placeholder-gray-500"
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
                                    placeholder="+54 9 11 0000-0000"
                                    value={formData.telefono}
                                    onChange={handleChange}
                                    className="w-full py-3 pl-10 pr-4 bg-[#111713] border border-[#2D3E31] text-white rounded-xl focus:outline-none focus:border-[#E08A3E] text-sm placeholder-gray-500"
                                />
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
                                    className="w-full py-3 pl-10 pr-4 bg-[#111713] border border-[#2D3E31] text-white rounded-xl focus:outline-none focus:border-[#E08A3E] text-sm placeholder-gray-500"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full mt-3 py-3 px-6 bg-[#E08A3E] hover:bg-[#c9762e] text-[#111713] font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg cursor-pointer text-sm"
                        >
                            <ShieldCheck size={18} />
                            <span>Guardar y Dar de Alta</span>
                        </button>
                    </form>
                </div>
            </main>

            <footer className="relative z-10 p-4"></footer>
        </div>
    );
}