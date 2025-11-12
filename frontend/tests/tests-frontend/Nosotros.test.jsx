import "@testing-library/jest-dom";
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
  });
});
