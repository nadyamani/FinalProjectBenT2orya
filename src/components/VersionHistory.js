// src/components/VersionHistory.js
import React, { useState, useEffect } from 'react';
import { firestore } from '../firebaseConfig';
import { useParams } from 'react-router-dom';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';

const VersionHistory = () => {
    const { id } = useParams();
    const [versions, setVersions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
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
                setError('Error fetching versions: ' + error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchVersions();
    }, [id]);

    const revertToVersion = async (version) => {
        try {
            const noteRef = doc(firestore, 'notes', id);
            await updateDoc(noteRef, {
                title: version.title,
                content: version.content,
                category: version.category
            });
            alert('Reverted to selected version');
        } catch (error) {
            alert('Error reverting to version: ' + error.message);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div style={{ color: 'red' }}>{error}</div>;

    return (
        <div>
            <h3>Version History</h3>
            <ul>
                {versions.map((version, index) => (
                    <li key={index}>
                        <p>
                            <strong>Version {index + 1}</strong> - {new Date(version.timestamp.toDate()).toLocaleString()}
                        </p>
                        <p>{version.title}</p>
                        <p>{version.content}</p>
                        <button onClick={() => revertToVersion(version)} className="btn btn-primary">
                            Revert to this version
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default VersionHistory;
