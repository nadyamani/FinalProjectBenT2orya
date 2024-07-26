// src/components/NotesDashboard.js
import React, { useEffect, useState } from 'react';
import { firestore } from '../firebaseConfig';
import { collection, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import BackButton from './BackButton';

const NotesDashboard = () => {
    const [notes, setNotes] = useState([]);
    const [filteredNotes, setFilteredNotes] = useState([]);
    const [category, setCategory] = useState(''); // State for filtering by category
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const notesCollection = collection(firestore, 'notes');

        const unsubscribe = onSnapshot(notesCollection, (snapshot) => {
            const notesList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setNotes(notesList);
            setFilteredNotes(notesList);
            setLoading(false);
        }, (error) => {
            console.error('Error fetching notes:', error);
            setLoading(false);
        });

        return () => unsubscribe(); // Cleanup listener on component unmount
    }, []);

    const handleCategoryChange = (e) => {
        const selectedCategory = e.target.value;
        setCategory(selectedCategory);
        if (selectedCategory) {
            setFilteredNotes(notes.filter(note => note.category === selectedCategory));
        } else {
            setFilteredNotes(notes); // Show all notes if no category is selected
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteDoc(doc(firestore, 'notes', id));
        } catch (error) {
            console.error('Error deleting note:', error);
        }
    };

    return (
        <div>
            <Navbar />
            <div className="container mt-5">
                <div className="d-flex justify-content-between align-items-center">
                    <h2>Your Notes</h2>
                    <select value={category} onChange={handleCategoryChange} className="form-select">
                        <option value="">All Categories</option>
                        {Array.from(new Set(notes.map(note => note.category))).map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
                {loading ? (
                    <p>Loading notes...</p>
                ) : filteredNotes.length === 0 ? (
                    <p>No notes available. Create a new note to get started!</p>
                ) : (
                    filteredNotes.map(note => (
                        <div key={note.id} className="card mb-3">
                            <div className="card-body">
                                <h3 className="card-title">{note.title}</h3>
                                <p className="card-text">{note.content}</p>
                                <p className="card-text"><small className="text-muted">Category: {note.category}</small></p>
                                <button onClick={() => handleDelete(note.id)} className="btn btn-danger mr-2">Delete</button>
                                <Link to={`/edit-note/${note.id}`} className="btn btn-primary">Edit</Link>
                            </div>
                        </div>
                    ))
                )}
                <BackButton />
            </div>
        </div>
    );
};

export default NotesDashboard;
