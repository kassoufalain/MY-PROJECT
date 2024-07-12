const Note = require('../models/noteModel'); // Assuming Note model is correctly imported

// Get all notes associated with a userId
const getNotes = async (req, res) => {
  try {
    const userId = req.user.id; // Retrieve userId from authenticated user
    const notes = await Note.find({ userId }); // Query notes associated with userId
    res.json(notes);
  } catch (error) {
    console.error('Error fetching notes:', error);
    res.status(500).json({ error: 'Error fetching notes' });
  }
};

// Add a new note associated with a userId
const addNote = async (req, res) => {
  try {
    const { description } = req.body;
    const userId = req.user.id; // Retrieve userId from authenticated user

    const newNote = new Note({
      description,
      userId, // Associate the note with userId
      completed: false, // Assuming default value for completed
    });

    const savedNote = await newNote.save();
    res.status(201).json(savedNote);
  } catch (error) {
    console.error('Error adding note:', error);
    res.status(500).json({ error: 'Error adding note' });
  }
};

// Delete a note by note id and userId
const deleteNote = async (req, res) => {
  try {
    const { id, userId } = req.params;
    await Note.findOneAndDelete({ _id: id, userId });
    res.status(204).end();
  } catch (error) {
    console.error('Error deleting note:', error);
    res.status(500).json({ error: 'Error deleting note' });
  }
};

// Update a note by id
const updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { description, completed } = req.body;
    const updatedNote = await Note.findByIdAndUpdate(
      id,
      { description, completed },
      { new: true }
    );
    res.json(updatedNote);
  } catch (error) {
    console.error('Error updating note:', error);
    res.status(500).json({ error: 'Error updating note' });
  }
};

module.exports = {
  getNotes,
  addNote,
  deleteNote,
  updateNote,
};
