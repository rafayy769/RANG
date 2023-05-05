import { Socket } from "socket.io";
import AppState from "../types/AppState";
import GLOBALS from "../types/globals";
import Card from "../types/card";
import { PlayTurn } from "../types/GameState";

export default class GameHandler {
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

    static tempTest: number = 0;

    constructor(appState: AppState) {
        this.appState = appState;
        this.onGameStart = this.onGameStart.bind(this);
        this.onRangSelected = this.onRangSelected.bind(this);
        this.onMoveMade = this.onMoveMade.bind(this);
    }

    /**
     * @remarks
     * Reacts to what happens in the game when the game starts
     * 
     * @param socket - The socket of the user
     * @param data - The data sent by the user
     */
    public onGameStart(socket: Socket, data: any) {
        let thisPlayer = this.appState.gameState.getPlayerById(data.data.playerId);

        if (!thisPlayer) {
            socket.emit(GLOBALS.Events.ERROR, {
                event: GLOBALS.Events.ERROR,
                data: {
                    message: "Player not found"
                }
            });
        }
        
        // need to send the player their hand, their score, the current card, and whether it is their turn and other information
        let myPlayerSend = {
            name: thisPlayer.user.user_name,
            hand: thisPlayer.hand,
            score: thisPlayer.score,
            current_card: thisPlayer.current_card,
            is_turn: this.appState.gameState.isTurn(thisPlayer.user.id),
            user_id: thisPlayer.user.id
        };

        let players = this.appState.gameState.players.map((player) => {
            return {
                name: player.user.user_name,
                score: player.score,
                current_card: player.current_card,
                is_turn: this.appState.gameState.isTurn(player.user.id),
                user_id: player.user.id
            }
        });

        // remove the player from the array
        players = players.filter((player) => player.user_id !== myPlayerSend.user_id);

        let toSend = {
            myPlayer: myPlayerSend,
            players: players,
            messages: [
                { sender: "Me", content: "Hello" },
                { sender: "You", content: "Hi" },
            ],
            playStarted: false
        }

        if (thisPlayer) {
            socket.emit(GLOBALS.Events.LOAD_STATE, {
                event: GLOBALS.Events.LOAD_STATE,
                data: toSend
            });
        }

        if (this.appState.gameState.rangChooser === thisPlayer.user.id) {
            socket.emit(GLOBALS.Events.SELECT_RANG, {
                event: GLOBALS.Events.SELECT_RANG,
            });
        }
    }


    /**
     * @remarks
     * Reacts to what happens what the rang is selected.
     * 
     * @param socket - The socket of the user
     * @param data - The data sent by the user
     */
    public onRangSelected(socket: Socket, data: any) {
        // now that the rang has been selected, we need to proceed with starting the gamePlay
        // 1. set the rang
        // 2. set the current player to be the first player. The first player is the one who got to select the rang.
        // 3. set the current state to be gamePlay
        // 4. emit the gamePlay event

        console.log("Received:");
        console.log(data);

        this.appState.gameState.players.forEach((player) => {
            player.user.socket.emit(GLOBALS.Events.RANG_SELECTED,
                {
                    event: GLOBALS.Events.RANG_SELECTED,
                    data: {
                        user_id: data.data.playerId,
                        user_name: data.data.playerName,
                        rang: data.data.rang,
                    }
                })
        });

        this.appState.gameState.RUNGsuit = data.data.rang;

        this.appState.currentState = GLOBALS.APP_STATES.GAME;

        // give each player 8 cards and add it to their current hands
        this.appState.gameState.players.forEach((player) => {
            let cards = this.appState.gameState.deck.drawMultiple(8);
            player.hand.push(...cards);
        });

        this.appState.gameState.players.forEach((thisPlayer) => {
            let myPlayerSend = {
                name: thisPlayer.user.user_name,
                hand: thisPlayer.hand,
                score: thisPlayer.score,
                current_card: thisPlayer.current_card,
                is_turn: this.appState.gameState.isTurn(thisPlayer.user.id),
                user_id: thisPlayer.user.id
            };
            thisPlayer.user.socket.emit(GLOBALS.Events.UPDATE_HAND, {
                event: GLOBALS.Events.UPDATE_HAND,
                data: {
                    myPlayer: myPlayerSend
                }
            });
        });
    }

    /**
     * @remarks
     * Reacts to what happens in the game when a move is made
     * 
     * @param socket - The socket of the user
     * @param data - The data sent by the user
     */
    public onMoveMade(socket: Socket, data: any) {

        if (GameHandler.tempTest === 0) {
            GameHandler.tempTest = 1;
            return;
        }

        console.log("Move made")
        console.log(data);
        console.log("current player: " + this.appState.gameState.currentPlayerId)
        console.log("rung chooser: " + this.appState.gameState.rangChooser)

        // if rung has not been selected, then we need to wait for the rung to be selected
        if (this.appState.gameState.RUNGsuit === "") {
            socket.emit(GLOBALS.Events.ERROR, {
                event: GLOBALS.Events.ERROR,
                data: {
                    message: "Rung has not been selected yet"
                }
            });
            GameHandler.tempTest = 0;
            return;
        }


        let move: PlayTurn = data.data as PlayTurn;

        let validMoveResult = this.appState.gameState.isValidMove(move);

        console.log(validMoveResult);

        if (validMoveResult.status === "success") {
            this.appState.gameState.playMove(move);

            this.appState.broadcastMessage(GLOBALS.Events.MOVE_MADE, {
                event: GLOBALS.Events.VALID_MOVE,
                data: {
                    move: move
                }
            });

            // send the update hand event to the player
            let thisPlayer = this.appState.gameState.players.find((player) => player.user.user_name === move.playerName);

            if (thisPlayer) {
                let myPlayerSend = {
                    name: thisPlayer.user.user_name,
                    hand: thisPlayer.hand,
                    score: thisPlayer.score,
                    current_card: thisPlayer.current_card,
                    is_turn: false,
                    user_id: thisPlayer.user.id,
                };

                thisPlayer.user.socket.emit(GLOBALS.Events.UPDATE_HAND, {
                    event: GLOBALS.Events.UPDATE_HAND,
                    data: {
                        myPlayer: myPlayerSend
                    }
                });

                let players = this.appState.gameState.players.map((player) => {
                    return {
                        name: player.user.user_name,
                        score: player.score,
                        current_card: player.current_card,
                        is_turn: this.appState.gameState.isTurn(player.user.id),
                        user_id: player.user.id
                    }
                }
                );

                this.appState.gameState.players.forEach((player) => {
                    // remove the player from the array
                    let temPlayers = players.filter((arrplayer) => arrplayer.user_id !== player.user.id);

                    player.user.socket.emit("update-players", {
                        event: "update-players",
                        data: {
                            players: temPlayers
                        }
                    });
                }
                );

            }

        }
        else {
            socket.emit(GLOBALS.Events.ERROR, {
                event: GLOBALS.Events.ERROR,
                data: {
                    message: validMoveResult.message
                }
            });
        }

        GameHandler.tempTest = 0;
    }
};