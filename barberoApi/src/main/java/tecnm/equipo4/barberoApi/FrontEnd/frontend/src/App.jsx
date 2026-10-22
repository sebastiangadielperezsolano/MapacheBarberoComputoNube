import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Inicio from './paginas/publica/inicio';
import InicioSesion from './paginas/publica/inicioSesion';
import Registro from './paginas/publica/registro';
import InicioCliente from './paginas/cliente/inicioCliente';
import RegistroC from './paginas/cliente/registroCita';
import Historial from './paginas/cliente/historialCliente';
import AjustesC from './paginas/cliente/ajustesCliente';
import InicioBarbero from './paginas/barbero/inicioBarbero';
import RegistroB from './paginas/barbero/registroBarbero';
import RegistroLocal from './paginas/barbero/registroLocal';
import AjustesB from './paginas/barbero/ajustesBarbero';
//Ya callate wicho

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Inicio />} />

                <Route path="/login" element={<InicioSesion />} />

                <Route path="/registro" element={<Registro />} />

                <Route path="/cliente" element={<InicioCliente />} />

                <Route path="/agendar" element={<RegistroC />} />

                <Route path="/barbero" element={<InicioBarbero />} />

                <Route path="/empleado" element={<RegistroB />} />

                <Route path="/registrol" element={<RegistroLocal />} />

                <Route path="/historialC" element={<Historial />} />

                <Route path="/ajustesc" element={<AjustesC />} />

                <Route path="/ajustesb" element={<AjustesB />} />

            </Routes>
        </BrowserRouter>
    )
}

export default App