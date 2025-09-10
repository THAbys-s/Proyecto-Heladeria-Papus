import { useEffect, useState } from "react";

export function Sabores() {
  const [sabores, setSabores] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/sabores") // ruta de Flask
      .then((res) => res.json())
      .then((data) => setSabores(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h1>Lista de Juegos</h1>
      <ol>
        {sabores.map((sabor, i) => (
          <li key={i}>{sabor.nombre_sabor}</li>
        ))}
      </ol>
    </div>
  );
}
