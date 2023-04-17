import User from "./user";
import GameState from "./GameState";
import GLOBALS from "./globals";
import { Socket } from "socket.io";

type Message = {
    /**
     * @remarks
     * This is a message object
     * 
     * @param sender - The sender of the message
     * @param message - The message
     */

    sender: User;
    message: string;
};

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
    currentState: string;
    gameState: GameState;
    messages: Message[];

    constructor()
    {
        this.users = [];
        this.currentState = GLOBALS.APP_STATES.LOBBY;
        this.gameState = new GameState(this.users);
        this.messages = [];
    }

    public sendTo = (playerId: number, eventName: String, data: any) => 
    {
        const recipientSocket = this.users[playerId].socket;
        if (!recipientSocket) return;
        recipientSocket.emit(`${eventName}`, data);
    }

    public broadcastMessage = (eventName: String, data: any) =>
    {
        this.users.forEach((user) => {
            if (user.socket) user.socket.emit(`${eventName}`, data);
        });
    }

    public getPlayerBySocket = (socket: Socket) =>
    {
        return this.users.find((user: User) => user.socket.id === socket.id);
    }
};

export default AppState;