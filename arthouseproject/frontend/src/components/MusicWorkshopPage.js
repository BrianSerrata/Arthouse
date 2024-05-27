
import React, { useState } from "react";
import { Grid, Typography, TextField, Button, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import FormControl from "@mui/material/FormControl";

const MusicWorkshopPage = () => {
    const [description, setDescription] = useState("");
    const [generatedSong, setGeneratedSong] = useState(null);
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

        fetch('/api/create_song', requestOptions)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                setError(data.error);
                setLoading(false);
            } else {
                setGeneratedSong(data.audio_files); // Assuming the response contains audio file URLs
                console.log('Redirecting to /song/' + data.id);
                setLoading(false);
                setTimeout(() => {
                    navigate('/song/' + data.id); // Change to your song detail route if needed
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
                Song Generation Workshop
            </Typography>
            <FormControl>
                <TextField
                    label="Song Description"
                    variant="outlined"
                    value={description}
                    onChange={updateDescription}
                    helperText="Enter a description for the song you want to generate."
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
            {generatedSong && (
                <div style={{ marginTop: 20, maxWidth: '100%' }}>
                    <Typography variant="h6">Generated Songs:</Typography>
                    {generatedSong.map((file, index) => (
                        <audio key={index} controls>
                            <source src={file.file} type="audio/mpeg" />
                            Your browser does not support the audio element.
                        </audio>
                    ))}
                </div>
            )}
        </Grid>
    );
};

export default MusicWorkshopPage;

