import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import PaginaPrincipalPage from "./pages/Principal";
import BuscarSabores from "./pages/BuscarSabores";
import LoadingPage from "./pages/Loading";
import NotFound from "./pages/NoFueEncontrado";
import Sabores from "./components/sabores/Sabores";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import { AuthProvider } from "./components/auth/Auth";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Redirige raíz a /home */}
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/home" element={<PaginaPrincipalPage />} />

          <Route path="/buscar" element={<BuscarSabores />} />
          <Route path="/sabores" element={<Sabores />} />
          {/* Hacer que funcione antes de cada página */}
          <Route path="/loading" element={<LoadingPage />} />

          {/* Página 404 */}
          <Route path="*" element={<NotFound />} />

          {/*Rutas de Login, Register y Auth */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
