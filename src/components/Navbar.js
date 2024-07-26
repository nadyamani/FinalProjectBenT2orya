// src/components/Navbar.js
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
        <nav className="navbar navbar-expand-lg navbar-dark">
            <span className="navbar-brand ml-3">Note-Taking Website</span>
            <div className="navbar-nav ml-auto mr-3">
                <Link to="/notes" className="nav-item nav-link">All Notes</Link>
                <Link to="/add-note" className="nav-item nav-link">Add New Note</Link>
                <button onClick={handleLogout} className="nav-item nav-link btn btn-link"
                        style={{color: '#F4C2C2'}}>Logout
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
