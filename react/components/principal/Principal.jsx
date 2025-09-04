import "./principal.css";

const Principal = () => {
  return (
    <div className="principal-container">
      <div className="principal-header">
        <header>
          <h1>Heladería Los Papus</h1>
          <p>¡Bienvenido a la mejor heladería de la ciudad</p>
        </header>
      </div>

      <section className="principal-section">
        <div className="principal-info">
          <h2>¡Un vistazo a nuestros sabores mas tentadores</h2>
          <ul>
            <li>Sabores</li>
            <li>Capelinas</li>
            <li>Bombones</li>
          </ul>
        </div>
      </section>

      <div className="principal-footer">
        <footer>
          <p>&copy; 2025 Heladería Papus. Todos los derechos reservados.</p>
        </footer>
      </div>
    </div>
  );
};

export default Principal;
