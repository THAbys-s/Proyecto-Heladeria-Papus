// ComentariosProducto.jsx
import React, { useState, useEffect } from "react";
import "./comentariosproducto.css";

const ComentariosProducto = ({ productoId }) => {
  const [comentarios, setComentarios] = useState([]);
  const [nuevoComentario, setNuevoComentario] = useState("");
  const [usuario, setUsuario] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // Obtener usuario actual (sin romper sesión global)
  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/protected", {
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          const nombreExtraido =
            data?.message
              ?.replace("Hola ", "")
              .replace(", estás logueado", "") || null;
          setUsuario(nombreExtraido);
        } else {
          setUsuario(null);
        }
      } catch {
        setUsuario(null);
      } finally {
        setLoadingUser(false);
      }
    };

    checkUser();
  }, []);

  // Cargar comentarios del producto
  useEffect(() => {
    const cargarComentarios = async () => {
      try {
        const res = await fetch(`/api/comentarios/${productoId}`);
        if (res.ok) {
          const data = await res.json();
          setComentarios(data);
        } else {
          setComentarios([]);
        }
      } catch {
        setComentarios([]);
      }
    };

    if (productoId) cargarComentarios();
  }, [productoId]);

  const enviarComentario = async () => {
    if (!nuevoComentario.trim()) return;

    try {
      const res = await fetch(`/api/comentarios/${productoId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ comentario: nuevoComentario }),
      });

      const data = await res.json();

      if (res.ok && data.message) {
        setComentarios((prev) => [
          {
            comentario: nuevoComentario,
            usuario,
            fecha: new Date().toISOString(),
          },
          ...prev,
        ]);
        setNuevoComentario("");
      } else if (res.status === 401) {
        alert("Tenés que iniciar sesión para comentar.");
      }
    } catch (err) {
      console.error("Error al enviar comentario:", err);
    }
  };

  return (
    <div className="comentarios-card">
      <h4>Comentarios</h4>

      {loadingUser ? (
        <p className="muted">Cargando...</p>
      ) : (
        <>
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
                usuario
                  ? "Escribe tu opinión..."
                  : "Inicia sesión para comentar"
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
        </>
      )}
    </div>
  );
};

export default ComentariosProducto;
