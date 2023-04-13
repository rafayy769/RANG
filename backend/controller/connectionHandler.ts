// define the connection handler class
//
// Path: backend/controller/connectionHandler.ts
import GLOBALS from "../Entities/globals";
import { Socket } from "socket.io";
import { Events } from "../Entities/Events";
import AppState from "../Entities/AppState";
import Deck from "../Entities/deck";
import User from "../Entities/user";
import GameState from "../Entities/GameState";

export default class ConnectionHandler
{
    ApplicationState: AppState;

    constructor(Appstate: AppState)
    {
        this.ApplicationState = Appstate;
        this.onUserJoin = this.onUserJoin.bind(this);
    }

    set(appState: AppState)
    {
        this.ApplicationState = appState;
    }

    onUserConnect(socket: Socket) 
    {
        console.log("A user connected with the socket id", socket.id)
        if (this.ApplicationState.currentState === GLOBALS.APP_STATES.LOBBY)
        {
            return true;
        }

        return false;
    }

    onUserJoin(socket: Socket, data: any)
    {
        if (this.ApplicationState.users.length === GLOBALS.MAX_PLAYERS)
        {
            console.log("\tGame is full");
            return;
        }
        else
        {
            let connected_user: User = 
            {
                id: this.ApplicationState.users.length,
                user_name: data.playerName,
                socket: socket
            };
            console.log(`\t${connected_user.user_name} joined successfully`);
            this.ApplicationState.users.push(connected_user);

            this.broadcastMessage(GLOBALS.Events.PLAYER_JOINED, {
                playerName: connected_user.user_name,
                playerCount: this.ApplicationState.users.length,
            });

            if (this.ApplicationState.users.length === GLOBALS.MAX_PLAYERS)
            {
                this.ApplicationState.currentState = GLOBALS.APP_STATES.GAME;
                this.ApplicationState.gameState = new GameState();
                // this.broadcastMessage(GLOBALS.Events.GAME_STARTED, "The game has started");
            }
        }

        return;

        if (this.ApplicationState.currentState === GLOBALS.APP_STATES.LOBBY)    
        {
            let connected_user: User = {
                id: this.ApplicationState.users.length,
                user_name: data.user_name,
                socket: socket
            };
            this.ApplicationState.users.push(connected_user);
            this.sendTo(connected_user.id, GLOBALS.Events.NEW_CONNECTION, "You have joined the game");
            this.broadcastMessage(GLOBALS.Events.NEW_CONNECTION, `${connected_user.user_name} has joined the game`);
            if (this.ApplicationState.users.length === GLOBALS.MAX_PLAYERS)
            {
                this.ApplicationState.currentState = GLOBALS.APP_STATES.GAME;
                this.ApplicationState.gameState = new GameState();
                this.broadcastMessage(GLOBALS.Events.GAME_STARTED, "The game has started");
            }
        }
        else
        {
            // TODO: Send a message to the user that the game is full
            // socket.emit("join", "Game is full")
            // TODO: Close the socket
            // socket.close()
        }
    }


    private sendTo = (playerId: number, eventName: String, data: any) => 
    {
        const recipientSocket = this.ApplicationState.users[playerId].socket;
        if (!recipientSocket) return;
        recipientSocket.emit(`${eventName}`, data);
    }

    private broadcastMessage = (eventName: String, data: any) =>
    {
        this.ApplicationState.users.forEach((user) => {
            if (user.socket) user.socket.emit(`${eventName}`, data);
        });
    }
}