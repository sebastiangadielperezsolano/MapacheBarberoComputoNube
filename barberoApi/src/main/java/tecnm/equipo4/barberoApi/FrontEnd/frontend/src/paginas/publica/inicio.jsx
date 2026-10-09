import React from 'react';
import { LogIn, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Inicio() {
    const navigate = useNavigate();

    return (
        <div className="relative min-h-screen bg-[#111713] text-white flex flex-col justify-between overflow-hidden font-sans">

            <div className="absolute top-[-100px] right-[-100px] w-96 h-96 bg-[#1A251D] rounded-full opacity-60 pointer-events-none" />
            <div className="absolute bottom-[-100px] left-[-100px] w-96 h-96 bg-[#1A251D] rounded-full opacity-60 pointer-events-none" />

            <header className="relative z-10 p-6 flex items-center gap-3">
                <div className="w-12 h-12 bg-[#1A251D] border border-[#2D3E31] rounded-2xl flex items-center justify-center p-2 shadow-inner">
                    <img
                        src="/racoon%201.png"
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
            </header>

            <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 text-center">
        <span className="text-xs tracking-widest text-[#E08A3E] font-bold uppercase mb-2">
          El Mapache Bigotón
        </span>
                <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-3">
                    Bienvenido al <br />
                    Mapache Bigotón
                </h2>
                <p className="text-gray-400 text-sm mb-8">
                    Tu estilo, tu tiempo.
                </p>

                <div className="w-full max-w-sm flex flex-col gap-3">
                    <button
                        type="button"
                        onClick={() => navigate('/login')}
                        className="w-full py-3 px-6 bg-[#E08A3E] hover:bg-[#c9762e] text-[#111713] font-semibold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg cursor-pointer"
                    >
                        <LogIn size={18} />
                        <span>Iniciar sesión</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate('/registro')}
                        className="w-full py-3 px-6 bg-[#1A251D] hover:bg-[#25352a] text-gray-200 font-semibold rounded-xl border border-[#2D3E31] flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                        <UserPlus size={18} />
                        <span>Registrarse</span>
                    </button>
                </div>

                <p className="text-[11px] text-gray-500 mt-6">
                    Al continuar aceptas nuestros términos y política de privacidad.
                </p>
            </main>

            <footer className="relative z-10 p-4 text-center"></footer>
        </div>
    );
}