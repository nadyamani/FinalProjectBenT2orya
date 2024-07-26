// src/components/UserProfile.js
import React, { useState } from 'react';
import Notes from './Notes';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebaseConfig';

const UserProfile = () => {
    const navigate = useNavigate();
    const [showNotes, setShowNotes] = useState(false);

    const handleLogout = () => {
        auth.signOut().then(() => {
            navigate('/login');
        }).catch((error) => {
            console.error('Error logging out:', error);
        });
    };

    const handleShowNotes = () => {
        setShowNotes(true);
    };

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between mb-3">
                <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
                <button className="btn btn-primary" onClick={handleShowNotes}>All Notes</button>
            </div>
            <h2>User Profile</h2>
            {showNotes && <Notes />}
        </div>
    );
};

export default UserProfile;
