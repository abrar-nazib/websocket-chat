const path = require('path');
const http = require("http");
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const botName = 'ChatChordBot';

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set the static server
app.use(express.static(path.join(__dirname, 'public')));

// Run when a client connects
io.on('connection', socket => {
    console.log("New Websocket connection occured");

    // Welcome the current user
    socket.emit('message', formatMessage(botName, 'Welcome to the chat!'));  // Send a message to the client. Single client who is connecting to the server

    // Broadcast when a user connects. Difference: Will send to everyone except the user who is connecting
    socket.broadcast.emit('message', formatMessage(botName, 'A user has joined the chat'));


    // Broadcast to everybody
    // io.emit() 

    // Runs when client disconnects
    socket.on('disconnect', () => {
        io.emit('message', formatMessage(botName, 'A user has left the chat'));
    });

    // Listen for chat message
    socket.on('chatMessage', (msg) => {
        io.emit('message', formatMessage('USER', msg));
    });
}
);

const port = process.env.PORT || 5000;

server.listen(port, () => console.log(`Server running on port ${port}`));