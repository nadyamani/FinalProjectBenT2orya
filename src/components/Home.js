// src/components/Home.js
import React from 'react';
import Login from './Login';
import Register from './Register';

const Home = () => {
    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">Welcome to Collaborative Note-Taking App</h2>
            <div className="row">
                <div className="col-md-6">
                    <h3 className="text-center">Login</h3>
                    <Login />
                </div>
                <div className="col-md-6">
                    <h3 className="text-center">Register</h3>
                    <Register />
                </div>
            </div>
        </div>
    );
};

export default Home;
