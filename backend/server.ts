import AppState from "./types/AppState";
import User from "./types/user";

import ConnectionHandler from "./controller/connectionHandler";
import GameHandler from "./controller/gameHandler";
import EventHandler, { getEventData } from "./types/Events";
import MessageHandler from "./controller/messageHandler";

import GLOBALS from "./types/globals";
import { Socket } from "socket.io";

const express = require("express");
const app = express();
const http = require("http");
const {Server} = require('socket.io')
const cors = require('cors')

app.use(cors())
const server = http.createServer(app)
const io = new Server(
    server,{cors:{
        origin:"http://localhost:3001",
        methods: ["GET", "POST"]
    },
})

server.listen(3001, ()=>{
    console.log("SERVER IS LISTENING ON PORT 3001")
})

// Create a new AppState object
const APP_STATE = new AppState();

// create handler objects. These objects will handle all the events (specifically the methods provided by these objects.)
const CONNECTION_HANDLER = new ConnectionHandler(APP_STATE);
const GAME_HANDLER = new GameHandler(APP_STATE);
const MESSAGE_HANDLER = new MessageHandler(APP_STATE);

// setUp Event Handlers. A list of event handlers, where we just define what event we want to listen for and what handler we want to call when that event is triggered.

// This is a list of event handlers for connection events
const connectionEventHandlers: EventHandler[] = [
    {
        event: GLOBALS.Events.PLAYER_JOINED,
        handler: CONNECTION_HANDLER.onPlayerJoin
    },
    {
        event: GLOBALS.Events.NEW_CONNECTION,
        handler: CONNECTION_HANDLER.onPlayerConnect
    }
];

// This is a list of event handlers for game events
const gameEventHandlers: EventHandler[] = [
    {
        event: GLOBALS.Events.CARD_PLAYED,
        handler: GAME_HANDLER.onMoveMade
    },
    {
        event: GLOBALS.Events.GAME_STARTED,
        handler: GAME_HANDLER.onGameStart
    },
    {
        event: GLOBALS.Events.CARD_PLAYED,
        handler: GAME_HANDLER.onMoveMade
    },
    {
        event: GLOBALS.Events.RANG_SELECTED,
        handler: GAME_HANDLER.onRangSelected
    }
];

// This is a list of event handlers for message events
const messageEventHandlers: EventHandler[] = [
    {
        event: GLOBALS.Events.MESSAGE,
        handler: MESSAGE_HANDLER.onMessageReceived
    }
];

const EventHandlers : EventHandler[][] = [connectionEventHandlers, gameEventHandlers, messageEventHandlers];

io.on("connection", (socket: Socket) => {
    // This is called when a user connects to the server
    // We check if the user can connect to the server
    let canConnect = CONNECTION_HANDLER.onUserConnect(socket);

    if (!canConnect)
    {
        console.log("User tried to connect but the game is full.");
        socket.emit(GLOBALS.Events.CONNECTION_FAILED, getEventData(GLOBALS.Events.CONNECTION_FAILED, GLOBALS.stdErrors.GAME_FULL));
        socket.disconnect();
        return;
    }

    EventHandlers.forEach((eventHandlerList) => {
        eventHandlerList.forEach((eventHandler) => {
            socket.on(eventHandler.event, (data) => {
                console.log("Event received: ", eventHandler.event);
                eventHandler.handler(socket, data);
            });
        });
    });
});