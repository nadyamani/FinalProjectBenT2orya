// src/components/SharedNotes.js
import React, { useEffect, useState } from 'react';
import { firestore } from '../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import Navbar from './Navbar';
import BackButton from './BackButton';

const SharedNotes = () => {
    const [sharedNotes, setSharedNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchSharedNotes = async () => {
            try {
                const sharedNotesCollection = collection(firestore, 'notes');
                const snapshot = await getDocs(sharedNotesCollection);
                const sharedNotesList = snapshot.docs
                    .map(doc => ({ id: doc.id, ...doc.data() }))
                    .filter(note => note.shared); // Filter for shared notes
                setSharedNotes(sharedNotesList);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching shared notes:', error);
                setError('Failed to load shared notes');
                setLoading(false);
            }
        };

        fetchSharedNotes();
    }, []);

    return (
        <div>
            <Navbar />
            <div className="container mt-5">
                <h2>Shared Notes</h2>
                {loading ? (
                    <p>Loading shared notes...</p>
                ) : error ? (
                    <p>{error}</p>
                ) : sharedNotes.length === 0 ? (
                    <p>No shared notes available.</p>
                ) : (
                    <div className="row">
                        {sharedNotes.map(note => (
                            <div key={note.id} className="col-md-3 mb-3">
                                <div className="card h-100">
                                    <div className="card-body">
                                        <h3 className="card-title">{note.title}</h3>
                                        <p className="card-text">{note.content}</p>
                                        <p className="card-text"><small className="text-muted">Category: {note.category}</small></p>
                                        <p className="card-text"><small className="text-muted">Shared by: {note.sharedBy}</small></p>
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

export default SharedNotes;
