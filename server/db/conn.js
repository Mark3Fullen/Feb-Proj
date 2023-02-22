const mongoose = require('mongoose');
require("dotenv").config({ path: "./config.env" });

const URI = process.env.MONGODB_URI;

const connectToDB = async () => {
    
    try {
        await mongoose.connect(URI,  {useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Connected to MongoDB');
        return mongoose.connection;
    } catch (err) {
        console.error('Failed to connect to MongoDB', err);
        process.exit(1);
    }

};

module.exports = connectToDB;