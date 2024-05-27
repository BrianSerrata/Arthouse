import React, { useState } from "react";
import { Tabs, Tab, Box, Container } from "@mui/material";
import WorkshopPage from "./ImageWorkshopPage";
import MusicWorkshopPage from "./MusicWorkshopPage";

const Test = () => {
    const [selectedTab, setSelectedTab] = useState(0);

    const handleChange = (event, newValue) => {
        setSelectedTab(newValue);
    };

    return (
        <Container maxWidth="md" style={{ marginTop: '100px' }}>
            <Tabs
                value={selectedTab}
                onChange={handleChange}
                centered
                indicatorColor="primary"
                textColor="primary"
                variant="fullWidth"
            >
                <Tab label="Image Workshop" />
                <Tab label="Music Workshop" />
            </Tabs>
            <Box p={2}>
                {selectedTab === 0 && <WorkshopPage />}
                {selectedTab === 1 && <MusicWorkshopPage />}
            </Box>
        </Container>
    );
};

export default Test;
