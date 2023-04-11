// define the connection handler class
//
// Path: backend/controller/connectionHandler.ts
import GLOBALS from "../Entities/globals";
import { Socket } from "socket.io";
import { Events } from "../Entities/globals";
import AppState from "../Entities/AppState";
import Deck from "../Entities/deck";
import User from "../Entities/user";

class ConnectionHandler
{
    ApplicationState: AppState = {
        users: [],
        currentState: GLOBALS.APP_STATES.LOBBY,
        gameState: undefined
    };

    constructor()
    {
        this.ApplicationState = {
            users: [],
            currentState: GLOBALS.APP_STATES.LOBBY,
            gameState: undefined
        };
    }

    // This function is called when a user connects to the server
    // It adds the user to the users array
    // It also sends a message to the user that they have joined the game
    // It also sends a message to all other users that a new user has joined the game


    public onUserConnect(socket: Socket) 
    {
        console.log("user connected with a socket id", socket.id)

        if (this.ApplicationState.currentState === GLOBALS.APP_STATES.LOBBY)
        {
            let connected_user: User = {
                id: this.ApplicationState.users.length,
                user_name: "",
                socket: socket
            }
            this.ApplicationState.users.push(connected_user);
            this.sendTo(connected_user.id, GLOBALS.Events.NEW_CONNECTION, "You have joined the game");
            this.broadcastMessage(GLOBALS.Events.NEW_CONNECTION, `${connected_user.user_name} has joined the game`);
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