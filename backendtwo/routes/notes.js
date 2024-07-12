const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/requireAuth'); // Ensure the path to requireAuth is correct

const {
  getNotes,
  addNote,
  deleteNote,
  updateNote,
} = require('../controllers/noteController'); // Ensure the path to noteController is correct

router.get('/', requireAuth, getNotes); // GET all notes
router.post('/', requireAuth, addNote); // Add a new note
router.delete('/:id', requireAuth, deleteNote); // Delete a note
router.put('/:id', requireAuth, updateNote); // Update a note

module.exports = router;
