import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import PaginaPrincipalPage from "./pages/Principal";
import BuscarSabores from "./pages/BuscarSabores";
import NotFound from "./pages/NoFueEncontrado";
import Sabores from "./components/Sabores/Sabores";
import PageWithLoading from "./components/Loading/PageWithLoading";
import MainLayout from "./components/Layouts/MainLayout";
import Nosotros from "./components/Nosotros/Nosotros";

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
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
