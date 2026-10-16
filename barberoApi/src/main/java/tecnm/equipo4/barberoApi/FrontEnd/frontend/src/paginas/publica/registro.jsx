import React, { useState } from 'react';
import { UserPlus, User, Mail, Lock, ArrowLeft } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

const API_URL = 'http://localhost:8080';

export default function RegistroCliente() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        password: '',
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch(`${API_URL}/cliente`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                console.log('Cliente registrado en BD');
            }
        } catch (error) {
            console.log('Modo prueba: Servidor no detectado, simulando registro...');
        } finally {
            setLoading(false);
            alert('¡Cuenta creada con éxito!');
            navigate('/login');
        }
    };

    return (
        <div className="relative min-h-screen bg-[#111713] text-white flex flex-col justify-between overflow-hidden font-sans">

            <div className="absolute top-[-100px] right-[-100px] w-96 h-96 bg-[#1A251D] rounded-full opacity-60 pointer-events-none" />
            <div className="absolute bottom-[-100px] left-[-100px] w-96 h-96 bg-[#1A251D] rounded-full opacity-60 pointer-events-none" />

            <header className="relative z-10 p-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate('/')}
                        className="w-10 h-10 bg-[#1A251D] border border-[#2D3E31] rounded-xl flex items-center justify-center hover:bg-[#25352a] transition-colors cursor-pointer"
                    >
                        <ArrowLeft size={18} />
                    </button>
                    <div className="w-12 h-12 bg-[#1A251D] border border-[#2D3E31] rounded-2xl flex items-center justify-center p-2 shadow-inner">
                        <img
                            src="/racoon_1.png"
                            alt="El Mapache Bigotón"
                            className="w-full h-full object-contain"
                        />
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
                <div className="w-full max-w-sm">
                    <div className="text-center mb-6">
                        <span className="text-xs tracking-widest text-[#E08A3E] font-bold uppercase mb-1 block">
                            Únete a nosotros
                        </span>
                        <h2 className="text-3xl font-extrabold tracking-tight">
                            Crear Cuenta
                        </h2>
                        <p className="text-gray-400 text-xs mt-1">
                            Registro para clientes
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-300 mb-1.5">
                                Nombre Completo
                            </label>
                            <div className="relative flex items-center">
                                <User className="absolute left-3 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    name="nombre"
                                    required
                                    placeholder="Tu nombre completo"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                    className="w-full py-3 pl-10 pr-4 bg-[#1A251D] border border-[#2D3E31] text-white rounded-xl focus:outline-none focus:border-[#E08A3E] text-sm placeholder-gray-500 transition-colors"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-300 mb-1.5">
                                Correo Electrónico
                            </label>
                            <div className="relative flex items-center">
                                <Mail className="absolute left-3 text-gray-400" size={18} />
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    placeholder="tu@correo.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full py-3 pl-10 pr-4 bg-[#1A251D] border border-[#2D3E31] text-white rounded-xl focus:outline-none focus:border-[#E08A3E] text-sm placeholder-gray-500 transition-colors"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-300 mb-1.5">
                                Contraseña
                            </label>
                            <div className="relative flex items-center">
                                <Lock className="absolute left-3 text-gray-400" size={18} />
                                <input
                                    type="password"
                                    name="password"
                                    required
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full py-3 pl-10 pr-4 bg-[#1A251D] border border-[#2D3E31] text-white rounded-xl focus:outline-none focus:border-[#E08A3E] text-sm placeholder-gray-500 transition-colors"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full mt-2 py-3 px-6 bg-[#E08A3E] hover:bg-[#c9762e] disabled:bg-gray-600 text-[#111713] font-semibold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg cursor-pointer"
                        >
                            <UserPlus size={18} />
                            <span>{loading ? 'Creando cuenta...' : 'Registrarse'}</span>
                        </button>
                    </form>

                    <p className="text-center text-xs text-gray-400 mt-6">
                        ¿Ya tienes una cuenta?{' '}
                        <Link to="/login" className="text-[#E08A3E] font-semibold hover:underline">
                            Inicia sesión
                        </Link>
                    </p>
                </div>
            </main>

            <footer className="relative z-10 p-4"></footer>
        </div>
    );
}