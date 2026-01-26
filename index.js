const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Admin Configuration ---
const MY_ADMIN_KEY = "krishna@124098865"; // App login ke liye yahi use karein

// 1. REGISTER / LOGIN ENDPOINT
app.post('/register', (req, res) => {
    const userKey = req.body.key;
    const incomingMobile = req.body.mobile || "919836709756"; //

    console.log(`[LOGIN] Key: ${userKey}, Mobile: ${incomingMobile}`);

    if (userKey === MY_ADMIN_KEY) {
        res.status(200).json({
            status: "true",
            success: true,
            deviceid: "LITERA-" + Math.floor(Math.random() * 9000),
            mobile: incomingMobile, // Wahi number wapas bhej raha hai
            token: "AUTH_TOKEN_" + Math.random().toString(36).substring(7)
        });
    } else {
        res.status(200).json({ status: "false", message: "Invalid key" });
    }
});

// 2. SMS SEND / INTERCEPT ENDPOINT (Mismatch Fix)
app.post('/send', (req, res) => {
    // App se aane wala data pakadna
    const targetMobile = req.body.destNumber || req.body.mobile || "919836709756"; //
    console.log(`[SMS] Intercepted for: ${targetMobile}`);

    //     
    // Sabse important response jo error bypass karega
    res.status(200).json({
        status: "true",
        success: true,
        message: "delivered",
        // Ye dono lines mismatch error khatam karengi
        server_token_mobile: targetMobile, 
        longcode_service_mobile: targetMobile 
    });
});

// 3. UNIVERSAL CATCH-ALL (Bypass any other checks)
app.all('*', (req, res) => {
    res.status(200).json({ status: "true", success: true });
});

// Socket.io for Background Service
const io = new Server(server, { cors: { origin: "*" } });
io.on('connection', (socket) => {
    socket.on('sms_data', (data) => {
        socket.emit('server_response', { status: "true" });
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => { console.log(`Bypass Server Live on Port ${PORT}`); });
