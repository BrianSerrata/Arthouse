import React, { useState, useEffect } from "react";
import {
  Grid,
  Typography,
  Box,
  IconButton,
  Slider,
  Container,
  AppBar,
  Toolbar,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
} from "@mui/material";
import { useLocation } from "react-router-dom";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import TuneIcon from "@mui/icons-material/Tune";
import CropIcon from "@mui/icons-material/Crop";
import RotateLeftIcon from "@mui/icons-material/RotateLeft";
import RotateRightIcon from "@mui/icons-material/RotateRight";
import AddIcon from "@mui/icons-material/Add";

const EditImagePage = () => {
  const location = useLocation();
  const generatedImage = location.state ? location.state.generatedImage : null;

  const [selectedImage, setSelectedImage] = useState(generatedImage);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [sharpness, setSharpness] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [activeTool, setActiveTool] = useState(null);
  const [images, setImages] = useState(generatedImage ? [generatedImage] : []);
  const [showModal, setShowModal] = useState(false);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch user-created images
    fetch("/api/images") // Replace with your actual API endpoint
      .then((response) => response.json())
      .then((data) => {
        setImages(data);
        if (!generatedImage && data.length > 0) {
          setSelectedImage(data[0].image);
        }
      })
      .catch((error) => {
        console.error("Error fetching images:", error);
      });
  }, [generatedImage]);

  const handleToolClick = (tool) => {
    setActiveTool(tool);
  };

  const handleSliderChange = (event, newValue) => {
    if (activeTool === "brightness") {
      setBrightness(newValue);
    } else if (activeTool === "contrast") {
      setContrast(newValue);
    } else if (activeTool === "sharpness") {
      setSharpness(newValue);
    }
  };

  const applyFilters = () => {
    let filters = `brightness(${brightness}%) contrast(${contrast}%)`;
    return filters;
  };

  const handleRotate = (direction) => {
    if (direction === "left") {
      setRotation(rotation - 90);
    } else {
      setRotation(rotation + 90);
    }
  };

  const handleImageClick = (img) => {
    setSelectedImage(img);
    // Reset edit tool states
    setBrightness(100);
    setContrast(100);
    setSharpness(100);
    setRotation(0);
    setActiveTool(null);
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

    fetch("/api/create_image", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
          setLoading(false);
        } else {
          setSelectedImage(data.image);
          setImages([...images, data]);
          setLoading(false);
          setShowModal(false);
          setDescription(""); // Reset the description
        }
      })
      .catch((error) => {
        setLoading(false);
        console.error("Error:", error);
        setError(error);
      });
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
        {selectedImage && (
          <img
            src={selectedImage}
            alt="Selected"
            style={{
              maxWidth: "80%",
              maxHeight: "80vh",
              filter: applyFilters(),
              transform: `rotate(${rotation}deg)`,
            }}
          />
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
        {images.map((img, index) => (
          <Box
            key={index}
            onClick={() => handleImageClick(img.image)}
            style={{
              cursor: "pointer",
              marginBottom: 8,
              border: img === selectedImage ? "2px solid blue" : "none",
            }}
          >
            <img src={img.image} alt="Generated Thumbnail" style={{ width: "100%" }} />
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
          <IconButton onClick={() => handleToolClick("brightness")}>
            <Brightness4Icon style={{ color: "#fff" }} />
          </IconButton>
          <IconButton onClick={() => handleToolClick("contrast")}>
            <TuneIcon style={{ color: "#fff" }} />
          </IconButton>
          <IconButton onClick={() => handleToolClick("sharpness")}>
            <TuneIcon style={{ color: "#fff" }} />
          </IconButton>
          <IconButton onClick={() => handleRotate("left")}>
            <RotateLeftIcon style={{ color: "#fff" }} />
          </IconButton>
          <IconButton onClick={() => handleRotate("right")}>
            <RotateRightIcon style={{ color: "#fff" }} />
          </IconButton>
          <IconButton onClick={() => handleToolClick("crop")}>
            <CropIcon style={{ color: "#fff" }} />
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
                activeTool === "brightness"
                  ? brightness
                  : activeTool === "contrast"
                  ? contrast
                  : sharpness
              }
              onChange={handleSliderChange}
              aria-labelledby="continuous-slider"
              min={0}
              max={200}
              style={{ color: "#fff" }}
            />
            <Button
              variant="contained"
              color="primary"
              style={{ marginTop: 16 }}
              onClick={() => setActiveTool(null)}
            >
              Apply Changes
            </Button>
          </Box>
        )}
      </AppBar>

      <Dialog open={showModal} onClose={() => { setShowModal(false); setDescription(""); }}>
        <DialogTitle style={{ backgroundColor: "#333", color: "#fff" }}>Generate New Image</DialogTitle>
        <DialogContent style={{ backgroundColor: "#333" }}>
        <TextField
            label="Image Description"
            variant="outlined"
            fullWidth
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            helperText="Enter a description for the image you want to generate."
            placeholder="Image Description" // Added placeholder text
            margin="dense" // Adjust the margin for better spacing
            InputLabelProps={{ shrink: true }} // Ensure the label doesn't overlap the input
            style={{ backgroundColor: "#333" }}
            sx={{
                '& .MuiFormHelperText-root': {
                  color: '#fff', // Change this to your desired color for helper text
                },
                input: {
                  color: '#fff', // Change this to your desired color for input text
                },
                '& .MuiInputLabel-root': {
                  color: '#fff', // Change this to your desired color for label text
                },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#fff', // Initial border color
                  },
                  '&:hover fieldset': {
                    borderColor: '#fff', // Hover border color
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'blue', // Focused border color, change this to your desired shade of blue
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

export default EditImagePage;
