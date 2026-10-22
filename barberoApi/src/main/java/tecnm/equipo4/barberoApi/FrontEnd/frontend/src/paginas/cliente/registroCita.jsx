import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const API_BASE = 'http://localhost:8081/api';

export default function RegistroCita() {
  const navigate = useNavigate();

  const [usuario] = useState(() => {
    try {
      const sesion = localStorage.getItem('usuario');
      return sesion ? JSON.parse(sesion) : { id_usuario: 1 };
    } catch {
      return { id_usuario: 1 };
    }
  });

  const [formData, setFormData] = useState({
    fecha: '',
    hora: '',
    idServicio: '1',
    idBarbero: '2',
    notasCliente: 'Corte Clásico',
    sucursal: 'BarberApp Centro'
  });
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);

    const bodyTurno = {
      idCliente: Number(usuario?.id_usuario || usuario?.idCliente || 1),
      idBarbero: Number(formData.idBarbero),
      idServicio: Number(formData.idServicio),
      fecha: formData.fecha,
      horaInicio: formData.hora.length === 5 ? `${formData.hora}:00` : formData.hora,
      notasCliente: formData.notasCliente,
      sucursal: formData.sucursal,
      estado: 'CONFIRMADO'
    };

    try {
      const res = await fetch(`${API_BASE}/turnos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyTurno)
      });

      if (res.ok) {
        alert('¡Turno confirmado y guardado con éxito!');
        navigate('/cliente');
      } else {
        const errorText = await res.text();
        console.error('Error al agendar:', errorText);
        alert('Error en el servidor al guardar el turno.');
      }
    } catch (err) {
      console.error(err);
      alert('Error de conexión con el backend.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0e1411] text-gray-200 p-8 flex justify-center items-center font-sans">
      <div className="w-full max-w-md bg-[#151d18] border border-[#232f27] p-8 rounded-2xl shadow-2xl">
        <button 
          onClick={() => navigate('/cliente')} 
          className="flex items-center gap-1.5 text-xs text-[#d97706] hover:underline mb-6"
        >
          <ArrowLeft size={14} /> Volver al Panel
        </button>

        <h2 className="text-2xl font-bold text-white mb-1">Agendar Cita</h2>
        <p className="text-xs text-gray-400 mb-6">Selecciona el servicio y la hora para tu turno.</p>

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Servicio</label>
            <select
              className="w-full bg-[#18211b] border border-gray-700 rounded-lg p-2.5 text-white text-xs outline-none focus:border-[#d97706]"
              value={formData.idServicio}
              onChange={(e) => {
                const nombreServicio = e.target.options[e.target.selectedIndex].text.split('—')[0].trim();
                setFormData({ ...formData, idServicio: e.target.value, notasCliente: nombreServicio });
              }}
            >
              <option value="1">Corte Clásico — $150.00</option>
              <option value="2">Corte y Barba — $250.00</option>
              <option value="3">Perfilado de Barba — $120.00</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Fecha</label>
            <input
              type="date"
              required
              className="w-full bg-[#18211b] border border-gray-700 rounded-lg p-2.5 text-white text-xs outline-none focus:border-[#d97706]"
              value={formData.fecha}
              onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Hora</label>
            <input
              type="time"
              required
              className="w-full bg-[#18211b] border border-gray-700 rounded-lg p-2.5 text-white text-xs outline-none focus:border-[#d97706]"
              value={formData.hora}
              onChange={(e) => setFormData({ ...formData, hora: e.target.value })}
            />
          </div>

          <button
            type="submit"
            disabled={cargando}
            className="w-full mt-4 bg-[#d97706] hover:bg-[#b45309] font-bold text-black py-2.5 rounded-lg text-xs transition"
          >
            {cargando ? 'Guardando turno...' : 'Confirmar Reserva'}
          </button>
        </form>
      </div>
    </div>
  );
}