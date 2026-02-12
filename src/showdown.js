import { compareHands, evaluateBestHandFromSeven } from "./evaluator.js";

export function resolveShowdown(board, players) {
  if (!Array.isArray(board) || board.length !== 5) {
    throw new Error("Board must contain exactly 5 cards");
  }

  if (!Array.isArray(players) || players.length === 0) {
    throw new Error("Players must be a non-empty array");
  }

  const playerResults = players.map((holeCards) => {
    if (!Array.isArray(holeCards) || holeCards.length !== 2) {
      throw new Error("Each player must have exactly 2 hole cards");
    }

    return evaluateBestHandFromSeven([...board, ...holeCards]);
  });

  let bestHand = playerResults[0];
  for (let i = 1; i < playerResults.length; i += 1) {
    if (compareHands(playerResults[i], bestHand) > 0) {
      bestHand = playerResults[i];
    }
  }

  const winnerIndexes = [];
  for (let i = 0; i < playerResults.length; i += 1) {
    if (compareHands(playerResults[i], bestHand) === 0) {
      winnerIndexes.push(i);
    }
  }

  return {
    winnerIndexes,
    isSplit: winnerIndexes.length > 1,
    playerResults
  };
}
