import React, { useState, useEffect, useRef } from 'react';
import {
    Container,
    Typography,
    Box,
    IconButton,
    Slider,
    AppBar,
    Toolbar,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    CircularProgress
} from '@mui/material';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import SpeedIcon from '@mui/icons-material/Speed';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import WaveSurfer from 'wavesurfer.js';

const EditSongPage = () => {
    const [songs, setSongs] = useState([]);
    const [selectedSong, setSelectedSong] = useState(null);
    const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
    const [volume, setVolume] = useState(100);
    const [speed, setSpeed] = useState(1);
    const [pitch, setPitch] = useState(1);
    const [activeTool, setActiveTool] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const waveformRef = useRef(null);
    const wavesurferRef = useRef(null);

    useEffect(() => {
        fetch('/api/songs')
            .then(response => response.json())
            .then(data => setSongs(data))
            .catch(error => {
                console.error('Error fetching songs:', error);
                setError('Error fetching songs');
            });
    }, []);

    useEffect(() => {
        if (selectedSong && selectedSong.audio_files.length > 0) {
            const trackUrl = replaceServerAddress(selectedSong.audio_files[currentTrackIndex].file);

            // Initialize WaveSurfer
            wavesurferRef.current = WaveSurfer.create({
                container: waveformRef.current,
                waveColor: 'rgb(200, 0, 200)',
                progressColor: 'rgb(100, 0, 100)',
                url: trackUrl
            });

            wavesurferRef.current.on('click', () => {
                wavesurferRef.current.play()
              })

            wavesurferRef.current.on('seek', (progress) => {
                wavesurferRef.current.play(progress * wavesurferRef.current.getDuration());
            });

            return () => {
                wavesurferRef.current.destroy();
            };
        }
    }, [selectedSong, currentTrackIndex]);

    const handleToolClick = (tool) => {
        setActiveTool(tool);
    };

    const handleSliderChange = (event, newValue) => {
        if (activeTool === "volume") {
            setVolume(newValue);
        } else if (activeTool === "speed") {
            setSpeed(newValue);
        } else if (activeTool === "pitch") {
            setPitch(newValue);
        }
    };

    const applyAudioEffects = () => {
        // Apply audio effects logic
    };

    const handleSongClick = (song) => {
        setSelectedSong(song);
        setCurrentTrackIndex(0);
        setVolume(100);
        setSpeed(1);
        setPitch(1);
        setActiveTool(null);
    };

    const replaceServerAddress = (url) => {
        const baseURL = 'http://localhost';
        const localServer = 'http://127.0.0.1:8000';
        
        if (url.includes(localServer)) {
            return url.replace(localServer, baseURL);
        }
        else if(url.includes(baseURL)) {
            return url;
        } else {
            return baseURL + url;
        }
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

        fetch('/api/create_song', requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    setError(data.error);
                    setLoading(false);
                } else {
                    const adjustedFiles = data.audio_files.map(file => ({
                        ...file,
                        file: replaceServerAddress(file.file)
                    }));
                    data.audio_files = adjustedFiles;
                    setSongs([...songs, data]);
                    setLoading(false);
                    setShowModal(false);
                    setDescription("");
                }
            })
            .catch(error => {
                setLoading(false);
                console.error('Error:', error);
                setError(error);
            });
    };

    const handlePrevTrack = () => {
        setCurrentTrackIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : selectedSong.audio_files.length - 1));
    };

    const handleNextTrack = () => {
        setCurrentTrackIndex((prevIndex) => (prevIndex < selectedSong.audio_files.length - 1 ? prevIndex + 1 : 0));
    };

    return (
        <Box style={{ display: "flex", height: "100vh", width: "100vw", padding: 0 }}>
            <Box
                style={{
                    flex: 1,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: 16,
                    backgroundColor: "#333",
                }}
            >
                {selectedSong ? (
                    <Box>
                        <Typography variant="h6" style={{ color: '#fff' }}>
                            {selectedSong.description}
                        </Typography>
                        {selectedSong.audio_files.length > 0 ? (
                            <><Box display="flex" alignItems="center">
                                <IconButton onClick={handlePrevTrack} style={{ color: "#fff" }}>
                                    <ArrowBackIcon />
                                </IconButton>
                                <Box ref={waveformRef} style={{ flex: 1, margin: '0 20px' }} />
                                <IconButton onClick={handleNextTrack} style={{ color: "#fff" }}>
                                    <ArrowForwardIcon />
                                </IconButton>
                            </Box><Typography variant="body2" style={{ color: '#fff', marginTop: 10 }}>
                                    Track {currentTrackIndex + 1} of {selectedSong.audio_files.length}
                                </Typography></>
                        ) : (
                            <Typography variant="body2" style={{ color: '#fff' }}>
                                No audio files available for this song.
                            </Typography>
                        )}
                    </Box>
                ) : (
                    <Typography variant="h6" style={{ color: '#fff' }}>
                        Select a song to view its audio files.
                    </Typography>
                )}

            </Box>
            <Box
                style={{
                    width: "20%",
                    height: "100%",
                    overflowY: "auto",
                    borderLeft: "1px solid #ccc",
                    padding: 16,
                    backgroundColor: "#444",
                }}
            >
                {songs.map((song) => (
                    <Box
                        key={song.id}
                        onClick={() => handleSongClick(song)}
                        style={{
                            cursor: "pointer",
                            marginBottom: 8,
                            border: song === selectedSong ? "2px solid blue" : "none",
                        }}
                    >
                        <Typography variant="body1" style={{ color: '#fff' }}>
                            {song.description}
                        </Typography>
                    </Box>
                ))}
            </Box>
            <AppBar
                position="fixed"
                color="default"
                style={{
                    top: "auto",
                    bottom: 0,
                    backgroundColor: "#222",
                    color: "#fff",
                }}
            >
                <Toolbar style={{ justifyContent: "center" }}>
                    <IconButton onClick={() => handleToolClick("volume")}>
                        <VolumeUpIcon style={{ color: "#fff" }} />
                    </IconButton>
                    <IconButton onClick={() => handleToolClick("speed")}>
                        <SpeedIcon style={{ color: "#fff" }} />
                    </IconButton>
                    <IconButton onClick={() => handleToolClick("pitch")}>
                        <MusicNoteIcon style={{ color: "#fff" }} />
                    </IconButton>
                    <IconButton
                        style={{ position: "absolute", left: 16 }}
                        onClick={() => setShowModal(true)}
                    >
                        <AddIcon style={{ color: "#fff" }} />
                    </IconButton>
                </Toolbar>
                {activeTool && (
                    <Box
                        style={{
                            padding: 16,
                            background: "#333",
                            width: "100%",
                            color: "#fff",
                        }}
                    >
                        <Typography variant="subtitle1">
                            {activeTool.charAt(0).toUpperCase() + activeTool.slice(1)}
                        </Typography>
                        <Slider
                            value={
                                activeTool === "volume"
                                    ? volume
                                    : activeTool === "speed"
                                        ? speed
                                        : pitch
                            }
                            onChange={handleSliderChange}
                            aria-labelledby="continuous-slider"
                            min={activeTool === "speed" || activeTool === "pitch" ? 0.5 : 0}
                            max={activeTool === "speed" || activeTool === "pitch" ? 2 : 200}
                            step={activeTool === "speed" || activeTool === "pitch" ? 0.1 : 1}
                            style={{ color: "#fff" }}
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            style={{ marginTop: 16 }}
                            onClick={applyAudioEffects}
                        >
                            Apply Changes
                        </Button>
                    </Box>
                )}
            </AppBar>

            <Dialog open={showModal} onClose={() => { setShowModal(false); setDescription(""); }}>
                <DialogTitle style={{ backgroundColor: "#333", color: "#fff" }}>Generate New Song</DialogTitle>
                <DialogContent style={{ backgroundColor: "#333" }}>
                    <TextField
                        label="Song Description"
                        variant="outlined"
                        fullWidth
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        helperText="Enter a description for the song you want to generate."
                        placeholder="Song Description"
                        margin="dense"
                        InputLabelProps={{ shrink: true }}
                        style={{ backgroundColor: "#333" }}
                        sx={{
                            '& .MuiFormHelperText-root': {
                                color: '#fff',
                            },
                            input: {
                                color: '#fff',
                            },
                            '& .MuiInputLabel-root': {
                                color: '#fff',
                            },
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: '#fff',
                                },
                                '&:hover fieldset': {
                                    borderColor: '#fff',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: 'blue',
                                },
                            },
                        }}
                    />
                    {loading && (
                        <Box style={{ display: "flex", justifyContent: "center", marginTop: 20 }}>
                            <CircularProgress />
                        </Box>
                    )}
                    {error && <Typography color="error" style={{ marginTop: 20 }}>{error}</Typography>}
                </DialogContent>
                <DialogActions style={{ backgroundColor: "#333" }}>
                    <Button onClick={() => { setShowModal(false); setDescription(""); }} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={generateButtonPressed} color="primary" disabled={loading}>
                        Generate
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default EditSongPage;
