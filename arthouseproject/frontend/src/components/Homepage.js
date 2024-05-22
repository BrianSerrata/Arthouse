import React, { Component } from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link,
} from "react-router-dom";
import { Grid, Typography, Button, Container } from "@mui/material";

import WorkshopPage from "./WorkshopPage";
import ViewCreationsPage from "./ViewCreationsPage";
import Image from "./Image";

class HomePage extends Component {
    render() {
        return (
            <Router>
                <Routes>
                    <Route path='/' element={<Home />} />
                    <Route path='/create' element={<WorkshopPage />} />
                    <Route path='/view' element={<ViewCreationsPage />} />
                    <Route path='/image/:description' element={<Image />} />
                </Routes>
            </Router>
        );
    }
}

const Home = () => {
    return (
        <Container>
            <Grid container spacing={4} direction="column" alignItems="center" justifyContent="center" style={{ minHeight: '100vh' }}>
                {/* Welcome Message */}
                <Grid item>
                    <Typography variant="h3" align="center" gutterBottom>
                        Welcome to Arthouse!
                    </Typography>
                    <Typography variant="h6" align="center" gutterBottom>
                        Imagine, Create, and Share your AI-generated artwork!
                    </Typography>
                </Grid>

                {/* Call to Action Buttons */}
                <Grid item>
                    <Button component={Link} to="/create" variant="contained" color="primary" style={{ margin: 10 }}>
                        Generate an Image
                    </Button>
                    <Button component={Link} to="/view" variant="contained" color="secondary" style={{ margin: 10 }}>
                        View Gallery
                    </Button>
                </Grid>
            </Grid>
        </Container>
    );
}

export default HomePage;
