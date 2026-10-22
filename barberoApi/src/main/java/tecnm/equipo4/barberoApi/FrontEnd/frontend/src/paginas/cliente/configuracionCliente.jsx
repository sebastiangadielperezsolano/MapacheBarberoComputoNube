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
    <div className="min-h-screen bg-[#0e1411] text-gray-200 p-8 font-sans">
      <div className="max-w-2xl mx-auto">
        <button 
          onClick={() => navigate('/cliente')} 
          className="flex items-center gap-1.5 text-xs text-[#d97706] hover:underline mb-6 inline-flex"
        >
          <ArrowLeft size={14} /> Volver al Panel
        </button>

        <h1 className="text-2xl font-bold text-white mb-1">Configuración del Perfil</h1>
        <p className="text-xs text-gray-400 mb-8">Administra tus datos personales y actualiza tu foto de perfil.</p>

        {mensaje.texto && (
          <div className={`p-3.5 mb-6 rounded-xl text-xs flex items-center gap-2 border ${
            mensaje.tipo === 'exito' 
              ? 'bg-green-950/60 border-green-800 text-green-300' 
              : 'bg-red-950/60 border-red-800 text-red-300'
          }`}>
            {mensaje.tipo === 'exito' ? <Check size={14} /> : <AlertCircle size={14} />}
            {mensaje.texto}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-[#151d18] border border-[#232f27] rounded-2xl p-6 space-y-6">
          <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-[#232f27]">
            <div className="relative group">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-[#1c2620] border-2 border-[#d97706] flex items-center justify-center">
                {fotoPreview ? (
                  <img src={fotoPreview} alt="Foto de perfil" className="w-full h-full object-cover" />
                ) : (
                  <User size={36} className="text-gray-500" />
                )}
              </div>
              <label className="absolute bottom-0 right-0 bg-[#d97706] hover:bg-[#b45309] text-black p-2 rounded-full cursor-pointer shadow-lg transition">
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
              <p className="text-[11px] text-gray-400 mt-0.5">
                Formatos permitidos: JPG, PNG o WEBP. Tamaño máximo sugerido: 2MB.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Nombre Completo</label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 text-gray-500" size={15} />
                <input
                  type="text"
                  required
                  value={formData.nombre_completo}
                  onChange={(e) => setFormData({ ...formData, nombre_completo: e.target.value })}
                  className="w-full bg-[#18211b] border border-[#2b3a30] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:border-[#d97706] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Correo Electrónico</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 text-gray-500" size={15} />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-[#18211b] border border-[#2b3a30] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:border-[#d97706] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Teléfono de Contacto</label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-3 text-gray-500" size={15} />
                <input
                  type="text"
                  value={formData.telefono}
                  onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                  className="w-full bg-[#18211b] border border-[#2b3a30] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:border-[#d97706] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">
                Nueva Contraseña <span className="text-[10px] text-gray-500">(Opcional)</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 text-gray-500" size={15} />
                <input
                  type="password"
                  placeholder="Dejar en blanco para mantener"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-[#18211b] border border-[#2b3a30] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-600 focus:border-[#d97706] outline-none"
                />
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={cargando}
              className="bg-[#d97706] hover:bg-[#b45309] text-black font-bold px-6 py-2.5 rounded-xl text-xs transition duration-200"
            >
              {cargando ? 'Guardando cambios...' : 'Guardar Información'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}