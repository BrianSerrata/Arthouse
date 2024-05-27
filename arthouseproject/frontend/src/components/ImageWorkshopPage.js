import React, { useState } from "react";
import { Grid, Typography, TextField, Button, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import FormControl from "@mui/material/FormControl";
import Navbar from "./Navbar";

const ImageWorkshopPage = () => {
    const [description, setDescription] = useState("");
    const [generatedImage, setGeneratedImage] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const updateDescription = (e) => {
        setDescription(e.target.value);
    };

    const generateButtonPressed = () => {
        setLoading(true);
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                description: description,
            }),
        };

        fetch('/api/create_image', requestOptions)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                setError(data.error);
                setLoading(false);
            } else {
                setGeneratedImage(data.image);
                setLoading(false);
            }
        })
        .catch(error => {
            setLoading(false);
            console.error('Error:', error);
            setError(error);
        });
    };

    const handleEdit = () => {
        navigate('/edit_image', { state: { generatedImage } });
    };

    return (
        <Grid container spacing={2} direction="column" alignItems="center" justifyContent="center" style={{ minHeight: '100vh', padding: '20px' }}>
            <Typography variant="h4" gutterBottom>
                Image Generation Workshop
            </Typography>
            <FormControl>
                <TextField
                    label="Image Description"
                    variant="outlined"
                    value={description}
                    onChange={updateDescription}
                    helperText="Enter a description for the image you want to generate."
                />
            </FormControl>
            {loading ? (
                <CircularProgress style={{ marginTop: 20 }} />
            ) : (
                <Button variant="contained" color="primary" onClick={generateButtonPressed} style={{ marginTop: 20 }}>
                    Generate
                </Button>
            )}
            {error && <Typography color="error" style={{ marginTop: 20 }}>{error}</Typography>}
            {generatedImage && (
                <>
                    <div className="image-workshop-image-container">
                        <img src={generatedImage} alt="Generated" />
                    </div>
                    <Button variant="contained" color="secondary" onClick={handleEdit} style={{ marginTop: 20 }}>
                        Edit Image
                    </Button>
                </>
            )}
        </Grid>
    );
};

export default ImageWorkshopPage;
