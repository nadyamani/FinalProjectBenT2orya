// src/components/PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { auth } from '../firebaseConfig';

const PrivateRoute = ({ component: Component }) => {
    const isAuthenticated = auth.currentUser != null;

    return isAuthenticated ? <Component /> : <Navigate to="/login" />;
};

export default PrivateRoute;
