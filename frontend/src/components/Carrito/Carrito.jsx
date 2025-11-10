import React, { useEffect } from "react";
import PaypalButton from "../PaypalButton/PaypalButton.jsx";
import "./carrito.css";

const Carrito = ({
  items,
  onRemoveItem,
  onUpdateQuantity,
  storageKey = "carrito",
}) => {
  // Calcular el total del carrito
  const total = items.reduce((sum, item) => {
    return sum + item.precio * item.cantidad;
  }, 0);

  // Ajustar altura dinámica del carrito
  useEffect(() => {
    const h = Math.max(300, 80 + items.length * 60);
    document.documentElement.style.setProperty("--cart-height", `${h}px`);
  }, [items.length]);

  // Guardar en localStorage
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(items));
  }, [items, storageKey]);

  if (items.length === 0) {
    return (
      <div className="carrito-container carrito-vacio">
        <h3>Tu carrito está vacío</h3>
        <p>¡Agrega algunos productos deliciosos!</p>
      </div>
    );
  }

  return (
    <div className="carrito-container">
      <h3>Tu Carrito</h3>
      <div className="carrito-items">
        {items.map((item) => (
          <div key={item.id} className="carrito-item">
            <div className="item-info">
              <span className="item-name">{item.nombre}</span>
              <span className="item-price">Bs. {item.precio}</span>
            </div>
            <div className="item-controls">
              <button
                onClick={() => onUpdateQuantity(item.id, item.cantidad - 1)}
                disabled={item.cantidad <= 1}
              >
                -
              </button>
              <span>{item.cantidad}</span>
              <button
                onClick={() => onUpdateQuantity(item.id, item.cantidad + 1)}
              >
                +
              </button>
              <button
                className="remove-btn"
                onClick={() => onRemoveItem(item.id)}
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="carrito-total">
        <strong>Total: Bs. {total.toFixed(2)}</strong>
      </div>
      <PaypalButton amount={total.toFixed(2)} />
    </div>
  );
};

export default Carrito;
