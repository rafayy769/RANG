import User from "./user"
import Card from "./card";
import Deck from "./deck";
import GLOBALS from "./globals";

export type Player = {
    /**
     * @remarks
     * This is a player object
     * 
     * @param user  - The user object of the player
     * @param hand  - The hand of the player
     * @param score - The score of the player
     */

    user: User,
    hand: Card[],
    score: number,
    is_turn: boolean,
    current_card: Card,
    teamMateId: number
};

export type PlayTurn = {
    /**
     * @remarks
     * This is a play object, represents a single play in the game
     * 
     * @param player - The player who played the card
     * @param card - The card that was played
     */

    playerName: string,
    card: Card
};

export type GameRound = {
    /**
     * @remarks
     * This is a game round object, represents a single round in the game
     * 
     * @param plays - The plays of the round, an array of size 4
     * @param winner - The winner of the round
     */

    plays: PlayTurn[],
    winner_id: number
};

class GameState
{
    /**
     * @remarks
     * Represents the state of the game.
     * 
     * @param players - An array of players
     * @param dealer - The dealer
     * @param RUNGsuit - The trump suit
     * @param currentPlayerId - The id of the current player
     * @param currentRoundNumber - The current round of the game
     * @param sequence - The sequence of the game
     * @param Deck - The deck of the game
     */

    players: Player[] = [];
    RUNGsuit: string = "";
    currentPlayerId: number = -1;
    currentRoundNumber: number = 0;
    deck: Deck = new Deck();
    gameRounds: GameRound[] = [];
    rangChooser: number = -1;

    constructor(players: User[] = [])
    {
        // if players are empty return
        if (players.length === 0) return;

        this.deck.reset();
        this.deck.shuffle();
        players.forEach((userObj: User) => {
            this.addPlayer(userObj);
        });

        let cards = this.deck.drawMultiple(4);

        // make sure no cards have the same rank
        while (cards[0].rank === cards[1].rank || cards[0].rank === cards[2].rank || cards[0].rank === cards[3].rank || cards[1].rank === cards[2].rank || cards[1].rank === cards[3].rank || cards[2].rank === cards[3].rank) 
        {

            this.deck.reset();
            this.deck.shuffle();
            cards = this.deck.drawMultiple(4);
        
        }

        // give each player a starting card for toss
        this.players.forEach((player: Player) => {
            player.current_card = cards.pop() as Card;
        });

        console.log("Initializing toss.");
        this.players.forEach((player: Player) => {
            console.log(player.user.user_name + " has " + player.current_card.rank + " of " + player.current_card.suit_name);
        });

        // player with the highest ranked card is the rangChooser
        this.rangChooser = this.players.reduce((acc: number, curr: Player, index: number) => {
            if (curr.current_card.rank > this.players[acc].current_card.rank) {
                return index;
            }
            return acc;
        }, 0);

        console.log("Rang chooser is " + this.players[this.rangChooser].user.user_name);
        console.log("Rung chooser id : " + this.players[this.rangChooser].user.id);
        this.currentPlayerId = this.players[this.rangChooser].user.id;
        console.log("current player id : " + this.currentPlayerId);

        // form teams, player1 and player3 are on the same team, player2 and player4 are on the same team
        this.players[0].teamMateId = this.players[2].user.id;
        this.players[1].teamMateId = this.players[3].user.id;
        this.players[2].teamMateId = this.players[0].user.id;
        this.players[3].teamMateId = this.players[1].user.id;

        this.deck.reset();
        this.deck.shuffle();

        // deal 5 cards to each player
        this.players.forEach((player: Player) => {
            player.hand = this.deck.drawMultiple(5);
        });

        this.gameRounds.push({
            plays: [],
            winner_id: -1
        });

        console.log("Game initialized.");
        console.log()
    }

    /**
     * @remarks
     * Resets the game state
     * 
     * @param players - An array of players
     * @param dealer - The dealer
     * @param RUNGsuit - The trump suit
     * @param currentPlayerId - The id of the current player
     * @param currentRoundNumber - The current round of the game
     * @param sequence - The sequence of the game
     * @param Deck - The deck of the game
     */

    reset()
    {
        this.players = [];
        this.RUNGsuit = "";
        this.currentPlayerId = -1;
        this.currentRoundNumber = 0;
        this.deck.reset();
        this.deck.shuffle();
    }

    /**
     * @remarks
     * Returns the player object of the player with the given id
     * 
     * @param playerId - The id of the player
     * @returns The player object of the player with the given id
     */
    getPlayerById(playerId: number) : Player
    {
        console.log("Lookin for id : " + playerId)

        let response = this.players.find((player: Player) => player.user.id == playerId) as Player;

        return response;
    }

    isTurn(playerId: number) : boolean
    {
        return this.currentPlayerId === playerId;
    }

    /**
     * @remarks
     * Adds a player to the game
     * 
     * @param userObj - The user object of the player
     * @param handArr - The hand of the player
     * @param score - The score of the player
    */
    addPlayer(userObj: User, handArr: Card[] = [], score: number = 0)
    {
        this.players.push({
            user: userObj,
            hand: handArr,
            score: score,
            is_turn: false,
            current_card: {} as Card,
            teamMateId: -1
        });
    }

    /**
     * @remarks
     * Determines the next player. If the last round is over, then simply return the player who won the last round, otherwise throw an error.
     * 
     * @returns The next player.
     */
    getNextPlayer()
    {
        if (this.gameRounds[this.currentRoundNumber] === undefined)
            throw new Error("Round not found");

        if (this.gameRounds[this.currentRoundNumber].winner_id !== -1)
            return this.gameRounds[this.currentRoundNumber].winner_id;
    }


    /**
     * @remarks
     * Determines the winner of the round. If the round is not over, then throw an error.
     * 
     * @returns The winner of the round.
     */
    getRoundWinner(round: number)
    {
        // find the winner of the round. the winner is the player which has the highest ranked card of the rang suit, if no one has the rang suit, then the winner is the player which has the highest ranked card of the suit that was played first

        if (this.gameRounds[round] === undefined)
            throw new Error("Round not found");

        let starting = this.gameRounds[round].plays[0].card;
        let highest = {} as Card;

        this.gameRounds[round].plays.forEach((play: PlayTurn) => 
        {
            if (play.card.suit_name === starting.suit_name && play.card.rank > highest.rank)
                highest = play.card;

            if (play.card.suit_name === this.RUNGsuit && highest.suit_name === this.RUNGsuit && play.card.rank > highest.rank)
                highest = play.card;

            if (play.card.suit_name === this.RUNGsuit && highest.suit_name !== this.RUNGsuit)
                highest = play.card;

            if (highest.suit_name === "")
                highest = play.card;
        });

        console.log("Highest card is " + highest.suit_name + " " + highest.rank);

        let winner = this.gameRounds[round].plays.find((play: PlayTurn) => play.card.suit_name === highest.suit_name && play.card.rank === highest.rank) as PlayTurn;

        console.log("Winner is " + winner);

        return winner.playerName;
    }

    /**
     * @remarks
     * Determines the winner of the game. If the game is not over, then throw an error.
     * 
     * @returns The winner of the game.
     */
    getGameWinner = () => {
        // compute the winner of the game. the winner of the game is the team which gets to 7 points first

        let r1 = this.players[0];
        let a1 = this.players[1];
        let r2 = this.players[2];
        let a2 = this.players[3];

        if (r1.score + r2.score === 7)
            return [r1.teamMateId, r2.teamMateId];
        else if (a1.score + a2.score === 7)
            return [a1.teamMateId, a2.teamMateId];
        else
            throw new Error("Game not over yet");
    }; 

    /**
     * @remarks
     * Determines whether the move is valid.
     * 
     * @returns Whether the move is valid.
     * @param play - The play that was made by the player
     */
    isValidMove = (play: PlayTurn) => 
    {
        // when is a move valid? The move is valid if the player has the card in their hand and the card is of the same suit as the first card played in the round (if it's the first card played in the round, then the move is valid given that the move was made by the current player)

        let player = this.players.find((player: Player) => player.user.user_name === play.playerName);

        if (player === undefined)
            return {
                status: "error",
                message: "Player not found"
            }
        
        if (this.currentPlayerId !== player.user.id)
        {
            console.log("Expected player id: " + this.currentPlayerId);
            console.log("Actual player id: " + player.user.id);

            return {
                status: "error",
                message: "It is not your turn"
            }
        }

        // check if the player has the card in their hand
        let card = player.hand.find((card: Card) => card.rank === play.card.rank && card.suit_name === play.card.suit_name);
        if (card === undefined)
            return {
                status: "error",
                message: "You do not have this card"
            }

        
        // get the current round
        let currentRound = this.gameRounds[this.gameRounds.length - 1];

        console.log(this.gameRounds);
        console.log(currentRound);

        // check if the card is of the same suit as the first card played in the round
        if (currentRound.plays.length > 0)
        {
            let firstCard = currentRound.plays[0].card;

            if (card.suit_name !== firstCard.suit_name)
                return {
                    status: "error",
                    message: "You must play a card of the same suit as the first card played in the round"
                };
        }

        return {
            status: "success",
            message: "Valid move"
        };
    };

    playMove = (play: PlayTurn) =>
    {
        let player = this.players.find((player: Player) => player.user.user_name === play.playerName) as Player;

        this.players.forEach((player: Player) => {
            if (player.user.user_name === play.playerName)
            {
                console.log(play.card)
                // remove the card from the player's hand
                player.hand = player.hand.filter((card: Card) => card.rank !== play.card.rank || card.suit_name !== play.card.suit_name || card.suit_symbol !== play.card.suit_symbol);

                // player's turn is over
                player.is_turn = false;

                // update the current card
                player.current_card = play.card;
            }
        });

        // add the play to the current round
        this.gameRounds[this.gameRounds.length - 1].plays.push(play);

        console.log("Round")
        console.log(this.gameRounds[this.gameRounds.length - 1]);

        // check if the round is over
        if (this.gameRounds[this.gameRounds.length - 1].plays.length === this.players.length)
        {
            console.log("Round over");
                
            // the round is over
            // determine the winner of the round
            let winner_name = this.getRoundWinner(this.gameRounds.length - 1);

            // determine the winner's id
            let winner = this.players.find((player: Player) => player.user.user_name === winner_name) as Player;

            let winner_id = winner.user.id;

            // update the score of the winner
            this.players[winner_id].score += 1;

            // update the current player
            this.currentPlayerId = winner_id;

            // update the current round number
            this.currentRoundNumber += 1;

            // add a new round
            this.gameRounds.push({
                plays: [],
                winner_id: -1
            });

            // check if the game is over
            try
            {
                let winner_ids = this.getGameWinner();

                this.players.forEach((player: Player) => {
                    player.user.socket.emit("   ", {
                        event: "game_over",
                        data: {
                            winner_ids: winner_ids
                        }
                    });
                });

                // update the winner's id
                this.gameRounds[this.gameRounds.length - 1].winner_id = winner_ids[0];
            }
            catch (e)
            {
                // the game is not over
            }

        }
        else
        {
            // the round is not over
            // update the current player
            this.currentPlayerId = this.players[(this.currentPlayerId + 1) % this.players.length].user.id;
        }

        // update the player's turn
        this.players.forEach((player: Player) => {
            if (player.user.id === this.currentPlayerId)
                player.is_turn = true;
        }
        );
    }

    /**
     * @remarks
     * Determines whether the game is over.
     * 
     * @returns Whether the game is over.
     * @param play - The play that was made by the player   
     */
    isGameOver = (play: PlayTurn) => {}; // TODO: Implement this function

    isRangSelected = () => {
        return this.RUNGsuit !== "";
    };

    getHand = (playerId: number) => {
        return this.getPlayerById(playerId)?.hand;
    }
};  

export default GameState;