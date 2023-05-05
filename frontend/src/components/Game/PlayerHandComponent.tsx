import React, { useEffect, useState, useContext } from "react";
// import styled from 'styled-components';
import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { Events } from "../../eventHandlers/Events";

import { Card } from "../../types/card";
import { BasePlayer, Player } from "../../types/player";

import "../../styles/playing-cards.css";
import "../../styles/rang.css";

import CardComponent from "./CardComponent";

interface playerHandComponentProps {
  player: Player;
  players: BasePlayer[];
  setPlayer: Function;
  setPlayers: Function;
  socket: Socket<DefaultEventsMap, DefaultEventsMap>;
}
function PlayerHandComponent({
  player,
  players,
  setPlayer,
  setPlayers,
  socket,
}: playerHandComponentProps) {
  // effects
  React.useEffect(() => {
    socket.on(Events.ERROR, (data) => {
      alert(data.data.message);
    });

    return () => {
      // socket.off(Events.VALID_MOVE);
      socket.off(Events.ERROR);
    };
  }, [socket, player]);

  // function to handle click on card
  function handleClick(card: Card) {
    socket.emit(Events.CARD_PLAYED, {
      event: Events.CARD_PLAYED,
      data: {
        playerName: player.name,
        card: card,
      },
    });
  }

  // returns the component
  return (
    <div className="right-side-container my-cards-container">
      <h1>Your Hand</h1>
      <div className="my-cards-inner-container">
        <ul className="hand">
          {player.hand.map((card: Card) => (
            <li key={card.rank + card.suit_name}>
              <CardComponent
                card={card}
                myHand={true}
                handleClick={handleClick}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default PlayerHandComponent;