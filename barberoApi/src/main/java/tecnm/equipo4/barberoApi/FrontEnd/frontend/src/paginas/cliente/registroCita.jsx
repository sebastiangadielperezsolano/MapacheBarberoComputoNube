import React, { useState } from 'react';
import {
    User,
    Phone,
    FileText,
    CheckCircle2,
    CreditCard,
    Wallet,
    QrCode,
    ArrowLeft,
    Lock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AgendarCita() {
    const navigate = useNavigate();

    const [nombre, setNombre] = useState('Mateo Ruiz');
    const [telefono, setTelefono] = useState('+54 9 11 1234-5678');
    const [fechaSeleccionada, setFechaSeleccionada] = useState('HOY 20');
    const [horaSeleccionada, setHoraSeleccionada] = useState('18:30');
    const [servicioSeleccionado, setServicioSeleccionado] = useState(2); // ID del servicio
    const [metodoPago, setMetodoPago] = useState('tarjeta'); // 'tarjeta', 'mercadopago', 'transferencia'
    const [notas, setNotas] = useState('');

    const servicios = [
        { id: 1, nombre: 'Corte clásico', duracion: '45 min', precio: 38 },
        { id: 2, nombre: 'Corte + barba', duracion: '60 min', precio: 48 },
        { id: 3, nombre: 'Afeitado + corte', duracion: '60 min', precio: 52 },
        { id: 4, nombre: 'Peinado + barba', duracion: '50 min', precio: 42 },
        { id: 5, nombre: 'Corte degradado', duracion: '45 min', precio: 40 },
    ];

    const servicioActual = servicios.find(s => s.id === servicioSeleccionado);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Cita agendada:', {
            nombre,
            telefono,
            fechaSeleccionada,
            horaSeleccionada,
            servicio: servicioActual,
            metodoPago,
            notas
        });

        alert('¡Tu cita ha sido agendada con éxito!');
        navigate('/cliente');
    };

    return (
        <div className="relative min-h-screen bg-[#111713] text-white font-sans p-4 sm:p-8 overflow-hidden">

            <div className="absolute top-[-100px] right-[-100px] w-[500px] h-[500px] bg-[#1A251D] rounded-full opacity-40 pointer-events-none" />
            <div className="absolute bottom-[-100px] left-[-100px] w-[500px] h-[500px] bg-[#1A251D] rounded-full opacity-40 pointer-events-none" />

            <header className="relative z-10 flex items-center justify-between mb-8 max-w-7xl mx-auto">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate('/cliente')}
                        className="w-10 h-10 bg-[#1A251D] border border-[#2D3E31] rounded-xl flex items-center justify-center hover:bg-[#25352a] transition-colors"
                    >
                        <ArrowLeft size={18} />
                    </button>
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
            </header>

            <form onSubmit={handleSubmit} className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-7xl mx-auto">

                <div className="lg:col-span-7 flex flex-col gap-6">
                    <div className="bg-[#1A251D] border border-[#2D3E31] rounded-2xl p-6 shadow-xl">
            <span className="text-[10px] tracking-widest text-[#E08A3E] font-bold uppercase block mb-1">
              Nuevo Turno
            </span>
                        <h2 className="text-3xl font-extrabold mb-2">Agendar tu cita</h2>
                        <p className="text-gray-400 text-xs mb-6">
                            Ingresa tus datos, elige el servicio que deseas y selecciona la hora más conveniente para tu estilo.
                        </p>

                        <div className="flex flex-col gap-4 mb-6">
                            <div>
                                <label className="block text-xs font-medium text-gray-300 mb-1.5">Nombre completo</label>
                                <div className="relative flex items-center">
                                    <User className="absolute left-3 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        required
                                        value={nombre}
                                        onChange={(e) => setNombre(e.target.value)}
                                        placeholder="Ej. Mateo Ruiz"
                                        className="w-full py-3 pl-10 pr-4 bg-[#111713] border border-[#2D3E31] text-white rounded-xl focus:outline-none focus:border-[#E08A3E] text-sm"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-300 mb-1.5">Número de teléfono</label>
                                <div className="relative flex items-center">
                                    <Phone className="absolute left-3 text-gray-400" size={18} />
                                    <input
                                        type="tel"
                                        required
                                        value={telefono}
                                        onChange={(e) => setTelefono(e.target.value)}
                                        placeholder="Ej. +54 9 11 1234-5678"
                                        className="w-full py-3 pl-10 pr-4 bg-[#111713] border border-[#2D3E31] text-white rounded-xl focus:outline-none focus:border-[#E08A3E] text-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="block text-xs font-medium text-gray-300 mb-3">Selección de fecha y hora</label>

                            <div className="grid grid-cols-4 gap-2 mb-4">
                                {[
                                    { dia: 'HOY', num: '20', mes: 'Marzo' },
                                    { dia: 'SÁB', num: '21', mes: 'Marzo' },
                                    { dia: 'LUN', num: '23', mes: 'Marzo' },
                                    { dia: 'MAR', num: '24', mes: 'Marzo' },
                                ].map((item, idx) => {
                                    const id = `${item.dia} ${item.num}`;
                                    const isSelected = fechaSeleccionada === id;
                                    return (
                                        <button
                                            key={idx}
                                            type="button"
                                            onClick={() => setFechaSeleccionada(id)}
                                            className={`p-3 rounded-xl border flex flex-col items-center transition-all ${
                                                isSelected
                                                    ? 'bg-[#111713] border-[#E08A3E] text-[#E08A3E]'
                                                    : 'bg-[#111713] border-[#2D3E31] text-gray-300 hover:border-gray-500'
                                            }`}
                                        >
                                            <span className="text-[10px] font-bold">{item.dia}</span>
                                            <span className="text-lg font-extrabold">{item.num}</span>
                                            <span className="text-[10px] text-gray-400">{item.mes}</span>
                                        </button>
                                    );
                                })}
                            </div>

                            <span className="block text-[10px] text-gray-400 font-bold uppercase mb-2">Mañana</span>
                            <div className="grid grid-cols-4 gap-2 mb-4">
                                {['09:00', '09:45', '10:30', '11:15'].map((hora) => (
                                    <button
                                        key={hora}
                                        type="button"
                                        onClick={() => setHoraSeleccionada(hora)}
                                        className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                                            horaSeleccionada === hora
                                                ? 'bg-[#E08A3E] border-[#E08A3E] text-[#111713]'
                                                : 'bg-[#111713] border-[#2D3E31] text-gray-300 hover:border-gray-500'
                                        }`}
                                    >
                                        {hora}
                                    </button>
                                ))}
                            </div>

                            <span className="block text-[10px] text-gray-400 font-bold uppercase mb-2">Tarde</span>
                            <div className="grid grid-cols-4 gap-2">
                                {['14:00', '15:30', '17:00', '18:30'].map((hora) => (
                                    <button
                                        key={hora}
                                        type="button"
                                        onClick={() => setHoraSeleccionada(hora)}
                                        className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                                            horaSeleccionada === hora
                                                ? 'bg-[#E08A3E] border-[#E08A3E] text-[#111713]'
                                                : 'bg-[#111713] border-[#2D3E31] text-gray-300 hover:border-gray-500'
                                        }`}
                                    >
                                        {hora}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-300 mb-1.5">Detalles adicionales o notas especiales</label>
                            <div className="relative flex items-center">
                                <FileText className="absolute left-3 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    value={notas}
                                    onChange={(e) => setNotas(e.target.value)}
                                    placeholder="Ej. Preferencia por navaja tradicional, detalles sobre barba, etc."
                                    className="w-full py-3 pl-10 pr-4 bg-[#111713] border border-[#2D3E31] text-white rounded-xl focus:outline-none focus:border-[#E08A3E] text-sm"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#1A251D] border border-[#2D3E31] rounded-2xl p-6 shadow-xl">
                        <div className="flex items-center justify-between mb-3">
                            <div>
                <span className="text-[10px] tracking-widest text-[#E08A3E] font-bold uppercase block">
                  Pago seguro
                </span>
                                <h3 className="text-xl font-bold">Método de pago digital</h3>
                            </div>
                            <Lock size={18} className="text-[#E08A3E]" />
                        </div>

                        <p className="text-xs text-gray-400 mb-4">
                            Selecciona tu forma de pago en línea para confirmar el apartado de tu turno al instante.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <button
                                type="button"
                                onClick={() => setMetodoPago('tarjeta')}
                                className={`p-4 rounded-xl border text-left flex flex-col justify-between transition-all ${
                                    metodoPago === 'tarjeta'
                                        ? 'bg-[#111713] border-[#E08A3E]'
                                        : 'bg-[#111713] border-[#2D3E31] hover:border-gray-500'
                                }`}
                            >
                                <CreditCard size={22} className={metodoPago === 'tarjeta' ? 'text-[#E08A3E]' : 'text-gray-400'} />
                                <div className="mt-3">
                                    <span className="block font-bold text-xs">Tarjeta</span>
                                    <span className="text-[10px] text-gray-400">Débito / Crédito</span>
                                </div>
                            </button>

                            <button
                                type="button"
                                onClick={() => setMetodoPago('mercadopago')}
                                className={`p-4 rounded-xl border text-left flex flex-col justify-between transition-all ${
                                    metodoPago === 'mercadopago'
                                        ? 'bg-[#111713] border-[#E08A3E]'
                                        : 'bg-[#111713] border-[#2D3E31] hover:border-gray-500'
                                }`}
                            >
                                <Wallet size={22} className={metodoPago === 'mercadopago' ? 'text-[#E08A3E]' : 'text-gray-400'} />
                                <div className="mt-3">
                                    <span className="block font-bold text-xs">Mercado Pago</span>
                                    <span className="text-[10px] text-gray-400">Saldo o cuotas</span>
                                </div>
                            </button>

                            <button
                                type="button"
                                onClick={() => setMetodoPago('transferencia')}
                                className={`p-4 rounded-xl border text-left flex flex-col justify-between transition-all ${
                                    metodoPago === 'transferencia'
                                        ? 'bg-[#111713] border-[#E08A3E]'
                                        : 'bg-[#111713] border-[#2D3E31] hover:border-gray-500'
                                }`}
                            >
                                <QrCode size={22} className={metodoPago === 'transferencia' ? 'text-[#E08A3E]' : 'text-gray-400'} />
                                <div className="mt-3">
                                    <span className="block font-bold text-xs">Transferencia</span>
                                    <span className="text-[10px] text-gray-400">Pago por SPEI / QR</span>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-5 flex flex-col gap-6">
                    <div className="bg-[#1A251D] border border-[#2D3E31] rounded-2xl p-6 shadow-xl flex-1 flex flex-col justify-between">
                        <div>
                            <h3 className="text-xl font-bold mb-1">Elige el servicio</h3>
                            <p className="text-xs text-gray-400 mb-6">
                                Todos nuestros servicios incluyen lavado de cabello y bebida de cortesía.
                            </p>

                            {/* Lista de Servicios */}
                            <div className="flex flex-col gap-3 mb-6">
                                {servicios.map((s) => {
                                    const isSelected = servicioSeleccionado === s.id;
                                    return (
                                        <div
                                            key={s.id}
                                            onClick={() => setServicioSeleccionado(s.id)}
                                            className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                                                isSelected
                                                    ? 'bg-[#111713] border-[#E08A3E]'
                                                    : 'bg-[#111713] border-[#2D3E31] hover:border-gray-500'
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                                                    isSelected ? 'border-[#E08A3E] bg-[#E08A3E]' : 'border-gray-500'
                                                }`}>
                                                    {isSelected && <CheckCircle2 size={14} className="text-[#111713]" />}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-sm leading-none mb-1">{s.nombre}</h4>
                                                    <span className="text-[10px] text-gray-400">{s.duracion}</span>
                                                </div>
                                            </div>
                                            <span className="font-extrabold text-[#E08A3E] text-base">${s.precio}</span>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Nota de Atención Personalizada */}
                            <div className="bg-[#111713] border border-[#2D3E31] p-4 rounded-xl mb-6">
                <span className="block font-bold text-xs text-[#E08A3E] mb-1">
                  ✂ Atención personalizada
                </span>
                                <p className="text-[11px] text-gray-400">
                                    Si tienes dudas sobre qué corte elegir, tu barbero te guiará al inicio del turno según tus rasgos y objetivos de estilo.
                                </p>
                            </div>
                        </div>

                        <div className="border-t border-[#2D3E31] pt-4">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-xs text-gray-400">Total a pagar:</span>
                                <span className="text-2xl font-black text-[#E08A3E]">${servicioActual?.precio}</span>
                            </div>

                            <button
                                type="submit"
                                className="w-full py-3.5 px-6 bg-[#E08A3E] hover:bg-[#c9762e] text-[#111713] font-extrabold rounded-xl transition-all shadow-lg cursor-pointer text-sm"
                            >
                                Confirmar y Pagar Turno
                            </button>
                        </div>

                    </div>
                </div>

            </form>
        </div>
    );
}