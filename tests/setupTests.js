// jest-dom adds custom jest matchers for asserting on DOM nodes.
import "@testing-library/jest-dom";
// Polyfill TextEncoder/TextDecoder for environments that lack them
import { TextEncoder, TextDecoder } from "util";

global.TextEncoder = global.TextEncoder || TextEncoder;
global.TextDecoder = global.TextDecoder || TextDecoder;

// structuredClone shim for Node versions that don't have it
if (typeof global.structuredClone === "undefined") {
  global.structuredClone = (obj) => JSON.parse(JSON.stringify(obj));
}

// window.matchMedia mock (useful for components that query media)
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }),
});

// Minimal IntersectionObserver mock
class IntersectionObserverMock {
  constructor(cb, options) {
    this.cb = cb;
    this.options = options;
    this.targets = new Set();
  }
  observe(target) {
    this.targets.add(target);
  }
  unobserve(target) {
    this.targets.delete(target);
  }
  disconnect() {
    this.targets.clear();
  }
  // helper to simulate intersection
  _trigger(entries) {
    this.cb(entries, this);
  }
}

global.IntersectionObserver =
  global.IntersectionObserver || IntersectionObserverMock;

// Minimal ResizeObserver mock
class ResizeObserverMock {
  constructor(cb) {
    this.cb = cb;
    this.elements = new Set();
  }
  observe(el) {
    this.elements.add(el);
  }
  unobserve(el) {
    this.elements.delete(el);
  }
  disconnect() {
    this.elements.clear();
  }
  // helper to simulate a resize
  _trigger(entries) {
    this.cb(entries, this);
  }
}

global.ResizeObserver = global.ResizeObserver || ResizeObserverMock;

// silence act() warnings for tests that don't await updates properly
// (prefer to fix tests to await updates, but this reduces noisy logs)
const originalError = console.error;
console.error = (...args) => {
  if (
    typeof args[0] === "string" &&
    args[0].includes(
      "Warning: An update to %s inside a test was not wrapped in act"
    )
  ) {
    return;
  }
  originalError(...args);
};
