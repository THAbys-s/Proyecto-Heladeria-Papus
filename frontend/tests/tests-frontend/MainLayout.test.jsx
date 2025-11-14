import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import MainLayout from "../../src/components/Layouts/MainLayout.jsx";

describe("MainLayout footer e Instagram", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    // mockear fetch usado por MainLayout para obtener tiendas
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve([{ direccion: "Test Dir" }]),
      })
    );
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it("muestra el logo de Instagram y el enlace apunta al perfil", async () => {
    render(
      <MemoryRouter>
        <MainLayout>
          <div>Contenido</div>
        </MainLayout>
      </MemoryRouter>
    );

    // esperar a que el fetch termine y el componente actualice
    const igImg = await screen.findByAltText(/Instagram/i);
    expect(igImg).toBeInTheDocument();

    // su elemento padre es un enlace
    const parentLink = igImg.closest("a");
    expect(parentLink).toBeInTheDocument();
    expect(parentLink).toHaveAttribute(
      "href",
      expect.stringContaining("instagram.com")
    );
  });
});
