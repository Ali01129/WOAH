const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const path = require('path');

// Connect to MongoDB
mongoose.connect('mongodb+srv://ali:alinawaz1@cluster0.pc6svvj.mongodb.net/WOAH?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => {
    console.log('MongoDB connected successfully');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

// Create an Express app
const app = express();
const port = process.env.PORT || 5000; // Use a default or environment-specific port

app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Middleware to parse JSON request bodies

// Serve static files from the React build
app.use(express.static(path.resolve(__dirname, 'frontend', 'build')));

// API routes
app.use('/auth', require('./routes/auth')); // Route for authentication
app.use('/create', require('./routes/store')); // Route for creating items
app.use('/bid', require('./routes/auction')); // Route for bidding
app.use('/carttwo', require('./routes/cartTwo')); // Route for managing cart
app.use('/buy', require('./routes/buy'));

// Catch-all route to serve the React app
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
