import { render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Nosotros from "../../src/components/Nosotros/Nosotros.jsx";

describe("Bloque de mapa y ubicación", () => {
  it("debería incluir un iframe de Google Maps correctamente configurado", () => {
    const mapa = screen.getByTitle("Ubicación Heladería Los Papus");

    expect(mapa).toBeVisible();
    expect(mapa.tagName).toBe("IFRAME");
    expect(mapa).toHaveAttribute(
      "src",
      expect.stringContaining("https://www.google.com/maps")
    );
    expect(mapa).toHaveAttribute("loading", "lazy");
    expect(mapa).toHaveAttribute("allowFullScreen");
  });

  it("debería acompañar el mapa con una imagen del local visible", () => {
    const imagenLocal = screen.getByAltText("Local visto desde fuera");
    expect(imagenLocal).toBeVisible();
  });
});

/* Bloque de Iframe */
describe("Nosotros component - mapa", () => {
  it("renderiza un iframe con el mapa de Google", async () => {
    render(
      <MemoryRouter>
        <Nosotros />
      </MemoryRouter>
    );

    const iframe = screen.getByTitle(/Ubicación Heladería Los Papus/i);
    expect(iframe).toBeVisible();
    expect(iframe).toHaveAttribute(
      "src",
      expect.stringContaining("google.com/maps")
    );
  });

  /* Bloque de Imagenes */
  describe("Imágenes y contenido visual", () => {
    const imagenes = [
      "Anuncio de postres",
      "Anuncio de bombones",
      "Anuncio de capelinas",
      "Bandejas de helado",
      "Imagen del local por dentro",
      "Local visto desde fuera",
    ];

    it("debería renderizar todas las imágenes con su texto alternativo visible", () => {
      imagenes.forEach((altText) => {
        const img = screen.getByAltText(altText);
        expect(img).toBeVisible();
        expect(img).toHaveAttribute(
          "src",
          expect.stringContaining("/Nosotros/imagenes/")
        );
      });
    });

    it("debería agrupar las imágenes promocionales dentro de .nosotros-imagenes", () => {
      const contenedor = document.querySelector(".nosotros-imagenes");
      expect(contenedor).toBeInTheDocument();

      const internas = within(contenedor).getAllByRole("img");
      expect(internas.length).toBeGreaterThanOrEqual(3);
    });
  });
});
