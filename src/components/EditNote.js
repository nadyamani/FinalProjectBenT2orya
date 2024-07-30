// src/components/EditNote.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { firestore } from '../firebaseConfig';
import { doc, getDoc, updateDoc, collection, addDoc, getDocs, deleteDoc } from 'firebase/firestore';
import Navbar from './Navbar';
import BackButton from './BackButton';
import { Modal, Button } from 'react-bootstrap';

const EditNote = () => {
    const { id } = useParams();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [versions, setVersions] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedVersion, setSelectedVersion] = useState(null);

    useEffect(() => {
        const fetchNote = async () => {
            try {
                const noteRef = doc(firestore, 'notes', id);
                const noteDoc = await getDoc(noteRef);
                if (noteDoc.exists()) {
                    const noteData = noteDoc.data();
                    setTitle(noteData.title);
                    setContent(noteData.content);
                    setCategory(noteData.category || '');
                } else {
                    setError('Note not found');
                }
            } catch (error) {
                setError('Error fetching note');
            } finally {
                setLoading(false);
            }
        };

        const fetchVersions = async () => {
            try {
                const versionsCollection = collection(firestore, `notes/${id}/versions`);
                const versionSnapshot = await getDocs(versionsCollection);
                const versionsList = versionSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setVersions(versionsList);
            } catch (error) {
                console.error('Error fetching versions:', error);
            }
        };

        fetchNote();
        fetchVersions();
    }, [id]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        try {
            const noteRef = doc(firestore, 'notes', id);
            const currentNote = await getDoc(noteRef);
            if (currentNote.exists()) {
                const noteData = currentNote.data();
                const versionsCollection = collection(noteRef, 'versions');
                await addDoc(versionsCollection, {
                    title: noteData.title,
                    content: noteData.content,
                    category: noteData.category,
                    timestamp: new Date()
                });
            }

            await updateDoc(noteRef, { title, content, category });
            setSuccess('Note updated successfully!');
        } catch (error) {
            setError('Error updating note: ' + error.message);
        }
    };

    const handleRevertClick = (version) => {
        setSelectedVersion(version);
        setShowModal(true);
    };

    const handleRevertConfirm = async () => {
        try {
            const noteRef = doc(firestore, 'notes', id);
            await updateDoc(noteRef, {
                title: selectedVersion.title,
                content: selectedVersion.content,
                category: selectedVersion.category
            });
            setTitle(selectedVersion.title);
            setContent(selectedVersion.content);
            setCategory(selectedVersion.category);
            setShowModal(false);
            setSuccess('Reverted to selected version');
        } catch (error) {
            setError('Error reverting to version: ' + error.message);
        }
    };

    const handleDeleteClick = (version) => {
        setSelectedVersion(version);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            const versionDocRef = doc(firestore, `notes/${id}/versions`, selectedVersion.id);
            await deleteDoc(versionDocRef);
            setVersions(versions.filter(v => v.id !== selectedVersion.id));
            setShowDeleteModal(false);
            setSuccess('Version deleted successfully');
        } catch (error) {
            setError('Error deleting version: ' + error.message);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setShowDeleteModal(false);
        setSelectedVersion(null);
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div style={{ color: 'red' }}>{error}</div>;

    return (
        <div>
            <Navbar />
            <div className="card container mt-5">
                <div className="card-body">
                    <h2 className="card-title">Edit Note</h2>
                    <form onSubmit={handleUpdate}>
                        <div className="form-group">
                            <label htmlFor="title">Title</label>
                            <input
                                type="text"
                                className="form-control"
                                id="title"
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
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                placeholder="Enter category"
                            />
                        </div>
                        <button type="submit" className="btn btn-primary">Update Note</button>
                    </form>
                    {success && <div className="alert alert-success mt-3">{success}</div>}
                    {error && <div className="alert alert-danger mt-3">{error}</div>}
                </div>
            </div>
            <div className="container mt-5">
                <h3>Version History</h3>
                <div className="row">
                    {versions.map((version, index) => (
                        <div key={index} className="col-md-4 mb-3">
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">Version {index + 1}</h5>
                                    <h6 className="card-subtitle mb-2 text-muted">{new Date(version.timestamp.toDate()).toLocaleString()}</h6>
                                    <p><strong>Category:</strong> {version.category}</p>
                                    <p>{version.title}</p>
                                    <p>{version.content}</p>
                                    <button onClick={() => handleRevertClick(version)} className="btn btn-primary mr-2">
                                        Revert to this version
                                    </button>
                                    <button onClick={() => handleDeleteClick(version)} className="btn btn-danger">
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <BackButton />
            </div>

            {/* Modal for confirming revert action */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Revert</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to revert to this version of the note?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleRevertConfirm}>
                        Revert
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal for confirming delete action */}
            <Modal show={showDeleteModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete this version? This action cannot be undone.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleDeleteConfirm}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default EditNote;
