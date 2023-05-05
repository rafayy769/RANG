import React, { useEffect, useState, useContext } from "react";

// Networking and event handling
import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { Events } from "../../eventHandlers/Events";

// Types
import { Player } from "../../types/player";

// Styles
import "../../styles/playing-cards.css";
import "../../styles/rang.css";

interface SelectRangProps {
  player: Player;
  socket: Socket<DefaultEventsMap, DefaultEventsMap>;
  setPlayStarted: React.Dispatch<React.SetStateAction<Boolean>>;
  setRang: React.Dispatch<React.SetStateAction<String>>;
}
function SelectRangComponent({ player, socket, setPlayStarted, setRang }: SelectRangProps) {
  const [selectedRang, setSelectedRang] = useState<Boolean>(false);

  const handleClick = (rang: string) => {
    if (selectedRang) return;
    setSelectedRang(true);
    setPlayStarted(true);
    setRang(rang);
    alert(`You selected ${rang} rang.`);

    socket.emit(Events.RANG_SELECTED, {
      event: Events.RANG_SELECTED,
      data: {
        playerId: player.user_id,
        playerName: player.name,
        rang: rang,
      },
    });
  };

  return (
    <div className="select-rang-container">
      <h3>Select Rang:</h3>
      <button
        className="button-select-rang"
        onClick={() => handleClick("diams")}
      >
        Diamond
      </button>
      <button
        className="button-select-rang"
        onClick={() => handleClick("hearts")}
      >
        Hearts
      </button>
      <button
        className="button-select-rang"
        onClick={() => handleClick("spades")}
      >
        Spades
      </button>
      <button
        className="button-select-rang"
        onClick={() => handleClick("clubs")}
      >
        Clubs
      </button>
    </div>
  );
}

export default SelectRangComponent;