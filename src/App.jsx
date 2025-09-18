import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import PaginaPrincipalPage from "./pages/Principal";
import BuscarSabores from "./pages/BuscarSabores";
import NotFound from "./pages/NoFueEncontrado";
import Sabores from "./components/Sabores/Sabores";
import PageWithLoading from "./components/Loading/PageWithLoading";
import MainLayout from "./components/Layouts/MainLayout";
import Nosotros from "./components/Nosotros/Nosotros";
import Sabores from "./components/sabores/Sabores";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import { AuthProvider } from "./components/auth/Auth";

/*
#FF6E72
#FFA9AC
#65B7DA
#FCBA78
#DD7E6B
#FFF7BA
*/

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Redirige raíz a /home */}
          <Route path="/" element={<Navigate to="/home" />} />
          <Route
            path="/home"
            element={
              <PageWithLoading>
                <MainLayout>
                  <PaginaPrincipalPage />
                </MainLayout>
              </PageWithLoading>
            }
          />
          {/* Ruta de Busqueda */}
          <Route
            path="/buscar"
            element={
              <PageWithLoading>
                <MainLayout>
                  <BuscarSabores />
                </MainLayout>
              </PageWithLoading>
            }
          />
          {/* Ruta preview de Sabores */}
          <Route
            path="/sabores"
            element={
              <PageWithLoading>
                <MainLayout>
                  <Sabores />
                </MainLayout>
              </PageWithLoading>
            }
          />
          {/* Información de Nosotros */}
          <Route
            path="/nosotros"
            element={
              <PageWithLoading>
                <MainLayout>
                  <Nosotros />
                </MainLayout>
              </PageWithLoading>
            }
          />

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
