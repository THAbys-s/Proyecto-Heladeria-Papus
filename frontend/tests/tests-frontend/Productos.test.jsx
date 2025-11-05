import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Productos from "../../src/components/Productos/Productos.jsx";

// Función de comparación del json
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () =>
      Promise.resolve([
        {
          id: 1,
          nombre: "Crujido Tentador",
          precio: 1000,
          precioOriginal: 1200,
          descuento: 10,
        },
        {
          id: 2,
          nombre: "Boscado Celestial",
          precio: 900,
          precioOriginal: 1100,
          descuento: 15,
        },
        {
          id: 3,
          nombre: "Dulce Suspiro",
          precio: 950,
          precioOriginal: 1100,
          descuento: 12,
        },
        {
          id: 4,
          nombre: "Duo Delicia",
          precio: 1100,
          precioOriginal: 1300,
          descuento: 15,
        },
        {
          id: 5,
          nombre: "Vainilla Sueño",
          precio: 800,
          precioOriginal: 1000,
          descuento: 20,
        },
        {
          id: 6,
          nombre: "Frescura Tropical",
          precio: 1050,
          precioOriginal: 1250,
          descuento: 16,
        },
        {
          id: 7,
          nombre: "Frutilla Encantada",
          precio: 900,
          precioOriginal: 1100,
          descuento: 18,
        },
      ]),
  })
);

describe("Productos Component - flujo dinámico", () => {
  beforeEach(() => {
    localStorage.clear(); // limpiar antes de cada test
  });

  const setup = () =>
    render(
      <MemoryRouter>
        <Productos />
      </MemoryRouter>
    );

  // --- Test de carga de productos ---
  it("carga y muestra los productos provenientes de la API", async () => {
    setup();

    // Esperamos a que vengan los productos desde el fetch de la DB.
    const prod1 = await screen.findByText("Crujido Tentador");
    const prod2 = await screen.findByText("Boscado Celestial");

    expect(prod1).toBeVisible();
    expect(prod2).toBeVisible();
  });

  // --- Test de imagenes dinámicas ---
  it("muestra la imagen correcta para cada producto", async () => {
    setup();

    // Aguarda a que la imagen de Cloudinary llegué.
    const img = await screen.findByAltText("Crujido Tentador");
    expect(img).toHaveAttribute("src", expect.stringContaining("cloudinary"));
  });

  // --- Test de agregar al carrito y botón Pagar ---
  it("agregar un producto al carrito muestra el botón Pagar", async () => {
    setup();

    const agregarBtns = await screen.findAllByText(/Agregar al carrito/i);
    fireEvent.click(agregarBtns[0]); // agregamos el primer producto

    // Botón Pagar aparece
    const pagarBtn = screen.getByText(/Pagar/i);
    expect(pagarBtn).toBeVisible();

    // LocalStorage se actualiza
    const carrito = JSON.parse(localStorage.getItem("carrito"));
    expect(carrito.length).toBe(1);
    expect(carrito[0].nombre).toBe("Crujido Tentador");
  });

  // --- Test de apertura de modal ---
  it("al hacer clic en Pagar se abre el modal de compra", async () => {
    setup();

    const agregarBtns = await screen.findAllByText(/Agregar al carrito/i);
    fireEvent.click(agregarBtns[0]); // agregamos producto

    const pagarBtn = screen.getByText(/Pagar/i);
    fireEvent.click(pagarBtn);

    const modal = screen.getByRole("dialog");
    expect(modal).toBeVisible();
    expect(screen.getByText(/Finalizar Compra/i)).toBeVisible();
  });

  // --- Test de quitar producto ---
  it("quitar un producto actualiza el carrito y LocalStorage", async () => {
    setup();

    const agregarBtns = await screen.findAllByText(/Agregar al carrito/i);
    fireEvent.click(agregarBtns[0]); // agregamos producto
    fireEvent.click(agregarBtns[0]); // agregamos de nuevo

    let carrito = JSON.parse(localStorage.getItem("carrito"));
    expect(carrito[0].cantidad).toBe(2);

    // Quitar 1 producto
    const quitarBtn = screen.getByText("Quitar");
    fireEvent.click(quitarBtn);

    carrito = JSON.parse(localStorage.getItem("carrito"));
    expect(carrito[0].cantidad).toBe(1);
  });

  // --- Test de paginación ---
  it("paginación muestra productos correctos", async () => {
    setup();

    // Página 1: debería mostrar los primeros 6 productos
    expect(await screen.findByText("Crujido Tentador")).toBeVisible();
    expect(screen.getByText("Frescura Tropical")).toBeVisible();
    expect(screen.queryByText("Frutilla Encantada")).toBeNull();

    // Ir a página 2
    const nextPageBtn = screen.getByTitle("Página siguiente");
    fireEvent.click(nextPageBtn);

    expect(await screen.findByText("Frutilla Encantada")).toBeVisible();
    expect(screen.queryByText("Crujido Tentador")).toBeNull();
  });
});
