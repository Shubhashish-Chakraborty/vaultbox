require('dotenv').config();

const express = require('express');

const app = express();
const PORT = process.env.PORT;

app.get('/' , (req , res) => {
    res.json({message: "STARTED WITH!"})
})


app.listen(PORT , () => {
    console.log(`BACKEND HOSTED: http://localhost:${PORT}`);
})