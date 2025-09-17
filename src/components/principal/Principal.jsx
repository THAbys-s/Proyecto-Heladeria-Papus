import "./principal.css";
import { Link } from "react-router-dom";

const Principal = () => {
  return (
    <div className="principal-container">
      <header className="principal-header">
        <h1 className="titulo"> Heladería Los Papus</h1>
        <h3 className="subtitulo">
          ¡Bienvenido a la mejor heladería de la ciudad!
        </h3>
      </header>

      <main className="principal-main">
        <section className="sabores-section">
          <h2> Un vistazo a nuestros sabores más tentadores </h2>
          <div className="cards-container">
            <Link to="/buscar" className="card">
              Busqueda de Sabores
            </Link>
            <div className="card">Capelinas</div>
            <div className="card">Capelinas</div>

            <div className="card">Capelinas</div>
            <div className="card">Bombones</div>
            <Link to="/sabores" className="card">
              Sabores
            </Link>
          </div>
        </section>
      </main>

      <footer className="principal-footer">
        <p>&copy; 2025 Heladería Papus. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
};

export default Principal;
