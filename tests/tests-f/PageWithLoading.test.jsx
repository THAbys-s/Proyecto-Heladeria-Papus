import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import PageWithLoading from "../../src/components/Loading/PageWithLoading";
import { MemoryRouter } from "react-router-dom";

describe("PageWithLoading", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    jest.resetAllMocks();
  });

  afterAll(() => {
    global.fetch = originalFetch;
  });

  test("shows Loading initially and then renders children after fetch resolves", async () => {
    // mock fetch to return an ok response
    global.fetch = jest.fn(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve({}) })
    );

    render(
      <MemoryRouter initialEntries={["/test"]}>
        <PageWithLoading>
          <div data-testid="child">page content</div>
        </PageWithLoading>
      </MemoryRouter>
    );

    // initially the Loading component should be present
    expect(document.querySelector(".loop-wrapper")).toBeInTheDocument();

    // wait for the child to appear after the mocked fetch resolves
    await waitFor(() => {
      expect(screen.getByTestId("child")).toBeInTheDocument();
    });
  });
});
