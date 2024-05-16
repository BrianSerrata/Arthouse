import React, {Component} from "react";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import { Link } from "react-router-dom";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { useNavigate } from 'react-router-dom';

export default class WorkshopPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            description: "",
            generatedImage: null,
            error: null
        };

        this.updateDescription = this.updateDescription.bind(this);
        this.generateButtonPressed = this.generateButtonPressed.bind(this);
    }

    updateDescription(e) {
        this.setState({
            description: e.target.value
        });
    }

    generateButtonPressed() {
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                description: this.state.description,
            }),
        };

        console.log("made it here");

        //TODO: COMPLETE IMPLEMENTING API CALL for generated images
    
        fetch('/api/create', requestOptions) // Make sure the URL matches your backend setup
        .then(response => response.json())
        .then(data => this.props.history.push('/image/' + data.description));
    }
    
    

    render() {
        return (
            <Grid container spacing={2} direction="column" alignItems="center" justifyContent="center" style={{ minHeight: '100vh' }}>
                <Typography variant="h4" gutterBottom>
                    Image Generation Workshop
                </Typography>
                <FormControl>
                    <TextField
                        label="Image Description"
                        variant="outlined"
                        value={this.state.description}
                        onChange={this.updateDescription}
                        helperText="Enter a description for the image you want to generate."
                    />
                </FormControl>
                <Button variant="contained" color="primary" onClick={this.generateButtonPressed} style={{ marginTop: 20 }}>
                    Generate
                </Button>
            </Grid>
        );
    }
}