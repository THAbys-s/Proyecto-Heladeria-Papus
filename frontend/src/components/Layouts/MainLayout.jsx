import React, { useEffect, useState } from "react";
import Navbar from "../Navbar/Navbar";
import "./mainLayout.css";

const MainLayout = ({ children }) => {
  const [direccionFooter, setDireccionFooter] = useState(
    "Francisco Camet 4591, Barrio Olímpico"
  );

  useEffect(() => {
    const selected = localStorage.getItem("selected_tienda");
    if (selected) {
      setDireccionFooter(selected);
      return;
    }

    // Si no hay selección, pedir la lista de tiendas y usar la primera disponible
    fetch("/api/tiendas")
      .then((res) => res.json())
      .then((tiendas) => {
        if (Array.isArray(tiendas) && tiendas.length > 0) {
          const firstDir = tiendas[0].direccion;
          if (firstDir) setDireccionFooter(firstDir);
        }
      })
      .catch(() => {
        // mantener valor por defecto si falla
      });

    // Escuchar cambios de selección desde la página Sucursales
    const handler = (e) => {
      // Si viene con detalle, usarlo (mejor experiencia inmediata)
      if (e && e.detail && e.detail.direccion) {
        setDireccionFooter(e.detail.direccion);
        return;
      }
      // Fallback: leer desde localStorage
      const sel = localStorage.getItem("selected_tienda");
      if (sel) setDireccionFooter(sel);
    };
    window.addEventListener("sucursalChanged", handler);
    return () => window.removeEventListener("sucursalChanged", handler);
  }, []);

  return (
    <div className="main-layout">
      <Navbar />
      <main className="main-content">{children}</main>
      <footer className="main-footer">
        <p>&copy; 2025 Los Papus | Todos los derechos reservados.</p>
        <p>Dirección: {direccionFooter}</p>
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
