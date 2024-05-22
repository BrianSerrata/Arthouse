import React, { useState } from "react";
import { Grid, Typography, TextField, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";

const WorkshopPage = () => {
    const [description, setDescription] = useState("");
    const [generatedImage, setGeneratedImage] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const updateDescription = (e) => {
        setDescription(e.target.value);
    };

    const generateButtonPressed = () => {
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

        // Send request to Django backend to generate image and save URL
        fetch('/api/create', requestOptions) // Ensure the URL matches your Django endpoint
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                setError(data.error);
            } else {
                setGeneratedImage(data.image_url);
                console.log('Redirecting to /image/' + data.description);
                navigate('/image/' + data.description);
            }
        })
        .catch(error => {
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
            <Button variant="contained" color="primary" onClick={generateButtonPressed} style={{ marginTop: 20 }}>
                Generate
            </Button>
            {error && <Typography color="error">{error}</Typography>}
            {generatedImage && <img src={generatedImage} alt="Generated" style={{ marginTop: 20, maxWidth: '100%' }} />}
        </Grid>
    );
};

export default WorkshopPage;
