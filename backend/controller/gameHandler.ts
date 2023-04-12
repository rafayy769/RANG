import { Socket } from "socket.io";
import AppState from "../Entities/AppState";

export default class GameHandler
{
    /**
     * @remarks
     * This is a game handler object
     * 
     * @param appState - The state of the application
     * 
     * @example
     * const gameHandler = {
     *    appState: {
     *        users: [],
     *        currentState: undefined,
     *        gameState: undefined
     *    }
     * }
     * 
     */

    appState: AppState;

    constructor(appState: AppState)
    {
        this.appState = appState;
    }

    /**
     * @remarks
     * Reacts to what happens in the game when a move is made
     * 
     * @param socket - The socket of the user
     * @param data - The data sent by the user
     */

    public onMoveMade(socket: Socket, data: any)
    {

    }

};