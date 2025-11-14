import "@testing-library/jest-dom";
<<<<<<< HEAD
import { render, screen, within } from "@testing-library/react";
import Nosotros from "../../src/components/Nosotros/Nosotros.jsx";

describe("Componente <Nosotros />", () => {
  beforeEach(() => {
    render(<Nosotros />);
  });

  // --- ESTRUCTURA PRINCIPAL ---
  describe("Estructura general del componente", () => {
    it("debería renderizar un contenedor principal", () => {
      const container = document.querySelector("div");
      expect(container).toBeInTheDocument();
    });

    it("debería mostrar el título principal y subtítulo visibles", () => {
      const tituloPrincipal = screen.getByRole("heading", {
        name: "¡Dulzura pura!",
      });
      const subtitulo = screen.getByRole("heading", {
        name: /Un vistazo a nuestros sabores/i,
      });

      expect(tituloPrincipal).toBeVisible();
      expect(subtitulo).toBeVisible();
      expect(tituloPrincipal.tagName).toBe("H1");
      expect(subtitulo.tagName).toBe("H2");
    });
  });

  // --- CONTENIDO TEXTUAL ---
  describe("Contenido informativo y descripciones", () => {
    it("debería describir la propuesta de la heladería", () => {
      const descripcion = screen.getByText(
        /ofrecemos los mejores helados de la zona/i
      );
      expect(descripcion).toBeVisible();
    });

    it("debería mencionar la disponibilidad 24 horas", () => {
      const disponibilidad = screen.getByText(/24 horas/i);
      expect(disponibilidad).toBeVisible();
      expect(disponibilidad.tagName).toBe("B");
    });

    it("debería mencionar la dirección del local", () => {
      const direccion = screen.getByText(/Francisco Camet 4591/i);
      expect(direccion).toBeVisible();
    });

    it("debería contener todos los encabezados secundarios visibles", () => {
      const headings = [
        "¿Qué hacemos?",
        "¿Quiénes somos?",
        "Nuestra ubicación",
      ];

      headings.forEach((title) => {
        const el = screen.getByRole("heading", { name: title });
        expect(el).toBeVisible();
        expect(el.tagName).toBe("H2");
      });
    });
  });

  // --- IMÁGENES ---
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

  // --- MAPA ---
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

  // --- ROBUSTEZ Y CONSISTENCIA ---
  describe("Robustez del componente", () => {
    it("no debería renderizar elementos vacíos ni innecesarios", () => {
      const emptyElements = Array.from(
        document.querySelectorAll("p, h1, h2")
      ).filter((el) => el.textContent.trim() === "");
      expect(emptyElements.length).toBe(0);
    });

    it("debería mantener consistencia entre número de encabezados y bloques descriptivos", () => {
      const headings = screen.getAllByRole("heading");
      const paragraphs = document.querySelectorAll("p");
      expect(paragraphs.length).toBeGreaterThanOrEqual(headings.length - 1);
    });
=======
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Nosotros from "../../src/components/Nosotros/Nosotros.jsx";

describe("Nosotros component - mapa", () => {
  it("renderiza un iframe con el mapa de Google", async () => {
    render(
      <MemoryRouter>
        <Nosotros />
      </MemoryRouter>
    );

    const iframe = screen.getByTitle(/Ubicación Heladería Los Papus/i);
    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute(
      "src",
      expect.stringContaining("google.com/maps")
    );
>>>>>>> Diego
  });
});
