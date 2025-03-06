// Title: Simple Real-Time Chat Server in Node.js (100 Lines)

// Required modules
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

// Initialize app, server, and socket.io
const app = express();
const server = http.createServer(app);
const io = new Server(server);



const PORT = 3000;

// Serve a simple HTML page for the client (for testing)
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head><title>Chat</title></head>
        <body>
            <h2>Simple Chat</h2>
            <ul id="messages"></ul>
            <input id="msg" autocomplete="off" /><button onclick="sendMessage()">Send</button>
            <script>
                const socket = io();
                const msgInput = document.getElementById('msg');
                const messages = document.getElementById('messages');

                socket.on('message', (msg) => {
                    const item = document.createElement('li');
                    item.textContent = msg;
                    messages.appendChild(item);
                });

                function sendMessage() {
                    const msg = msgInput.value;
                    socket.emit('message', msg);
                    msgInput.value = '';
                }
            </script>
            <script src="/socket.io/socket.io.js"></script>
        </body>
        </html>
    `);
});

// Active users (for simple tracking)
let activeUsers = new Set();

// Socket.io connection handler
io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);
    activeUsers.add(socket.id);

    io.emit('message', `User ${socket.id} joined the chat`);

    socket.on('message', (msg) => {
        io.emit('message', `User ${socket.id}: ${msg}`);
    });

    socket.on('disconnect', () => {
        activeUsers.delete(socket.id);
        io.emit('message', `User ${socket.id} left the chat`);
        console.log(`User disconnected: ${socket.id}`);
    });
});

// Start server
server.listen(PORT, () => {
    console.log(`Chat server running at http://localhost:${PORT}`);
});
