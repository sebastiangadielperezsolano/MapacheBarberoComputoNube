import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Inicio from './paginas/publica/inicio';
import InicioSesion from './paginas/publica/inicioSesion';
import Registro from './paginas/publica/registro';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Inicio />} />

                <Route path="/login" element={<InicioSesion />} />

                <Route path="/registro" element={<Registro />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App