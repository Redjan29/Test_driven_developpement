import { VALID_RANKS, VALID_SUITS } from "./constants.js";

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
