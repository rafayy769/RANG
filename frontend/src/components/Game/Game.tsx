import React, { useState, useContext } from "react";
import { UserContext } from "../../store";

// Networking and event handling
import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { Events } from "../../eventHandlers/Events";

// Routing
import { useNavigate } from "react-router-dom";

// Types
import { Card } from "../../types/card";
import { BasePlayer, Player } from "../../types/player";

// Styles
import "../../styles/playing-cards.css";
import "../../styles/rang.css";

// Components
import PlayerHandComponent from "./PlayerHandComponent";
import MessagesComponent from "./MessagesComponent";
import GameBoardComponent from "./GameBoardComponent";
import SelectRangComponent from "./SelectRangComponent";



interface GamePageProps {
  socket: Socket<DefaultEventsMap, DefaultEventsMap>;
}
function Game({ socket }: GamePageProps) {
  const navigate = useNavigate();
  const { user_id, setUser_id } = useContext(UserContext);

  // Sample starts
  let testCard: Card = { rank: "7", suit_name: "spades", suit_symbol: "♠" };
  let testCard2: Card = { rank: "8", suit_name: "spades", suit_symbol: "♠" };
  let playerHand: Card[] = [testCard, testCard2];
  let testMessages: Message[] = [
    { sender: "Esha", content: "Hello" },
    { sender: "Saood", content: "Hi" },
  ];
  let testPlayers: BasePlayer[] = [
    { name: "test1", current_card: testCard, score: 0, is_turn: false },
    { name: "test2", current_card: testCard2, score: 0, is_turn: false },
    { name: "test3", current_card: testCard, score: 0, is_turn: false },
  ];
  let testPlayer: Player = {
    name: "testMe",
    score: 0,
    is_turn: false,
    hand: playerHand,
    user_id: user_id,
    current_card: testCard,
  };

  const [players, setPlayers] = useState<BasePlayer[]>(testPlayers);
  const [myPlayer, setMyPlayer] = useState<Player>(testPlayer);
  const [playStarted, setPlayStarted] = useState<Boolean>(false);
  const [choosesRang, setChoosesRang] = useState<Boolean>(false);
  const [rang, setRang] = useState<String>("none");

  React.useEffect(() => {
    socket.on(Events.LOAD_STATE, (data: any) => {
      console.log("Received: ");
      console.log(data.data);

      setMyPlayer(data.data.myPlayer);
      setPlayers(data.data.players);
      setPlayStarted(data.data.playStarted);
    });

    socket.on(Events.SELECT_RANG, (data: any) => {
      setChoosesRang(true);
    });

    socket.emit(Events.GAME_STARTED, {
      event: Events.GAME_STARTED,
      data: {
        playerId: user_id,
      },
    });

    socket.on(Events.RANG_SELECTED, (data: any) => {
      console.log("Received");
      console.log(data.data);
      setChoosesRang(false);
      setRang(data.data.rang);
    });

    socket.on(Events.UPDATE_HAND, (data: any) => {
      console.log("Received update hand");
      console.log(data.data);
      setMyPlayer(data.data.myPlayer);
    });

    socket.on("update-players", (data: any) => {
      console.log("Received update players");
      console.log(data.data);
      setPlayers(data.data.players);
    });

    socket.on("round_winner", (data: any) => {
      console.log("Received round winner");
      console.log(data.data);
      alert(`${data.data.winner} won the round!`);
    });

    socket.on("game_over", (data: any) => {
      console.log("Received game winner");
      console.log(data.data);
      alert(`${data.data.winner} won the game!`);
    });

    return () => {
      socket.off(Events.LOAD_STATE);
      socket.off(Events.SELECT_RANG);
      socket.off(Events.RANG_SELECTED);
      socket.off(Events.UPDATE_HAND);
      socket.off("update-players");
      socket.off("round_winner");
    };
  }, [socket, user_id]);

  return (
    <div className="main-container playingCards">
      <div className="game-container">
        <div className="heading-container">
          <h1>Rang</h1>
        </div>
        <GameBoardComponent player={myPlayer} players={players} />
        {
          (!playStarted) ? 
          (
            choosesRang ?
            <SelectRangComponent player={myPlayer} socket={socket} setPlayStarted={setPlayStarted} setRang={setRang}/> : <></>
          ) : 
          (
            <h1>Rang: {rang}</h1>
          )
        }
      </div>
      <div className="messages-and-cards-container">
        <MessagesComponent player={myPlayer} socket={socket} />
        <PlayerHandComponent
          player={myPlayer}
          players={players}
          setPlayer={setMyPlayer}
          setPlayers={setPlayers}
          socket={socket}
        />
      </div>
    </div>
  );
}

export default Game;
