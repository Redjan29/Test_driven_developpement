import { describe, expect, it } from "vitest";
import { resolveShowdown } from "../src/index.js";

describe("resolveShowdown", () => {
  it("returns a single winner when one player has the best hand", () => {
    const board = ["7C", "7D", "7H", "7S", "2D"];
    const players = [
      ["AC", "KC"],
      ["QC", "JC"]
    ];

    const result = resolveShowdown(board, players);

    expect(result.winnerIndexes).toEqual([0]);
    expect(result.isSplit).toBe(false);
    expect(result.playerResults[0].category).toBe("FOUR_OF_A_KIND");
    expect(result.playerResults[1].category).toBe("FOUR_OF_A_KIND");
    expect(result.playerResults[0].rankVector).toEqual([7, 14]);
    expect(result.playerResults[1].rankVector).toEqual([7, 12]);
  });

  it("returns split winners when board plays equally", () => {
    const board = ["5C", "6D", "7H", "8S", "9D"];
    const players = [
      ["AS", "AD"],
      ["KC", "QD"]
    ];

    const result = resolveShowdown(board, players);

    expect(result.winnerIndexes).toEqual([0, 1]);
    expect(result.isSplit).toBe(true);
    expect(result.playerResults[0].chosen5).toEqual(["9D", "8S", "7H", "6D", "5C"]);
    expect(result.playerResults[1].chosen5).toEqual(["9D", "8S", "7H", "6D", "5C"]);
  });

  it("includes chosen5 and category for every player", () => {
    const board = ["AH", "KH", "QH", "JH", "2C"];
    const players = [
      ["TH", "3D"],
      ["AS", "AD"]
    ];

    const result = resolveShowdown(board, players);

    expect(result.playerResults).toHaveLength(2);
    expect(result.playerResults[0]).toMatchObject({
      category: "STRAIGHT_FLUSH",
      chosen5: ["AH", "KH", "QH", "JH", "TH"]
    });
    expect(result.playerResults[1].category).toBe("THREE_OF_A_KIND");
  });
});
