import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import PaginaPrincipalPage from "./pages/Principal";
import BuscarSabores from "./pages/BuscarSabores";
import LoadingPage from "./pages/Loading";
import NotFound from "./pages/NoFueEncontrado";
import Sabores from "./components/sabores/Sabores";
import PageWithLoading from "./components/loading/PageWithLoading";

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
              <PaginaPrincipalPage />
            </PageWithLoading>
          }
        />

        <Route
          path="/buscar"
          element={
            <PageWithLoading>
              <BuscarSabores />
            </PageWithLoading>
          }
        />

        <Route
          path="/sabores"
          element={
            <PageWithLoading>
              <Sabores />
            </PageWithLoading>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
