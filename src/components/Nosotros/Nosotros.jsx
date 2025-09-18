import React from "react";
import "./nosotros.css"; // CSS propio del componente

const Nosotros = () => {
  return (
    <div className="nosotros-container">
      <h1 className="nosotros-titulo">Acerca de Nosotros</h1>
      <p className="nosotros-texto">
        En Heladería Los Papus nos apasiona crear los mejores helados de la
        ciudad. Utilizamos ingredientes frescos y recetas tradicionales para
        brindar una experiencia única a cada cliente. Nuestro compromiso es la
        calidad, la creatividad y la alegría en cada sabor que ofrecemos.
      </p>

      <div className="nosotros-imagenes">
        <img
          src="/path-to-your-image1.jpg"
          alt="Nuestro local"
          className="nosotros-imagen"
        />
        <img
          src="/path-to-your-image2.jpg"
          alt="Nuestros helados"
          className="nosotros-imagen"
        />
      </div>
    </div>
  );
};

export default Nosotros;
