import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Loading from "./Loading";

const PageWithLoading = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [fade, setFade] = useState(false);
  const location = useLocation(); // detecta cambios de ruta

  useEffect(() => {
    // Reinicia el loading cada vez que cambia la ruta
    setLoading(true);
    setFade(false);

    // Aquí se simula un evento de "carga de la página" usando la API Fetch o similar.
    // Puede ser cualquier acción que verifique que la página o recursos están cargados.

    const loadPage = async () => {
      try {
        // Simulamos la carga de la página (esto lo puedes reemplazar por una llamada a una API o carga de recursos)
        const response = await fetch(location.pathname); // o cualquier otra acción que se realice en tu página

        if (response.ok) {
          // Si todo carga correctamente, inicia el fade-out y termina el loading
          setFade(true);
          setTimeout(() => setLoading(false), 500); // espera para finalizar el loading
        }
      } catch (error) {
        console.error("Error al cargar la página", error);
        // Maneja el error en caso de que falle la carga
      }
    };

    loadPage();

    // Limpieza de posibles recursos si es necesario
    return () => {
      setLoading(false);
      setFade(false);
    };
  }, [location.pathname]); // se dispara cada vez que cambia la ruta

  return loading ? <Loading fade={fade} /> : children;
};

export default PageWithLoading;
