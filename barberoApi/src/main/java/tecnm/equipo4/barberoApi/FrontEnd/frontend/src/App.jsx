import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Inicio from './paginas/publica/inicio';
import InicioSesion from './paginas/publica/inicioSesion';
import Registro from './paginas/publica/registro';
import InicioCliente from './paginas/cliente/inicioCliente';
import RegistroC from './paginas/cliente/registroCita';
import inicioBarbero from './paginas/barbero/inicioBarbero';
import RegistroB from './paginas/barbero/registroBarbero';
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

                <Route path="/barbero" element={<inicioBarbero />} />

                <Route path="/empleado" element={<RegistroB />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App