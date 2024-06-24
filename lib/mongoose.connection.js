const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const ConnectionBase = require('./connection-base');
const Trades = require('../models/trades');

mongoose.Promise = Promise;

const mongoServer = new MongoMemoryServer();

const connect = async () => {
    try {
        await mongoServer.start();
        const mongoUri = mongoServer.getUri();
        const mongooseOpts = {
            useNewUrlParser: true,
            useUnifiedTopology: true
        };

        await mongoose.connect(mongoUri, mongooseOpts);

        mongoose.connection.on('error', (e) => {
            console.log(e);
            if (e.message.code === 'ETIMEDOUT') {
                mongoose.connect(mongoUri, mongooseOpts);
            }
        });

        mongoose.connection.once('open', () => {
            console.log(`MongoDB successfully connected to ${mongoUri}`);
        });

        return mongoose;
    } catch (error) {
        console.error('Failed to connect to MongoDB', error);
        throw error;
    }
};

class MongooseConnection extends ConnectionBase {
    getConnection() {
        if (this.promise) {
            return this.promise;
        }
        this.promise = connect()
            .then(connection => {
                this.connection = connection;
                return connection;
            });
        return this.promise;
    }

    async clearDatabase() {
        return Trades.deleteMany();
    }

    async closeConnection() {
        if (this.connection) {
            await mongoose.disconnect();
            await mongoServer.stop();
        }
    }
}

module.exports = new MongooseConnection();
