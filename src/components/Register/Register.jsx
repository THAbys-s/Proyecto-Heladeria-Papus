import { useState } from "react";
import "./register.css"; // archivo CSS con la animación

const RegisterPage = () => {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // aquí podrías poner tu lógica de registro
    console.log({ nombre, email, password });
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
        <div className="boton">
          <button type="submit">Registrarse</button>
        </div>
      </form>
    </div>
  );
};

export default RegisterPage;
