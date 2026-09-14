const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');

const tankerRoutes = require('./routes/tankerRoutes');
const areaRoutes = require('./routes/areaRoutes');
const deliveryRoutes = require('./routes/deliveryRoutes');
const sourceRoutes = require('./routes/sourceRoutes');
const algorithmRoutes = require('./routes/algorithmRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/water-tanker-system';

app.use(cors());
app.use(express.json());

// Serve static files from React build
app.use(express.static(path.join(__dirname, '../client/build')));

// API Routes
app.use('/api/tankers', tankerRoutes);
app.use('/api/areas', areaRoutes);
app.use('/api/deliveries', deliveryRoutes);
app.use('/api/sources', sourceRoutes);
app.use('/api/algorithms', algorithmRoutes);
app.use('/api/analytics', analyticsRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve React app for any other route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

module.exports = app;
