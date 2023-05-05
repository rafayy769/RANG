import React, { useState, useContext } from "react";
import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import "./Home.css";
import { Events } from "../../eventHandlers/Events";
import { useNavigate } from "react-router-dom";

import { UserContext } from "../../store/index";

const styled = require("styled-components").default;
//create an interface for the props that you want to pass to this component
interface HomePageProps {
  socket: Socket<DefaultEventsMap, DefaultEventsMap>; //this is the type for sockets
  //you can always add more functions/objects that you would like as props for this component
}

function HomePage({ socket }: HomePageProps) 
{
  const [username, setUsername] = useState<string>("");
  const [numPlayers, setNumPlayers] = useState<number>(0);
  const [hasJoined, setHasJoined] = useState<boolean>(false);
  const { user_id, setUser_id } = useContext(UserContext);
  
  const navigate = useNavigate();

  React.useEffect(() => 
  {
    socket.on(Events.PLAYER_JOINED, (data) => {
      if (!hasJoined && data.playerName === username) 
      {
        setHasJoined(true);
        setUser_id(data.playerID.toString());
        // console.log("player's id given is : ", data.playerID)
        // console.log("player joined with id : ", user_id);
      }
      setNumPlayers(data.playerCount);
    });

    socket.on(Events.GAME_STARTED, (data) => {
      console.log("game started");
      navigate("/game");
    });
  }, [socket, username, navigate, setUser_id, hasJoined]);

  React.useEffect(() => {
    socket.on(Events.ERROR, (error_msg) => {
      alert(error_msg.data);
    });

    return () => {
      socket.off(Events.ERROR);
    };
  }, [socket]);

  const handleUsernameChange = (event: any) => {
    setUsername(event.target.value);
  };

  const handleStartGame = (socket: Socket) => {
    console.log("handleStartGame: " + username);
    socket.emit(Events.PLAYER_JOINED, {
      playerName: username.toString(),
    });
  };

  return (
    <Container>
      <h1>RUNG</h1>
      <Greeting>Welcome to the Lobby</Greeting>
      {hasJoined ? (
        <>
        <p>{`${numPlayers} players have joined so far.`}</p>
        <p>{`Your username is ${username}`}</p>
        <p>{`Your user id is ${user_id}`}</p>
        </>
      ) : (
        <div>
          <InputWrapper>
            <InputLabel>Please enter your username:</InputLabel>
            <InputField
              type="text"
              value={username}
              onChange={handleUsernameChange}
            />
          </InputWrapper>
          <Button onClick={() => handleStartGame(socket)}>Join Lobby</Button>
        </div>
      )}
    </Container>
  );
}

export default HomePage;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

const Greeting = styled.h1`
  font-size: 3rem;
  margin-bottom: 2rem;
`;

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
`;

const InputLabel = styled.label`
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
`;

const InputField = styled.input`
  font-size: 1.2rem;
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #ccc;
`;

const Button = styled.button`
  font-size: 1.2rem;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  border: none;
  background-color: #333;
  color: #fff;
  cursor: pointer;
`;
