// src/components/BackButton.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const BackButton = () => {
    const navigate = useNavigate();

    const handleBack = () => {
        navigate(-1); // Go back to the previous page
    };

    return (
        <button onClick={handleBack} className="btn btn-secondary back-button">
            &#8592; Back
        </button>
    );
};

export default BackButton;
