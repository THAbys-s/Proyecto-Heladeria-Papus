import { Link } from "react-router-dom";
import "./navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <Link to="/home">
            <img
              src="src/components/Navbar/imagenes/logotipo-heladerialospapus-removebg2.png"
              alt="Ir a la página principal"
            />
          </Link>
        </div>

        <ul className="navbar-menu">
          <li className="menu-item">
            <Link to="/home" className="card">
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
            <Link to="/Productos" className="card">
              Productos
            </Link>
          </li>

          <li className="menu-item">
            <Link to="/nosotros" className="card">
              Nosotros
            </Link>
            <div className="dropdown">
              <img
                src="src/components/Navbar/imagenes/heladerialospapus-local-interior.png"
                alt="HeladeriaLosPapus"
              />
            </div>
          </li>

          <li>
            <Link to="/register" className="card">
              Registrarse
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
