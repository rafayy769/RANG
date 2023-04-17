// define the connection handler class
//
// Path: backend/controller/connectionHandler.ts
import GLOBALS from "../types/globals";
import { Socket } from "socket.io";
import { Events, getEventData } from "../types/Events";
import AppState from "../types/AppState";
import Deck from "../types/deck";
import User from "../types/user";
import GameState from "../types/GameState";

export default class ConnectionHandler
{
    ApplicationState: AppState;

    constructor(Appstate: AppState)
    {
        this.ApplicationState = Appstate;
        this.onPlayerJoin = this.onPlayerJoin.bind(this);
    }

    set(appState: AppState)
    {
        this.ApplicationState = appState;
    }

    onUserConnect(socket: Socket) 
    {
        console.log("A user connected with the socket id", socket.id);
        if (this.ApplicationState.currentState === GLOBALS.APP_STATES.LOBBY)
        {
            return true;
        }

        return false;
    }

    onUserDisconnect(socket: Socket)
    {
        console.log("A user disconnected with the socket id", socket.id)
        let disconnected_user = this.ApplicationState.users.find((user) => user.socket.id === socket.id);
        if (disconnected_user)
        {
            this.ApplicationState.users = this.ApplicationState.users.filter((user) => user.socket.id !== socket.id);
            this.ApplicationState.broadcastMessage(GLOBALS.Events.PLAYER_DISCONNECTED, {
                playerName: disconnected_user.user_name,
                playerCount: this.ApplicationState.users.length,
            });
        }
    }

    onPlayerConnect(socket: Socket, data: any)
    {
        console.log("A player connected with the id", data.playerID);

        let playerUID = data.playerID;
        console.log(this.ApplicationState.users);
        let player = this.ApplicationState.users ? this.ApplicationState.users.find((user) => user.id === playerUID) : null;
        if (player)
        {
            // refresh detected
            console.log(`\t${player.user_name} reconnected successfully`);
            // player.socket = socket;

            this.ApplicationState.currentState === GLOBALS.APP_STATES.GAME ? socket.emit(GLOBALS.Events.GAME_STARTED, getEventData(GLOBALS.Events.GAME_STARTED, "")) : null;
        }
        else
        {
            console.log("No player found with the id", playerUID);

            socket.emit(GLOBALS.Events.PLAYER_JOINED, getEventData(GLOBALS.Events.NEW_CONNECTION, {
                playerUID: this.ApplicationState.users.length
            }));
        }
    }

    onPlayerJoin(socket: Socket, data: any)
    {
        if (this.ApplicationState.users.length === GLOBALS.MAX_PLAYERS)
        {
            console.log("\tGame is full");
        }
        else if (this.ApplicationState.currentState !== GLOBALS.APP_STATES.LOBBY)
        {
            socket.emit(GLOBALS.Events.ERROR, getEventData(GLOBALS.Events.ERROR, GLOBALS.stdErrors.GAME_RUNNING));
        }
        else if (this.ApplicationState.users.find((user) => user.user_name === data.playerName))
        {
            socket.emit(GLOBALS.Events.ERROR, getEventData(GLOBALS.Events.ERROR, GLOBALS.stdErrors.USERNAME_TAKEN));
        }
        else
        {
            let connected_user: User = 
            {
                id: this.ApplicationState.users.length,
                user_name: data.playerName,
                socket: socket
            };

            console.log("Connected user given id", connected_user.id)

            console.log(`\t${connected_user.user_name} joined successfully`);
            this.ApplicationState.users.push(connected_user);

            this.ApplicationState.broadcastMessage(GLOBALS.Events.PLAYER_JOINED, {
                playerID: connected_user.id,
                playerName: connected_user.user_name,
                playerCount: this.ApplicationState.users.length,
            });

            if (this.ApplicationState.users.length === GLOBALS.MAX_PLAYERS)
            {
                this.ApplicationState.currentState = GLOBALS.APP_STATES.GAME;
                
                this.ApplicationState.gameState = new GameState(this.ApplicationState.users);

                this.ApplicationState.broadcastMessage(GLOBALS.Events.GAME_STARTED, "");
            }
        }

        return;
    }
}