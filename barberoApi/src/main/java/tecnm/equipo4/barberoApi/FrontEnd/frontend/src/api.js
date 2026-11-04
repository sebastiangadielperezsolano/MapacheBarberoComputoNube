// Colócalo en src/api.js  (ajusta la ruta '../api' en los imports si tus pantallas están en otra carpeta)
export const API_URL = 'http://localhost:8080';

export const leerSesion = () => {
  try {
    const raw = localStorage.getItem('usuarioSesion') || localStorage.getItem('usuario');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

// Deja solo 10 dígitos (quita espacios, guiones, "+" y la lada 52 si viene completa)
export const normalizarTelefono = (tel = '') => {
  let d = String(tel).replace(/\D/g, '');
  if (d.length === 12 && d.startsWith('52')) d = d.slice(2);
  return d;
};

// Extrae el mensaje {"error": "..."} que ahora devuelve el backend
export const leerError = async (res, porDefecto = 'Ocurrió un error.') => {
  try {
    const txt = await res.text();
    try {
      const j = JSON.parse(txt);
      return j.error || j.message || porDefecto;
    } catch {
      return txt || porDefecto;
    }
  } catch {
    return porDefecto;
  }
};

export const fechaLocalISO = (d = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

export const esActivo = (estado) =>
  !['CANCELADO', 'FINALIZADO', 'COMPLETADO'].includes((estado || '').toUpperCase());

export const fechaHoraTurno = (t) =>
  new Date(`${t.fecha}T${String(t.horaInicio || '00:00:00').slice(0, 5)}:00`);

export const cambiarEstadoTurno = async (idTurno, nuevoEstado, rol, idUsuario) => {
  const res = await fetch(
    `${API_URL}/api/turnos/${idTurno}/estado?nuevoEstado=${nuevoEstado}&rol=${rol}&idUsuario=${idUsuario}`,
    { method: 'PATCH' }
  );
  if (!res.ok) throw new Error(await leerError(res, 'No se pudo actualizar la cita.'));
  return res.json();
};
