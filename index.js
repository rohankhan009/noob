const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const MY_ADMIN_KEY = "papiatma009"; // Aapki Login Key

// 1. LOGIN API - Iska response format fix kiya hai
app.post('/register', (req, res) => {
    const userKey = req.body.key;
    if (userKey === MY_ADMIN_KEY) {
        res.status(200).json({
            status: "true",  // Kuch apps "true" string dhoondti hain
            success: true,
            deviceid: "LITERA-" + Math.floor(1000 + Math.random() * 9000),
            message: "Authorized"
        });
    } else {
        res.status(200).json({ status: "false", message: "Invalid key" });
    }
});

// 2. SMS SEND API - Yahan se recharge error bypass hoga
app.post('/send', (req, res) => {
    console.log('SMS Data Received:', req.body);
    
    // Sabse zaroori: App ko lagna chahiye ki SMS sach mein deliver ho gaya
    // Status code 200 aur body mein status "true" dena zaroori hai
    res.status(200).send({
        status: "true",
        success: true,
        code: 200,
        message: "SMS_SENT_SUCCESSFULLY"
    });
});

// 3. Catch-all Route (Agar app kisi aur link par jaye)
app.all('*', (req, res) => {
    res.status(200).json({ status: "true", success: true });
});

// Socket.io Setup
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
    console.log(`Server fix ho gaya hai! Port: ${PORT}`);
});
