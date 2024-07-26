// src/components/Navbar.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebaseConfig';

const Navbar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        auth.signOut().then(() => {
            navigate('/');
        }).catch((error) => {
            console.error('Logout error:', error);
        });
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
            <span className="navbar-brand">Note-Taking App</span>
            <div className="ml-auto">
                <button onClick={handleLogout} className="btn btn-outline-light">Logout</button>
            </div>
        </nav>
    );
};

export default Navbar;
