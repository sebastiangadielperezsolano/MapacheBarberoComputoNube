import React from 'react';
import {
    LogOut,
    Home,
    Calendar,
    Heart,
    History,
    CreditCard,
    Settings,
    PlusCircle,
    Clock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ClienteDashboard() {
    const navigate = useNavigate();

    const handleLogout = () => {
        navigate('/login');
    };

    return (
        <div className="relative min-h-screen bg-[#111713] text-white font-sans p-4 sm:p-8 overflow-hidden">

            <div className="absolute top-[-100px] right-[-100px] w-[500px] h-[500px] bg-[#1A251D] rounded-full opacity-40 pointer-events-none" />
            <div className="absolute bottom-[-100px] left-[-100px] w-[500px] h-[500px] bg-[#1A251D] rounded-full opacity-40 pointer-events-none" />

            <header className="relative z-10 flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-[#1A251D] border border-[#2D3E31] rounded-2xl flex items-center justify-center p-2 shadow-inner">
                        <img
                            src="/mapache-logo.svg"
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

                <button
                    onClick={handleLogout}
                    className="py-2 px-5 bg-[#E08A3E] hover:bg-[#c9762e] text-[#111713] font-semibold rounded-xl flex items-center gap-2 transition-all shadow-md cursor-pointer text-sm"
                >
                    <LogOut size={16} />
                    <span>Salir</span>
                </button>
            </header>

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">

                <div className="lg:col-span-2 flex flex-col gap-8">

                    <div>
            <span className="text-xs tracking-widest text-[#E08A3E] font-bold uppercase block mb-1">
              El Mapache Bigotón
            </span>
                        <h2 className="text-4xl font-extrabold tracking-tight mb-2">
                            Hola, Mateo
                        </h2>
                        <p className="text-gray-400 text-sm max-w-xl">
                            Tu próximo turno ya está confirmado. Revisa tu agenda, accede a tus servicios favoritos y administra tus pagos desde un solo lugar.
                        </p>
                    </div>

                    <div className="bg-[#1A251D] border border-[#2D3E31] rounded-2xl p-6 shadow-xl">
                        <div className="flex justify-between items-center mb-4">
              <span className="text-[10px] tracking-widest text-[#E08A3E] font-bold uppercase">
                Próximo turno
              </span>
                            <span className="text-xs bg-[#111713] border border-[#2D3E31] text-gray-300 px-3 py-1 rounded-full font-medium">
                Hoy · 18:30
              </span>
                        </div>

                        <h3 className="text-2xl font-bold mb-4">Confirmado para hoy</h3>

                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#111713] p-4 rounded-xl border border-[#2D3E31] mb-6">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-800 border border-[#2D3E31]">
                                    <img
                                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"
                                        alt="Barbero Bruno"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold text-white">Corte clásico + barba</h4>
                                    <p className="text-xs text-gray-400">Con Bruno</p>
                                    <p className="text-xs text-gray-500 mt-1">18:30 · BarberApp Centro · 45 min</p>
                                </div>
                            </div>

                            <div className="flex gap-2 w-full sm:w-auto">
                                <button className="flex-1 sm:flex-initial py-2 px-4 bg-[#E08A3E] hover:bg-[#c9762e] text-[#111713] font-semibold rounded-lg text-xs transition-all">
                                    Ver turno
                                </button>
                                <button className="flex-1 sm:flex-initial py-2 px-4 bg-[#1A251D] hover:bg-[#25352a] text-gray-300 border border-[#2D3E31] rounded-lg text-xs transition-all">
                                    Cancelar
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div className="bg-[#111713] p-3 rounded-xl border border-[#2D3E31]">
                                <span className="block text-[10px] text-gray-400">Estado</span>
                                <span className="text-xs font-semibold text-white">Confirmado</span>
                            </div>
                            <div className="bg-[#111713] p-3 rounded-xl border border-[#2D3E31]">
                                <span className="block text-[10px] text-gray-400">Pago</span>
                                <span className="text-xs font-semibold text-white">Tarjeta terminada en 4242</span>
                            </div>
                            <div className="bg-[#111713] p-3 rounded-xl border border-[#2D3E31]">
                                <span className="block text-[10px] text-gray-400">Llegada</span>
                                <span className="text-xs font-semibold text-white">10 min antes</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <div>
                <span className="text-[10px] tracking-widest text-[#E08A3E] font-bold uppercase block">
                  Accesos rápidos
                </span>
                                <h3 className="text-xl font-bold">Gestiona tu experiencia</h3>
                            </div>
                            <span className="text-xs text-gray-500">Última actualización hoy</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="bg-[#1A251D] border border-[#2D3E31] p-5 rounded-2xl hover:border-[#E08A3E] transition-colors cursor-pointer group">
                                <div className="w-10 h-10 bg-[#111713] border border-[#2D3E31] rounded-xl flex items-center justify-center text-[#E08A3E] mb-3 group-hover:scale-105 transition-transform">
                                    <Calendar size={20} />
                                </div>
                                <h4 className="font-bold text-sm mb-1">Agendar turno</h4>
                                <p className="text-xs text-gray-400 mb-4">Elige fecha, hora y servicio con un solo clic.</p>
                                <button className="text-xs text-[#E08A3E] font-semibold hover:underline"
                                    onClick={() => navigate('/agendar')}
                                    className="text-xs text-[#E08A3E] font-semibold hover:underline"
                                >
                                    Agendar →
                                </button>
                            </div>

                            <div className="bg-[#1A251D] border border-[#2D3E31] p-5 rounded-2xl hover:border-[#E08A3E] transition-colors cursor-pointer group">
                                <div className="w-10 h-10 bg-[#111713] border border-[#2D3E31] rounded-xl flex items-center justify-center text-[#E08A3E] mb-3 group-hover:scale-105 transition-transform">
                                    <Heart size={20} />
                                </div>
                                <h4 className="font-bold text-sm mb-1">Mis barberos favoritos</h4>
                                <p className="text-xs text-gray-400 mb-4">Vuelve con Bruno u otros barberos que ya conoces.</p>
                                <button className="text-xs text-[#E08A3E] font-semibold hover:underline">
                                    Ver favoritos →
                                </button>
                            </div>

                            <div className="bg-[#1A251D] border border-[#2D3E31] p-5 rounded-2xl hover:border-[#E08A3E] transition-colors cursor-pointer group">
                                <div className="w-10 h-10 bg-[#111713] border border-[#2D3E31] rounded-xl flex items-center justify-center text-[#E08A3E] mb-3 group-hover:scale-105 transition-transform">
                                    <History size={20} />
                                </div>
                                <h4 className="font-bold text-sm mb-1">Historial de turnos</h4>
                                <p className="text-xs text-gray-400 mb-4">Revisa tus visitas pasadas y el detalle de cada servicio.</p>
                                <button className="text-xs text-[#E08A3E] font-semibold hover:underline">
                                    Ver historial →
                                </button>
                            </div>
                        </div>
                    </div>

                </div>

                <div className="flex flex-col gap-6">

                    <div className="bg-[#1A251D] border border-[#2D3E31] rounded-2xl p-4">
                        <div className="flex justify-between items-center mb-4 pb-3 border-b border-[#2D3E31]">
              <span className="text-[10px] tracking-widest text-[#E08A3E] font-bold uppercase">
                Navegación
              </span>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-[#111713] border border-[#2D3E31] flex items-center justify-center text-xs font-bold text-white">
                                    M
                                </div>
                                <div className="text-right">
                                    <span className="block text-xs font-bold leading-none">Mateo</span>
                                    <span className="text-[10px] text-gray-400">Cliente</span>
                                </div>
                            </div>
                        </div>

                        <nav className="flex flex-col gap-1.5">
                            <button className="flex items-center gap-3 w-full p-3 bg-[#111713] border border-[#2D3E31] text-[#E08A3E] font-semibold text-xs rounded-xl transition-all">
                                <Home size={16} />
                                <span>Inicio</span>
                            </button>
                            <button className="flex items-center gap-3 w-full p-3 hover:bg-[#111713] text-gray-300 font-medium text-xs rounded-xl transition-all">
                                <Calendar size={16} />
                                <span>Mis turnos</span>
                            </button>
                            <button className="flex items-center gap-3 w-full p-3 hover:bg-[#111713] text-gray-300 font-medium text-xs rounded-xl transition-all">
                                <Heart size={16} />
                                <span>Favoritos</span>
                            </button>
                            <button className="flex items-center gap-3 w-full p-3 hover:bg-[#111713] text-gray-300 font-medium text-xs rounded-xl transition-all">
                                <History size={16} />
                                <span>Historial</span>
                            </button>
                            <button className="flex items-center gap-3 w-full p-3 hover:bg-[#111713] text-gray-300 font-medium text-xs rounded-xl transition-all">
                                <CreditCard size={16} />
                                <span>Pagos</span>
                            </button>
                            <button className="flex items-center gap-3 w-full p-3 hover:bg-[#111713] text-gray-300 font-medium text-xs rounded-xl transition-all">
                                <Settings size={16} />
                                <span>Configuración</span>
                            </button>
                        </nav>
                    </div>

                    <div className="bg-[#1A251D] border border-[#2D3E31] rounded-2xl p-5">
                        <div className="flex justify-between items-center mb-4">
              <span className="text-[10px] tracking-widest text-[#E08A3E] font-bold uppercase">
                Resumen
              </span>
                            <span className="text-[10px] text-gray-500">Actualizado hoy</span>
                        </div>

                        <div className="flex flex-col gap-3 text-xs mb-5">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400">Turnos este mes</span>
                                <span className="font-bold text-white">2</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400">Favoritos</span>
                                <span className="font-bold text-white">3</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400">Último pago</span>
                                <span className="font-bold text-white">$1.250</span>
                            </div>
                        </div>

                        <button className="w-full py-2.5 px-4 bg-[#111713] hover:bg-[#162019] text-gray-200 border border-[#2D3E31] font-semibold text-xs rounded-xl transition-all">
                            Ver resumen
                        </button>
                    </div>

                </div>

            </div>

        </div>
    );
}