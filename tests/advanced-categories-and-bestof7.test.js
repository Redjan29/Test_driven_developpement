import { describe, expect, it } from "vitest";
import { compareHands, evaluateBestHandFromSeven, evaluateFiveCardHand } from "../src/index.js";

describe("advanced categories", () => {
  it("detects full house and uses [trips, pair] rank vector", () => {
    const hand = evaluateFiveCardHand(["AS", "AD", "AH", "KC", "KD"]);

    expect(hand.category).toBe("FULL_HOUSE");
    expect(hand.rankVector).toEqual([14, 13]);
  });

  it("detects four of a kind and uses [quads, kicker] rank vector", () => {
    const hand = evaluateFiveCardHand(["7S", "7D", "7H", "7C", "AD"]);

    expect(hand.category).toBe("FOUR_OF_A_KIND");
    expect(hand.rankVector).toEqual([7, 14]);
  });

  it("detects straight flush and compares by highest straight card", () => {
    const handA = evaluateFiveCardHand(["9H", "8H", "7H", "6H", "5H"]);
    const handB = evaluateFiveCardHand(["8S", "7S", "6S", "5S", "4S"]);

    expect(handA.category).toBe("STRAIGHT_FLUSH");
    expect(handA.rankVector).toEqual([9]);
    expect(compareHands(handA, handB)).toBe(1);
  });

  it("uses category ordering for full house vs flush", () => {
    const fullHouse = evaluateFiveCardHand(["KS", "KD", "KH", "4C", "4D"]);
    const flush = evaluateFiveCardHand(["AH", "TH", "8H", "6H", "3H"]);

    expect(compareHands(fullHouse, flush)).toBe(1);
  });
});

describe("best of seven", () => {
  it("selects the best 5 cards among 7 cards", () => {
    const best = evaluateBestHandFromSeven(["AH", "KH", "QH", "JH", "2C", "TH", "3D"]);

    expect(best.category).toBe("STRAIGHT_FLUSH");
    expect(best.rankVector).toEqual([14]);
    expect(best.chosen5).toEqual(["AH", "KH", "QH", "JH", "TH"]);
  });

  it("handles board plays when board already gives best hand", () => {
    const board = ["5C", "6D", "7H", "8S", "9D"];
    const player = ["AS", "AD"];

    const best = evaluateBestHandFromSeven([...board, ...player]);

    expect(best.category).toBe("STRAIGHT");
    expect(best.rankVector).toEqual([9]);
    expect(best.chosen5).toEqual(["9D", "8S", "7H", "6D", "5C"]);
  });
});
