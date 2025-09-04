import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HolamundoPage from "./pages/Holamundo";
import PaginaPrincipalPage from "./pages/Principal";
import BuscarSabores from "./pages/BuscarSabores";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/example" element={<HolamundoPage />} />
        <Route path="/home" element={<PaginaPrincipalPage />} />
        <Route path="/buscar" element={<BuscarSabores />} />
        {/* Agrega más rutas aquí */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
