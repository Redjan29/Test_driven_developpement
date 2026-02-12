# Texas Hold'em Hand Evaluator (TDD)

## Objectif

Ce projet implémente un évaluateur/comparateur de mains Texas Hold'em en TDD.

Entrées:
- 5 cartes communes (`board`)
- 2 cartes privées par joueur (`hole cards`)

Sorties:
- meilleure main de 5 cartes choisie parmi 7
- catégorie de la main
- comparaison entre joueurs avec gestion des égalités (`split`)

## Catégories supportées

Ordre global (du plus fort au plus faible):

1. `STRAIGHT_FLUSH`
2. `FOUR_OF_A_KIND`
3. `FULL_HOUSE`
4. `FLUSH`
5. `STRAIGHT`
6. `THREE_OF_A_KIND`
7. `TWO_PAIR`
8. `ONE_PAIR`
9. `HIGH_CARD`

## Tie-break implémentés

- `STRAIGHT` / `STRAIGHT_FLUSH`: carte la plus haute de la quinte
- `FOUR_OF_A_KIND`: rang du carré puis kicker
- `FULL_HOUSE`: rang du brelan puis rang de la paire
- `FLUSH`: comparaison carte par carte (ordre décroissant)
- `THREE_OF_A_KIND`: rang du brelan puis deux kickers
- `TWO_PAIR`: paire haute, paire basse, puis kicker
- `ONE_PAIR`: paire puis trois kickers
- `HIGH_CARD`: comparaison lexicographique des 5 cartes

Cas particulier géré:
- quinte `A-2-3-4-5` (As bas) valide, avec valeur haute `5`
- quinte circulaire (`Q-K-A-2-3`) invalide

## API

Fonctions exportées depuis [src/index.js](src/index.js):

- `parseCard(cardText)`
- `parseCards(cards)`
- `evaluateFiveCardHand(cards)`
- `compareHands(handA, handB)`
- `evaluateBestHandFromSeven(cards)`
- `resolveShowdown(board, players)`

### Format des cartes

Format court sur 2 caractères:
- rang: `2 3 4 5 6 7 8 9 T J Q K A`
- couleur: `S H D C`

Exemples valides:
- `AS`
- `TD`
- `7H`

### Format de sortie (best-of-7)

`evaluateBestHandFromSeven(cards)` retourne:

- `category`: catégorie détectée
- `rankVector`: vecteur utilisé pour le tie-break
- `chosen5`: les 5 cartes choisies

`resolveShowdown(board, players)` retourne:

- `winnerIndexes`: index des gagnants
- `isSplit`: `true` si égalité
- `playerResults`: résultat détaillé pour chaque joueur

## Ordre déterministe de `chosen5`

`chosen5` est renvoyé de manière déterministe, avec un ordre aligné sur la logique de comparaison:

- `STRAIGHT` / `STRAIGHT_FLUSH`: du plus haut au plus bas (wheel: `5,4,3,2,A`)
- `FOUR_OF_A_KIND`: carré puis kicker
- `FULL_HOUSE`: brelan puis paire
- `THREE_OF_A_KIND`: brelan puis kickers
- `TWO_PAIR`: paire haute, paire basse, kicker
- `ONE_PAIR`: paire puis kickers
- `FLUSH` / `HIGH_CARD`: ordre décroissant

## Hypothèses et validation d'entrée

- Le format de carte est validé (`rank` + `suit`).
- Le moteur **n'effectue pas** encore de validation globale de duplicatas entre les 7 cartes (hypothèse: pas de cartes dupliquées en entrée).

## Lancer les tests

Prérequis: Node.js

Installation:

```bash
npm install
```

Exécution des tests:

```bash
npm test
```


