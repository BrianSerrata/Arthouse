import React, { Component } from "react";
import { createRoot } from "react-dom/client"; // Import createRoot
import HomePage from "./Homepage"

export default class App extends Component {
    constructor(props) {
        super(props)
    }
    
    render() {
        return <HomePage/>
    }
}

const appDiv = document.getElementById("app");
const root = createRoot(appDiv); // Create a root.
root.render(<App />); // Use the render method on the root.