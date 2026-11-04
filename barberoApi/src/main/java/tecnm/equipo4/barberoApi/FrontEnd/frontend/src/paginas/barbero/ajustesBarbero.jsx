import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Phone, Mail, Check, ShieldCheck } from 'lucide-react';
import { API_URL, leerSesion } from '../../api.js';

export default function AjustesBarbero() {
    const navigate = useNavigate();
    const [usuario] = useState(() => leerSesion() || {});

    const [nombre, setNombre] = useState(usuario?.nombreCompleto || usuario?.nombre || '');
    const [telefono, setTelefono] = useState(usuario?.telefono || '');
    const [email, setEmail] = useState(usuario?.email || '');

    let avatarsGuardados = {};
    try {
        avatarsGuardados = JSON.parse(localStorage.getItem('avatars_usuarios') || '{}');
    } catch {
        avatarsGuardados = {};
    }

    const [avatarSeleccionado, setAvatarSeleccionado] = useState(
        avatarsGuardados[(usuario?.email || '').toLowerCase()] || usuario?.avatar || usuario?.foto || '/defecto.jpg'
    );
    const [guardado, setGuardado] = useState(false);

    const avataresBarbero = [
        { id: 1, ruta: '/defecto.jpg', label: 'Predeterminado' },
        { id: 2, ruta: '/Confiable.jpg', label: 'Estilo 1' },
        { id: 3, ruta: '/barbero.jpg', label: 'Estilo 2' },
        { id: 4, ruta: '/racoon_1.png', label: 'Mapache' },
    ];

    const handleGuardarAjustes = (e) => {
        e.preventDefault();

        const usuarioActualizado = {
            ...usuario,
            nombreCompleto: nombre,
            telefono: telefono,
            email: email,
            avatar: avatarSeleccionado,
            tipo: 'BARBERO',
            rol: 'BARBERO'
        };

        localStorage.setItem('usuarioSesion', JSON.stringify(usuarioActualizado));
        localStorage.setItem('usuario', JSON.stringify(usuarioActualizado));

        if (email) {
            avatarsGuardados[email.toLowerCase()] = avatarSeleccionado;
            localStorage.setItem('avatars_usuarios', JSON.stringify(avatarsGuardados));
        }

        setGuardado(true);
        setTimeout(() => {
            setGuardado(false);
            navigate('/barbero');
        }, 1200);
    };

    return (
        <div className="relative min-h-screen w-full bg-[#111713] text-white font-sans p-4 sm:p-8 md:p-12 overflow-x-hidden flex flex-col justify-between">
            <div className="absolute top-[-150px] right-[-150px] w-[800px] h-[800px] bg-[#1A251D] rounded-full opacity-40 pointer-events-none" />

            <div className="relative z-10 w-full flex-1 flex flex-col max-w-7xl mx-auto">
                <header className="flex items-center justify-between mb-8 pb-4 border-b border-[#2D3E31] w-full">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/barbero')}
                            className="w-11 h-11 bg-[#1A251D] border border-[#2D3E31] rounded-2xl flex items-center justify-center hover:bg-[#25352a] text-gray-300 transition-colors cursor-pointer"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div className="w-12 h-12 bg-[#1A251D] border border-[#E08A3E] rounded-2xl flex items-center justify-center p-2 shadow-inner">
                            <img src="/racoon_1.png" alt="El Mapache Bigotón" className="w-full h-full object-contain" />
                        </div>
                        <div>
                            <span className="block text-[10px] tracking-widest text-[#E08A3E] font-bold uppercase">
                                Configuración Profesional
                            </span>
                            <h1 className="text-2xl font-black tracking-tight text-white leading-none">
                                Perfil de Barbero
                            </h1>
                        </div>
                    </div>
                </header>

                <form onSubmit={handleGuardarAjustes} className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full flex-1">
                    <div className="lg:col-span-5 flex flex-col items-center bg-[#1A251D] border border-[#2D3E31] p-8 rounded-3xl shadow-2xl justify-between">
                        <div className="w-full flex flex-col items-center">
                            <span className="text-[11px] font-bold text-[#E08A3E] tracking-widest uppercase mb-6">
                                Tu Avatar Profesional
                            </span>

                            <div className="relative w-36 h-36 bg-[#111713] border-4 border-[#E08A3E] rounded-full p-2 mb-6 shadow-2xl flex items-center justify-center">
                                <img
                                    src={avatarSeleccionado}
                                    alt="Avatar Vista Previa"
                                    className="w-full h-full object-cover rounded-full"
                                    onError={(e) => { e.target.src = '/defecto.jpg'; }}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4 w-full">
                                {avataresBarbero.map((a) => {
                                    const isSelected = avatarSeleccionado === a.ruta;
                                    return (
                                        <button
                                            key={a.id}
                                            type="button"
                                            onClick={() => setAvatarSeleccionado(a.ruta)}
                                            className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all cursor-pointer ${
                                                isSelected
                                                    ? 'bg-[#111713] border-[#E08A3E] shadow-lg'
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
                    </div>

                    <div className="lg:col-span-7 flex flex-col justify-between bg-[#1A251D] border border-[#2D3E31] p-8 rounded-3xl shadow-2xl">
                        <div className="space-y-6">
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
                                    Teléfono
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
                                        <span>¡Perfil Guardado!</span>
                                    </>
                                ) : (
                                    <span>Guardar Cambios</span>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}