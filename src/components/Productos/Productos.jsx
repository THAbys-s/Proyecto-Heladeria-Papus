import React, { useState } from "react";
import "./productos.css";

const Productos = () => {
  const productos = [
    {
      id: 1,
      nombre: "Crujido Tentador",
      precio: 2200,
      precioOriginal: 2500,
      descuento: 12,
      img: "src/components/Productos/imagenes/bombon-crocante.jpg",
    },
    {
      id: 2,
      nombre: "Boscado Celestial",
      precio: 2300,
      precioOriginal: 2600,
      descuento: 12,
      img: "src/components/Productos/imagenes/bombon-escoces.jpg",
    },
    {
      id: 3,
      nombre: "Dulce Suspiro",
      precio: 2300,
      precioOriginal: 2600,
      descuento: 12,
      img: "src/components/Productos/imagenes/bombon-split.jpg",
    },
    {
      id: 4,
      nombre: "Duo Delicia",
      precio: 2300,
      precioOriginal: 2600,
      descuento: 12,
      img: "src/components/Productos/imagenes/bombon-suizo.jpg",
    },
    {
      id: 5,
      nombre: "Vainilla Sueño",
      precio: 2100,
      precioOriginal: 2400,
      descuento: 13,
      img: "src/components/Productos/imagenes/capelinas-chocolate.jpg",
    },
    {
      id: 6,
      nombre: "Frescura Tropical",
      precio: 2100,
      precioOriginal: 2400,
      descuento: 13,
      img: "src/components/Productos/imagenes/capelinas-frutal.jpg",
    },
    {
      id: 7,
      nombre: "Frutilla Encantada",
      precio: 2100,
      precioOriginal: 2400,
      descuento: 13,
      img: "src/components/Productos/imagenes/capelinas-frutilla.jpg",
    },
    {
      id: 8,
      nombre: "Chocolate Divino",
      precio: 2100,
      precioOriginal: 2400,
      descuento: 13,
      img: "src/components/Productos/imagenes/capelinas-nuez.jpg",
    },
    {
      id: 9,
      nombre: "Palito Bombón",
      precio: 1800,
      precioOriginal: 2000,
      descuento: 10,
      img: "src/components/Productos/imagenes/palito-bombon.jpg",
    },
    {
      id: 10,
      nombre: "Palito Vainillita",
      precio: 1800,
      precioOriginal: 2000,
      descuento: 10,
      img: "src/components/Productos/imagenes/palitocremoso-americana.jpg",
    },
    {
      id: 11,
      nombre: "Palito Rosado",
      precio: 1800,
      precioOriginal: 2000,
      descuento: 10,
      img: "src/components/Productos/imagenes/palitocremoso-frutilla.jpg",
    },
    {
      id: 12,
      nombre: "Crujido Almendrado",
      precio: 3500,
      precioOriginal: 4000,
      descuento: 13,
      img: "src/components/Productos/imagenes/postres-almendrado.jpg",
    },
    {
      id: 13,
      nombre: "Trio Tentador",
      precio: 3500,
      precioOriginal: 4000,
      descuento: 13,
      img: "src/components/Productos/imagenes/postres-cassata.jpg",
    },
    {
      id: 14,
      nombre: "Sueño Chocolatoso",
      precio: 3500,
      precioOriginal: 4000,
      descuento: 13,
      img: "src/components/Productos/imagenes/postres-crocantino.jpg",
    },
    {
      id: 15,
      nombre: "Beso De Amor",
      precio: 3500,
      precioOriginal: 4000,
      descuento: 13,
      img: "src/components/Productos/imagenes/postres-delicia.jpg",
    },
    {
      id: 16,
      nombre: "Sundae Frutal",
      precio: 2000,
      precioOriginal: 2300,
      descuento: 13,
      img: "src/components/Productos/imagenes/sundae-frutal.jpg",
    },
    {
      id: 17,
      nombre: "Sundae Go",
      precio: 2000,
      precioOriginal: 2300,
      descuento: 13,
      img: "src/components/Productos/imagenes/sundae-go.jpg",
    },
  ];

  const [carrito, setCarrito] = useState([]);

  // Función para agregar al carrito
  const agregarAlCarrito = (producto) => {
    setCarrito((prevCarrito) => {
      const existe = prevCarrito.find((item) => item.id === producto.id);
      if (existe) {
        return prevCarrito.map((item) =>
          item.id === producto.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      } else {
        return [...prevCarrito, { ...producto, cantidad: 1 }];
      }
    });
  };

  // Función para quitar del carrito (elimina el producto si queda en 1)
  const quitarDelCarrito = (productoId) => {
    setCarrito((prevCarrito) =>
      prevCarrito
        .map((item) =>
          item.id === productoId
            ? { ...item, cantidad: item.cantidad - 1 }
            : item
        )
        .filter((item) => item.cantidad > 0)
    );
  };

  return (
    <div className="productos-container">
      <div className="productos-lista">
        {productos.map((producto) => (
          <div key={producto.id} className="producto-card">
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
                className="agregar-carrito"
                onClick={() => agregarAlCarrito(producto)}
              >
                Agregar al carrito
              </button>
            </div>
          </div>
        ))}
      </div>

      <div
        className="carrito-sidebar"
        style={{
          height: `${Math.max(300, 80 + carrito.length * 60)}px`,
          minHeight: "300px",
          maxHeight: "600px",
          transition: "height 0.3s ease",
        }}
      >
        <h3>Mi pedido</h3>
        {carrito.length === 0 ? (
          <p>Tu pedido está vacío</p>
        ) : (
          <ul>
            {carrito.map((item) => (
              <li key={item.id}>
                <span className="carrito-item">
                  <span className="cantidad">{item.cantidad}x</span>{" "}
                  {item.nombre}- ${item.precio.toLocaleString()}
                </span>
                <button
                  className="quitar-del-carrito"
                  onClick={() => quitarDelCarrito(item.id)}
                  title="Quitar uno"
                >
                  Quitar
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Productos;
