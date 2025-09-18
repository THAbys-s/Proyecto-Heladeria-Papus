import { Link } from "react-router-dom";
import "./navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <a to="/home" rel="noopener noreferrer">
            <img
              src="src/components/Navbar/imagenes/logotipo-heladerialospapus-removebg2.png"
              alt="Principal"
            />
          </a>
          <Link to="/home">Los Papus</Link>
        </div>
        <ul className="navbar-menu">
          <div className="navbar-car-deco"></div>
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
            <div className="dropdown">
              <img
                src="src/components/Navbar/imagenes/capelinas-frutilla.jpg"
                alt="CapelinaFrutilla"
              />
            </div>
          </li>
          <li className="menu-item">
            <Link to="/sabores" className="card">
              Sabores
            </Link>
            <div className="dropdown">
              <img
                src="src/components/Navbar/imagenes/capelinas-frutilla.jpg"
                alt="CapelinaFrutilla"
              />
            </div>
          </li>
          <li className="menu-item">
            <Link to="/sabores extravagantes" className="card">
              Especiales
            </Link>
            <div className="dropdown">
              <img
                src="src/components/Navbar/imagenes/capelinas-frutilla.jpg"
                alt="CapelinaFrutilla"
              />
              {/* </div>
          </li>
          <li className="menu-item">
            <Link to="/bocadillos" className="card">
              Bocadillos
            </Link>
            <div className="dropdown">
              <img
                src="src/components/Navbar/imagenes/capelinas-frutilla.jpg"
                alt="CapelinaFrutilla"
              />
            </div>
          </li>
          <li className="menu-item">
            <Link to="/salsas" className="card">
              Salsas
            </Link>
            <div className="dropdown">
              <img
                src="src/components/Navbar/imagenes/capelinas-frutilla.jpg"
                alt="CapelinaFrutilla"
              /> */}
            </div>
          </li>
          <li className="menu-item">
            <Link to="/cucuruchos" className="card">
              Cucuruchos
            </Link>
            <div className="dropdown">
              <img
                src="src/components/Navbar/imagenes/capelinas-frutilla.jpg"
                alt="CapelinaFrutilla"
              />
            </div>
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
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
