import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, ArrowLeft, LogIn } from 'lucide-react';

const API_URL = 'http://localhost:8081';

export default function InicioSesion() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const response = await fetch(`${API_URL}/api/usuarios/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const data = await response.json();

        // Detectar si es BARBERO según las columnas de MySQL (tipo_usuario o perfil)
        const rolUsuario = (data.tipo_usuario || data.tipoUsuario || data.perfil || 'CLIENTE').toUpperCase();

        const sesionUsuario = {
          id_usuario: data.id_usuario || data.idUsuario || data.id,
          nombre_completo: data.nombre_completo || data.nombreCompleto || data.nombre || 'Usuario',
          email: data.email,
          telefono: data.telefono || '',
          tipo_usuario: rolUsuario
        };

        localStorage.setItem('usuario', JSON.stringify(sesionUsuario));

        // Redirección condicionada
        if (rolUsuario === 'BARBERO') {
          navigate('/barbero');
        } else {
          navigate('/cliente');
        }
      } else {
        setErrorMsg('Correo o contraseña incorrectos.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Error al conectar con el servidor backend.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#111613] text-gray-200 flex items-center justify-center p-6 font-sans relative overflow-hidden select-none">
      
      {/* Círculos sólidos de fondo Figma */}
      <div className="absolute -top-44 -right-32 w-[550px] h-[550px] bg-[#18221b] rounded-full pointer-events-none z-0"></div>
      <div className="absolute -bottom-48 -left-32 w-[480px] h-[480px] bg-[#18221b] rounded-full pointer-events-none z-0"></div>

      {/* Contenedor tipo Tarjeta Login */}
      <div className="w-full max-w-md bg-[#18211b]/95 border border-[#25332a] rounded-3xl p-8 md:p-10 shadow-2xl backdrop-blur-md relative z-10">
        
        <Link 
          to="/" 
          className="flex items-center gap-1.5 text-xs text-[#d97706] hover:underline mb-6 inline-flex"
        >
          <ArrowLeft size={14} /> Volver al inicio
        </Link>

        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-[#213026] border border-[#2d4034] rounded-2xl flex items-center justify-center text-3xl mx-auto mb-3 shadow-lg shadow-black/30">
            🦝
          </div>
          <span className="text-[10px] font-black tracking-widest text-[#d97706] uppercase block">
            El Mapache Bigotón
          </span>
          <h2 className="text-3xl font-black text-white mt-1">Iniciar Sesión</h2>
          <p className="text-xs text-gray-400 mt-1">Ingresa tus credenciales para acceder a tu panel.</p>
        </div>

        {errorMsg && (
          <div className="mb-5 p-3.5 bg-red-950/70 border border-red-800 text-red-300 text-xs rounded-2xl text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-300 mb-1.5">Correo Electrónico</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 text-gray-500" size={16} />
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="ejemplo@correo.com"
                className="w-full bg-[#121914] border border-[#243328] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-600 focus:border-[#ea8536] outline-none transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-300 mb-1.5">Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 text-gray-500" size={16} />
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full bg-[#121914] border border-[#243328] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-600 focus:border-[#ea8536] outline-none transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 bg-[#ea8536] hover:bg-[#d97528] text-[#121814] font-black py-3 rounded-xl text-xs transition duration-200 flex items-center justify-center gap-2 shadow-lg shadow-black/30"
          >
            {loading ? 'Verificando...' : (
              <>
                <LogIn size={16} /> Entrar
              </>
            )}
          </button>
        </form>

        <p className="text-center text-xs text-gray-500 mt-6">
          ¿No tienes una cuenta?{' '}
          <Link to="/registro" className="text-[#ea8536] font-bold hover:underline">
            Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  );
}