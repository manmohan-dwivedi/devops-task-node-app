// src/app.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const routes = require('./routes/routes');
const taskController = require('./controllers/controllers');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health Check Route
app.get('/health', taskController.healthCheck);

// Routes
app.use('/api/tasks', routes);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log('✅ MongoDB connected');
    // Start server only after DB connection
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
})
.catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
});
