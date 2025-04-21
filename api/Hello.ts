// pages/api/hello.ts
import type { NextApiRequest, NextApiResponse } from 'next';

type Note = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
};

let notes: Note[] = []; // In-memory notes, replace with DB in production

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === 'GET') {
    return res.status(200).json(notes);
  }

  if (req.method === 'POST') {
    const { title, content } = req.body;
    const newNote: Note = {
      id: `${Date.now()}`, // Use timestamp for ID
      title,
      content,
      createdAt: new Date().toISOString(),
    };
    notes.push(newNote);
    return res.status(201).json(newNote);
  }

  if (req.method === 'DELETE') {
    notes = notes.filter((note) => note.id !== id);
    return res.status(200).json({ message: 'Note deleted' });
  }

  if (req.method === 'PUT') {
    const { content } = req.body;
    const noteIndex = notes.findIndex((note) => note.id === id);
    if (noteIndex !== -1) {
      notes[noteIndex].content = content;
      return res.status(200).json(notes[noteIndex]);
    }
    return res.status(404).json({ error: 'Note not found' });
  }

  res.setHeader('Allow', ['GET', 'POST', 'DELETE', 'PUT']);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
