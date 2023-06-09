import { Socket } from "socket.io";

export const Events = {
    NEW_CONNECTION: "new-connection",
    CONNECTION_FAILED: "connection-failed",
    PLAYER_JOINED: "join",
    GAME_STARTED: "start",
    CARD_PLAYED: "play",
    TRICK_OVER: "trickEnd",
    ROUND_OVER: "round-over",
    GAME_OVER: "gameOver",
    ERROR: "error",
    PLAYER_DISCONNECTED: "disconnect",
    PLAYER_RECONNECTED: "reconnect",
    MESSAGE: "message",
    VALID_MOVE: "validMove",
    INVALID_MOVE: "invalidMove",
    RANG_SELECTED: "rangSelected",
    LOAD_STATE: "loadState",
    SELECT_RANG: "selectRang",
    TOSS_WINNER: "tossWinner",
    UPDATE_HAND: "updateHand",
};

type EventData = {
    /**
     * @remarks
     * Represents the data of an event
     * 
     * @param event - The event
     * @param data - The data of the event
     */

    event: string;
    data: any;
}

export function getEventData(event: string, data: any): EventData
{
    return {
        event: event,
        data: data
    };
}

type EventHandler = 
{
    /**
     * @remarks
     * This is an event handler
     * 
     * @param event - The event
     * @param handler - The handler for the event
     */

    event: string;
    handler: (socket: Socket, data: any) => void;
}

export default EventHandler;