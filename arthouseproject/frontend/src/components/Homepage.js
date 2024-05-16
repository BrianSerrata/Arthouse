import React, {Component} from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link,
    Redirect,
} from "react-router-dom";

import WorkshopPage from "./WorkshopPage";
import ViewCreationsPage from "./ViewCreationsPage";
import Image from "./Image";

export default class HomePage extends Component {
    render() {
        return (
            <Router>
                <Routes>
                    <Route path='/' element={<p>This is the home page</p>} />
                    <Route path='/create' element={<WorkshopPage />} />
                    <Route path='/view' element={<ViewCreationsPage />} />
                    <Route path='/image/:description' element={<Image />} />
                </Routes>
            </Router>
        );
    }
}