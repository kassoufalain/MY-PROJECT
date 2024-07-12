import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Note {
  _id: string;
  description: string;
  completed: boolean;
}

const Notes: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNoteTitle, setNewNoteTitle] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const userId = localStorage.getItem('userId'); // Get userId from localStorage

        if (!userId) {
          throw new Error('No userId found');
        }

        const response = await axios.get<Note[]>(`http://localhost:5000/api/notes/${userId}`);
        setNotes(response.data);
      } catch (error: any) {
        console.error('Error fetching notes:', error);
        setError(error.message || 'Error fetching notes');
      }
    };

    fetchNotes();
  }, []); // Empty dependencies array to run only once

  const handleAddNote = async () => {
    try {
      const userId = localStorage.getItem('userId'); // Get userId from localStorage

      if (!userId) {
        throw new Error('No userId found');
      }

      const response = await axios.post<Note>(
        'http://localhost:5000/api/notes',
        { description: newNoteTitle, user: userId }, // Include userId in the request body
      );

      setNotes([...notes, response.data]);
      setNewNoteTitle('');
    } catch (error: any) {
      console.error('Error adding note:', error);
      setError(error.message || 'Error adding note');
    }
  };

  const handleDeleteNote = async (id: string) => {
    try {
      const userId = localStorage.getItem('userId'); // Get userId from localStorage

      if (!userId) {
        throw new Error('No userId found');
      }

      await axios.delete(`http://localhost:5000/api/notes/${id}/${userId}`);
      setNotes(notes.filter((note) => note._id !== id));
    } catch (error: any) {
      console.error('Error deleting note:', error);
      setError(error.message || 'Error deleting note');
    }
  };

  const handleToggleComplete = async (id: string) => {
    try {
      const userId = localStorage.getItem('userId'); // Get userId from localStorage

      if (!userId) {
        throw new Error('No userId found');
      }

      const noteToUpdate = notes.find((note) => note._id === id);
      if (!noteToUpdate) {
        throw new Error('Note not found');
      }

      const updatedNote = { ...noteToUpdate, completed: !noteToUpdate.completed };
      const response = await axios.put<Note>(
        `http://localhost:5000/api/notes/${id}`,
        updatedNote,
        {
          headers: {
            Authorization: `Bearer ${userId}`,
          },
        }
      );

      setNotes(notes.map((note) => (note._id === id ? response.data : note)));
    } catch (error: any) {
      console.error('Error updating note:', error);
      setError(error.message || 'Error updating note');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Your Notes</h1>
      {error && <p className="text-red-500">{error}</p>}
      <ul className="w-full max-w-md">
        {notes.map((note) => (
          <li
            key={note._id}
            className="bg-white p-4 mb-4 shadow-md rounded-md flex justify-between items-center"
          >
            <div>
              <h2 className={`text-xl font-semibold ${note.completed ? 'line-through' : ''}`}>
                {note.description}
              </h2>
              {/* Additional content */}
              <p>Completed: {note.completed ? 'Yes' : 'No'}</p>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={note.completed}
                onChange={() => handleToggleComplete(note._id)}
                className="mr-2"
              />
              <button onClick={() => handleDeleteNote(note._id)} className="text-red-500">
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
      <div className="w-full max-w-md mt-4 flex">
        <input
          type="text"
          value={newNoteTitle}
          onChange={(e) => setNewNoteTitle(e.target.value)}
          placeholder="New Note"
          className="flex-1 p-2 border border-gray-300 rounded-md"
        />
        <button onClick={handleAddNote} className="ml-2 px-4 py-2 bg-indigo-600 text-white rounded-md">
          Add New Note
        </button>
      </div>
    </div>
  );
};

export default Notes;
