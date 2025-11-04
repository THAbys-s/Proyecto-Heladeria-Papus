/* Register.jsx */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./register.css";

const RegisterPage = () => {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState("usuario"); // 👈 nuevo: rol
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, email, password, rol }),
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok) {
        // Guardar usuario en localStorage
        localStorage.setItem("user", JSON.stringify({ nombre, rol }));

        alert("Cuenta creada con éxito 🎉");
        navigate("/home"); // redirigir al home
      } else {
        setError(data.error || "Error al registrarse");
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Error del servidor");
    }
  };

  return (
    <div className="form-wrapper">
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-item">
          <input
            type="text"
            id="nombre"
            required
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
          <label htmlFor="nombre">Nombre</label>
        </div>

        <div className="form-item">
          <input
            type="email"
            id="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label htmlFor="email">Email</label>
        </div>

        <div className="form-item">
          <input
            type="password"
            id="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <label htmlFor="password">Contraseña</label>
        </div>

        {/* 👇 Nuevo campo select para el rol */}
        <div className="form-item">
          <select
            id="rol"
            value={rol}
            onChange={(e) => setRol(e.target.value)}
            required
          >
            <option value="usuario">Usuario</option>
            <option value="admin">Admin</option>
          </select>
          <label htmlFor="rol">Tipo de cuenta</label>
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <div className="boton">
          <button type="submit">Registrarse</button>
        </div>
      </form>
    </div>
  );
};

export default RegisterPage;
