import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Navbar from "../src/components/Navbar/navbar.jsx";

describe("Navbar Component", () => {
  const renderNavbar = () =>
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

  it("renderiza correctamente el logo con el alt correcto", () => {
    renderNavbar();
    const logo = screen.getByAltText(/Ir a la página principal/i);
    expect(logo).toBeInTheDocument();
  });

  it("muestra las opciones del menú", () => {
    renderNavbar();

    expect(screen.getByText(/Principal/i)).toBeInTheDocument();
    expect(screen.getByText(/Productos/i)).toBeInTheDocument();
    expect(screen.getByText(/Nosotros/i)).toBeInTheDocument();
    expect(screen.getByText(/Registrarse/i)).toBeInTheDocument();
  });

  it("tiene un botón accesible para abrir el menú", () => {
    renderNavbar();
    const iceCreamButton = screen.getByRole("button", { name: /Abrir menú/i });

    expect(iceCreamButton).toBeInTheDocument();
    expect(iceCreamButton).toHaveAttribute("aria-expanded", "false");
  });

  it("al hacer clic en el menú hamburguesa, cambia aria-expanded a true", () => {
    renderNavbar();
    const iceCreamButton = screen.getByRole("button", { name: /Abrir menú/i });

    fireEvent.click(iceCreamButton);
    expect(iceCreamButton).toHaveAttribute("aria-expanded", "true");

    fireEvent.click(iceCreamButton);
    expect(iceCreamButton).toHaveAttribute("aria-expanded", "false");
  });
});
