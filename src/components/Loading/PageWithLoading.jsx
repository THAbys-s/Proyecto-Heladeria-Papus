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

    const timer = setTimeout(() => {
      setFade(true); // inicia fade out
      setTimeout(() => setLoading(false), 500); // espera transición
    }, 100); // pequeño delay para que se vea la animación

    return () => clearTimeout(timer);
  }, [location.pathname]); // se dispara en cada cambio de ruta

  return loading ? <Loading fade={fade} /> : children;
};

export default PageWithLoading;
