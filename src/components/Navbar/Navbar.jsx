import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiMenu } from "react-icons/fi";
import "./navbar.css";

const Navbar = () => {
  const [menuAbierto, setMenuAbierto] = useState(false);

  // Alterna visibilidad del menú en móvil
  const toggleMenu = () => setMenuAbierto((prev) => !prev);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <div className="navbar-logo">
          <Link to="/home">
            <img
              src="src/components/Navbar/imagenes/logotipo-heladerialospapus-removebg2.png"
              alt="Ir a la página principal"
            />
          </Link>
        </div>

        {/* Icono menú hamburguesa para móviles */}
        <button
          className="menu-burger"
          aria-label="Abrir menú"
          aria-expanded={menuAbierto}
          onClick={toggleMenu}
        >
          <FiMenu size={28} color="#fff" />
        </button>

        {/* Menú principal */}
        <ul className={`navbar-menu ${menuAbierto ? "show-menu" : ""}`}>
          <li className="menu-item">
            <Link
              to="/home"
              className="card"
              onClick={() => setMenuAbierto(false)}
            >
              Principal
            </Link>
            <div className="dropdown">
              <img
                src="src/components/Navbar/imagenes/logotipo-heladerialospapus-removebg.png"
                alt="Principal"
              />
            </div>
          </li>
          <li className="menu-item">
            <Link
              to="/Productos"
              className="card"
              onClick={() => setMenuAbierto(false)}
            >
              Productos
            </Link>
          </li>
          <li className="menu-item">
            <Link
              to="/nosotros"
              className="card"
              onClick={() => setMenuAbierto(false)}
            >
              Nosotros
            </Link>
            <div className="dropdown">
              <img
                src="src/components/Navbar/imagenes/heladerialospapus-local-interior.png"
                alt="HeladeriaLosPapus"
              />
            </div>
          </li>
          <li className="menu-item">
            <Link
              to="/register"
              className="card"
              onClick={() => setMenuAbierto(false)}
            >
              Registrarse
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
