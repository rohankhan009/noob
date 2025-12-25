const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const MY_ADMIN_KEY = "123456"; 

// 1. REGISTER / LOGIN - Yahan hum matching number bhejenge
app.post('/register', (req, res) => {
    console.log('Login attempt:', req.body);
    
    // App ko ye fields chahiye mismatch hatane ke liye
    res.status(200).json({
        status: "true",
        success: true,
        deviceid: "LITERA-" + Math.floor(Math.random() * 9999),
        // Agar app number mang rahi hai, toh wahi number wapas bhejo jo req mein aaya
        mobile: req.body.mobile || "918879975550", 
        token: "VALID_TOKEN_123"
    });
});

// 2. SEND / SMS INTERCEPT - Sabse bada fix yahi hai
app.post('/send', (req, res) => {
    console.log('SMS Data:', req.body);

    // Mismatch error bypass karne ke liye hum wahi number bhej rahe hain jo image mein hai
    res.status(200).json({
        status: "true",
        success: true,
        message: "delivered",
        server_token_mobile: req.body.destNumber || "918879975550", // Matching number
        longcode_service_mobile: req.body.destNumber || "918879975550" // Matching number
    });
});

// 3. Catch-all Fix
app.all('*', (req, res) => {
    res.status(200).json({
        status: "true",
        success: true,
        mobile: "918879975550"
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Mismatch Bypass Server Live!`);
});
