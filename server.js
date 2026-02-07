require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
console.log('Setting up middleware...');
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

console.log('Connecting to MongoDB...');
mongoose.set('strictQuery', false);
// Database Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/hospital-db', {
    serverSelectionTimeoutMS: 5000,
    family: 4
})
    .then(() => console.log('MongoDB Connected Successfully'))
    .catch(err => {
        console.error('MongoDB Connection Error:', err.message);
        console.error('Check if MongoDB is running on port 27017');
        process.exit(1); // Exit if DB fails so user knows
    });

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/patients', require('./routes/patients'));
app.use('/api/doctors', require('./routes/doctors'));
app.use('/api/appointments', require('./routes/appointments'));
app.use('/api/meals', require('./routes/meals'));

// Serve Frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

app.get('/admin-dashboard.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin-dashboard.html'));
});

app.get('/doctor-dashboard.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'doctor-dashboard.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Access locally via: http://localhost:${PORT}`);
    console.log(`Access on network via IP: http://<your-ip>:${PORT}`);
});
