import "./principal.css";
import { Link } from "react-router-dom";

const Principal = () => {
  return (
    <div className="principal-container">
      <header className="principal-header">
        <svg class="onda" viewBox="0 0 1440 150">
          <path
            fill="#59a5c5ff"
            fill-opacity="1"
            d="M0,96L80,106.7C160,117,320,139,480,128C640,117,800,75,960,74.7C1120,75,1280,117,1360,138.7L1440,160L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"
          ></path>
        </svg>
        <h1> Heladería Los Papus</h1>
        <h2>¡Bienvenido a la mejor heladería de la ciudad!</h2>
      </header>

      <main className="principal-main">
        <svg class="onda" viewBox="0 0 1440 150">
          <path
            fill="#f3878bff"
            fill-opacity="1"
            d="M0,96L80,106.7C160,117,320,139,480,128C640,117,800,75,960,74.7C1120,75,1280,117,1360,138.7L1440,160L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"
          ></path>
        </svg>
        <section className="sabores-section">
          <h2> Un vistazo a nuestros sabores más tentadores </h2>
          <div className="cards-container">
            <Link to="/buscar" className="card">
              Busqueda de Sabores
            </Link>
            <Link to="/sabores" className="card">
              Sabores
            </Link>
            <Link to="/sabores extravagantes" className="card">
              Especiales
            </Link>
            <Link to="/bocadillos" className="card">
              Bocadillos
            </Link>
            <Link to="/salsas" className="card">
              Salsas
            </Link>
            <Link to="/cucuruchos" className="card">
              Cucuruchos
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Principal;
