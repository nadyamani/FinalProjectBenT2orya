// src/components/Notes.js
import React, { useState, useEffect } from 'react';
import { firestore } from '../firebaseConfig';
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, updateDoc, deleteDoc, doc } from "firebase/firestore";

const Notes = () => {
    const [notes, setNotes] = useState([]);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [editingNoteId, setEditingNoteId] = useState(null);

    useEffect(() => {
        const q = query(collection(firestore, 'notes'), orderBy('timestamp', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const notesData = [];
            snapshot.forEach((doc) => notesData.push({ ...doc.data(), id: doc.id }));
            setNotes(notesData);
        });
        return unsubscribe;
    }, []);

    const handleSaveNote = (e) => {
        e.preventDefault();

        if (editingNoteId) {
            const noteDoc = doc(firestore, 'notes', editingNoteId);
            updateDoc(noteDoc, {
                title,
                content,
                timestamp: serverTimestamp()
            }).then(() => {
                setTitle('');
                setContent('');
                setEditingNoteId(null);
            }).catch((error) => {
                console.error('Error updating note:', error);
            });
        } else {
            addDoc(collection(firestore, 'notes'), {
                title,
                content,
                timestamp: serverTimestamp()
            })
                .then(() => {
                    setTitle('');
                    setContent('');
                })
                .catch((error) => {
                    console.error('Error saving note:', error);
                });
        }
    };

    const handleEditNote = (note) => {
        setTitle(note.title);
        setContent(note.content);
        setEditingNoteId(note.id);
    };

    const handleDeleteNote = (id) => {
        const noteDoc = doc(firestore, 'notes', id);
        deleteDoc(noteDoc)
            .catch((error) => {
                console.error('Error deleting note:', error);
            });
    };

    return (
        <div>
            <h2>Your Notes</h2>
            <form className="mb-4" onSubmit={handleSaveNote}>
                <div className="form-group">
                    <label>Note Title</label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Note Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label>Note Content</label>
                    <textarea
                        className="form-control"
                        placeholder="Note Content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    ></textarea>
                </div>
                <button type="submit" className="btn btn-primary btn-block mt-3">
                    {editingNoteId ? 'Update Note' : 'Save Note'}
                </button>
            </form>
            <div className="row">
                {notes.map((note) => (
                    <div key={note.id} className="col-md-4">
                        <div className="card mb-4 shadow-sm bg-pink">
                            <div className="card-body">
                                <h3 className="card-title">{note.title}</h3>
                                <p className="card-text">{note.content}</p>
                                <button className="btn btn-warning mr-2" onClick={() => handleEditNote(note)}>Edit</button>
                                <button className="btn btn-danger" onClick={() => handleDeleteNote(note.id)}>Delete</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Notes;
