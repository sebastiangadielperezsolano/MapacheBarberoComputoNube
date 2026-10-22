import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Phone, Lock, ArrowLeft, UserPlus, CheckCircle2 } from 'lucide-react';

const API_URL = 'http://localhost:8081';

export default function Registro() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre_completo: '',
    email: '',
    telefono: '',
    password: '',
    confirmPassword: ''
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [exitoMsg, setExitoMsg] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setExitoMsg('');

    if (formData.password !== formData.confirmPassword) {
      setErrorMsg('Las contraseñas no coinciden.');
      return;
    }

    if (formData.password.length < 4) {
      setErrorMsg('La contraseña debe tener al menos 4 caracteres.');
      return;
    }

    setLoading(true);

    const bodyUsuario = {
      nombreCompleto: formData.nombre_completo,
      email: formData.email,
      telefono: formData.telefono,
      password: formData.password,
      perfil: 'CLIENTE',
      tipoUsuario: 'CLIENTE'
    };

    try {
      const response = await fetch(`${API_URL}/api/usuarios/registro`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyUsuario)
      });

      if (response.ok) {
        setExitoMsg('¡Cuenta creada con éxito! Redirigiendo al inicio de sesión...');
        setTimeout(() => {
          navigate('/iniciar-sesion');
        }, 1500);
      } else {
        setErrorMsg('No se pudo completar el registro. Verifica los datos ingresados.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Error de conexión con el servidor backend.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#111613] text-gray-200 flex items-center justify-center p-6 font-sans relative overflow-hidden select-none">
      
      {/* CÍRCULOS SÓLIDOS DE FIGMA (Mismo diseño exacto que la bienvenida y el login) */}
      <div className="absolute -top-44 -right-32 w-[550px] h-[550px] bg-[#18221b] rounded-full pointer-events-none z-0"></div>
      <div className="absolute -bottom-48 -left-32 w-[480px] h-[480px] bg-[#18221b] rounded-full pointer-events-none z-0"></div>

      {/* Contenedor tipo Tarjeta Figma */}
      <div className="w-full max-w-lg bg-[#18211b]/95 border border-[#25332a] rounded-3xl p-8 md:p-10 shadow-2xl backdrop-blur-md relative z-10">
        
        <Link 
          to="/iniciar-sesion" 
          className="flex items-center gap-1.5 text-xs text-[#d97706] hover:underline mb-6 inline-flex"
        >
          <ArrowLeft size={14} /> Volver al inicio de sesión
        </Link>

        {/* Encabezado con el Mapache */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-[#213026] border border-[#2d4034] rounded-2xl flex items-center justify-center text-3xl mx-auto mb-3 shadow-lg shadow-black/30">
            🦝
          </div>
          <span className="text-[10px] font-black tracking-widest text-[#d97706] uppercase block">
            El Mapache Bigotón
          </span>
          <h2 className="text-3xl font-black text-white mt-1">Crear Cuenta</h2>
          <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
            Únete a BarberApp para agendar tus turnos y administrar tu estilo.
          </p>
        </div>

        {/* Alertas */}
        {errorMsg && (
          <div className="mb-5 p-3.5 bg-red-950/70 border border-red-800 text-red-300 text-xs rounded-2xl text-center">
            {errorMsg}
          </div>
        )}

        {exitoMsg && (
          <div className="mb-5 p-3.5 bg-green-950/70 border border-green-800 text-green-300 text-xs rounded-2xl text-center flex items-center justify-center gap-2">
            <CheckCircle2 size={16} /> {exitoMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-300 mb-1.5">Nombre Completo</label>
            <div className="relative">
              <User className="absolute left-3.5 top-3 text-gray-500" size={16} />
              <input
                type="text"
                name="nombre_completo"
                required
                value={formData.nombre_completo}
                onChange={handleChange}
                placeholder="Ej. Luis Ángel Julio"
                className="w-full bg-[#121914] border border-[#243328] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-600 focus:border-[#ea8536] outline-none transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              <label className="block text-xs font-bold text-gray-300 mb-1.5">Teléfono</label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-3 text-gray-500" size={16} />
                <input
                  type="tel"
                  name="telefono"
                  required
                  value={formData.telefono}
                  onChange={handleChange}
                  placeholder="+52 231 000 0000"
                  className="w-full bg-[#121914] border border-[#243328] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-600 focus:border-[#ea8536] outline-none transition"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1.5">Confirmar Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 text-gray-500" size={16} />
                <input
                  type="password"
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full bg-[#121914] border border-[#243328] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-600 focus:border-[#ea8536] outline-none transition"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 bg-[#ea8536] hover:bg-[#d97528] text-[#121814] font-black py-3 rounded-xl text-xs transition duration-200 flex items-center justify-center gap-2 shadow-lg shadow-black/30"
          >
            {loading ? 'Registrando cuenta...' : (
              <>
                <UserPlus size={16} /> Registrarme
              </>
            )}
          </button>
        </form>

        <p className="text-center text-xs text-gray-500 mt-6">
          ¿Ya tienes una cuenta?{' '}
          <Link to="/iniciar-sesion" className="text-[#ea8536] font-bold hover:underline">
            Inicia sesión aquí
          </Link>
        </p>
      </div>
    </div>
  );
}