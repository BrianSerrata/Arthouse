import React, { useState } from "react";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import { useNavigate } from "react-router-dom";
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

        fetch('/api/create', requestOptions) // Make sure the URL matches your backend setup
        .then(response => response.json())
        .then(data => {
            console.log('Redirecting to /image/' + data.description);
            navigate('/image/' + data.description);
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
        </Grid>
    );
};

export default WorkshopPage;