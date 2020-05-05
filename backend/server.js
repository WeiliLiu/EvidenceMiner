const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser')
const dotenv = require('dotenv')
const basic = require('express-authentication-basic');
const authentication = require('express-authentication');
const mongoose = require('mongoose');
const config = require('./config');

// import routes
const search = require('./routes/search');

// initialize app
const app = express();

// configureapp to use bodyParser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// set port to be 5000 if dev
const port = process.env.PORT || 5000;

// register routes
const router = express.Router();
require('./routes')(app, router);

// start the server
app.listen(port, () => {
    console.log(`API running on port ${port}`)
});

// Connect to mongodb instance
mongoose.connect(config.dbUrl, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
});
mongoose.connection.on('error', (err) => {
    console.error(`Could not connect to the database:\n${err}`);
});
mongoose.connection.once('open', () => {
    console.log('Connected to the database.');
});