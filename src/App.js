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
import SharedNotes from './components/SharedNotes'; // Import the SharedNotes component
import './App.css';

function App() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setUser(user);
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
                    <Route path="/shared-notes" element={user ? <SharedNotes /> : <Login />} /> {/* Add this route */}
                </Routes>
            </div>
        </Router>
    );
}

export default App;
