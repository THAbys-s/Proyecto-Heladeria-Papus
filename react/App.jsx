import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HolamundoPage from "./pages/Holamundo";
import PaginaPrincipalPage from "./pages/Principal";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/example" element={<HolamundoPage />} />
        <Route path="/home" element={<PaginaPrincipalPage />} />
        {/* Agrega más rutas aquí */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
