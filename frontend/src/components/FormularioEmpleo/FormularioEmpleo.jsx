import React, { useState } from "react";
import "./formularioempleo.css";

function FormularioEmpleo() {
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    puesto_deseado: "",
    experiencia: "",
    mensaje: "",
    cv_url: "",
  });
  const [status, setStatus] = useState({
    loading: false,
    message: null,
    error: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, message: null, error: false });

    // validations minimal
    if (!form.nombre || !form.apellido || !form.email) {
      setStatus({
        loading: false,
        message: "Por favor complete nombre, apellido y email.",
        error: true,
      });
      return;
    }

    try {
      const res = await fetch("/api/solicitudes-empleo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || "Error al enviar la solicitud");
      setStatus({
        loading: false,
        message: data.message || "Solicitud enviada correctamente.",
        error: false,
      });
      setForm({
        nombre: "",
        apellido: "",
        email: "",
        telefono: "",
        puesto_deseado: "",
        experiencia: "",
        mensaje: "",
        cv_url: "",
      });
    } catch (err) {
      setStatus({
        loading: false,
        message: err.message || "Error de red.",
        error: true,
      });
    }
  };

  return (
    <div className="form-empleo-container">
      <h2>Solicitud de Empleo</h2>
      <form className="form-empleo" onSubmit={handleSubmit}>
        <div className="row">
          <label>
            Nombre
            <input name="nombre" value={form.nombre} onChange={handleChange} />
          </label>
          <label>
            Apellido
            <input
              name="apellido"
              value={form.apellido}
              onChange={handleChange}
            />
          </label>
        </div>

        <div className="row">
          <label>
            Email
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
            />
          </label>
          <label>
            Teléfono
            <input
              name="telefono"
              value={form.telefono}
              onChange={handleChange}
            />
          </label>
        </div>

        <label>
          Puesto deseado
          <input
            name="puesto_deseado"
            value={form.puesto_deseado}
            onChange={handleChange}
          />
        </label>

        <label>
          Experiencia (años / breve descripción)
          <input
            name="experiencia"
            value={form.experiencia}
            onChange={handleChange}
          />
        </label>

        <label>
          Mensaje
          <textarea
            name="mensaje"
            value={form.mensaje}
            onChange={handleChange}
          />
        </label>

        <label>
          URL del CV (opcional)
          <input
            name="cv_url"
            value={form.cv_url}
            onChange={handleChange}
            placeholder="https://..."
          />
        </label>

        <div className="actions">
          <button type="submit" disabled={status.loading}>
            {status.loading ? "Enviando..." : "Enviar solicitud"}
          </button>
        </div>

        {status.message && (
          <div className={"status " + (status.error ? "error" : "success")}>
            {status.message}
          </div>
        )}
      </form>
    </div>
  );
}

export default FormularioEmpleo;
