import { useState, useEffect } from 'react';

type Note = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
};

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [content, setContent] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  // Load notes on first render
  useEffect(() => {
    fetch('/api/hello')
      .then((res) => res.json())
      .then((data) => setNotes(data));
  }, []);

  // Save a new note
  const save = async () => {
    const res = await fetch('/api/hello', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title: 'Untitled', content }),
    });
    const newNote = await res.json();
    setNotes([newNote, ...notes]);
    setContent('');
  };

  // Delete note
  const deleteNote = async (id: string) => {
    await fetch(`/api/hello?id=${id}`, { method: 'DELETE' });
    setNotes(notes.filter((note) => note.id !== id));
  };

  // Start editing note
  const startEditing = (note: Note) => {
    setEditingId(note.id);
    setContent(note.content);
  };

  // Save edited note
  const saveEditedNote = async () => {
    if (editingId) {
      const res = await fetch(`/api/hello?id=${editingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });

      const updatedNote = await res.json();
      setNotes(notes.map((note) => (note.id === updatedNote.id ? updatedNote : note)));
      setEditingId(null);
      setContent('');
    }
  };

  return (
    <div>
      <h1>Notes App</h1>
      <div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your note here..."
        />
        <br />
        {editingId ? (
          <button onClick={saveEditedNote}>Save Edited Note</button>
        ) : (
          <button onClick={save}>Save New Note</button>
        )}
      </div>
      <hr />
      <h2>Saved Notes:</h2>
      {notes.map((note) => (
        <div key={note.id} style={{ border: '1px solid gray', marginBottom: '10px', padding: '10px' }}>
          <p>{note.content}</p>
          <button onClick={() => startEditing(note)}>Edit</button>
          <button onClick={() => deleteNote(note.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
