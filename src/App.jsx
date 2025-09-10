import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PaginaPrincipalPage from "./pages/Principal";
import BuscarSabores from "./pages/BuscarSabores";
import LoadingPage from "./pages/Loading";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/home" element={<PaginaPrincipalPage />} />
        <Route path="/buscar" element={<BuscarSabores />} />
        {/* Agrega más rutas aquí */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
