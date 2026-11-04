import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Phone, Mail, Camera, Check, Award, Heart } from 'lucide-react';

export default function AjustesCliente() {
    const navigate = useNavigate();

    const [usuario, setUsuario] = useState(() => {
        try {
            const sesion = localStorage.getItem('usuarioSesion') || localStorage.getItem('usuario');
            return sesion ? JSON.parse(sesion) : {
                idUsuario: 1,
                nombreCompleto: 'Mateo Ruiz',
                telefono: '+52 222 123 4567',
                email: 'cliente@barberapp.com',
                avatar: '/defecto.png',
                rol: 'CLIENTE'
            };
        } catch {
            return null;
        }
    });

    const [nombre, setNombre] = useState(usuario?.nombreCompleto || usuario?.nombre_completo || '');
    const [telefono, setTelefono] = useState(usuario?.telefono || '');
    const [email, setEmail] = useState(usuario?.email || '');
    const [avatarSeleccionado, setAvatarSeleccionado] = useState(usuario?.avatar || '/defecto.jpg');
    const [guardado, setGuardado] = useState(false);

    const avataresCliente = [
        { id: 1, ruta: '/defecto.jpg', label: 'Predeterminado' },
        { id: 2, ruta: '/de_pelos.jpg', label: 'Mapache Clásico' },
        { id: 3, ruta: '/usuario.jpg', label: 'Mapache Elegante' },
        { id: 4, ruta: '/racoon_1.png', label: 'Mapache Casual' },
    ];

    const handleGuardarAjustes = (e) => {
        e.preventDefault();

        const usuarioActualizado = {
            ...usuario,
            nombreCompleto: nombre,
            nombre_completo: nombre,
            telefono: telefono,
            email: email,
            avatar: avatarSeleccionado,
            rol: 'CLIENTE'
        };

        localStorage.setItem('usuarioSesion', JSON.stringify(usuarioActualizado));
        localStorage.setItem('usuario', JSON.stringify(usuarioActualizado));

        if (email) {
            const avatarsGuardados = JSON.parse(localStorage.getItem('avatars_usuarios') || '{}');
            avatarsGuardados[email.toLowerCase()] = avatarSeleccionado;
            localStorage.setItem('avatars_usuarios', JSON.stringify(avatarsGuardados));
        }

        setGuardado(true);
        setTimeout(() => {
            setGuardado(false);
            navigate(usuario?.rol === 'BARBERO' ? '/barbero' : '/cliente');
        }, 1200);
    };

    return (
        <div className="relative min-h-screen w-full bg-[#111713] text-white font-sans p-4 sm:p-8 md:p-12 overflow-x-hidden flex flex-col justify-between">
            <div className="absolute top-[-150px] right-[-150px] w-[800px] h-[800px] bg-[#1A251D] rounded-full opacity-40 pointer-events-none" />

            <div className="relative z-10 w-full flex-1 flex flex-col max-w-7xl mx-auto">
                <header className="flex items-center justify-between mb-8 pb-4 border-b border-[#2D3E31] w-full">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/cliente')}
                            className="w-11 h-11 bg-[#1A251D] border border-[#2D3E31] rounded-2xl flex items-center justify-center hover:bg-[#25352a] text-gray-300 transition-colors cursor-pointer"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div className="w-12 h-12 bg-[#1A251D] border border-[#E08A3E]/40 rounded-2xl flex items-center justify-center p-2 shadow-inner">
                            <img src="/racoon_1.png" alt="El Mapache Bigotón" className="w-full h-full object-contain" />
                        </div>
                        <div>
                            <span className="block text-[10px] tracking-widest text-[#E08A3E] font-bold uppercase">
                                Panel de Cliente
                            </span>
                            <h1 className="text-2xl font-black tracking-tight text-white leading-none">
                                Mi Perfil y Preferencias
                            </h1>
                        </div>
                    </div>

                    <div className="hidden sm:flex items-center gap-2 bg-[#1A251D] border border-[#2D3E31] px-4 py-2 rounded-2xl text-xs text-gray-300">
                        <Award size={16} className="text-[#E08A3E]" />
                        <span>Cliente VIP · El Mapache Bigotón</span>
                    </div>
                </header>

                <form onSubmit={handleGuardarAjustes} className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full flex-1">
                    <div className="lg:col-span-5 flex flex-col items-center bg-[#1A251D] border border-[#2D3E31] p-8 rounded-3xl shadow-2xl justify-between">
                        <div className="w-full flex flex-col items-center">
                            <span className="text-[11px] font-bold text-[#E08A3E] tracking-widest uppercase mb-6">
                                Tu Foto de Perfil
                            </span>

                            <div className="relative w-36 h-36 bg-[#111713] border-4 border-[#E08A3E] rounded-full p-2 mb-6 shadow-2xl flex items-center justify-center group">
                                <img
                                    src={avatarSeleccionado}
                                    alt="Avatar Vista Previa"
                                    className="w-full h-full object-cover rounded-full"
                                    onError={(e) => { e.target.src = '/defecto.png'; }}
                                />
                                <div className="absolute bottom-1 right-1 bg-[#E08A3E] text-[#111713] p-2.5 rounded-full border-2 border-[#1A251D]">
                                    <Camera size={16} />
                                </div>
                            </div>

                            <p className="text-xs text-gray-400 text-center mb-6 max-w-xs">
                                Elige la imagen que se mostrará en tu saludo principal cuando entres a la app.
                            </p>

                            <div className="grid grid-cols-2 gap-4 w-full">
                                {avataresCliente.map((a) => {
                                    const isSelected = avatarSeleccionado === a.ruta;
                                    return (
                                        <button
                                            key={a.id}
                                            type="button"
                                            onClick={() => setAvatarSeleccionado(a.ruta)}
                                            className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all cursor-pointer ${
                                                isSelected
                                                    ? 'bg-[#111713] border-[#E08A3E] shadow-lg scale-102'
                                                    : 'bg-[#111713] border-[#2D3E31] hover:border-gray-500'
                                            }`}
                                        >
                                            <div className="w-12 h-12 p-1">
                                                <img src={a.ruta} alt={a.label} className="w-full h-full object-contain" />
                                            </div>
                                            <span className="text-xs font-bold text-gray-300">{a.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="w-full mt-6 pt-6 border-t border-[#2D3E31] flex items-center justify-center gap-2 text-xs text-gray-400">
                            <Heart size={14} className="text-[#E08A3E]" />
                            <span>Gracias por ser parte de El Mapache Bigotón</span>
                        </div>
                    </div>

                    <div className="lg:col-span-7 flex flex-col justify-between bg-[#1A251D] border border-[#2D3E31] p-8 rounded-3xl shadow-2xl">
                        <div className="space-y-6">
                            <div className="flex items-center justify-between border-b border-[#2D3E31] pb-3">
                                <span className="text-[11px] font-bold text-[#E08A3E] tracking-widest uppercase">
                                    Información de Contacto
                                </span>
                                <span className="text-xs text-gray-500">
                                    Datos para confirmación de citas
                                </span>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-300 mb-2 uppercase tracking-wider">
                                    Nombre Completo
                                </label>
                                <div className="relative flex items-center">
                                    <User className="absolute left-4 text-gray-400" size={20} />
                                    <input
                                        type="text"
                                        required
                                        value={nombre}
                                        onChange={(e) => setNombre(e.target.value)}
                                        className="w-full py-4 pl-12 pr-4 bg-[#111713] border border-[#2D3E31] text-white rounded-2xl focus:outline-none focus:border-[#E08A3E] text-sm font-medium"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-300 mb-2 uppercase tracking-wider">
                                    Teléfono Móvil
                                </label>
                                <div className="relative flex items-center">
                                    <Phone className="absolute left-4 text-gray-400" size={20} />
                                    <input
                                        type="tel"
                                        required
                                        value={telefono}
                                        onChange={(e) => setTelefono(e.target.value)}
                                        className="w-full py-4 pl-12 pr-4 bg-[#111713] border border-[#2D3E31] text-white rounded-2xl focus:outline-none focus:border-[#E08A3E] text-sm font-medium"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-300 mb-2 uppercase tracking-wider">
                                    Correo Electrónico
                                </label>
                                <div className="relative flex items-center">
                                    <Mail className="absolute left-4 text-gray-400" size={20} />
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full py-4 pl-12 pr-4 bg-[#111713] border border-[#2D3E31] text-white rounded-2xl focus:outline-none focus:border-[#E08A3E] text-sm font-medium"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mt-10 pt-6 border-t border-[#2D3E31]">
                            <button
                                type="submit"
                                className="w-full py-4 bg-[#E08A3E] hover:bg-[#c9762e] text-[#111713] font-black rounded-2xl transition-all shadow-xl cursor-pointer text-base flex items-center justify-center gap-2"
                            >
                                {guardado ? (
                                    <>
                                        <Check size={20} />
                                        <span>¡Perfil de Cliente Actualizado!</span>
                                    </>
                                ) : (
                                    <span>Guardar Mis Cambios</span>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            <footer className="relative z-10 p-4 text-center text-xs text-gray-600 mt-8">
                El Mapache Bigotón &copy; BarberApp
            </footer>
        </div>
    );
}