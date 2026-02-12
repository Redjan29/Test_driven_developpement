const VALID_RANKS = new Set(["2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K", "A"]);
const VALID_SUITS = new Set(["S", "H", "D", "C"]);
const RANK_TO_VALUE = {
  "2": 2,
  "3": 3,
  "4": 4,
  "5": 5,
  "6": 6,
  "7": 7,
  "8": 8,
  "9": 9,
  T: 10,
  J: 11,
  Q: 12,
  K: 13,
  A: 14
};

const CATEGORY_STRENGTH = {
  HIGH_CARD: 1,
  ONE_PAIR: 2,
  TWO_PAIR: 3,
  THREE_OF_A_KIND: 4
};

export function parseCard(cardText) {
  if (typeof cardText !== "string" || cardText.length !== 2) {
    throw new Error("Card must be a 2-character string like AS or TD");
  }

  const rank = cardText[0].toUpperCase();
  const suit = cardText[1].toUpperCase();

  if (!VALID_RANKS.has(rank)) {
    throw new Error(`Invalid rank: ${rank}`);
  }

  if (!VALID_SUITS.has(suit)) {
    throw new Error(`Invalid suit: ${suit}`);
  }

  return { rank, suit };
}

export function parseCards(cards) {
  if (!Array.isArray(cards)) {
    throw new Error("Cards must be an array");
  }

  return cards.map(parseCard);
}

export function evaluateFiveCardHand(cards) {
  if (!Array.isArray(cards) || cards.length !== 5) {
    throw new Error("A hand must contain exactly 5 cards");
  }

  const parsed = parseCards(cards);
  const rankValues = parsed
    .map((card) => RANK_TO_VALUE[card.rank])
    .sort((a, b) => b - a);

  const counts = {};
  for (const rankValue of rankValues) {
    counts[rankValue] = (counts[rankValue] ?? 0) + 1;
  }

  const entries = Object.entries(counts).map(([rank, count]) => ({
    rank: Number(rank),
    count
  }));

  const trips = entries
    .filter((entry) => entry.count === 3)
    .map((entry) => entry.rank)
    .sort((a, b) => b - a);

  if (trips.length === 1) {
    const kickers = rankValues.filter((value) => value !== trips[0]);
    return {
      category: "THREE_OF_A_KIND",
      rankVector: [trips[0], ...kickers]
    };
  }

  const pairs = entries
    .filter((entry) => entry.count === 2)
    .map((entry) => entry.rank)
    .sort((a, b) => b - a);

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
