// src/components/AddNote.js
import React, { useState } from 'react';
import { firestore, auth } from '../firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import Navbar from './Navbar';
import BackButton from './BackButton';

const AddNote = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState('');
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccess('');
        setError('');

        try {
            const user = auth.currentUser;
            if (!user) {
                throw new Error('User is not authenticated');
            }

            await addDoc(collection(firestore, 'notes'), {
                title,
                content,
                category,
                ownerId: user.uid, // Set the owner ID
                shared: false // Default value for shared
            });

            setTitle('');
            setContent('');
            setCategory('');
            setSuccess('Note added successfully!');
        } catch (error) {
            console.error('Error adding note:', error);
            setError('Error adding note: ' + error.message);
        }
    };

    return (
        <div>
            <Navbar />
            <div className="container mt-5">
                <div className="card">
                    <div className="card-body">
                        <h2 className="card-title">Add New Note</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="title">Title</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="title"
                                    placeholder="Title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="content">Content</label>
                                <textarea
                                    className="form-control"
                                    id="content"
                                    placeholder="Content"
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    required
                                ></textarea>
                            </div>
                            <div className="form-group">
                                <label htmlFor="category">Category</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="category"
                                    placeholder="Category"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    required
                                />
                            </div>
                            <button type="submit" className="btn btn-primary">Add Note</button>
                        </form>
                        {success && <div className="alert alert-success mt-3">{success}</div>}
                        {error && <div className="alert alert-danger mt-3">{error}</div>}
                    </div>
                </div>
                <div>
                    <BackButton />
                </div>
            </div>
        </div>
    );
};

export default AddNote;
