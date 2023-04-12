import User from "./user";
import GameState from "./GameState";

class AppState
{
    /**
     * @remarks
     * Represents the state of the application.
     * 
     * @param users - An array of users
     * @param gameState - The state of the game
     * @param currentState - The current state of the application. Possible values are: "lobby", "game", "gameOver"
     */

    users: User[];
    currentState?: string;
    gameState?: GameState;

    constructor()
    {
        this.users = [];
        this.currentState = undefined;
        this.gameState = undefined;
    }
};

export default AppState;