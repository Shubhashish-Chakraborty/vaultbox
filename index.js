require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');

const { userRouter } = require("./routes/user");

const app = express();
const PORT = process.env.PORT;

app.use(express.json());

app.use('/api/v1/user' , userRouter);

async function main() {
    await mongoose.connect(process.env.MONGO_URL);
    app.listen(PORT , () => {
        console.log(`BACKEND HOSTED: http://localhost:${PORT}`);
    });
    console.log("Backend Successfully Connected to the Database!");
}
main();