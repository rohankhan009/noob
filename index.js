const express = require('express');
const app = express();

app.use(express.json()); // JSON data ke liye
app.use(express.urlencoded({ extended: true })); // Form data ke liye

// Ye function har request ko handle karega, chahe URL kuch bhi ho
app.all('*', (req, res) => {
    console.log(`\n--- Nayi Request Aayi ---`);
    console.log(`Method: ${req.method}`); // GET hai ya POST
    console.log(`Path: ${req.path}`);     // /send hai ya kuch aur
    console.log(`Data:`, req.body);      // App ne kya bheja

    // App ko hamesha Success bhejna taaki wo ruke nahi
    res.status(200).json({
        status: "success",
        success: true,
        message: "Request Processed"
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server fix ho gaya hai! Port: ${PORT}`);
});
