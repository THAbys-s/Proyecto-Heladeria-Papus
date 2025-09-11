import Navbar from "../Navbar/Navbar";
import "./MainLayout.css";

const MainLayout = ({ children }) => {
  return (
    <div className="main-layout">
      <Navbar />
      <main className="main-content">{children}</main>
      <footer className="main-footer">
        &copy; 2025 Heladería Papus. Todos los derechos reservados.
      </footer>
    </div>
  );
};

export default MainLayout;
