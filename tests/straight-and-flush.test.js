import { describe, expect, it } from "vitest";
import { compareHands, evaluateFiveCardHand } from "../src/index.js";

describe("straight", () => {
  it("detects an ace-high straight", () => {
    const hand = evaluateFiveCardHand(["AS", "KD", "QH", "JC", "TS"]);

    expect(hand.category).toBe("STRAIGHT");
    expect(hand.rankVector).toEqual([14]);
  });

  it("detects an ace-low straight (wheel)", () => {
    const hand = evaluateFiveCardHand(["5S", "4D", "3H", "2C", "AD"]);

    expect(hand.category).toBe("STRAIGHT");
    expect(hand.rankVector).toEqual([5]);
  });

  it("rejects wrap-around ranks as straight", () => {
    const hand = evaluateFiveCardHand(["QS", "KD", "AH", "2C", "3D"]);

    expect(hand.category).toBe("HIGH_CARD");
  });

  it("compares straights using highest card only", () => {
    const handA = evaluateFiveCardHand(["9S", "8D", "7H", "6C", "5D"]);
    const handB = evaluateFiveCardHand(["8S", "7D", "6H", "5C", "4D"]);

    expect(compareHands(handA, handB)).toBe(1);
  });
});

describe("flush", () => {
  it("detects flush and sorts ranks descending", () => {
    const hand = evaluateFiveCardHand(["AH", "JH", "9H", "6H", "4H"]);

    expect(hand.category).toBe("FLUSH");
    expect(hand.rankVector).toEqual([14, 11, 9, 6, 4]);
  });

  it("compares flushes card by card", () => {
    const handA = evaluateFiveCardHand(["AH", "JH", "9H", "6H", "4H"]);
    const handB = evaluateFiveCardHand(["AH", "JH", "8H", "6H", "4H"]);

    expect(compareHands(handA, handB)).toBe(1);
  });
});
