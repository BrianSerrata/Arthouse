// const express = require('express');
// const bodyParser = require('body-parser');
// const fetch = require('node-fetch');
// require('dotenv').config();

// const app = express();
// const port = 3000; // Choose an appropriate port

// app.use(bodyParser.json());

// app.post('/generate-image', async (req, res) => {
//     const { prompt } = req.body;
//     try {
//         const response = await fetch('http://localhost:8080/api/v1/dalle', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({
//                 prompt: prompt,
//                 size: '256x256', // Ensure this matches the required size
//                 n: 1 // Number of images to generate
//             }),
//         });
//         const data = await response.json();
//         if (data.error) {
//             throw new Error(data.error.message);
//         }
//         const imageUrl = data.data[0].url;
//         res.set('Access-Control-Allow-Origin', 'http://localhost:8000'); // Set the CORS header
//         res.json({ url: imageUrl });
//     } catch (error) {
//         res.status(500).send(error.message);
//     }
// });

// app.listen(port, () => {
//     console.log(`Server is running on port: ${port}`);
// });
