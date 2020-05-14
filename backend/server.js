const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const basic = require('express-authentication-basic');
const authentication = require('express-authentication');
const mongoose = require('mongoose');
const path = require('path');
const config = require('./config');

// Configure environment secrets
dotenv.config();

// initialize app
const app = express();

// set port to be 5000 if dev
const port = process.env.PORT || 5000;

// Set up allowed origins
const allowedOrigins = [config.clientUrl];

// configure app to use bodyParser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({ origin: allowedOrigins }));

// // configure basic authentication
// const auth = authentication()
// const login = basic((challenge, callback) => {
//     if (challenge.username === process.env.ADMIN_USERNAME && challenge.password === process.env.ADMIN_PASSWORD) {
//         callback(null, true, { user: challenge.username });
//     } else {
//         callback(null, false, { error: 'INVALID LOGIN CREDENTIAL' });
//     }
// })

// const except = (middleware) => {
//     return (req, res, next) => {
//         if (req.headers.origin === config.clientUrl) {
//             return next();
//         } else {
//             return middleware(req, res, next);
//         }
//     }
// }

// app.use(except(auth));
// app.use(except(login));
// app.use(except(auth.required()));

// register routes
const router = express.Router();
require('./routes')(app, router);

// Serve the static files from the React admin-panel
app.use(express.static(path.join(__dirname, 'admin-panel/build')));

// Connect the admin panel
app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname + '/admin-panel/build/index.html'));
})

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