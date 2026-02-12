# Texas Hold'em Hand Evaluator (TDD)

## Objectif

Ce projet implémente un évaluateur de mains Texas Hold'em en TDD.

Entrées visées:
- 5 cartes communes (board)
- 2 cartes privatives par joueur

Sorties visées:
- meilleure main de 5 cartes choisie parmi 7
- catégorie de main
- comparaison entre joueurs (avec égalités/split)

## État

Implémenté pour l'instant:
- parsing des cartes (`parseCard`, `parseCards`)
- évaluation 5 cartes pour:
	- `HIGH_CARD`
	- `ONE_PAIR`
	- `TWO_PAIR`
	- `THREE_OF_A_KIND`
	- `STRAIGHT` (inclut A-2-3-4-5)
	- `FLUSH`
- comparaison des mains via catégorie + `rankVector`


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

## Format des cartes

Format court sur 2 caractères:
- rang: `2 3 4 5 6 7 8 9 T J Q K A`
- couleur: `S H D C`

Exemples valides:
- `AS`
- `TD`
- `7H`


