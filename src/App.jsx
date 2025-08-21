import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HolamundoPage from './pages/Holamundo';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/example" element={<HolamundoPage />} />
        {/* Agrega más rutas aquí */}
      </Routes>
    </BrowserRouter>
  );
}

export default App
