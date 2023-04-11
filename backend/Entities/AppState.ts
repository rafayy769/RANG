import User from "./user";
import GameState from "./GameState";
import Deck from "./deck";

type AppState = {
    /**
     * @remarks
     * Represents the state of the application.
     * 
     * @param users - An array of users
     * @param gameState - The state of the game
     * @param currentState - The current state of the application. Possible values are: "lobby", "game", "gameOver"
     */

    users: User[],
    deck: Deck,
    currentState?: string
    gameState?: GameState,
};

export default AppState;