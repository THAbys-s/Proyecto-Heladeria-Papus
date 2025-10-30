import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./sucursales.css";

const Sucursales = () => {
  const navigate = useNavigate();
  const [tiendas, setTiendas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    fetch("/api/tiendas")
      .then((res) => res.json())
      .then((data) => {
        setTiendas(Array.isArray(data) ? data : []);
      })
      .catch(() => setTiendas([]))
      .finally(() => setLoading(false));
  }, []);

  const handleSelect = (tienda) => {
    if (tienda && tienda.direccion) {
      localStorage.setItem("selected_tienda", tienda.direccion);
      // Guardar también el id para referencia futura
      localStorage.setItem("selected_tienda_id", String(tienda.tienda_id));
    }
    setSelectedId(tienda.tienda_id);
    // Dispatch a CustomEvent with details so MainLayout can react immediately
    const ev = new CustomEvent("sucursalChanged", {
      detail: { direccion: tienda.direccion, tienda_id: tienda.tienda_id },
    });
    window.dispatchEvent(ev);
    // Navegar a la página principal
    navigate("/home");
  };

  // Mostrar/ocultar empleados para una tienda
  const [expandedTienda, setExpandedTienda] = useState(null);
  const [empleadosCache, setEmpleadosCache] = useState({});

  const toggleEmpleados = (tienda) => {
    const id = tienda.tienda_id;
    if (expandedTienda === id) {
      setExpandedTienda(null);
      return;
    }

    // Si ya tengo la info en cache, solo expandir
    if (empleadosCache[id]) {
      setExpandedTienda(id);
      return;
    }

    // Pedir empleados para la tienda
    fetch(`/api/tiendas/${id}/empleados`)
      .then((res) => res.json())
      .then((data) => {
        setEmpleadosCache((prev) => ({
          ...prev,
          [id]: Array.isArray(data) ? data : [],
        }));
        setExpandedTienda(id);
      })
      .catch(() => {
        setEmpleadosCache((prev) => ({ ...prev, [id]: [] }));
        setExpandedTienda(id);
      });
  };

  if (loading)
    return <div className="sucursales-root">Cargando sucursales...</div>;
  if (!tiendas.length)
    return (
      <div className="sucursales-root">No hay sucursales registradas.</div>
    );

  return (
    <div className="sucursales-root">
      <h2>Nuestras Sucursales</h2>
      <div className="sucursales-list">
        {tiendas.map((t) => (
          <div key={t.tienda_id} className="sucursal-row">
            <div className="sucursal-row-main">
              <div
                className={`sucursal-label ${
                  selectedId === t.tienda_id ? "selected" : ""
                }`}
              >
                {t.direccion}
              </div>
              <div className="sucursal-actions">
                <button
                  className="sucursal-btn"
                  onClick={() => handleSelect(t)}
                >
                  Ir a sucursal
                </button>
                <button
                  className="ver-empleados-btn"
                  onClick={() => toggleEmpleados(t)}
                >
                  {expandedTienda === t.tienda_id
                    ? "Ocultar empleados"
                    : "Ver empleados"}
                </button>
              </div>
            </div>

            {expandedTienda === t.tienda_id && (
              <div className="empleados-table-wrap">
                <table className="empleados-table">
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Apellido</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(empleadosCache[t.tienda_id] || []).map((e, idx) => (
                      <tr key={idx}>
                        <td>{e.nombre}</td>
                        <td>{e.apellido}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="empleados-summary">
                  Total empleados: {(empleadosCache[t.tienda_id] || []).length}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sucursales;
