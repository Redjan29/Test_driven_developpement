import { describe, expect, it } from "vitest";
import { compareHands, evaluateFiveCardHand } from "../src/index.js";

describe("one pair", () => {
  it("detects one pair and builds pair-first rank vector", () => {
    const hand = evaluateFiveCardHand(["AS", "AD", "9C", "7H", "4S"]);

    expect(hand.category).toBe("ONE_PAIR");
    expect(hand.rankVector).toEqual([14, 9, 7, 4]);
  });

  it("compares one pair hands by pair rank, then kickers", () => {
    const handA = evaluateFiveCardHand(["AS", "AD", "9C", "7H", "4S"]);
    const handB = evaluateFiveCardHand(["KS", "KD", "QC", "7H", "4S"]);
    const handC = evaluateFiveCardHand(["AH", "AC", "8C", "7D", "4H"]);

    expect(compareHands(handA, handB)).toBe(1);
    expect(compareHands(handA, handC)).toBe(1);
  });
});

describe("two pair", () => {
  it("detects two pair with high pair first then low pair and kicker", () => {
    const hand = evaluateFiveCardHand(["AS", "AD", "KC", "KH", "4S"]);

    expect(hand.category).toBe("TWO_PAIR");
    expect(hand.rankVector).toEqual([14, 13, 4]);
  });

  it("compares two pair hands by high pair, low pair, then kicker", () => {
    const handA = evaluateFiveCardHand(["AS", "AD", "KC", "KH", "4S"]);
    const handB = evaluateFiveCardHand(["AS", "AD", "QC", "QH", "JS"]);
    const handC = evaluateFiveCardHand(["AH", "AC", "KD", "KS", "3H"]);

    expect(compareHands(handA, handB)).toBe(1);
    expect(compareHands(handA, handC)).toBe(1);
  });
});

describe("three of a kind", () => {
  it("detects three of a kind and orders kickers descending", () => {
    const hand = evaluateFiveCardHand(["QS", "QD", "QH", "AS", "2C"]);

    expect(hand.category).toBe("THREE_OF_A_KIND");
    expect(hand.rankVector).toEqual([12, 14, 2]);
  });

  it("compares trips by trip rank then kickers", () => {
    const handA = evaluateFiveCardHand(["QS", "QD", "QH", "AS", "2C"]);
    const handB = evaluateFiveCardHand(["JS", "JD", "JH", "AS", "KC"]);
    const handC = evaluateFiveCardHand(["QC", "QH", "QD", "KS", "2D"]);

    expect(compareHands(handA, handB)).toBe(1);
    expect(compareHands(handA, handC)).toBe(1);
  });
});
