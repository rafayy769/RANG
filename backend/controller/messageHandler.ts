import { Socket } from "socket.io";
import AppState from "../types/AppState";
import GLOBALS from "../types/globals";
import { getEventData } from "../types/Events";

export default class MessageHandler
{
    appState: AppState;

    constructor(appState: AppState)
    {
        this.appState = appState;
    }

    public onMessageReceived(socket: Socket, data: any)
    {
        this.appState.broadcastMessage(GLOBALS.Events.MESSAGE, data);
    }
};