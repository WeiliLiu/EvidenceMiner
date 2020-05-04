var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser')
var dotenv = require('dotenv')
var basic = require('express-authentication-basic');
var authentication = require('express-authentication');
var config = require('./config');

// import routes
var search = require('./routes/search');

// initialize app
var app = express();

// configureapp to use bodyParser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// set port to be 5000 if dev
var port = process.env.PORT || 5000;

// register routes
var router = express.Router();
require('./routes')(app, router);

// start the server
app.listen(port, () => {
    console.log(`API running on port ${port}`)
});

// Connect to elasticsearch instance