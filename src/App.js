// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import UserProfile from './components/UserProfile';
import PrivateRoute from './components/PrivateRoute';

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/login" element={<Home />} />
                    <Route path="/register" element={<Home />} />
                    <Route path="/user-profile" element={<PrivateRoute component={UserProfile} />} />
                    <Route path="/" element={<Home />} /> {/* Redirect to home page if no path is provided */}
                </Routes>
            </div>
        </Router>
    );
}

export default App;
