import React, { useState } from "react";
import { Grid, Typography, TextField, Button, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import FormControl from "@mui/material/FormControl";

const WorkshopPage = () => {
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

        console.log("made it here");

        fetch('/api/create', requestOptions)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                setError(data.error);
                setLoading(false);
            } else {
                setGeneratedImage(data.image_url);
                console.log('Redirecting to /image/' + data.description);
                setLoading(false);
                setTimeout(() => {
                    navigate('/image/' + data.description);
                }, 500); // Add a slight delay before navigating
            }
        })
        .catch(error => {
            setLoading(false);
            console.error('Error:', error);
            setError(error);
        });

        console.log('got past the fetch');
    };

    return (
        <Grid container spacing={2} direction="column" alignItems="center" justifyContent="center" style={{ minHeight: '100vh' }}>
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
            {generatedImage && <img src={generatedImage} alt="Generated" style={{ marginTop: 20, maxWidth: '100%' }} />}
        </Grid>
    );
};

export default WorkshopPage;
