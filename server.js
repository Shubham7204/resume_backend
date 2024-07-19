const express = require('express');
const cors = require('cors');
const setupDirectories = require('./directorySetup'); // Import the setupDirectories function

const app = express();
const port = process.env.PORT || 3000; // Use environment port or default to 3000

// Run directory setup
setupDirectories(); // Ensure directories are set up

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

app.use('/api', require('./routes/api'));

// Add your routes or middleware here
app.get('/', (req, res) => {
  res.send('Hello, world!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
