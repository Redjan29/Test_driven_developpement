import { CATEGORY_STRENGTH, RANK_TO_VALUE, VALUE_TO_RANK } from "./constants.js";
import { parseCard, parseCards } from "./parser.js";

export function evaluateFiveCardHand(cards) {
  if (!Array.isArray(cards) || cards.length !== 5) {
    throw new Error("A hand must contain exactly 5 cards");
  }

  const parsed = parseCards(cards);
  const rankValues = parsed
    .map((card) => RANK_TO_VALUE[card.rank])
    .sort((a, b) => b - a);

  const suits = parsed.map((card) => card.suit);
  const isFlush = suits.every((suit) => suit === suits[0]);

  const uniqueRanks = [...new Set(rankValues)];
  let straightHigh = null;

  if (uniqueRanks.length === 5) {
    let isRegularStraight = true;
    for (let i = 0; i < uniqueRanks.length - 1; i += 1) {
      if (uniqueRanks[i] - uniqueRanks[i + 1] !== 1) {
        isRegularStraight = false;
        break;
      }
    }

    if (isRegularStraight) {
      straightHigh = uniqueRanks[0];
    } else {
      const isWheel =
        uniqueRanks[0] === 14 &&
        uniqueRanks[1] === 5 &&
        uniqueRanks[2] === 4 &&
        uniqueRanks[3] === 3 &&
        uniqueRanks[4] === 2;

      if (isWheel) {
        straightHigh = 5;
      }
    }
  }

  const counts = {};
  for (const rankValue of rankValues) {
    counts[rankValue] = (counts[rankValue] ?? 0) + 1;
  }

  const entries = Object.entries(counts).map(([rank, count]) => ({
    rank: Number(rank),
    count
  }));

  const quads = entries
    .filter((entry) => entry.count === 4)
    .map((entry) => entry.rank)
    .sort((a, b) => b - a);

  const pairs = entries
    .filter((entry) => entry.count === 2)
    .map((entry) => entry.rank)
    .sort((a, b) => b - a);

  if (isFlush && straightHigh !== null) {
    return {
      category: "STRAIGHT_FLUSH",
      rankVector: [straightHigh]
    };
  }

  if (quads.length === 1) {
    const kicker = rankValues.find((value) => value !== quads[0]);
    return {
      category: "FOUR_OF_A_KIND",
      rankVector: [quads[0], kicker]
    };
  }

  const trips = entries
    .filter((entry) => entry.count === 3)
    .map((entry) => entry.rank)
    .sort((a, b) => b - a);

  if (trips.length === 1 && pairs.length === 1) {
    return {
      category: "FULL_HOUSE",
      rankVector: [trips[0], pairs[0]]
    };
  }

  if (isFlush) {
    return {
      category: "FLUSH",
      rankVector: rankValues
    };
  }

  if (straightHigh !== null) {
    return {
      category: "STRAIGHT",
      rankVector: [straightHigh]
    };
  }

  if (trips.length === 1) {
    const kickers = rankValues.filter((value) => value !== trips[0]);
    return {
      category: "THREE_OF_A_KIND",
      rankVector: [trips[0], ...kickers]
    };
  }

  if (pairs.length === 2) {
    const kicker = rankValues.find((value) => value !== pairs[0] && value !== pairs[1]);
    return {
      category: "TWO_PAIR",
      rankVector: [pairs[0], pairs[1], kicker]
    };
  }

  if (pairs.length === 1) {
    const kickers = rankValues.filter((value) => value !== pairs[0]);
    return {
      category: "ONE_PAIR",
      rankVector: [pairs[0], ...kickers]
    };
  }

  return {
    category: "HIGH_CARD",
    rankVector: rankValues
  };
}

export function compareHands(handA, handB) {
  if (CATEGORY_STRENGTH[handA.category] > CATEGORY_STRENGTH[handB.category]) {
    return 1;
  }

  if (CATEGORY_STRENGTH[handA.category] < CATEGORY_STRENGTH[handB.category]) {
    return -1;
  }

  const maxLength = Math.max(handA.rankVector.length, handB.rankVector.length);

  for (let i = 0; i < maxLength; i += 1) {
    const left = handA.rankVector[i] ?? -1;
    const right = handB.rankVector[i] ?? -1;

    if (left > right) {
      return 1;
    }

    if (left < right) {
      return -1;
    }
  }

  return 0;
}

function cardToText(card) {
  return `${VALUE_TO_RANK[card.value]}${card.suit}`;
}

function orderChosen5(rawCards, evaluatedHand) {
  const parsed = rawCards.map((text) => {
    const card = parseCard(text);
    return {
      text: `${card.rank}${card.suit}`,
      rank: card.rank,
      suit: card.suit,
      value: RANK_TO_VALUE[card.rank]
    };
  });

  if (evaluatedHand.category === "STRAIGHT" || evaluatedHand.category === "STRAIGHT_FLUSH") {
    const high = evaluatedHand.rankVector[0];
    const wanted = high === 5 ? [5, 4, 3, 2, 14] : [high, high - 1, high - 2, high - 3, high - 4];

    return wanted.map((value) => {
      const card = parsed.find((candidate) => candidate.value === value);
      return cardToText(card);
    });
  }

  return parsed.sort((a, b) => b.value - a.value).map(cardToText);
}

export function evaluateBestHandFromSeven(cards) {
  if (!Array.isArray(cards) || cards.length !== 7) {
    throw new Error("A 7-card hand is required");
  }

  const normalized = cards.map((card) => {
    const parsed = parseCard(card);
    return `${parsed.rank}${parsed.suit}`;
  });

  let bestResult = null;
  let bestCards = null;

  for (let a = 0; a < normalized.length - 4; a += 1) {
    for (let b = a + 1; b < normalized.length - 3; b += 1) {
      for (let c = b + 1; c < normalized.length - 2; c += 1) {
        for (let d = c + 1; d < normalized.length - 1; d += 1) {
          for (let e = d + 1; e < normalized.length; e += 1) {
            const current = [normalized[a], normalized[b], normalized[c], normalized[d], normalized[e]];
            const currentEval = evaluateFiveCardHand(current);

            if (!bestResult || compareHands(currentEval, bestResult) > 0) {
              bestResult = currentEval;
              bestCards = current;
            }
          }
        }
      }
    }
  }

  return {
    ...bestResult,
    chosen5: orderChosen5(bestCards, bestResult)
  };
}
