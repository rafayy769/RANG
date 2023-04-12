import User from "./user"
import Card from "./card";
import Deck from "./deck";
import GLOBALS from "./globals";

type Player = {
    /**
     * @remarks
     * This is a player object
     * 
     * @param user  - The user object of the player
     * @param hand  - The hand of the player
     * @param score - The score of the player
     */

    user: User,
    hand: Card[],
    score: number
};

type PlayTurn = {
    /**
     * @remarks
     * This is a play object, represents a single play in the game
     * 
     * @param player - The player who played the card
     * @param card - The card that was played
     */

    player: Player,
    card: Card
};

type GameRound = {
    /**
     * @remarks
     * This is a round object, represents a single round in the game
     * 
     * @param roundPlays - The sequence of the round
     */

    roundPlays: PlayTurn[]
};

class GameState
{
    /**
     * @remarks
     * Represents the state of the game.
     * 
     * @param players - An array of players
     * @param dealer - The dealer
     * @param RUNGsuit - The trump suit
     * @param currentPlayerId - The id of the current player
     * @param currentRoundNumber - The current round of the game
     * @param sequence - The sequence of the game
     * @param Deck - The deck of the game
     */

    players: Player[] = [];
    dealer: Player = {} as Player;
    RUNGsuit: string = "";
    currentPlayerId: number = -1;
    currentRoundNumber: number = 0;
    sequence: GameRound[] = [];
    deck: Deck = new Deck();

    constructor()
    {
        this.deck.reset();
        this.deck.shuffle();
    }

    /**
     * @remarks
     * Resets the game state
     * 
     * @param players - An array of players
     * @param dealer - The dealer
     * @param RUNGsuit - The trump suit
     * @param currentPlayerId - The id of the current player
     * @param currentRoundNumber - The current round of the game
     * @param sequence - The sequence of the game
     * @param Deck - The deck of the game
     */

    reset()
    {
        this.players = [];
        this.dealer = {} as Player;
        this.RUNGsuit = "";
        this.currentPlayerId = -1;
        this.currentRoundNumber = 0;
        this.sequence = [];
        this.deck.reset();
        this.deck.shuffle();
    }

    /**
     * @remarks
     * Adds a player to the game
     * 
     * @param userObj - The user object of the player
     * @param handArr - The hand of the player
     * @param score - The score of the player
    */

    addPlayer(userObj: User, handArr: Card[] = [], score: number = 0)
    {
        this.players.push({
            user: userObj,
            hand: handArr,
            score: score
        });
    }

    /**
     * @remarks
     * Determines the next player.
     * 
     * @returns The next player.
     */
    getNextPlayer = () => {}; // TODO: Implement this function

    /**
     * @remarks
     * Determines the winner of the round.
     * 
     * @returns The winner of the round.
     */
    getRoundWinner = () => {}; // TODO: Implement this function

    /**
     * @remarks
     * Determines the winner of the game.
     * 
     * @returns The winner of the game.
     */
    getGameWinner = () => {}; // TODO: Implement this function

    /**
     * @remarks
     * Determines whether the move is valid.
     * 
     * @returns Whether the move is valid.
     * @param play - The play that was made by the player
     */
    isValidMove = (play: PlayTurn) => {}; // TODO: Implement this function

    /**
     * @remarks
     * Determines whether the game is over.
     * 
     * @returns Whether the game is over.
     * @param play - The play that was made by the player   
     */
    isGameOver = (play: PlayTurn) => {}; // TODO: Implement this function
};  

export default GameState;