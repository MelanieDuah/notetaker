const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;
const fs = require('fs');
const filesPath = path.join(__dirname, 'public');

app.use(express.static(filesPath));
app.use(bodyParser.urlencoded());


app.get('/', (req, res, next) => {
   res.sendFile('index.html', { root: filesPath });
});

app.get('/notes', (req, res, next) => {
   res.sendFile('notes.html', { root: filesPath });
});

app.get('/api/notes', (req, res, next) => {
   fs.readFile(path.join(__dirname, '/db/db.json'), 'utf8', (err, existingNotesJson) => {
      if (err) throw err;

       res.json(existingNotesJson);
   });
});

app.post('/api/notes', (req, res, next) => {

   let newNote = {
      title: req.body.title,
      text: req.body.text,
   };

   fs.readFile(path.join(__dirname, '/db/db.json'), 'utf8', (err, existingNotesJson) => {
      if (err) throw err;

      let arrayOfNotes = [];

      if(existingNotesJson)
        arrayOfNotes = JSON.parse(existingNotesJson);

      newNote.id = arrayOfNotes.length + 1;
      arrayOfNotes.push(newNote);

      fs.writeFile(path.join(__dirname, "/db/db.json"), JSON.stringify(arrayOfNotes, null, '\t'), (err) => {
         if (err) throw err;
      });

      res.json(JSON.stringify(newNote));
   });

});

app.delete('/api/notes/:id', (req, res, next) => {

   let id = req.params.id;
 
   fs.readFile(path.join(__dirname, '/db/db.json'), 'utf8', (err, existingNotesJson) => {
      if (err) throw err;

      let arrayOfNotes = [];

      if(existingNotesJson)
        arrayOfNotes = JSON.parse(existingNotesJson);

      arrayOfNotes = arrayOfNotes.filter(note => note.id != id);

      fs.writeFile(path.join(__dirname, "/db/db.json"), JSON.stringify(arrayOfNotes, null, '\t'), (err) => {
         if (err) throw err;
      });

      res.end();
   });

});



app.listen(port, () => console.log(`We're live on ${port}`));
