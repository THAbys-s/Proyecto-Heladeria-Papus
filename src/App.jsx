import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import PaginaPrincipalPage from "./pages/Principal";
import BuscarSabores from "./pages/BuscarSabores";
import LoadingPage from "./pages/Loading";
import NotFound from "./pages/NoFueEncontrado";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirige raíz a /home */}
        <Route path="/" element={<Navigate to="/home" />} />

        <Route path="/home" element={<PaginaPrincipalPage />} />
        <Route path="/buscar" element={<BuscarSabores />} />
        <Route path="/loading" element={<LoadingPage />} />

        {/* Página 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
