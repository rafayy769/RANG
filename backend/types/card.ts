type Card = {
    /**
     * @remarks
     * This is a card object
     * 
     * @param value - The value of the card
     * 
     * @example
     * const card = {
     *    value: "2H"
     * }
     * This card represents the 2 of hearts
     * 
    */

    rank: string;
    suit_symbol: string;
    suit_name: string;
};

export default Card;