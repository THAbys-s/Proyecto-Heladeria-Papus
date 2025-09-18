import { createContext, useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://127.0.0.1:5000";

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
      const res = await axios.post(
        `${API_URL}/api/login`,
        { nombre, password },
        { withCredentials: true }
      );
      if (res.status === 200) {
        setUser({ nombre });
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    return false;
  };

  const logout = async () => {
    await axios.post(`${API_URL}/api/logout`, {}, { withCredentials: true });
    setUser(null);
  };

  const register = async (nombre, email, password) => {
    const res = await axios.post(`${API_URL}/api/register`, {
      nombre,
      email,
      password,
    });
    return res.status === 201;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};
