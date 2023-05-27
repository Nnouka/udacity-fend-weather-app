// Setup empty JS object to act as endpoint for all routes
projectData = {};

// Require Express to run server and routes
const express = require('express');
// require body parser
const bodyParser = require('body-parser');
// require cors
const cors = require('cors');
// Start up an instance of app
const port = 8000;
const app = express();

/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
app.use(cors());

// Initialize the main project folder
app.use(express.static('website'));


// Setup Server
app.listen(port, () => {
    console.log(`Server started. Listening on port: ${port}`);
});

// setup routes
const baseUrl = '/api'
app.get(`${baseUrl}/all`, (_, res) => {
    res.send(projectData);
});
app.post(`${baseUrl}/data`, (req, res) => {
    const body = req.body;
    if (body.key) {
        projectData[body.key] = body;
    } else {
        projectData["default"] = body;
    }
    res.send(projectData);
});
