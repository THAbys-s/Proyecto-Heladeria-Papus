import { createContext, useState, useEffect } from "react";
import axios from "axios";

axios.defaults.withCredentials = true;

const API_URL = "http://localhost:5000";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Verificar si hay sesión activa
  useEffect(() => {
    axios
      .get(`${API_URL}/api/protected`, { withCredentials: true })
      .then((res) => setUser({ nombre: res.data.message.split(" ")[1] }))
      .catch(() => setUser(null));
  }, []);

  const login = async (nombre, password) => {
    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ nombre, password }),
      });

      if (res.ok) {
        const data = await res.json();
        const userData = { nombre: data.user };
        setUser(userData); // ✅ Actualiza el contexto
        localStorage.setItem("user", JSON.stringify(userData));
        return true;
      } else {
        return false;
      }
    } catch (err) {
      console.error("Error en login:", err);
      return false;
    }
  };

  const logout = async () => {
    await axios.post(`${API_URL}/api/logout`, {}, { withCredentials: true });
    setUser(null);
  };

  const register = async (nombre, email, password) => {
    try {
      const res = await axios.post(
        `${API_URL}/api/register`,
        { nombre, email, password },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      return res.status === 201;
    } catch (err) {
      alert("Error en register:", err.response?.data || err.message);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};
