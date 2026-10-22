import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, UserPlus } from 'lucide-react';

export default function Inicio() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#111613] text-gray-200 flex flex-col justify-between p-6 md:p-10 font-sans relative overflow-hidden select-none">
      
      {/* Círculos sólidos de Figma */}
      <div className="absolute -top-44 -right-32 w-[550px] h-[550px] bg-[#18221b] rounded-full pointer-events-none z-0"></div>
      <div className="absolute -bottom-48 -left-32 w-[480px] h-[480px] bg-[#18221b] rounded-full pointer-events-none z-0"></div>

      {/* Header */}
      <header className="flex justify-between items-center relative z-10 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#213026] border border-[#2d4034] rounded-2xl flex items-center justify-center shadow-lg shadow-black/30">
            <span className="text-2xl filter drop-shadow">🦝</span>
          </div>
          <div className="leading-tight">
            <span className="text-[10px] font-black tracking-widest text-[#d97706] uppercase block">
              El Mapache Bigotón
            </span>
            <span className="text-xl font-extrabold text-white tracking-wide">
              BarberApp
            </span>
          </div>
        </div>
      </header>

      {/* Centro Hero */}
      <main className="relative z-10 max-w-md mx-auto text-center my-auto">
        <span className="text-[11px] font-black tracking-widest text-[#d97706] uppercase block mb-2">
          El Mapache Bigotón
        </span>
        <h1 className="text-4xl md:text-5xl font-black text-white leading-tight tracking-tight mb-2">
          Bienvenido al Mapache Bigotón
        </h1>
        <p className="text-xs text-gray-400 mb-8">
          Tu estilo, tu tiempo.
        </p>

        <div className="space-y-3">
          <button
            onClick={() => navigate('/iniciar-sesion')}
            className="w-full bg-[#ea8536] hover:bg-[#d97528] text-[#121814] font-black py-3.5 rounded-xl text-xs transition duration-200 shadow-xl shadow-black/40 flex items-center justify-center gap-2"
          >
            <LogIn size={15} /> Iniciar sesión
          </button>

          <button
            onClick={() => navigate('/registro')}
            className="w-full bg-[#18211b] hover:bg-[#202c23] border border-[#25332a] text-gray-200 font-bold py-3.5 rounded-xl text-xs transition duration-200 shadow-md flex items-center justify-center gap-2"
          >
            <UserPlus size={15} /> Registrarse
          </button>
        </div>

        <p className="text-[10px] text-gray-500 mt-6">
          Al continuar aceptas nuestros términos de servicio y política de privacidad.
        </p>
      </main>

      <footer className="relative z-10 text-center text-[10px] text-gray-600">
        © 2026 BarberApp. Todos los derechos reservados.
      </footer>
    </div>
  );
}