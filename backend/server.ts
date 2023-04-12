import AppState from "./Entities/AppState";
import User from "./Entities/user";
import ConnectionHandler from "./controller/connectionHandler";
import GameHandler from "./controller/gameHandler";
import EventHandler, { getEventData } from "./Entities/Events";
import GLOBALS from "./Entities/globals";
import { Socket } from "socket.io";

// const { Socket } = require( "socket.io");

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

// setUp Event Handlers. A list of event handlers, where we just define what event we want to listen for and what handler we want to call when that event is triggered.

// This is a list of event handlers for connection events
const connectionEventHandlers: EventHandler[] = [
    {
        event: GLOBALS.Events.PLAYER_JOINED,
        handler: CONNECTION_HANDLER.onUserJoin
    }
];

// This is a list of event handlers for game events
const gameEventHandlers: EventHandler[] = [
    {
        event: GLOBALS.Events.CARD_PLAYED,
        handler: GAME_HANDLER.onMoveMade
    }
];

io.on("connection", (socket: Socket) => {
    // This is called when a user connects to the server
    // We check if the user can connect to the server
    let canConnect = CONNECTION_HANDLER.onUserConnect(socket);

    if (!canConnect)
    {
        console.log("User tried to connect but the game is full.");
        socket.emit(GLOBALS.Events.ERROR, getEventData(GLOBALS.Events.ERROR, GLOBALS.stdErrors.GAME_FULL));
        socket.disconnect();
        return;
    }

    // register all the connection event handlers
    connectionEventHandlers.forEach((eventHandler) => {
        socket.on(eventHandler.event, (data) => {
            eventHandler.handler(socket, data);
        });
    });

    // register all the game event handlers
    // gameEventHandlers.forEach((eventHandler) => {
    //     socket.on(eventHandler.event, (data) => {
    //         eventHandler.handler(socket, data);
    //     });
    // });
});