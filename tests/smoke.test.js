import { describe, expect, it } from "vitest";
import { parseCard } from "../src/index.js";

describe("parseCard", () => {
  it("parses valid cards", () => {
    expect(parseCard("AS")).toEqual({ rank: "A", suit: "S" });
    expect(parseCard("TD")).toEqual({ rank: "T", suit: "D" });
    expect(parseCard("7H")).toEqual({ rank: "7", suit: "H" });
  });

  it("throws for invalid cards", () => {
    expect(() => parseCard("1S")).toThrow();
    expect(() => parseCard("AB")).toThrow();
    expect(() => parseCard("AA")).toThrow();
    expect(() => parseCard("S")).toThrow();
    expect(() => parseCard("10S")).toThrow();
    expect(() => parseCard(42)).toThrow();
  });
});
