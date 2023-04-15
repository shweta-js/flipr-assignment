const express = require('express');
const app = express();
const env=require('dotenv').config();

const bodyParser = require('body-parser');

// Parse JSON request body
app.use(bodyParser.json());



app.get('/',(req,res)=>{
    res.send("hell from node inside docker")
});

const mongoose = require("mongoose");


mongoose.connect(process.env.MONGODB_URI,{useNewUrlParser: true});


const noteSchema = {
  noteName: String,
  noteBody:String
};
const Note = mongoose.model("Note", noteSchema);



// Create a note
app.post('/notes', async (req, res) => {
  try {
    const { noteName, noteBody } = req.body;
    const newNote = new Note({ noteName, noteBody });
    const savedNote = await newNote.save();
    res.status(201).json(savedNote);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all notes
app.get('/notes', async (req, res) => {
  try {
    const notes = await Note.find();
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a note by ID
app.get('/notes/:id', async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }
    res.json(note);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a note by ID
app.put('/notes/:id', async (req, res) => {
  try {
    const { noteName, noteBody } = req.body;
    const updatedNote = await Note.findByIdAndUpdate(req.params.id, { noteName, noteBody }, { new: true });
    if (!updatedNote) {
      return res.status(404).json({ error: 'Note not found' });
    }
    res.json(updatedNote);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a note by ID
app.delete('/notes/:id', async (req, res) => {
  try {
    const note = await Note.findByIdAndDelete(req.params.id);
    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }
    res.json({ message: 'Note deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});





let port = process.env.PORT;
if(port == null || port== ""){
  port = 3000;

}

app.listen(port, function() {
  console.log("Server started Successfully");
});



