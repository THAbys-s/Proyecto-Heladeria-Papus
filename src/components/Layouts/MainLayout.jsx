import Navbar from "../Navbar/Navbar";
import "./mainLayout.css";

const MainLayout = ({ children }) => {
  return (
    <div className="main-layout">
      <Navbar />
      <main className="main-content">{children}</main>
      <footer className="main-footer">
        <p>&copy; 2025 Los Papus | Todos los derechos reservados.</p>
        <p>Dirección: Francisco Camet 4591, Barrio Olímpico</p>
        <p>Teléfono de Contacto: +54 9 11 3857-2025</p>
        <p> Correo: ajataledezmadiego@gmail.com</p>
        <p>
          Seguinos en Instagram para enterarte de nuestras novedades y ofertas:
        </p>
        <a
          href="https://www.instagram.com/ledemaaa/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="src/components/Layouts/instagram-logo.png"
            alt="Instagram"
          />
        </a>
      </footer>
    </div>
  );
};

export default MainLayout;
