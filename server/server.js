const express = require("express");
const mongoose = require("mongoose");
const connectToDB = require('./db/conn');
const app = express();

const cors = require("cors");
require("dotenv").config({ path: "./config.env" });

const port = process.env.PORT || 5000;
const userRouter = require('./routes/User');

app.use(cors());
app.use(express.json());
app.use('/user', userRouter);

connectToDB()
    .then(() => {
        app.listen(port, () => {
            console.log(`Server listening on port ${port}`);
        });
    })
    .catch(err => {
        console.error('Failed to connect to MongoDB', err);
    });

