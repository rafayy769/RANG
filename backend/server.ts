const { Socket } = require( "socket.io");

const express = require("express");
const app = express();
const http = require("http");
const {Server} = require('socket.io')
const cors = require('cors')

app.use(cors())
const server = http.createServer(app)
const io = new Server(
    server,{cors:{
        origin:"http://localhost:3001",
        methods: ["GET", "POST"]
    },
})

server.listen(3001, ()=>{
    console.log("SERVER IS LISTENING ON PORT 3001")
})

let users = []

io.on("connection",(socket)=>{
    console.log("user connected with a socket id", socket.id)
    //add custom events here
    socket.on("join",(myData)=>{
        console.log('Received myMessage:', myData);
    })

    // if(users.length < 4){
    //     users.push(socket)
    //     console.log(users)
    // }
    // else
    // {
    //     console.log("Game is full, start the game")
    //     socket.emit("startGame", "Game is full")
    // }

})
