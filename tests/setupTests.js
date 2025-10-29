import "@testing-library/jest-dom";
import { TextEncoder, TextDecoder } from "util";

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

global.structuredClone =
  global.structuredClone || ((obj) => JSON.parse(JSON.stringify(obj)));
