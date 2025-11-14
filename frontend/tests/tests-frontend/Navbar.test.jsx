import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import React from "react";
import Navbar from "../../src/components/Navbar/Navbar.jsx";
import { AuthContext } from "../../src/components/Auth/Auth.jsx";

const renderNavbar = (user = null, logout = jest.fn()) => {
  return render(
    <AuthContext.Provider value={{ user, logout }}>
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    </AuthContext.Provider>
  );
};

describe("Navbar Component", () => {
  const mockLogout = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renderiza correctamente el logo principal", () => {
    renderNavbar();
    const logo = screen.getByAltText(/Ir a la página principal/i);
    expect(logo).toBeInTheDocument();
  });

  it("muestra las opciones de menú correctas cuando no hay usuario logueado", () => {
    renderNavbar();

    expect(screen.getByText(/Principal/i)).toBeVisible();
    expect(screen.getByText(/Productos/i)).toBeVisible();
    expect(screen.getByText(/Nosotros/i)).toBeVisible();
    expect(screen.getByText(/Sucursales/i)).toBeVisible();
    expect(screen.getByText(/Registrarse/i)).toBeVisible();
    expect(screen.getByText(/Iniciar sesión/i)).toBeVisible();
  });

  it("muestra el nombre del usuario y el botón de cerrar sesión cuando hay un usuario logueado", () => {
    const mockUser = { nombre: "Juan" };
    renderNavbar(mockUser, mockLogout);

    expect(screen.getByText(/Juan/i)).toBeVisible();
    expect(
      screen.getByRole("button", { name: /Cerrar sesión/i })
    ).toBeInTheDocument();

    // No deberían estar las opciones de login/register
    expect(screen.queryByText(/Registrarse/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Iniciar sesión/i)).not.toBeInTheDocument();
  });

  it("llama a logout() al hacer clic en 'Cerrar sesión'", () => {
    const mockUser = { nombre: "Juan" };
    renderNavbar(mockUser, mockLogout);

    const logoutBtn = screen.getByRole("button", { name: /Cerrar sesión/i });
    fireEvent.click(logoutBtn);

    expect(mockLogout).toHaveBeenCalledTimes(1);
  });

  it("tiene un botón accesible con aria-expanded que alterna correctamente", () => {
    renderNavbar();

    const menuButton = screen.getByRole("button", { name: /Abrir menú/i });
    expect(menuButton).toHaveAttribute("aria-expanded", "false");

    fireEvent.click(menuButton);
    expect(menuButton).toHaveAttribute("aria-expanded", "true");

    fireEvent.click(menuButton);
    expect(menuButton).toHaveAttribute("aria-expanded", "false");
  });

  it("cierra el menú al hacer clic en un enlace", () => {
    renderNavbar();

    const menuButton = screen.getByRole("button", { name: /Abrir menú/i });
    fireEvent.click(menuButton);

    const productosLink = screen.getByText(/Productos/i);
    fireEvent.click(productosLink);

    expect(menuButton).toHaveAttribute("aria-expanded", "false");
  });
});
