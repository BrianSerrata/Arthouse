import React, { Component, useEffect, useState } from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link,
} from "react-router-dom";
import { Grid, Typography, Button, Container, Card, CardContent, CardActions } from "@mui/material";
import ImageWorkshopPage from "./ImageWorkshopPage";
import ViewCreationsPage from "./ViewCreationsPage";
import Image from "./Image";
import MusicWorkshopPage from "./MusicWorkshopPage";
import WorkshopPage from "./WorkshopPage";

class HomePage extends Component {
    render() {
        return (
            <Router>
                <Routes>
                    <Route path='/' element={<Home />} />
                    <Route path='/create_image' element={<ImageWorkshopPage />} />
                    <Route path='/create_song' element={<MusicWorkshopPage />} />
                    <Route path='/view' element={<ViewCreationsPage />} />
                    <Route path='/image/:description' element={<Image />} />
                    <Route path='/create' element={<WorkshopPage />} />
                </Routes>
            </Router>
        );
    }
}

const Home = () => {
    const [images, setImages] = useState([]);

    useEffect(() => {
        // Fetch user-created images
        fetch('/api/images') // Replace with your actual API endpoint
            .then(response => response.json())
            .then(data => {
                setImages(data);
            })
            .catch(error => {
                console.error('Error fetching images:', error);
            });
    }, []);

    useEffect(() => {
        // Function to randomly position and animate images
        const startAnimation = () => {
            const images = document.querySelectorAll('.falling-image');
            images.forEach((img) => {
                img.style.left = `${Math.random()*100}vw`;
                img.style.animationDelay = `${-Math.random() * 10}s`;
                img.style.animationDuration = `${5 + Math.random() * 10}s`;
            });
        };

        if (images.length) {
            startAnimation();
        }
    }, [images]);

    return (
        <div className="home-background">
            <Container maxWidth="md" style={{ padding: '2rem', zIndex: 1, position: 'relative' }}>
                <Grid container spacing={4} direction="column" alignItems="center" justifyContent="center">
                    {/* Welcome Message */}
                    <Grid item>
                        <Typography variant="h3" align="center" gutterBottom>
                            Welcome to Arthouse!
                        </Typography>
                        <Typography variant="h6" align="center" color="textSecondary" gutterBottom>
                            Create unique images with our AI-powered image generator, and view amazing creations in the gallery.
                        </Typography>
                    </Grid>

                    {/* Call to Action Cards */}
                    <Grid item container spacing={4} justifyContent="center">
                        <Grid item xs={12} sm={6}>
                            <Card>
                                <CardContent className="action-card">
                                    <Typography variant="h5" component="div">
                                        Generate art
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        Use our AI-powered tools to create stunning art!
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Button component={Link} to="/create" variant="contained" color="primary" fullWidth>
                                        Get Started
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Card>
                                <CardContent className="action-card">
                                    <Typography variant="h5" component="div">
                                        View Gallery
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        Explore the gallery to see what others have created.
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Button component={Link} to="/view" variant="contained" color="secondary" fullWidth>
                                        View Gallery
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    </Grid>
                </Grid>
            </Container>
            <div className="falling-images-container">
                {images.map((image, index) => (
                    <img key={index} src={image.image} alt={image.description} className="falling-image" />
                ))}
            </div>
        </div>
    );
}

export default HomePage;
