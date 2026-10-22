import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail, Phone, Lock, Camera, Check, AlertCircle } from 'lucide-react';

const API_BASE = 'http://localhost:8081/api';

export default function ConfiguracionCliente() {
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState(() => {
    try {
      const sesion = localStorage.getItem('usuario');
      return sesion ? JSON.parse(sesion) : null;
    } catch {
      return null;
    }
  });

  const [formData, setFormData] = useState({
    nombre_completo: '',
    email: '',
    telefono: '',
    password: ''
  });

  const [fotoPreview, setFotoPreview] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });

  useEffect(() => {
    if (!usuario || !usuario.id_usuario) {
      navigate('/iniciar-sesion');
      return;
    }

    fetch(`${API_BASE}/usuarios/${usuario.id_usuario}`)
      .then(res => res.json())
      .then(data => {
        setFormData({
          nombre_completo: data.nombre_completo || '',
          email: data.email || '',
          telefono: data.telefono || '',
          password: ''
        });
        if (data.foto) {
          setFotoPreview(data.foto);
        }
      })
      .catch(err => console.error('Error al cargar perfil:', err));
  }, []);

  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setMensaje({ tipo: 'error', texto: 'La imagen no debe superar los 2MB.' });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    setMensaje({ tipo: '', texto: '' });

    const payload = {
      nombre_completo: formData.nombre_completo,
      email: formData.email,
      telefono: formData.telefono,
      foto: fotoPreview
    };

    if (formData.password.trim() !== '') {
      payload.password = formData.password;
    }

    try {
      const res = await fetch(`${API_BASE}/usuarios/${usuario.id_usuario}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        const nuevaSesion = {
          ...usuario,
          nombre_completo: data.nombre_completo,
          email: data.email,
          telefono: data.telefono,
          foto: fotoPreview
        };
        localStorage.setItem('usuario', JSON.stringify(nuevaSesion));
        setUsuario(nuevaSesion);
        setMensaje({ tipo: 'exito', texto: '¡Datos y foto actualizados con éxito en la base de datos!' });
      } else {
        setMensaje({ tipo: 'error', texto: 'No se pudo actualizar la información.' });
      }
    } catch (err) {
      console.error(err);
      setMensaje({ tipo: 'error', texto: 'Error de conexión con el servidor.' });
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#111613] text-gray-200 p-6 md:p-10 font-sans relative overflow-hidden select-none">
      
      {/* CÍRCULOS SÓLIDOS DE FIGMA */}
      <div className="absolute -top-44 -right-32 w-[550px] h-[550px] bg-[#18221b] rounded-full pointer-events-none z-0"></div>
      <div className="absolute -bottom-48 -left-32 w-[480px] h-[480px] bg-[#18221b] rounded-full pointer-events-none z-0"></div>

      <div className="max-w-2xl mx-auto relative z-10">
        
        {/* Header con botón y logo */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/cliente')}>
            <div className="w-12 h-12 bg-[#213026] border border-[#2d4034] rounded-2xl flex items-center justify-center shadow-lg shadow-black/30">
              <span className="text-2xl filter drop-shadow">🦝</span>
            </div>
            <div>
              <span className="text-[10px] font-black tracking-widest text-[#d97706] uppercase block">
                El Mapache Bigotón
              </span>
              <span className="text-xl font-extrabold text-white tracking-wide">
                BarberApp
              </span>
            </div>
          </div>

          <button 
            onClick={() => navigate('/cliente')} 
            className="flex items-center gap-1.5 text-xs text-[#d97706] hover:underline"
          >
            <ArrowLeft size={14} /> Volver al panel
          </button>
        </div>

        {/* Título de la sección */}
        <div className="mb-6">
          <span className="text-[10px] font-black uppercase text-[#d97706] tracking-wider block mb-1">
            Mi Cuenta
          </span>
          <h1 className="text-3xl font-black text-white tracking-tight">Configuración del Perfil</h1>
          <p className="text-xs text-gray-400 mt-1">
            Administra tus datos personales y actualiza tu foto de perfil.
          </p>
        </div>

        {mensaje.texto && (
          <div className={`p-4 mb-6 rounded-2xl text-xs flex items-center gap-2 border ${
            mensaje.tipo === 'exito' 
              ? 'bg-emerald-950/70 border-emerald-800 text-emerald-300' 
              : 'bg-red-950/70 border-red-800 text-red-300'
          }`}>
            {mensaje.tipo === 'exito' ? <Check size={14} /> : <AlertCircle size={14} />}
            {mensaje.texto}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-[#18211b]/95 border border-[#25332a] rounded-3xl p-8 space-y-6 shadow-2xl backdrop-blur-md">
          
          {/* Avatar selector */}
          <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-[#25332a]">
            <div className="relative group">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-[#121914] border-2 border-[#ea8536] flex items-center justify-center shadow-lg">
                {fotoPreview ? (
                  <img src={fotoPreview} alt="Foto de perfil" className="w-full h-full object-cover" />
                ) : (
                  <User size={36} className="text-gray-500" />
                )}
              </div>
              <label className="absolute bottom-0 right-0 bg-[#ea8536] hover:bg-[#d97528] text-[#121814] p-2.5 rounded-full cursor-pointer shadow-xl transition">
                <Camera size={14} />
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFotoChange} 
                  className="hidden" 
                />
              </label>
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Foto de Perfil</h3>
              <p className="text-[11px] text-gray-400 mt-1">
                Formatos permitidos: JPG, PNG o WEBP. Tamaño máximo: 2MB.
              </p>
            </div>
          </div>

          {/* Formulario */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1.5">Nombre Completo</label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 text-gray-500" size={15} />
                <input
                  type="text"
                  required
                  value={formData.nombre_completo}
                  onChange={(e) => setFormData({ ...formData, nombre_completo: e.target.value })}
                  className="w-full bg-[#121914] border border-[#243328] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:border-[#ea8536] outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1.5">Correo Electrónico</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 text-gray-500" size={15} />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-[#121914] border border-[#243328] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:border-[#ea8536] outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1.5">Teléfono de Contacto</label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-3 text-gray-500" size={15} />
                <input
                  type="text"
                  value={formData.telefono}
                  onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                  className="w-full bg-[#121914] border border-[#243328] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:border-[#ea8536] outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1.5">
                Nueva Contraseña <span className="text-[10px] text-gray-500 font-normal">(Opcional)</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 text-gray-500" size={15} />
                <input
                  type="password"
                  placeholder="Dejar en blanco para mantener"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-[#121914] border border-[#243328] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-600 focus:border-[#ea8536] outline-none transition"
                />
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={cargando}
              className="bg-[#ea8536] hover:bg-[#d97528] text-[#121814] font-black px-6 py-2.5 rounded-xl text-xs transition duration-200 shadow-lg shadow-black/30"
            >
              {cargando ? 'Guardando cambios...' : 'Guardar Información'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}