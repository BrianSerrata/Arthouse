import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const Image = () => {
    const { description } = useParams(); // Use useParams hook to access route parameters
    const [desc, setDesc] = useState("");
    const [user, setUser] = useState("");

    // Function to fetch image data based on description
    const getImageDetails = async (description) => {
        try {
            const response = await fetch(`/api/get-image?description=${description}`);
            if (!response.ok) {
                throw new Error('Failed to fetch image data');
            }
            const data = await response.json();
            if (data.description) {
                setDesc(data.description);
            }
            if (data.user) {
                setUser(data.user);
            }
        } catch (error) {
            console.error('Error fetching image data:', error);
        }
    };

    useEffect(() => {
        if (description) {
            getImageDetails(description);
        }
    }, [description]);

    return (
        <div>
            <h3>Image Description: {description}</h3>
            <p>Image Description: {desc}</p>
            <p>User: {user}</p>
        </div>
    );
};

export default Image;
