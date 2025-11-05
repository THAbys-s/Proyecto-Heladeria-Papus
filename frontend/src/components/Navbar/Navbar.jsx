import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiMenu } from "react-icons/fi";
import "./navbar.css";

const Navbar = () => {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [usuario, setUsuario] = useState(null);

  // 👇 Cargar usuario desde localStorage al montar
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUsuario(JSON.parse(storedUser));
    }
  }, []);

  const toggleMenu = () => setMenuAbierto((prev) => !prev);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUsuario(null);
    window.location.reload();
  };

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

        {/* Icono menú móviles */}
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
          </li>
          <li className="menu-item">
            <Link
              to="/productos"
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

          {/* 👇 Mostrar según sesión */}
          {!usuario ? (
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
          ) : (
            <>
              <li className="menu-item">
                <span
                  className="card"
                  style={{ backgroundColor: "#fff7ba", color: "black" }}
                >
                  {usuario.rol === "admin"
                    ? `Admin: ${usuario.nombre}`
                    : usuario.nombre}
                </span>
              </li>
              <li className="menu-item">
                <button
                  className="card"
                  onClick={handleLogout}
                  style={{
                    backgroundColor: "#ff6e72",
                    color: "white",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Cerrar sesión
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
