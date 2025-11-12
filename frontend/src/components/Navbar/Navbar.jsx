import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { FiMenu } from "react-icons/fi";
import "./navbar.css";
import { AuthContext } from "../Auth/Auth.jsx";

const Navbar = () => {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const { user, logout } = useContext(AuthContext);

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

        {/* Icono menú helado móviles */}
        <button
          className="ice-cream-menu"
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
              to="/sucursales"
              className="card"
              onClick={() => setMenuAbierto(false)}
            >
              Sucursales
            </Link>
          </li>
          {user ? (
            <li className="menu-item">
              <div
                className="card"
                style={{ background: "#ffa9ac", color: "white" }}
              >
                {user.nombre}
                <button
                  onClick={() => {
                    logout();
                    setMenuAbierto(false);
                  }}
                  className="logout-btn"
                  style={{
                    marginLeft: "10px",
                    background: "#ff6e72",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    padding: "4px 10px",
                    cursor: "pointer",
                  }}
                >
                  Cerrar sesión
                </button>
              </div>
            </li>
          ) : (
            <>
              <li className="menu-item">
                <Link
                  to="/register"
                  className="card"
                  onClick={() => setMenuAbierto(false)}
                >
                  Registrarse
                </Link>
              </li>
              <li className="menu-item">
                <Link
                  to="/login"
                  className="card"
                  onClick={() => setMenuAbierto(false)}
                >
                  Iniciar sesión
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
