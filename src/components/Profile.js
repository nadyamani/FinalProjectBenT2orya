// src/components/Profile.js
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';

const Profile = () => {
    return (
        <div>
            <Navbar />
            <div className="container text-center mt-5">
                <h2>User Profile</h2>
                <div className="mt-4">
                    <Link to="/notes" className="btn btn-primary mx-2">All Notes</Link>
                    <Link to="/add-note" className="btn btn-secondary mx-2">Add New Note</Link>
                </div>
            </div>
        </div>
    );
};

export default Profile;
