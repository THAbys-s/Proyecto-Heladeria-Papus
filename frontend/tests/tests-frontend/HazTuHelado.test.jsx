import "@testing-library/jest-dom";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import HazTuHelado from "../../src/components/HazTuHelado/HazTuHelado.jsx";

global.fetch = jest.fn((url) => {
  if (url.includes("/sabores")) {
    return Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve([
          "Chocolate",
          "Frutilla",
          "Vainilla",
          "Dulce de Leche",
        ]),
    });
  }
  if (url.includes("/especiales")) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve(["Oreo", "Kinder", "Brownie"]),
    });
  }
  if (url.includes("/bocadillos")) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve(["Galleta", "Waffle", "Barquillo"]),
    });
  }
  if (url.includes("/cucuruchos")) {
    return Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve([
          "Cucurucho Simple",
          "Cucurucho Doble",
          "1/4 kg",
          "1/2 kg",
        ]),
    });
  }
  if (url.includes("/salsas")) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve(["Chocolate", "Caramelo", "Frutilla"]),
    });
  }
  return Promise.reject("Endpoint desconocido: " + url);
});

describe("HazTuHelado Component - flujo dinámico", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  const setup = () =>
    render(
      <MemoryRouter>
        <HazTuHelado />
      </MemoryRouter>
    );

  // --- Test 1: carga inicial ---
  it("carga y muestra los datos desde los 5 endpoints", async () => {
    setup();

    const titulo = await screen.findByText("Personaliza tu helado");
    expect(titulo).toBeVisible();

    // Esperamos cucuruchos del mock
    const cucurucho = await screen.findByText("Cucurucho Simple");
    expect(cucurucho).toBeVisible();

    // Verificamos que fetch fue llamado 5 veces
    expect(global.fetch).toHaveBeenCalledTimes(5);
  });

  // --- Test 2: flujo de armado de helado ---
  it("permite completar todas las etapas del helado y guardarlo en localStorage", async () => {
    setup();

    // Paso 0: elegir cucurucho
    const cucuruchoBtn = await screen.findByText("Cucurucho Simple");
    fireEvent.click(cucuruchoBtn);

    const nextBtn = screen.getByText("Siguiente");
    fireEvent.click(nextBtn);

    // Paso 1: elegir sabor
    const saborBtn = await screen.findByText("Chocolate");
    fireEvent.click(saborBtn);
    fireEvent.click(screen.getByText("Siguiente"));

    // Paso 2: esperar a que se rendericen los bocadillos (puede tardar un render)
    await waitFor(() => {
      expect(screen.getByText("Bocadillos")).toBeInTheDocument();
    });

    // Elegir bocadillo
    const bocadilloBtn = await screen.findByText("Galleta");
    fireEvent.click(bocadilloBtn);
    fireEvent.click(screen.getByText("Siguiente"));

    // Paso 3: elegir salsa
    await waitFor(() => {
      expect(screen.getByText("Salsas")).toBeInTheDocument();
    });
    const salsaBtn = await screen.findByText("Caramelo");
    fireEvent.click(salsaBtn);
    fireEvent.click(screen.getByText("Siguiente"));

    // Paso 4: confirmar
    await waitFor(() => {
      expect(screen.getByText("Confirmar helado")).toBeInTheDocument();
    });
    const confirmarBtn = screen.getByText("Confirmar helado");
    fireEvent.click(confirmarBtn);

    // Verificamos que el pedido aparece en el mini carrito
    const miniCarrito = await screen.findByText("Tus pedidos");
    const pedido = within(miniCarrito.closest(".mini-carrito")).getByText(
      "Cucurucho Simple"
    );
    expect(pedido).toBeVisible();

    // Validamos localStorage
    const carrito = JSON.parse(localStorage.getItem("carritoHelados"));
    expect(carrito.length).toBe(1);
    expect(carrito[0].cucurucho).toBe("Cucurucho Simple");
    expect(carrito[0].sabores).toContain("Chocolate");
  });

  // --- Test 3: eliminar pedido ---
  it("elimina un pedido correctamente del carrito y localStorage", async () => {
    // Precargamos un helado en localStorage
    localStorage.setItem(
      "carritoHelados",
      JSON.stringify([
        {
          id: 1,
          cucurucho: "Cucurucho Simple",
          sabores: ["Chocolate"],
          bocadillo: "Galleta",
          salsa: "Caramelo",
          cantidad: 1,
        },
      ])
    );

    setup();

    const eliminarBtn = await screen.findByText("Eliminar");
    fireEvent.click(eliminarBtn);

    const sinPedidos = await screen.findByText("No hay pedidos");
    expect(sinPedidos).toBeVisible();

    const carrito = JSON.parse(localStorage.getItem("carritoHelados"));
    expect(carrito).toEqual([]);
  });

  // --- Test 4: botón 'Pedir otro helado' reinicia el paso ---
  it("reinicia el proceso al presionar 'Pedir otro helado'", async () => {
    setup();

    const cucuruchoBtn = await screen.findByText("Cucurucho Simple");
    fireEvent.click(cucuruchoBtn);

    const nextBtn = screen.getByText("Siguiente");
    fireEvent.click(nextBtn);

    const saborBtn = await screen.findByText("Chocolate");
    fireEvent.click(saborBtn);

    // Simulamos pedir otro
    const pedirOtroBtn = screen.getByText("Pedir otro helado");
    fireEvent.click(pedirOtroBtn);

    // El paso debe volver al 0 (ver texto)
    expect(await screen.findByText("Elija su cucurucho")).toBeVisible();
  });

  // --- Test 5: muestra mensaje de error si fetch falla ---
  it("muestra mensaje de error si falla un endpoint", async () => {
    global.fetch.mockImplementationOnce(() => Promise.reject("Error de red"));
    setup();

    const errorMsg = await screen.findByText(
      /No se pudieron cargar todos los datos del servidor/i
    );
    expect(errorMsg).toBeVisible();
  });
});
