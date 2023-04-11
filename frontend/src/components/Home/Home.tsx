import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import "./Home.css";
import { useState } from "react";

//create an interface for the props that you want to pass to this component
interface HomePageProps {
  socket: Socket<DefaultEventsMap, DefaultEventsMap>; //this is the type for sockets
  //you can always add more functions/objects that you would like as props for this component
}

function HomePage({ socket }: HomePageProps) {
  const [name, setName] = useState("");

  //click handler
  const handleClick = (socket: Socket) => {
    console.log("Socket ID:", socket.id);
    // Do something with the socket object, such as emit an event
    socket.emit("join", { playerName: `${name}` });
  };

  return (
    <>
      <div className="HomePage">
        <h1 className="Title">RUNG</h1>
        <div className="UserName">
          <form>
            <label>
              Enter your name:
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
          </form>
            <button onClick={() => handleClick(socket)}>Submit</button>
        </div>
      </div>
    </>
  );
}
export default HomePage;
