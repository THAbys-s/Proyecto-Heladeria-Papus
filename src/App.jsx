// src/App.jsx
import "./App.css";
import { Routes, Route } from "react-router-dom";
import { Home } from "./components/home/Home";

function App() {
  return (
    <Routes>
      <Route path="/home" element={<Home />} />
      <Route path="/principal" element={<HomeClientes />} />
    </Routes>
  );
}

/*  
    #FF6E72 Rosa fuerte
    #FFA9AC Rosa claro
    #65B7DA Azul claro
    #EEEEEE Blanco
*/

export default App;
