import React, { useState } from "react";

const Sabores = () => {
  const [sabores, setSabores] = useState([]);

  const obtenerSabores = async () => {
    try {
      const response = await fetch("/mysql/buscar/sabores");
      console.log("Respuesta del servidor:", await response.text()); // Ver el contenido completo
      const data = await response.json(); // Esto sigue fallando si la respuesta no es JSON
      console.log(data);
      setSabores(data);
    } catch (error) {
      console.error("Error al obtener sabores:", error);
    }
  };

  return (
    <div>
      <button onClick={obtenerSabores}>Mostrar todos los sabores</button>
      <ul>
        {sabores.map((sabor, idx) => (
          <li key={idx}>{sabor.nombre_sabor}</li>
        ))}
      </ul>
    </div>
  );
};

export default Sabores;
