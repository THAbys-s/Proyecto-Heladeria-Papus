/* Productos.jsx */

import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./productos.css";
import PaypalButton from "../PaypalButton/PaypalButton.jsx";
import ComentariosProducto from "../ComentariosProducto/ComentariosProducto.jsx";

// --- ICONOS NUEVOS ---
import {
  TiArrowBack,
  TiArrowForward,
  TiArrowLeft,
  TiArrowRight,
} from "react-icons/ti";

const imgUrls = {
  "Crujido Tentador":
    "https://res.cloudinary.com/dwwzeq55r/image/upload/v1759933010/bombon-crocante_pjggzf.jpg",
  "Boscado Celestial":
    "https://res.cloudinary.com/dwwzeq55r/image/upload/v1759933010/bombon-escoces_etximj.jpg",
  "Dulce Suspiro":
    "https://res.cloudinary.com/dwwzeq55r/image/upload/v1759933010/bombon-split_jzocao.jpg",
  "Duo Delicia":
    "https://res.cloudinary.com/dwwzeq55r/image/upload/v1759933010/bombon-suizo_uajm0g.jpg",
  "Vainilla Sueño":
    "https://res.cloudinary.com/dwwzeq55r/image/upload/v1759933010/capelinas-chocolate_dvqf1s.jpg",
  "Frescura Tropical":
    "https://res.cloudinary.com/dwwzeq55r/image/upload/v1759933010/capelinas-frutal_ecktij.jpg",
  "Frutilla Encantada":
    "https://res.cloudinary.com/dwwzeq55r/image/upload/v1759933012/capelinas-frutilla_e4xxhj.jpg",
  "Chocolate Divino":
    "https://res.cloudinary.com/dwwzeq55r/image/upload/v1759933019/capelinas-nuez_nkkhlx.jpg",
  "Palito Bombón":
    "https://res.cloudinary.com/dwwzeq55r/image/upload/v1759933019/palito-bombon_x3wdc7.jpg",
  "Palito Vainillita":
    "https://res.cloudinary.com/dwwzeq55r/image/upload/v1759933019/palitocremoso-americana_ncrz23.jpg",
  "Palito Rosado":
    "https://res.cloudinary.com/dwwzeq55r/image/upload/v1759933019/palitocremoso-frutilla_bkwwo7.jpg",
  "Crujido Almendrado":
    "https://res.cloudinary.com/dwwzeq55r/image/upload/v1759933028/postres-almendrado_nmfxwe.jpg",
  "Trio Tentador":
    "https://res.cloudinary.com/dwwzeq55r/image/upload/v1759933028/postres-cassata_n4nmcp.jpg",
  "Sueño Chocolatoso":
    "https://res.cloudinary.com/dwwzeq55r/image/upload/v1759933028/postres-crocantino_ewicb2.jpg",
  "Beso De Amor":
    "https://res.cloudinary.com/dwwzeq55r/image/upload/v1759933028/postres-delicia_lsyjoo.jpg",
  "Sundae Frutal":
    "https://res.cloudinary.com/dwwzeq55r/image/upload/v1759933028/sundae-frutal_fgxdi3.jpg",
  "Sundae Go":
    "https://res.cloudinary.com/dwwzeq55r/image/upload/v1759933035/sundae-go_zhnr5w.jpg",
};

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState(() => {
    const savedCart = localStorage.getItem("carrito");
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [paginaActual, setPaginaActual] = useState(1);
  const productosPorPagina = 6;
  const [mostrarMenu, setMostrarMenu] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/api/productos")
      .then((res) => res.json())
      .then((data) => {
        const productosConImg = data.map((p) => ({
          ...p,
          img: imgUrls[p.nombre] || "",
        }));
        setProductos(productosConImg);
      })
      .catch((error) => console.error("Error cargando productos:", error));
  }, []);

  const indexInicio = (paginaActual - 1) * productosPorPagina;
  const indexFin = indexInicio + productosPorPagina;
  const productosVisibles = productos.slice(indexInicio, indexFin);
  const totalPaginas = Math.ceil(productos.length / productosPorPagina);

  // --- Guardar carrito en localStorage cada vez que cambie ---
  useEffect(() => {
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }, [carrito]);

  // --- Ajustar altura dinámica del carrito ---
  useEffect(() => {
    const h = Math.max(300, 80 + carrito.length * 60);
    document.documentElement.style.setProperty("--cart-height", `${h}px`);
  }, [carrito.length]);

  // --- Funciones para agregar/quitar productos ---
  const agregarAlCarrito = (producto) => {
    setCarrito((prev) => {
      const existe = prev.find((i) => i.id === producto.id);
      return existe
        ? prev.map((i) =>
            i.id === producto.id ? { ...i, cantidad: i.cantidad + 1 } : i
          )
        : [...prev, { ...producto, cantidad: 1 }];
    });
  };

  const quitarDelCarrito = (productoId) => {
    setCarrito((prev) =>
      prev
        .map((i) =>
          i.id === productoId ? { ...i, cantidad: i.cantidad - 1 } : i
        )
        .filter((i) => i.cantidad > 0)
    );
  };

  // --- Función para finalizar compra ---
  const finalizarCompra = () => {
    // Guardar carrito final en historial
    const historial = JSON.parse(
      localStorage.getItem("historialCompras") || "[]"
    );
    historial.push({
      fecha: new Date().toISOString(),
      items: carrito,
    });
    localStorage.setItem("historialCompras", JSON.stringify(historial));

    // Vaciar carrito actual
    setCarrito([]);
    setMostrarMenu(false);
  };

  // --- Renderizado del carrito ---
  const carritoItems = useMemo(
    () => (
      <ul className="list-unstyled">
        {carrito.map((item) => (
          <li key={item.id} className="cart-row">
            <span className="carrito-item">
              <span className="cantidad">{item.cantidad}x</span> {item.nombre} -
              ${item.precio.toLocaleString()}
            </span>
            <button
              className="btn-link quitar-del-carrito"
              onClick={() => quitarDelCarrito(item.id)}
              title="Quitar uno"
            >
              Quitar
            </button>
          </li>
        ))}
      </ul>
    ),
    [carrito]
  );

  const finalizarCompraBtn = useMemo(
    () =>
      carrito.length > 0 && (
        <button
          className="btn btn-submit finalizar-compra-btn"
          onClick={() => setMostrarMenu(true)}
        >
          Pagar
        </button>
      ),
    [carrito.length]
  );

  return (
    <main className="container productos">
      {/* Botón Personaliza tu Helado */}
      <div className="boton-producto" style={{ marginBottom: "1.5rem" }}>
        <button
          className="btn btn-primary"
          onClick={() => navigate("/crea-tu-helado")}
        >
          Personaliza tu helado
        </button>
      </div>

      <section className="productos-container">
        {/* === LISTA DE PRODUCTOS === */}
        <div className="productos-wrapper">
          <div className="productos-lista in-view">
            {productosVisibles.map((producto) => (
              <article key={producto.id} className="producto-card info-card">
                <img
                  src={producto.img}
                  alt={producto.nombre}
                  className="producto-img"
                />
                <div className="producto-info">
                  <h3>{producto.nombre}</h3>
                  <div className="producto-precio">
                    <span className="precio-original">
                      ${producto.precioOriginal.toLocaleString()}
                    </span>
                    <span className="precio-descuento">
                      ${producto.precio.toLocaleString()}
                    </span>
                    <span className="descuento">-{producto.descuento}%</span>
                  </div>
                  <button
                    className="btn btn-primary agregar-carrito"
                    onClick={() => agregarAlCarrito(producto)}
                  >
                    Agregar al carrito
                  </button>
                </div>
              </article>
            ))}
          </div>

          {/* === PAGINACIÓN DEBAJO DE LA GRILLA === */}
          <div className="paginacion centrada">
            <button
              className="btn-link"
              onClick={() => setPaginaActual(1)}
              disabled={paginaActual === 1}
              title="Primera página"
            >
              <TiArrowBack size={20} />
            </button>

            <button
              className="btn-link"
              onClick={() => setPaginaActual((p) => Math.max(p - 1, 1))}
              disabled={paginaActual === 1}
              title="Página anterior"
            >
              <TiArrowLeft size={22} />
            </button>

            <span style={{ margin: "0 1rem", fontWeight: "600" }}>
              {paginaActual} / {totalPaginas}
            </span>

            <button
              className="btn-link"
              onClick={() =>
                setPaginaActual((p) => Math.min(p + 1, totalPaginas))
              }
              disabled={paginaActual === totalPaginas}
              title="Página siguiente"
            >
              <TiArrowRight size={22} />
            </button>

            <button
              className="btn-link"
              onClick={() => setPaginaActual(totalPaginas)}
              disabled={paginaActual === totalPaginas}
              title="Última página"
            >
              <TiArrowForward size={22} />
            </button>
          </div>
        </div>

        {/* === CARRITO === */}
        <aside className="carrito-sidebar h-dynamic" aria-label="Mi pedido">
          <h3>Mi pedido</h3>
          {carrito.length === 0 ? (
            <p className="muted">Tu pedido está vacío</p>
          ) : (
            <>
              {carritoItems}
              {finalizarCompraBtn}
            </>
          )}
        </aside>
      </section>

      {/* === MODAL DE COMPRA === */}
      {mostrarMenu && (
        <div
          className="modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div className="modal-contenido">
            <h2 id="modal-title">Finalizar Compra</h2>
            <p>Aquí puedes continuar con el proceso de pago...</p>

            {/* Mostrar resumen y botón de pago */}
            <div style={{ margin: "1rem 0" }}>
              <strong>Resumen:</strong>
              <div style={{ marginTop: 8 }}>{carritoItems}</div>
              <div style={{ marginTop: 8, fontWeight: 700 }}>
                Total: $
                {carrito
                  .reduce((sum, it) => sum + (it.precio || 0) * it.cantidad, 0)
                  .toLocaleString()}
              </div>
            </div>

            <div style={{ marginTop: 12 }}>
              <PaypalButton
                amount={carrito.reduce(
                  (sum, it) => sum + (it.precio || 0) * it.cantidad,
                  0
                )}
                currency={"USD"}
                description={`Compra de ${carrito.length} producto(s)`}
                onSuccess={(details) => {
                  alert(
                    `Pago completado por ${
                      details.payer?.name?.given_name || "cliente"
                    }`
                  );
                  finalizarCompra();
                }}
              />
            </div>

            <button
              className="btn btn-submit"
              onClick={() => setMostrarMenu(false)}
              style={{ marginTop: 10 }}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
      <section className="comentarios-section">
        <h2>Opiniones de nuestros clientes</h2>
        {/* 👇 Mostramos los comentarios del producto seleccionado */}
        {productos.length > 0 ? (
          <ComentariosProducto
            productoId={productosVisibles[0].id} // o el primero visible, si querés
            nombre={productosVisibles[0].nombre}
          />
        ) : (
          <p className="muted">No hay productos para mostrar comentarios.</p>
        )}
      </section>
    </main>
  );
};

export default Productos;
