import React from 'react';
import logo from './logo.svg';
import HomePage from './components/Home/Home';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import {io} from "socket.io-client"
const socket = io('http://localhost:3001',{ transports: ["websocket"] });
socket.connect()

function App() {
  return (
    <div className="App">
      <header className="App-header">
      <Router>
        <Routes>
          <Route path="/" element={<HomePage socket={socket} />} />
        </Routes>
      </Router>
      </header>
    </div>
  );
}

export default App;
