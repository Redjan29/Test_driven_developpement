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
  const rankVector = parsed
    .map((card) => RANK_TO_VALUE[card.rank])
    .sort((a, b) => b - a);

  return {
    category: "HIGH_CARD",
    rankVector
  };
}

export function compareHands(handA, handB) {
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
