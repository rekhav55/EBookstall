const mongoose = require('mongoose');
const url = 'mongodb://localhost:27017/Books';

// connect to database.
mongoose.connect(url,{ useNewUrlParser: true });
// opt to use Global Promise library.
mongoose.Promise = global.Promise;
// connection for us to use.
const db = mongoose.connection;
// to get errors.
db.on('error', console.error.bind(console, 'DB Error: '));

module.exports = { db, mongoose };