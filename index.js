require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const { userRouter } = require("./routes/user");
const { socialAccountRouter } = require("./routes/socialaccounts");

const app = express();
const PORT = process.env.PORT;

app.use(cors());

app.use(express.json());

app.use('/api/v1/user' , userRouter);
app.use('/api/v1/socialaccounts' , socialAccountRouter);

app.get("/" , (req , res) => {
    res.json({
        message: "The Backend is UP!",
        endpoints: [
            "/api/v1/user/signup",
            "/api/v1/user/signin",
            "/api/v1/socialaccounts/add",
            "/api/v1/socialaccounts/search"
        ]
    })
})

async function main() {
    await mongoose.connect(process.env.MONGO_URL);
    app.listen(PORT , () => {
        console.log(`BACKEND HOSTED: http://localhost:${PORT}`);
    });
    console.log("Backend Successfully Connected to the Database!");
}
main();