import React, { Component } from "react";
import { Grid, Typography, TextField, Button } from "@mui/material";

export default class ViewCreationsPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            images: [], // Initialize state to hold the user-created images
            searchQuery: "", // State to hold the search query
            filteredImages: null, // State to hold the filtered images
            error: null
        };

        this.updateSearchQuery = this.updateSearchQuery.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
    }

    componentDidMount() {
        // Fetch user-created images when the component mounts
        fetch('/api/images') // Replace with your actual API endpoint
            .then(response => response.json())
            .then(data => {
                this.setState({ images: data });
            })
            .catch(error => {
                console.error('Error fetching images:', error);
                this.setState({ error });
            });
    }

    updateSearchQuery(event) {
        this.setState({ searchQuery: event.target.value });
    }

    handleSearch() {
        const { searchQuery, images } = this.state;
        const filteredImages = images.filter(creation => 
            creation.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
        this.setState({ filteredImages });
    }

    render() {
        const { images, searchQuery, filteredImages, error } = this.state;
        const displayedImages = filteredImages !== null ? filteredImages : images;

        return (
            <Grid 
                container 
                spacing={2} 
                direction="column" 
                alignItems="center" 
                justifyContent="center" 
                style={{ minHeight: '100vh', overflowY: 'auto', padding: 20 }}
            >
                <Typography variant="h4" gutterBottom>
                    User Images
                </Typography>
                <TextField 
                    label="Search Descriptions"
                    variant="outlined"
                    value={searchQuery}
                    onChange={this.updateSearchQuery}
                    style={{ marginBottom: 20 }}
                />
                <Button variant="contained" color="primary" onClick={this.handleSearch} style={{ marginBottom: 20 }}>
                    Search
                </Button>
                {error && <Typography color="error">{error.message}</Typography>}
                {displayedImages.length === 0 ? (
                    <Typography>No images found</Typography>
                ) : (
                    <Grid container spacing={2} style={{ overflowY: 'auto', maxHeight: '70vh' }}>
                        {displayedImages.map((creation, index) => (
                            <Grid item key={index} xs={12} sm={6} md={4}>
                                <Typography>{creation.user}</Typography>
                                <Typography>{creation.description}</Typography>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Grid>
        );
    }
}
