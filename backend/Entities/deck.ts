import Card from "./card";

const generateCardNames = () => {
    const suits: string[] = ["H", "D", "C", "S"];
    const values: string[] = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    const cards: string[] = [];
    
    // use map to create a new array of card names
    suits.map((suit: string) => {
        values.map((value: string) => {
            cards.push(value + suit);
        });
    });

    return cards;
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
    constructor() 
    {
        this.cardsDeck = generateCardNames().map((cardName: string) => {
            return {value: cardName};
        });
    }
    // create a method that shuffles the cardsDeck array
    shuffle()
    {
        for (let i = this.cardsDeck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cardsDeck[i], this.cardsDeck[j]] = [this.cardsDeck[j], this.cardsDeck[i]];
        }
    }
    // create a method that returns the top card of the cardsDeck array
    draw()
    {
        return this.cardsDeck.pop();
    }
    // create a method that returns the top n cards of the cardsDeck array
    drawMultiple(n: number) 
    {
        let cards: Card[] = [];
        if (n > this.cardsDeck.length) 
        {
            n = this.cardsDeck.length;
        }
        for (let i = 0; i < n; i++) 
        {
            let temp = this.cardsDeck.pop();
            temp && cards.push(temp);
        }
    }
    // create a method that returns the number of cards left in the deck
    getCardsLeft() {
        return this.cardsDeck.length;
    }
    // check if the deck is empty
    isEmpty() 
    {
        return this.cardsDeck.length === 0;
    }
    // reset the deck
    reset()
    {
        this.cardsDeck = generateCardNames().map((cardName: string) => {
            return {value: cardName};
        });
    }
};

// const Deck: Deck = {
//     cardsDeck: [],
//     constructor: function() {
//         this.cardsDeck = generateCardNames().map((cardName: string) => {
//             return {value: cardName};
//         });
//     }
//     ,
//     shuffle: function() {
//         for (let i = this.cardsDeck.length - 1; i > 0; i--) {
//             const j = Math.floor(Math.random() * (i + 1));
//             [this.cardsDeck[i], this.cardsDeck[j]] = [this.cardsDeck[j], this.cardsDeck[i]];
//         }
//     },
//     draw: function() {
//         return this.cardsDeck.pop();
//     },
//     drawMultiple: function(n: number) {
//         let cards: Card[] = [];
//         for (let i = 0; i < n; i++) {
//             cards.push(this.cardsDeck.pop());
//         }
//         return cards;
//     },
//     cardsLeft: function() {
//         return this.cardsDeck.length;
//     },
//     isEmpty: function() {
//         return this.cardsDeck.length === 0;
//     },
//     reset: function() {
//         this.cardsDeck = generateCardNames().map((cardName: string) => {
//             return {value: cardName};
//         });
//     }
// };

// export default Deck;