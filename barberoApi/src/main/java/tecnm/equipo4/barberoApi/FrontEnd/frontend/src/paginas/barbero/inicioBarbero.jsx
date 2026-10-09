import React from 'react';
import {
    UserPlus,
    Plus,
    Calendar,
    Users,
    User,
    Search,
    Bell,
    DollarSign,
    Settings,
    FileText,
    Phone,
    Check
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function BarberoDashboard() {
    const navigate = useNavigate();

    return (
        <div className="relative min-h-screen bg-[#111713] text-white font-sans p-4 sm:p-8 overflow-hidden">

             <div className="absolute top-[-100px] right-[-100px] w-[500px] h-[500px] bg-[#1A251D] rounded-full opacity-40 pointer-events-none" />

            <header className="relative z-10 flex flex-wrap items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-[#1A251D] border border-[#2D3E31] rounded-2xl flex items-center justify-center p-2 shadow-inner">
                        <img src="/mapache-logo.svg" alt="El Mapache Bigotón" className="w-full h-full object-contain" />
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
                        onClick={() => navigate('/registro-barbero')}
                        className="py-2 px-4 bg-[#1A251D] hover:bg-[#25352a] text-gray-200 border border-[#2D3E31] font-semibold rounded-xl flex items-center gap-2 transition-all cursor-pointer text-xs"
                    >
                        <UserPlus size={15} className="text-[#E08A3E]" />
                        <span>+ Nuevo barbero</span>
                    </button>

                    <div className="flex items-center gap-2 bg-[#1A251D] border border-[#2D3E31] p-1.5 px-3 rounded-xl">
                        <div className="w-7 h-7 rounded-full bg-[#E08A3E] text-[#111713] font-bold text-xs flex items-center justify-center">
                            B
                        </div>
                        <div className="text-left">
                            <span className="block text-xs font-bold leading-none">Bruno</span>
                            <span className="text-[10px] text-gray-400">Barbero principal</span>
                        </div>
                    </div>
                </div>
            </header>

            <div className="relative z-10 flex items-center justify-between mb-6 border-b border-[#2D3E31] pb-3">
                <div className="flex gap-2">
                    <button className="py-1.5 px-4 bg-[#1A251D] border border-[#2D3E31] text-[#E08A3E] text-xs font-bold rounded-lg">
                        Inicio
                    </button>
                    <button className="py-1.5 px-4 text-gray-400 hover:text-white text-xs font-medium rounded-lg">
                        Agenda
                    </button>
                    <button className="py-1.5 px-4 text-gray-400 hover:text-white text-xs font-medium rounded-lg">
                        Clientes
                    </button>
                    <button className="py-1.5 px-4 text-gray-400 hover:text-white text-xs font-medium rounded-lg">
                        Perfil
                    </button>
                </div>

                <div className="flex items-center gap-2">
          <span className="text-xs bg-[#1A251D] border border-[#2D3E31] px-3 py-1 rounded-full text-gray-300">
            Hoy · 09:00 - 19:00
          </span>
                    <span className="text-xs bg-[#E08A3E]/20 text-[#E08A3E] border border-[#E08A3E]/30 px-3 py-1 rounded-full font-bold">
            2 turnos próximos
          </span>
                </div>
            </div>

            <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h2 className="text-3xl font-extrabold tracking-tight mb-1">
                        Hola, Vieja confiable
                    </h2>
                    <p className="text-xs text-gray-400">
                        Gestiona tu agenda, revisa el rendimiento del día y prepara la próxima atención desde un solo lugar.
                    </p>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button className="py-2.5 px-4 bg-[#1A251D] hover:bg-[#25352a] text-gray-200 border border-[#2D3E31] font-semibold rounded-xl flex items-center gap-2 text-xs transition-all">
                        <Calendar size={16} />
                        <span>Ver agenda</span>
                    </button>

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
                            <span className="text-2xl font-black">8</span>
                            <span className="text-[10px] text-gray-500 block mt-1">2 pendientes por confirmar</span>
                        </div>

                        <div className="bg-[#1A251D] border border-[#2D3E31] p-4 rounded-2xl">
                            <span className="text-[10px] text-gray-400 block mb-1">Ingreso del día</span>
                            <span className="text-2xl font-black text-[#E08A3E]">$184</span>
                            <span className="text-[10px] text-gray-500 block mt-1">3 pagos pendientes</span>
                        </div>

                        <div className="bg-[#1A251D] border border-[#2D3E31] p-4 rounded-2xl">
                            <span className="text-[10px] text-gray-400 block mb-1">Clientes hoy</span>
                            <span className="text-2xl font-black">12</span>
                            <span className="text-[10px] text-gray-500 block mt-1">4 nuevos registros</span>
                        </div>

                        <div className="bg-[#1A251D] border border-[#2D3E31] p-4 rounded-2xl">
                            <span className="text-[10px] text-gray-400 block mb-1">Ocupación</span>
                            <span className="text-2xl font-black">82%</span>
                            <span className="text-[10px] text-gray-500 block mt-1">2 franjas disponibles</span>
                        </div>
                    </div>

                    <div className="bg-[#1A251D] border border-[#2D3E31] rounded-2xl p-6">
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <h3 className="font-bold text-lg">Agenda diaria</h3>
                                <span className="text-xs text-gray-400">12 clientes programados - 2 turnos próximos</span>
                            </div>
                            <span className="text-xs bg-[#111713] border border-[#2D3E31] px-3 py-1 rounded-full text-gray-400">
                Hoy · 09:00 - 19:00
              </span>
                        </div>

                        <div className="flex flex-col gap-3">
                            {[
                                { hora: '09:00', cliente: 'Lucas Cruz', servicio: 'Corte clásico - 45 min', iniciales: 'LC' },
                                { hora: '09:45', cliente: 'Mateo Ruiz', servicio: 'Afeitado + corte - 60 min', iniciales: 'MR' },
                                { hora: '10:45', cliente: 'Sofía Gómez', servicio: 'Peinado + barba - 75 min', iniciales: 'SG' },
                                { hora: '11:30', cliente: 'Andrés Pérez', servicio: 'Corte + lavado - 50 min', iniciales: 'AP' },
                            ].map((c, i) => (
                                <div key={i} className="flex items-center justify-between p-3 bg-[#111713] border border-[#2D3E31] rounded-xl">
                                    <div className="flex items-center gap-4">
                                        <span className="text-xs font-bold text-gray-400 w-12">{c.hora}</span>
                                        <div className="w-8 h-8 bg-[#1A251D] border border-[#2D3E31] rounded-lg flex items-center justify-center text-xs font-bold text-[#E08A3E]">
                                            {c.iniciales}
                                        </div>
                                        <div>
                                            <h4 className="text-xs font-bold">{c.cliente}</h4>
                                            <p className="text-[10px] text-gray-500">{c.servicio}</p>
                                        </div>
                                    </div>
                                    <span className="text-[10px] text-[#E08A3E] bg-[#E08A3E]/10 border border-[#E08A3E]/30 px-3 py-1 rounded-full font-semibold">
                    Confirmado
                  </span>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

                <div className="lg:col-span-4 flex flex-col gap-6">
                    <div className="bg-[#1A251D] border border-[#2D3E31] rounded-2xl p-5">
                        <h3 className="font-bold text-sm mb-4">Gestión rápida</h3>
                        <div className="grid grid-cols-2 gap-2">
                            <button className="p-3 bg-[#111713] border border-[#2D3E31] text-xs font-medium rounded-xl flex items-center gap-2 hover:border-[#E08A3E]">
                                <Plus size={14} className="text-[#E08A3E]" />
                                <span>Nuevo turno</span>
                            </button>
                            <button className="p-3 bg-[#111713] border border-[#2D3E31] text-xs font-medium rounded-xl flex items-center gap-2 hover:border-[#E08A3E]">
                                <Bell size={14} className="text-[#E08A3E]" />
                                <span>Recordatorios</span>
                            </button>
                            <button className="p-3 bg-[#111713] border border-[#2D3E31] text-xs font-medium rounded-xl flex items-center gap-2 hover:border-[#E08A3E]">
                                <DollarSign size={14} className="text-[#E08A3E]" />
                                <span>Cobros</span>
                            </button>
                            <button className="p-3 bg-[#111713] border border-[#2D3E31] text-xs font-medium rounded-xl flex items-center gap-2 hover:border-[#E08A3E]">
                                <Settings size={14} className="text-[#E08A3E]" />
                                <span>Servicios</span>
                            </button>
                        </div>
                    </div>
                </div>

            </div>

        </div>
    );
}