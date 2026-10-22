import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, Mail, Lock, ArrowLeft } from 'lucide-react';

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

        // Normalizamos el objeto para que nunca falte el id ni el nombre
        const sesionUsuario = {
          id_usuario: data.id_usuario || data.idUsuario || data.id,
          nombre_completo: data.nombre_completo || data.nombreCompleto || data.nombre || 'Cliente',
          email: data.email,
          tipo_usuario: data.tipo_usuario || data.tipoUsuario || 'CLIENTE'
        };

        localStorage.setItem('usuario', JSON.stringify(sesionUsuario));
        navigate('/cliente');
      } else {
        setErrorMsg('Correo o contraseña incorrectos.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Error al conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0e1411] text-gray-200 flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md bg-[#151d18] border border-[#232f27] rounded-2xl p-8 shadow-2xl">
        <Link to="/" className="flex items-center gap-1.5 text-xs text-[#d97706] hover:underline mb-6 inline-flex">
          <ArrowLeft size={14} /> Volver al inicio
        </Link>

        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-full bg-[#1b2b22] border border-gray-700 flex items-center justify-center text-2xl mx-auto mb-3">
            🦝
          </div>
          <span className="text-[10px] font-black tracking-widest text-[#d97706] uppercase block">
            El Mapache Bigotón
          </span>
          <h2 className="text-2xl font-bold text-white mt-1">Iniciar Sesión</h2>
          <p className="text-xs text-gray-400 mt-1">Ingresa tus credenciales para acceder a tu panel.</p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-950/60 border border-red-800 text-red-300 text-xs rounded-xl text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Correo Electrónico</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 text-gray-500" size={16} />
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="ejemplo@correo.com"
                className="w-full bg-[#18211b] border border-[#2b3a30] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-600 focus:border-[#d97706] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 text-gray-500" size={16} />
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full bg-[#18211b] border border-[#2b3a30] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-600 focus:border-[#d97706] outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-[#d97706] hover:bg-[#b45309] text-black font-bold py-2.5 rounded-xl text-xs transition duration-200 flex items-center justify-center gap-2"
          >
            {loading ? 'Verificando...' : (
              <>
                <LogIn size={14} /> Entrar
              </>
            )}
          </button>
        </form>

        <p className="text-center text-xs text-gray-500 mt-6">
          ¿No tienes una cuenta?{' '}
          <Link to="/registro" className="text-[#d97706] font-semibold hover:underline">
            Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  );
}