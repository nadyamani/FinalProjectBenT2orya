// src/components/Home.js
import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="container text-center mt-5">
            <h1 className="display-4">Welcome to the Note-Taking App</h1>
            <p className="lead">Please login or sign up to continue</p>
            <div className="mt-4">
                <Link to="/login" className="btn btn-primary btn-lg mx-2">Login</Link>
                <Link to="/signup" className="btn btn-secondary btn-lg mx-2">Sign Up</Link>
            </div>
        </div>
    );
};

export default Home;
