const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');

const vendorRouter = require('./routes/vendorroutes');
const firmRoutes = require('./routes/firmroutes');
const productRoutes = require('./routes/productroutes');

const app = express();
const PORT = process.env.PORT || 9090;

// Load environment variables
dotenv.config();

// Middleware
app.use(bodyParser.json());
app.use(morgan('dev'));

// CORS middleware setup
app.use(cors({
    origin: 'http://localhost:5173', // Adjust to your frontend origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Adjust to the methods you need
    allowedHeaders: ['Content-Type', 'Authorization', 'token'], // Include 'token' header here
    credentials: true // Allow sending cookies with the request
}));

// Log the MongoDB URI to ensure it is loaded correctly
console.log('MongoDB URI:', process.env.MONGO_URI);

// Route Middlewares
app.use('/vendor', vendorRouter);
app.use('/firm', firmRoutes);
app.use('/product', productRoutes);
app.use('/uploads', express.static('uploads'));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log('MongoDB connected successfully');
}).catch((error) => {
    console.error('MongoDB connection error:', error);
});

// Example route
app.get('/', (req, res) => {
    res.send('<h1>Welcome to Suby</h1>');
});

// 404 Error Handling
app.use((req, res, next) => {
    res.status(404).send('404: not found');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
