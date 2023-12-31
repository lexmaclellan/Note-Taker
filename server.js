const express = require('express');
const path = require('path');
const fs = require('fs');
const uuid = require('uuid/v1');

const { readFromFile, writeToFile, readAndAppend } = require('./helpers/fsUtils');

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

// GET route for the homepage
app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

// GET route for notes page
app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);

// GET route for database
app.get('/api/notes', (req, res) => {
    console.info(`${req.method} request received to get data`);
    readFromFile('./db/notes.json').then((data) => res.json(JSON.parse(data)));
});

// GET route to catch all
app.get('*', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

// POST route for adding to database
app.post('/api/notes', (req, res) => {
    console.info(`${req.method} request received to add a note`);

    const { title, text } = req.body;

    if (req.body) {
        const newNote = {
            title,
            text,
            id : uuid()
        }

        readAndAppend(newNote, './db/notes.json');
        res.json("Note added successfully");
    } else {
        res.error("Error in adding note");
    }
})

// DELETE route for database content
app.delete('/api/notes/:id', (req, res) => {
    console.log(req.params.id);
    readFromFile('./db/notes.json').then((data) => {
        let parsedData = JSON.parse(data);
        let filteredNotes = parsedData.filter((note) => {
            return note.id !== req.params.id;
        })
        writeToFile('./db/notes.json', filteredNotes);
    });
    readFromFile('./db/notes.json').then((data) => res.json(JSON.parse(data)));
})

app.listen(PORT, () =>
    console.log(`App listening on port ${PORT}`)
);