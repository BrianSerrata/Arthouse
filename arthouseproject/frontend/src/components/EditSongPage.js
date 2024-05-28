import React, { useState, useEffect } from 'react';
import { Container, Typography, List, ListItem, ListItemText, ListItemIcon } from '@mui/material';
import AudiotrackIcon from '@mui/icons-material/Audiotrack';

const EditSongPage = () => {
    const [songs, setSongs] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('/api/songs')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => setSongs(data))
            .catch(error => {
                console.error('Error fetching songs:', error);
                setError('Error fetching songs');
            });
    }, []);

    const replaceServerAddress = (url) => {
        return url.replace('http://127.0.0.1:8000', 'http://localhost');
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Audio Files
            </Typography>
            {error && <Typography color="error">{error}</Typography>}
            <List>
                {songs.map((song) => (
                    <React.Fragment key={song.id}>
                        <Typography variant="h6" style={{ color: '#000' }}>
                            {song.description}
                        </Typography>
                        {song.audio_files.map((file, index) => (
                            <ListItem key={index}>
                                <ListItemIcon>
                                    <AudiotrackIcon />
                                </ListItemIcon>
                                <ListItemText primary={file.file} />
                                <audio controls>
                                    <source src={replaceServerAddress(file.file)} type="audio/mpeg" />
                                    Your browser does not support the audio element.
                                </audio>
                            </ListItem>
                        ))}
                    </React.Fragment>
                ))}
            </List>
        </Container>
    );
};

export default EditSongPage;
