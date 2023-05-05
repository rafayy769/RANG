import React from "react";
// import logo from './logo.svg';
import HomePage from "./components/Home/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import { io } from "socket.io-client";
import Game from "./components/Game/Game";
import { Events } from "./eventHandlers/Events";
import { UserContext } from "./store/index";

const socket = io("http://localhost:3001", { transports: ["websocket"] });
socket.connect();

function App() {
  const [user_id, setUser_id] = React.useState<string>("");

  return (
    <UserContext.Provider value={{ user_id, setUser_id }}>
      <div className="damn">
        <Router>
          <Routes>
            <Route path="/" element={<HomePage socket={socket} />} />
            <Route path="/game" element={<Game socket={socket} />} />
            <Route path="/game_over" element={<div>Game Over</div>} />
          </Routes>
        </Router>
      </div>
    </UserContext.Provider>
  );
}

export default App;
