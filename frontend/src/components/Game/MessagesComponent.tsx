import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { Events } from "../../eventHandlers/Events";
import { BasePlayer, Player } from "../../types/player";

import "../../styles/playing-cards.css";
import "../../styles/rang.css";

interface MessagesComponentProps {
  player: Player;
  socket: Socket<DefaultEventsMap, DefaultEventsMap>;
}
function MessagesComponent({ player, socket }: MessagesComponentProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [typedMessage, setTypedMessage] = useState<string>("");

  useEffect(() => {
    socket.on(Events.MESSAGE, (data: any) => {
      let sender =
        data.data.playerName === player.name ? "You" : data.data.playerName;

      let message = {
        sender: sender,
        content: data.data.message,
      };

      setMessages((messages: Message[]) => [message, ...messages]);
    });

    return () => {
      socket.off(Events.MESSAGE);
    };
  }, [socket, player.name]);

  return (
    <div className="right-side-container messages-container">
      <h1>Messages</h1>
      <div className="message-box">
        {messages.map((message) => {
          return (
            <div className="message-content-container">
              {`${message.sender}: ${message.content}`}
            </div>
          );
        })}
      </div>
      <div className="send-message-container">
        <input
          type="text"
          value={typedMessage}
          onChange={(e) => setTypedMessage(e.target.value)}
        ></input>
        <button
          className="button-select-rang"
          onClick={() => {
            alert(`${typedMessage} sent.`);
            setTypedMessage("");
            let eventData = {
              event: Events.MESSAGE,
              data: {
                playerName: player.name,
                message: typedMessage,
              },
            };
            socket.emit(Events.MESSAGE, eventData);
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default MessagesComponent;