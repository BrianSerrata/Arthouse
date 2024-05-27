import React from 'react';
import { AppBar, Toolbar, IconButton, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import CreateIcon from '@mui/icons-material/Create';
import EditIcon from '@mui/icons-material/Edit';
import GalleryIcon from '@mui/icons-material/PhotoLibrary';

const Navbar = () => {
    const navigate = useNavigate();

    return (
        <AppBar position="fixed" className="app-bar">
            <Toolbar>
                <IconButton edge="start" color="inherit" aria-label="home" onClick={() => navigate('/')}>
                    <HomeIcon />
                </IconButton>
                <Typography variant="h6" style={{ flexGrow: 1 }}>
                    Arthouse
                </Typography>
                <Button className="nav-button" startIcon={<CreateIcon />} onClick={() => navigate('/create')}>
                    Create
                </Button>
                <Button className="nav-button" startIcon={<EditIcon />} onClick={() => navigate('/edit_image')}>
                    Edit
                </Button>
                <Button className="nav-button" startIcon={<GalleryIcon />} onClick={() => navigate('/view')}>
                    Gallery
                </Button>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
