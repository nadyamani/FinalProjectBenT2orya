// src/components/Profile.js
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';

const Profile = () => {
    return (
        <div>
            <Navbar />
            <div className="container d-flex align-items-center justify-content-center mt-5" style={{ minHeight: '80vh' }}>
                <div className="row">
                    <div className="col-md-6 mb-4">
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
                    <div className="col-md-6 mb-4">
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
                </div>
            </div>
        </div>
    );
};

export default Profile;
