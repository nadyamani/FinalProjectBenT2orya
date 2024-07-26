// src/components/Register.js
import React, { useState } from 'react';
import { auth } from '../firebaseConfig';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = (e) => {
        e.preventDefault();
        setError(''); // Clear previous errors

        if (password.length < 6) {
            setError('Password should be at least 6 characters');
            return;
        }

        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                console.log('User registered:', userCredential.user);
                navigate('/user-profile');
            })
            .catch((error) => {
                console.error('Error registering:', error);
                setError(error.message);
            });
    };

    return (
        <div className="card p-4 shadow-sm bg-pink">
            <form onSubmit={handleRegister}>
                <div className="form-group">
                    <label>Email</label>
                    <input
                        type="email"
                        className="form-control"
                        placeholder="Enter email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input
                        type="password"
                        className="form-control"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button type="submit" className="btn btn-primary btn-block mt-3">Register</button>
                {error && <p className="text-danger mt-2">{error}</p>}
            </form>
        </div>
    );
};

export default Register;
