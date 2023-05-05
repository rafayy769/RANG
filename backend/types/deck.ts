import Card from "./card";

const generateCardObjects = () => {
    const suits_name: { [key: string]: string } =
    {
        "s": "spades",
        "h": "hearts",
        "d": "diams",
        "c": "clubs"
    };
    const suits_symbol: { [key: string]: string } =
    {
        "s": "♠",
        "h": "♥",
        "d": "♦",
        "c": "♣"
    };
    const ranks = [
        "A",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10",
        "J",
        "Q",
        "K",
    ];

    // use map to create a new array of card names
    let cards: Card[] = [];
    for (let i = 0; i < ranks.length; i++) {
        for (let suit in suits_name) {
            let card: Card = {
                rank: ranks[i],
                suit_name: suits_name[suit],
                suit_symbol: suits_symbol[suit],
            };
            cards.push(card);
        }
    }

    return cards;
};

// Define the ranking of each card rank
const rankValues: { [key: string]: number } = {
    "2": 1,
    "3": 2,
    "4": 3,
    "5": 4,
    "6": 5,
    "7": 6,
    "8": 7,
    "9": 8,
    "10": 9,
    "J": 10,
    "Q": 11,
    "K": 12,
    "A": 13,
};
export default class Deck {
    /**
     * @remarks
     * This is a deck object. Represents a single deck of 52 cards.
     * 
     * @param cardsDeck - An array of cards
     * 
     */

    cardsDeck: Card[];

    // create a constructor for the deck that populates the cardsDeck array
    constructor() {
        this.cardsDeck = generateCardObjects();
    }
    // create a method that shuffles the cardsDeck array
    shuffle() {
        for (let i = this.cardsDeck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cardsDeck[i], this.cardsDeck[j]] = [this.cardsDeck[j], this.cardsDeck[i]];
        }
    }

    // generate hands for the players
    generateHands(players: number) {
        let hands: Card[][] = [];
        for (let i = 0; i < players; i++) {
            hands.push(this.drawMultiple(13));
        }
        return hands;
    }

    // create a method that returns the top card of the cardsDeck array
    draw() {
        return this.cardsDeck.pop() || { rank: "", suit_name: "", suit_symbol: "" };
    }
    // create a method that returns the top n cards of the cardsDeck array
    drawMultiple(n: number) {
        let cards: Card[] = [];
        if (n > this.cardsDeck.length) {
            n = this.cardsDeck.length;
        }
        for (let i = 0; i < n; i++) {
            let temp = this.cardsDeck.pop();
            temp && cards.push(temp);
        }

        return cards;
    }
    // create a method that returns the number of cards left in the deck
    getCardsLeft() {
        return this.cardsDeck.length;
    }
    // check if the deck is empty
    isEmpty() {
        return this.cardsDeck.length === 0;
    }
    // reset the deck
    reset() {
        this.cardsDeck = generateCardObjects();
    }

    compareCards(card1: Card, card2: Card, valueOnly: boolean = false): boolean {
        // Check if cards are of the same suit
        if (!valueOnly && card1.suit_symbol !== card2.suit_symbol) {
            return false;
        }

        // Get the rank value for each card
        const card1Value = rankValues[card1.rank.toString()];
        const card2Value = rankValues[card2.rank.toString()];

        // Compare the rank values, assuming Ace to be the highest and 2 to be the lowest
        return card1Value > card2Value;
    }
};