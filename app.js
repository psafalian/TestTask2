const express = require('express');
const bodyParser = require('body-parser');
const connectionManager = require('./connection'); 
const tradesRouter = require('./routes/trades');

const app = express();

app.use(bodyParser.json());
app.use('/trades', tradesRouter);

connectionManager.getConnection() 
    .then(() => {
        console.log('Database connected');
    })
    .catch(err => {
        console.error('Database connection error:', err);
    });

module.exports = app;
