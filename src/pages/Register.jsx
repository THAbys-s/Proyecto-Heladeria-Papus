import { useState, useContext } from "react";
import { AuthContext } from "../components/auth/Auth";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const { register } = useContext(AuthContext);
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await register(nombre, email, password);
    if (success) navigate("/login");
    else setError("No se pudo registrar el usuario");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Registrar</button>
      {error && <p>{error}</p>}
    </form>
  );
};

export default RegisterPage;
