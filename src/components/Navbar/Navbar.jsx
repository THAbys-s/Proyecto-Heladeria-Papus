import { Link } from "react-router-dom";
import "./navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/home">🍦 Los Papus</Link>
      </div>
      <ul className="navbar-menu">
        <li>
          <Link to="/home">Inicio</Link>
        </li>
        <li>
          <Link to="/buscar">Buscar</Link>
        </li>
        <li>
          <Link to="/sabores">Sabores</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
