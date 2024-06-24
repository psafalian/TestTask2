
const MongooseConnection = require('./lib/mongoose.connection');
const connectionManager = new MongooseConnection();

module.exports = connectionManager;
