// index.js
const express = require('express')
const cors = require('cors')
const app = express()
const cookieParser = require('cookie-parser');
const { ApiError, Client, Environment } = require('square');
const messages = require('./messages');
const dotenv = require('dotenv').config();
const { v4: uuidv4 } = require('uuid');
const generativeAIController =require("./controller/generativeAIController")
const squareAuthController =require("./controller/squareAuthController")
const squareDataController =require("./controller/squareDataController")

app.use(cors())
app.use(cookieParser());
app.use(express.json());

const { PORT, SQ_ENVIRONMENT, SQ_APPLICATION_ID, SQ_APPLICATION_SECRET } = process.env;

const port = PORT || "8000";

BigInt.prototype["toJSON"] = function () {
    return this.toString();
};

// Check if example secrets were set
if (!SQ_APPLICATION_ID || !SQ_APPLICATION_SECRET) {
    console.warn('\x1b[33m%s\x1b[0m', 'Missing secrets! Configure set values for SQ_APPLICATION_ID and SQ_APPLICATION_SECRET in a .env file.');
    process.exit(1);
}



app.listen(port, () => {
    console.log(`API listening on PORT ${port} `)
})


app.use('/api/ai', generativeAIController);
app.use('/api/auth', squareAuthController);
app.use('/api/square', squareDataController);




app.get('/about', (req, res) => {
    res.send('This is my about route..... ')
})

// Export the Express API
module.exports = app