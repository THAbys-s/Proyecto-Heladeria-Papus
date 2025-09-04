import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";

function BuscarSabores() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [resultados, setResultados] = useState([]);
  const [inputValue, setInputValue] = useState(
    searchParams.get("nombre") || ""
  );

  useEffect(() => {
    const nombre = searchParams.get("nombre") || "";
    if (nombre) {
      fetch(`/mysql/buscar/sabores?nombre=${encodeURIComponent(nombre)}`)
        .then((res) => res.json())
        .then(setResultados);
    } else {
      setResultados([]);
    }
  }, [searchParams]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      setSearchParams({ nombre: inputValue });
    }
  };

  return (
    <div>
      <input
        type="search"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Buscar sabor..."
      />
      <ul>
        {resultados.length === 0 ? (
          <li>No se encontraron sabores.</li>
        ) : (
          resultados.map((sabor) => (
            <li key={sabor.nombre_sabor}>{sabor.nombre_sabor}</li>
          ))
        )}
      </ul>
    </div>
  );
}

export default BuscarSabores;

//
// 28/08/2025
//
// Comentario de DEV: Mi mente está nublada y cansada, no puedo pensar con claridad.
// Cambios realizados:
// Actualicé el creador de rutas personalizadas en base a los componentes en la carpeta pages.
// Utilicé useSearchParams para actualizar de manera dinámica los parámetros en la URL.
// Agregué una ruta 404 en caso de error.
//
