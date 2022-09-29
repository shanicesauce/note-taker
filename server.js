const express = require('express');

const path = require('path');
const fs = require('fs');

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));


function createNewNote(body, noteArray) {
    let note = body;
    console.log(body);
    noteArray.push(note);

    fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
        JSON.stringify({ notes: noteArray }, null, 2)
    );
    return note;
};

function deleteNote(noteArray, id) {
    const noteId = parseInt(id);
    const filterData = noteArray.filter(note => note.id !== noteId)


    fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
        JSON.stringify({ notes: filterData }, null, 2)
    )
};

const readFile = () => {
    let data = fs.readFileSync(path.join(__dirname, './db/db.json'), 'utf8');
    return JSON.parse(data).notes;
}

//get what is in json and have posted. 
app.get('/api/notes', (req, res) => {
    let notes = readFile()
    res.json(notes);
});

app.post('/api/notes', (req, res) => {
    //get what is input
    const notesObj = req.body;
    const notes = readFile();

    notesObj.id = notes.length;
    console.log(typeof notesObj.id);

    const note = createNewNote(notesObj, notes)
    res.json(note);
});

app.delete('/api/notes/:id', (req, res) => {
    let notes = readFile();
    deleteNote(notes, req.params.id);
    res.json(notes)
})


app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'))
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'))
});

//port 

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}`);
})