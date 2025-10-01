import React, { useContext, useEffect, useState, useMemo } from "react";
import axios from "axios";
import { AuthContext } from "./auth/Auth";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000/";

const AdminPage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);
  const [search, setSearch] = useState("");
  const [rolFiltro, setRolFiltro] = useState("");

  // Redirigir si no es admin
  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
  }, [user, navigate]);

  useEffect(() => {
    // Solo admin puede cargar usuarios
    if (user && user.rol === "admin") {
      axios
        .get(`${API_URL}/api/usuarios`, { withCredentials: true })
        .then((res) => setUsuarios(res.data))
        .catch(() => setUsuarios([]));
    }
  }, [user]);

  // useMemo para filtrar usuarios y evitar renders innecesarios
  const usuariosFiltrados = useMemo(() => {
    let resultado = usuarios;
    if (search) {
      resultado = resultado.filter((u) =>
        u.nombre.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (rolFiltro) {
      resultado = resultado.filter((u) => u.rol === rolFiltro);
    }
    return resultado;
  }, [usuarios, search, rolFiltro]);

  if (!user || user.rol !== "admin") {
    return <p>No autorizado. Necesitas rol admin.</p>;
  }

  return (
    <div style={{ padding: 24 }}>
      <h2>Panel de Administración</h2>
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Buscar usuario..."
        style={{ marginRight: 8 }}
      />
      <select
        value={rolFiltro}
        onChange={(e) => setRolFiltro(e.target.value)}
        style={{ marginRight: 8 }}
      >
        <option value="">Todos</option>
        <option value="admin">Admin</option>
        <option value="usuario">Usuario</option>
      </select>
      <table
        style={{
          marginTop: 16,
          width: "100%",
          borderCollapse: "collapse",
          border: "1px solid #ddd",
        }}
      >
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Rol</th>
          </tr>
        </thead>
        <tbody>
          {usuariosFiltrados.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.nombre}</td>
              <td>{u.email}</td>
              <td>{u.rol}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPage;
