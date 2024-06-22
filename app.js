const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const connectionManager = require('./lib/mongoose.connection'); // Adjust the path if necessary
const indexRouter = require('./routes/index');
const tradesRouter = require('./routes/trades');

const app = express();

// Initialize database connection
connectionManager.getConnection()
    .then(() => {
        console.log('Database connected');
    })
    .catch(err => {
        console.error('Database connection failed', err);
    });

app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/trades', tradesRouter);
app.use('/', indexRouter);

app.use((req, res) => {
    res.status(404).json({ error: 'Not Found' });
});

// Add the server start code here
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;