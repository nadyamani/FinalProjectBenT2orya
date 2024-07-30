// src/components/Profile.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import { firestore, auth } from '../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

const Profile = () => {
    const [sharedNotes, setSharedNotes] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchSharedNotes = async () => {
            try {
                // Log the current user for debugging purposes
                const user = auth.currentUser;
                console.log("Current user:", user);

                if (!user) {
                    setError('User is not authenticated');
                    return;
                }

                const sharedNotesCollection = collection(firestore, 'notes');
                const snapshot = await getDocs(sharedNotesCollection);
                const sharedNotesList = snapshot.docs
                    .map(doc => ({ id: doc.id, ...doc.data() }))
                    .filter(note => note.shared); // Filter for shared notes

                setSharedNotes(sharedNotesList);
            } catch (err) {
                console.error('Error fetching shared notes:', err);
                setError(`Failed to load shared notes. Please try again. Error: ${err.message}`);
            }
        };

        fetchSharedNotes();
    }, []);

    return (
        <div>
            <Navbar />
            <div className="container d-flex align-items-center justify-content-center mt-5" style={{ minHeight: '80vh' }}>
                <div className="row">
                    {error && <p className="text-danger">{error}</p>}
                    <div className="col-md-4 mb-4">
                        <div className="card h-100">
                            <div className="card-body text-center">
                                <h3 className="card-title">All Notes</h3>
                                <h6 className="card-subtitle mb-2 text-muted">View and manage all your notes</h6>
                                <Link to="/notes" className="btn btn-primary mt-3">
                                    View Notes
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4 mb-4">
                        <div className="card h-100">
                            <div className="card-body text-center">
                                <h3 className="card-title">Add New Note</h3>
                                <h6 className="card-subtitle mb-2 text-muted">Create a new note</h6>
                                <Link to="/add-note" className="btn btn-primary mt-3">
                                    Add Note
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4 mb-4">
                        <div className="card h-100">
                            <div className="card-body text-center">
                                <h3 className="card-title">Shared Notes</h3>
                                <h6 className="card-subtitle mb-2 text-muted">View notes shared by others</h6>
                                <Link to="/shared-notes" className="btn btn-primary mt-3">
                                    View Shared Notes
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
