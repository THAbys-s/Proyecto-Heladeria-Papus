// Login.jsx
import { useState, useContext } from "react";
import { AuthContext } from "../Auth/Auth";
import { useNavigate } from "react-router-dom";
import "./login.css";

const LoginPage = () => {
  const { login } = useContext(AuthContext);
  const [nombre, setNombre] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(nombre, password);
    if (success) navigate("/home");
    else setError("Credenciales inválidas");
  };

  return (
    <div className="form-wrapper">
      <form onSubmit={handleSubmit} className="form">

        <div className="form-item">
          <input
            type="text"
            placeholder=" "
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
          <label>Nombre</label>
        </div>

        <div className="form-item">
          <input
            type="password"
            placeholder=" "
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <label>Contraseña</label>
        </div>

        <div className="boton">
          <button type="submit">Login</button>
        </div>

      </form>

      {error && <p>{error}</p>}
    </div>
  );
};

export default LoginPage;
