// setupTests.js
import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";

afterEach(() => {
  cleanup();
});

jest.mock("\\.(png|jpg|jpeg|gif)$", () => "mock-image");
