const express = require('express');
const path = require('path');
const fs = require('fs');

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

// GET route for the homepage
app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

// GET route to catch all
app.get('*', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

// GET route for notes page
app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);

// GET request for database
app.get('/api/notes', (req, res) => {
    res.json(`${req.method} request received to get data`);

    console.info(`${req.method} request received to get data`);
});

app.listen(PORT, () => console.log(`App listening on port ${PORT}`));