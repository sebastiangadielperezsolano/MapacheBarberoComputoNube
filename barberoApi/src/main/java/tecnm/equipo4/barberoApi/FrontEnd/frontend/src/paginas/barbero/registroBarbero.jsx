import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Phone, Clock, Award, ArrowLeft, Lock } from 'lucide-react';

const API_BASE = 'http://localhost:8081/api';

export default function RegistroBarbero() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombreCompleto: '',
    email: '',
    telefono: '',
    experiencia: '3',
    password: '1234',
    horaEntrada: '09:00',
    horaSalida: '19:00'
  });

  const diasSemana = ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'];
  const [diasSeleccionados, setDiasSeleccionados] = useState(['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB']);

  const [especialidades, setEspecialidades] = useState([
    { id: 1, nombre: 'Corte clásico', duracion: '45 min', activo: true },
    { id: 2, nombre: 'Corte degradado', duracion: '45 min', activo: true },
    { id: 3, nombre: 'Corte + barba', duracion: '60 min', activo: true },
    { id: 4, nombre: 'Afeitado clásico', duracion: '60 min', activo: true },
    { id: 5, nombre: 'Peinado + barba', duracion: '50 min', activo: true },
    { id: 6, nombre: 'Diseño de barba', duracion: '30 min', activo: true },
    { id: 7, nombre: 'Tinte/Decoloración', duracion: '60 min', activo: true },
  ]);

  const [cargando, setCargando] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const toggleDia = (dia) => {
    if (diasSeleccionados.includes(dia)) {
      setDiasSeleccionados(diasSeleccionados.filter(d => d !== dia));
    } else {
      setDiasSeleccionados([...diasSeleccionados, dia]);
    }
  };

  const toggleEspecialidad = (id) => {
    setEspecialidades(especialidades.map(esp => 
      esp.id === id ? { ...esp, activo: !esp.activo } : esp
    ));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    setErrorMsg('');

    const payload = {
      nombreCompleto: formData.nombreCompleto,
      email: formData.email,
      telefono: formData.telefono,
      password: formData.password,
      experiencia: Number(formData.experiencia) || 1,
      tituloRol: 'Master Barber'
    };

    try {
      const res = await fetch(`${API_BASE}/barberos/registro`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        
        // Guardar sesión de BARBERO en localStorage
        const sesionBarbero = {
          id_usuario: data.id_usuario,
          nombre_completo: data.nombre_completo || formData.nombreCompleto,
          email: data.email || formData.email,
          telefono: formData.telefono,
          tipo_usuario: 'BARBERO'
        };
        localStorage.setItem('usuario', JSON.stringify(sesionBarbero));

        // Redirección inmediata al panel del barbero
        navigate('/barbero');
      } else {
        const errorText = await res.text();
        console.error('Error backend barbero:', errorText);
        setErrorMsg('Error al registrar al barbero. Verifica los datos.');
      }
    } catch (err) {
      console.error('Error de red:', err);
      setErrorMsg('Error de conexión con el backend.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#111613] text-gray-200 p-6 md:p-10 font-sans relative overflow-hidden select-none flex justify-center items-center">
      
      {/* Círculos sólidos de fondo Figma */}
      <div className="absolute -top-44 -right-32 w-[550px] h-[550px] bg-[#18221b] rounded-full pointer-events-none z-0"></div>
      <div className="absolute -bottom-48 -left-32 w-[480px] h-[480px] bg-[#18221b] rounded-full pointer-events-none z-0"></div>

      <div className="w-full max-w-2xl bg-[#18211b]/95 border border-[#25332a] rounded-3xl p-8 md:p-10 shadow-2xl backdrop-blur-md relative z-10 my-8">
        
        <Link 
          to="/iniciar-sesion" 
          className="flex items-center gap-1.5 text-xs text-[#d97706] hover:underline mb-6 inline-flex"
        >
          <ArrowLeft size={14} /> Volver al inicio de sesión
        </Link>

        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-[#213026] border border-[#2d4034] rounded-2xl flex items-center justify-center text-3xl mx-auto mb-3 shadow-lg shadow-black/30">
            🦝
          </div>
          <span className="text-[10px] font-black tracking-widest text-[#d97706] uppercase block">
            El Mapache Bigotón
          </span>
          <h1 className="text-3xl font-black text-white mt-1">Registro de Barbero</h1>
          <p className="text-xs text-gray-400 mt-1">
            Completa tu perfil profesional para unirte al equipo.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-3.5 bg-red-950/70 border border-red-800 text-red-300 text-xs rounded-2xl text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-7">
          
          <div>
            <h3 className="text-xs font-black uppercase text-[#d97706] tracking-wider mb-1">
              Datos Personales
            </h3>
            <p className="text-[11px] text-gray-400 mb-4">Completa la información básica para tu cuenta profesional.</p>

            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1.5">Nombre completo</label>
                <div className="relative">
                  <User size={15} className="absolute left-3.5 top-3 text-gray-500" />
                  <input
                    type="text"
                    required
                    placeholder="Ej. Bruno Barbero"
                    value={formData.nombreCompleto}
                    onChange={(e) => setFormData({ ...formData, nombreCompleto: e.target.value })}
                    className="w-full bg-[#121914] border border-[#243328] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-600 focus:border-[#ea8536] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1.5">Correo electrónico</label>
                  <div className="relative">
                    <Mail size={15} className="absolute left-3.5 top-3 text-gray-500" />
                    <input
                      type="email"
                      required
                      placeholder="bruno@barberia.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-[#121914] border border-[#243328] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-600 focus:border-[#ea8536] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1.5">Teléfono</label>
                  <div className="relative">
                    <Phone size={15} className="absolute left-3.5 top-3 text-gray-500" />
                    <input
                      type="text"
                      required
                      placeholder="+52 231 000 0000"
                      value={formData.telefono}
                      onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                      className="w-full bg-[#121914] border border-[#243328] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-600 focus:border-[#ea8536] outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1.5">Años de experiencia</label>
                  <div className="relative">
                    <Award size={15} className="absolute left-3.5 top-3 text-gray-500" />
                    <input
                      type="number"
                      required
                      min="1"
                      placeholder="Ej. 5"
                      value={formData.experiencia}
                      onChange={(e) => setFormData({ ...formData, experiencia: e.target.value })}
                      className="w-full bg-[#121914] border border-[#243328] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-600 focus:border-[#ea8536] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1.5">Contraseña de acceso</label>
                  <div className="relative">
                    <Lock size={15} className="absolute left-3.5 top-3 text-gray-500" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full bg-[#121914] border border-[#243328] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-600 focus:border-[#ea8536] outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-black uppercase text-[#d97706] tracking-wider mb-1">
              Disponibilidad Horaria
            </h3>
            <p className="text-[11px] text-gray-400 mb-3.5">Configura los días y horarios en los que estarás disponible para atención.</p>

            <div className="flex flex-wrap gap-2 mb-4">
              {diasSemana.map((dia) => {
                const activo = diasSeleccionados.includes(dia);
                return (
                  <button
                    key={dia}
                    type="button"
                    onClick={() => toggleDia(dia)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                      activo
                        ? 'bg-[#222e25] text-white border-[#ea8536]'
                        : 'bg-[#121914] text-gray-400 border-[#243328] hover:border-gray-600'
                    }`}
                  >
                    {dia}
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-gray-400 mb-1">Hora de entrada</label>
                <div className="relative">
                  <Clock size={14} className="absolute left-3.5 top-3 text-gray-500" />
                  <input
                    type="time"
                    value={formData.horaEntrada}
                    onChange={(e) => setFormData({ ...formData, horaEntrada: e.target.value })}
                    className="w-full bg-[#121914] border border-[#243328] rounded-xl pl-10 pr-3 py-2 text-xs text-white focus:border-[#ea8536] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-400 mb-1">Hora de salida</label>
                <div className="relative">
                  <Clock size={14} className="absolute left-3.5 top-3 text-gray-500" />
                  <input
                    type="time"
                    value={formData.horaSalida}
                    onChange={(e) => setFormData({ ...formData, horaSalida: e.target.value })}
                    className="w-full bg-[#121914] border border-[#243328] rounded-xl pl-10 pr-3 py-2 text-xs text-white focus:border-[#ea8536] outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-black uppercase text-[#d97706] tracking-wider mb-1">
              Especialidades / Cortes con Experiencia
            </h3>
            <p className="text-[11px] text-gray-400 mb-3.5">Selecciona los servicios en los que te sientes más cómodo para atender a clientes.</p>

            <div className="space-y-2.5">
              {especialidades.map((esp) => (
                <div
                  key={esp.id}
                  onClick={() => toggleEspecialidad(esp.id)}
                  className={`p-3.5 rounded-2xl border flex justify-between items-center cursor-pointer transition ${
                    esp.activo
                      ? 'bg-[#1e2a22] border-[#2e3e33]'
                      : 'bg-[#121914] border-[#243328] opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      esp.activo ? 'border-[#ea8536] bg-[#ea8536]' : 'border-gray-600'
                    }`}>
                      {esp.activo && <div className="w-1.5 h-1.5 bg-black rounded-full" />}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-white">{esp.nombre}</h4>
                      <span className="text-[10px] text-gray-400">{esp.duracion}</span>
                    </div>
                  </div>

                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                    esp.activo
                      ? 'bg-[#2b3a2f] text-emerald-400 border border-emerald-800/40'
                      : 'bg-gray-800 text-gray-500'
                  }`}>
                    {esp.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={cargando}
            className="w-full bg-[#ea8536] hover:bg-[#d97528] text-[#121814] font-black py-3 rounded-xl text-xs transition duration-200 shadow-xl shadow-black/40"
          >
            {cargando ? 'Registrando barbero...' : 'Crear cuenta de barbero'}
          </button>
        </form>

        <p className="text-center text-[11px] text-gray-500 mt-5">
          Al continuar aceptas nuestros términos de servicio y política de privacidad. ¿Ya tienes cuenta?{' '}
          <Link to="/iniciar-sesion" className="text-[#ea8536] font-bold hover:underline">
            Inicia sesión aquí.
          </Link>
        </p>
      </div>
    </div>
  );
}