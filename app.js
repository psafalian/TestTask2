const express = require('express');
const bodyParser = require('body-parser');
const connectionManager = require('./connection'); // Ensure this path is correct
const tradesRouter = require('./routes/trades');

const app = express();

app.use(bodyParser.json());
app.use('/trades', tradesRouter);

connectionManager.getConnection() // Ensure connection is established when app starts
    .then(() => {
        console.log('Database connected');
    })
    .catch(err => {
        console.error('Database connection error:', err);
    });

module.exports = app;
