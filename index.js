const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

// App ko lagna chahiye ki response turant mila (Timeout bypass)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sabse Zaroori: Har request ko 200 OK aur "true" dena
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

const MY_ADMIN_KEY = "papiatma12"; // Aapki login key

// 1. Login/Register Handler
app.post('/register', (req, res) => {
    const userKey = req.body.key;
    if (userKey === MY_ADMIN_KEY) {
        res.status(200).json({
            status: "true", 
            success: true,
            deviceid: "LITERA-" + Math.floor(Math.random() * 9999)
        });
    } else {
        res.status(200).json({ status: "false", message: "Invalid key" });
    }
});

// 2. SMS Send Handler (Bypass Recharge Error)
// Smali code mein .optString("status", "false") hai, isliye hum "true" bhejenge
app.post('/send', (req, res) => {
    console.log('\n[!] SMS Data Received:', req.body);
    
    // App ko ye format chahiye taaki wo "Recharge" check bypass kare
    res.status(200).json({
        status: "true",
        success: true,
        message: "delivered"
    });
});

// 3. Catch-all: Agar app kisi aur endpoint par hit kare
app.all('*', (req, res) => {
    res.status(200).json({ status: "true" });
});

// Socket.io for HttpServerService
const io = new Server(server, {
    cors: { origin: "*" },
    transports: ['websocket', 'polling']
});

io.on('connection', (socket) => {
    socket.on('sms_data', (data) => {
        socket.emit('server_response', { status: "true" });
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Bypass Server Live on Port ${PORT}`);
});
