import React, { useState } from 'react';
// import styled from 'styled-components';
import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import "./Home.css";
import { Events } from '../../eventHandlers/Events';

const styled = require('styled-components').default;
//create an interface for the props that you want to pass to this component
interface HomePageProps {
  socket: Socket<DefaultEventsMap, DefaultEventsMap>; //this is the type for sockets
  //you can always add more functions/objects that you would like as props for this component
}

const CONNECTION_HANDLER = 'connection';


function HomePage({ socket }: HomePageProps) {
    const [username, setUsername] = useState<string>('');
    const [numPlayers, setNumPlayers] = useState<number>(0);
    const [hasJoined, setHasJoined] = useState<boolean>(false);

    React.useEffect(() => {
        socket.on(Events.PLAYER_JOINED, (data) => 
        {
            // console.log("player joined: " + username);
            if (data.playerName === username) 
            {
              setHasJoined(true);
            }
            setNumPlayers(data.playerCount);
        });
        socket.on(Events.ERROR, (data) => {
            console.log("error: " + data.message);
            setHasJoined(false);
        });
    }, [socket, username]);
  
    const handleUsernameChange = (event: any) => {
      setUsername(event.target.value);
    };
  
    const handleStartGame = (socket: Socket) => {
        console.log("handleStartGame: " + username)
        socket.emit("join", {playerName: username.toString()});
    };
  
    return (
      <Container>
        <h1>!!!RUNG!!!</h1>
        <Greeting>Welcome to the Lobby</Greeting>
        { 
        hasJoined ? <p>{`${numPlayers} players have joined so far.`}</p> :
        <div>
          <InputWrapper>
            <InputLabel>Please enter your username:</InputLabel>
            <InputField type="text" value={username} onChange={handleUsernameChange} />
          </InputWrapper>
          <Button onClick={() => handleStartGame(socket)}>Join Lobby</Button>
        </div>
        }
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