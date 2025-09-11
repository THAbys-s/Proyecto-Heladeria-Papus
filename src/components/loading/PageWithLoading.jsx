import { useState, useEffect } from "react";
import Loading from "./Loading"; // tu animación de helado

const PageWithLoading = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const handleLoad = () => {
      // Inicia el fade out
      setFade(true);
      // Espera la transición antes de mostrar el contenido
      setTimeout(() => setLoading(false), 500); // 500ms = duración del fade
    };

    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
    }

    return () => window.removeEventListener("load", handleLoad);
  }, []);

  return loading ? <Loading fade={fade} /> : children;
};

export default PageWithLoading;
