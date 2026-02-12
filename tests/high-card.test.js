import { describe, expect, it } from "vitest";
import { compareHands, evaluateFiveCardHand } from "../src/index.js";

describe("high card evaluation", () => {
  it("detects high card and builds lexicographic rank vector", () => {
    const hand = evaluateFiveCardHand(["AS", "7D", "4C", "KH", "9S"]);

    expect(hand.category).toBe("HIGH_CARD");
    expect(hand.rankVector).toEqual([14, 13, 9, 7, 4]);
  });

  it("compares high card hands lexicographically", () => {
    const handA = evaluateFiveCardHand(["AS", "KD", "9C", "7H", "4S"]);
    const handB = evaluateFiveCardHand(["AS", "KD", "8C", "7H", "4S"]);

    expect(compareHands(handA, handB)).toBe(1);
    expect(compareHands(handB, handA)).toBe(-1);
  });

  it("returns a tie when rank vectors are identical", () => {
    const handA = evaluateFiveCardHand(["AS", "KD", "9C", "7H", "4S"]);
    const handB = evaluateFiveCardHand(["AD", "KC", "9H", "7C", "4D"]);

    expect(compareHands(handA, handB)).toBe(0);
  });
});
