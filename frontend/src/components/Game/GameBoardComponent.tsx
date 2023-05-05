import React, { useEffect, useState, useContext } from "react";
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
import CardComponent from "./CardComponent";

interface GameBoardComponentProps {
  players: BasePlayer[];
  player: Player;
}
function GameBoardComponent({ players, player }: GameBoardComponentProps) {
  return (
    <div className="game-table-container">
      <div className="game-table">
        <div className="card-area">
          <div className="card-area-rows output-row-one">
            <CardComponent
              card={players[1].current_card}
              myHand={false}
              handleClick={(card: Card) => {}}
            />
          </div>
          <div className="card-area-rows output-row-two">
            <CardComponent
              card={players[0].current_card}
              myHand={false}
              handleClick={(card: Card) => {}}
            />
            <CardComponent
              card={players[2].current_card}
              myHand={false}
              handleClick={(card: Card) => {}}
            />
          </div>
          <div className="card-area-rows output-row-three">
            <CardComponent
              card={player.current_card}
              myHand={false}
              handleClick={(card: Card) => {}}
            />
          </div>
        </div>
        <div className="game-players-container">
          <div className="player-tag player-one">{player.name}</div>
        </div>
        <div className="game-players-container">
          <div className="player-tag player-two">{players[0].name}</div>
        </div>
        <div className="game-players-container">
          <div className="player-tag player-three">{players[1].name}</div>
        </div>
        <div className="game-players-container">
          <div className="player-tag player-four">{players[2].name}</div>
        </div>
      </div>
    </div>
  );
}

export default GameBoardComponent;