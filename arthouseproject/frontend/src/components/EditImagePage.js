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
} from "@mui/material";
import { useLocation } from "react-router-dom";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import TuneIcon from "@mui/icons-material/Tune";
import CropIcon from "@mui/icons-material/Crop";
import RotateLeftIcon from "@mui/icons-material/RotateLeft";
import RotateRightIcon from "@mui/icons-material/RotateRight";

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
    </Box>
  );
};

export default EditImagePage;
