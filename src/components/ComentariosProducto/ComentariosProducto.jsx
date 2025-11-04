// ComentariosProducto.jsx
import React, { useState, useEffect } from "react";
import "./comentariosproducto.css";

const ComentariosProducto = ({ productoId, nombre }) => {
  const [comentarios, setComentarios] = useState([]);
  const [nuevoComentario, setNuevoComentario] = useState("");
  const [usuario, setUsuario] = useState(null);

  // Obtener usuario actual
  useEffect(() => {
    fetch("http://localhost:5000/api/protected", { credentials: "include" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        const nombre = data?.message?.split(" ")[1] || null;
        setUsuario(nombre);
      })
      .catch(() => setUsuario(null));
  }, []);

  // Cargar comentarios del producto
  useEffect(() => {
    fetch(`/api/comentarios/${productoId}`)
      .then((res) => res.json())
      .then(setComentarios)
      .catch(() => setComentarios([]));
  }, [productoId]);

  const enviarComentario = () => {
    if (!nuevoComentario.trim()) return;

    fetch(`/api/comentarios/${productoId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ comentario: nuevoComentario }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message) {
          setNuevoComentario("");
          setComentarios([
            {
              comentario: nuevoComentario,
              usuario,
              fecha: new Date().toISOString(),
            },
            ...comentarios,
          ]);
        } else {
          alert("Tenés que iniciar sesión para comentar.");
        }
      });
  };

  return (
    <div className="comentarios-card">
      <h3>{nombre}</h3>
      <div className="comentarios-lista">
        {comentarios.length === 0 ? (
          <p className="muted">No hay comentarios aún.</p>
        ) : (
          comentarios.map((c, i) => (
            <div key={i} className="comentario-item">
              <strong>{c.usuario}</strong>{" "}
              <span className="fecha">
                {new Date(c.fecha).toLocaleString()}
              </span>
              <p>{c.comentario}</p>
            </div>
          ))
        )}
      </div>

      <div className="comentario-form">
        <textarea
          placeholder={
            usuario ? "Escribe tu opinión..." : "Inicia sesión para comentar"
          }
          value={nuevoComentario}
          onChange={(e) => setNuevoComentario(e.target.value)}
          disabled={!usuario}
        />
        <button
          className="btn btn-primary"
          onClick={enviarComentario}
          disabled={!usuario}
        >
          Enviar
        </button>
      </div>
    </div>
  );
};

export default ComentariosProducto;
