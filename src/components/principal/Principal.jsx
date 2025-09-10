import "./principal.css";

const Principal = () => {
  return (
    <div>
      <header>
        <h1>Heladería Los Papus</h1>
        <h3>¡Bienvenido a la mejor heladería de la ciudad!</h3>
      </header>

      <section>
        <div className="info">
          <h2>¡Un vistazo a nuestros sabores más tentadores!</h2>
          <ul>
            <li>Sabores</li>
            <li>Capelinas</li>
            <li>Bombones</li>
          </ul>
        </div>
      </section>

      <footer>
        <p>&copy; 2025 Heladería Papus. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
};

export default Principal;
