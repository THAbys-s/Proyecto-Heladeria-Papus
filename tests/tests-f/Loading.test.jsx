import React from "react";
import { render } from "@testing-library/react";
import Loading from "../../src/components/Loading/Loading";

describe("Loading component", () => {
  test("renders the loop-wrapper", () => {
    const { container } = render(<Loading fade={false} />);
    expect(container.querySelector(".loop-wrapper")).toBeInTheDocument();
  });

  test("applies fade-out class when fade prop is true", () => {
    const { container } = render(<Loading fade={true} />);
    expect(
      container.querySelector(".loop-wrapper.fade-out")
    ).toBeInTheDocument();
  });
});
