import React from "react";
import "./nosotros.css"; // CSS propio del componente

const Nosotros = () => {
  return (
    <div>
      <h1>¡Dulzura pura!</h1>
      <h2>Un vistazo a nuestros sabores mas tentadores</h2>

      <div className="nosotros-imagenes">
        <div className="postres-bombones">
          <img
            src="src/components/Nosotros/imagenes/anuncio-postres.jpg"
            alt="Anuncio de postres"
            className="anuncio-imagen"
          />
          <img
            src="src/components/Nosotros/imagenes/anuncio-bombones.jpg"
            alt="Anuncio de bombones"
            className="anuncio-imagen"
          />
        </div>
        <img
          src="src/components/Nosotros/imagenes/anuncio-capelinas.jpg"
          alt="Anuncio de capelinas"
          className="anuncio-imagen"
        />
      </div>
      <h2>¿Qué hacemos?</h2>
      <p>
        En <b>Los Papus</b> ofrecemos los mejores helados de la zona, con
        sabores para todos los gustos. También contamos con una gran variedad de
        salsas, bocadillos y cucuruchos para elegir.
      </p>
      <img
        src="src/components/Nosotros/imagenes/lospapus-bandejas.jpg"
        alt="Bandejas de helado"
        className="nosotros-imagen"
      />
      <h2>¿Quiénes somos?</h2>
      <p>
        Somos una heladería dedicada a elaborar helados de calidad, frescos y
        accesibles. Ofrecemos un espacio cómodo para disfrutar en cualquier
        momento, ya que estamos abiertos las <b>24 horas</b>, todos los días del
        año.
      </p>
      <img
        src="src/components/Nosotros/imagenes/heladerialospapus-local-interior.png"
        alt="Imagen del local por dentro"
        className="nosotros-imagen"
      />
      <h2>Nuestra ubicación</h2>
      <p>
        Nos encontramos en <b>Francisco Camet 4591</b>, en el
        <b> Barrio Olímpico</b>. Actualmente contamos con una sucursal, pero
        próximamente abriremos más locales para que puedas disfrutarnos aún más
        de cerca.
      </p>
      {/* Mapa de Google */}
      <div className="mapa-wrapper">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3281.1176004626045!2d-58.45388510000001!3d-34.6769813!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bccbf866f3b065%3A0xdb8c418632620a21!2sFrancisco%20Camet%204591%2C%20C1439%20Cdad.%20Aut%C3%B3noma%20de%20Buenos%20Aires!5e0!3m2!1ses-419!2sar!4v1758195136034!5m2!1ses-419!2sar"
          className="mapa-cuadrado"
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Ubicación Heladería Los Papus"
        ></iframe>
        <img
          src="src/components/Nosotros/imagenes/local-lospapus.png"
          alt="Local visto desde fuera"
          className="mapa-imagen-local"
        />
      </div>
    </div>
  );
};

export default Nosotros;
