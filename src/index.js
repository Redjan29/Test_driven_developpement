const VALID_RANKS = new Set(["2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K", "A"]);
const VALID_SUITS = new Set(["S", "H", "D", "C"]);

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
