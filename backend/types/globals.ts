import { Events } from "./Events";

export const Suits = {
    HEARTS: "H",
    DIAMONDS: "D",
    CLUBS: "C",
    SPADES: "S"
}

export const stdErrors = {
    GAME_FULL: "Sorry you can't join the game. The game is full",
    INVALID_CARD: "You can't play this card. Illegel move",
    INVALID_TURN: "Invalid turn",
    INVALID_ROUND: "Invalid round",
    INVALID_GAME: "Invalid game",
    USERNAME_TAKEN: "Sorry, this username is already taken",
    GAME_RUNNING: "Sorry, you can't join the game. The game is already in progress"
};

export const APP_STATES = {
    LOBBY: "lobby",
    GAME: "game",
    GAME_OVER: "gameOver"
};

class Globals {
    /**
     * @remarks
     * Represents the global variables of the application.
     * 
     * @param Events - An object that contains the events of the application
     * @param Suits - An object that contains the suits of the cards
     * @param stdErrors - An object that contains the standard errors of the application
     * @param MAX_PLAYERS - The maximum number of players in the game
     * @param MAX_CARDS - The maximum number of cards in a hand
     * @param MAX_ROUNDS - The maximum number of rounds in a game
     * @param APP_STATES - An object that contains the states of the application
     */

    Events: typeof Events;
    Suits: typeof Suits;
    stdErrors: typeof stdErrors;
    MAX_PLAYERS: number = 4;
    MAX_CARDS: number = 13;
    MAX_ROUNDS: number = 7;
    APP_STATES: typeof APP_STATES;

    constructor() {
        this.Events = Events;
        this.Suits = Suits;
        this.stdErrors = stdErrors;
        this.APP_STATES = APP_STATES;
    }
};

const GLOBALS: Globals = new Globals();
export default GLOBALS;