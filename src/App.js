// src/App.js
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { auth } from './firebaseConfig';
import Home from './components/Home';
import SignUp from './components/SignUp';
import Login from './components/Login';
import Profile from './components/Profile';
import NotesDashboard from './components/NotesDashboard';
import AddNote from './components/AddNote';
import EditNote from './components/EditNote';
import './App.css';

function App() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setUser(user);
            } else {
                setUser(null);
            }
        });

        return () => unsubscribe(); // Cleanup subscription on unmount
    }, []);

    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/profile" element={user ? <Profile /> : <Login />} />
                    <Route path="/notes" element={user ? <NotesDashboard /> : <Login />} />
                    <Route path="/add-note" element={user ? <AddNote /> : <Login />} />
                    <Route path="/edit-note/:id" element={user ? <EditNote /> : <Login />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
