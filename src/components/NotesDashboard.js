// src/components/NotesDashboard.js
import React, { useEffect, useState } from 'react';
import { firestore, auth } from '../firebaseConfig';
import { collection, onSnapshot, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import BackButton from './BackButton';

const NotesDashboard = () => {
    const [notes, setNotes] = useState([]);
    const [filteredNotes, setFilteredNotes] = useState([]);
    const [category, setCategory] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [shareSuccess, setShareSuccess] = useState(''); // State for share success message

    useEffect(() => {
        const fetchNotes = async () => {
            const user = auth.currentUser;
            if (!user) {
                setError('User is not authenticated');
                return;
            }

            const notesCollection = collection(firestore, 'notes');
            const unsubscribe = onSnapshot(notesCollection, (snapshot) => {
                const notesList = snapshot.docs
                    .map(doc => ({ id: doc.id, ...doc.data() }))
                    .filter(note => note.ownerId === user.uid);
                setNotes(notesList);
                setFilteredNotes(notesList);
                setLoading(false);
            }, (error) => {
                console.error('Error fetching notes:', error);
                setError('Failed to load notes');
                setLoading(false);
            });

            return unsubscribe;
        };

        fetchNotes();
    }, []);

    const handleCategoryChange = (e) => {
        const selectedCategory = e.target.value;
        setCategory(selectedCategory);
        if (selectedCategory) {
            setFilteredNotes(notes.filter(note => note.category === selectedCategory));
        } else {
            setFilteredNotes(notes);
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteDoc(doc(firestore, 'notes', id));
        } catch (error) {
            console.error('Error deleting note:', error);
            setError('Failed to delete note');
        }
    };

    const handleShare = async (id) => {
        try {
            const noteRef = doc(firestore, 'notes', id);
            await updateDoc(noteRef, { shared: true, sharedBy: auth.currentUser.email });
            setShareSuccess('Note shared successfully!');
            // Optionally, clear the message after a few seconds
            setTimeout(() => setShareSuccess(''), 3000);
        } catch (error) {
            console.error('Error sharing note:', error);
        }
    };

    return (
        <div>
            <Navbar />
            <div className="container mt-5">
                {shareSuccess && <div className="alert alert-success">{shareSuccess}</div>} {/* Success message */}
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h2>Your Notes</h2>
                    <select value={category} onChange={handleCategoryChange} className="form-select w-auto">
                        <option value="">All Categories</option>
                        {Array.from(new Set(notes.map(note => note.category))).map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
                {loading ? (
                    <p>Loading notes...</p>
                ) : error ? (
                    <p>{error}</p>
                ) : filteredNotes.length === 0 ? (
                    <p>No notes available. Create a new note to get started!</p>
                ) : (
                    <div className="row">
                        {filteredNotes.map(note => (
                            <div key={note.id} className="col-md-3 mb-3">
                                <div className="card h-100">
                                    <div className="card-body">
                                        <h3 className="card-title">{note.title}</h3>
                                        <p className="card-text">{note.content}</p>
                                        <p className="card-text"><small className="text-muted">Category: {note.category}</small></p>
                                        <div className="d-flex justify-content-between">
                                            <Link to={`/edit-note/${note.id}`} className="btn btn-primary">Edit</Link>
                                            <button onClick={() => handleDelete(note.id)} className="btn btn-danger">Delete</button>
                                            <button onClick={() => handleShare(note.id)} className="btn btn-danger">Share</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                <BackButton />
            </div>
        </div>
    );
};

export default NotesDashboard;
