require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const sanitizeRequest = require('./middleware/sanitize');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/authRoutes');
const locationRoutes = require('./routes/locationRoutes');
const weatherRoutes = require('./routes/weatherRoutes');
const aiRoutes = require('./routes/aiRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10kb' }));
app.use(sanitizeRequest);

app.get('/', (_req, res) => {
  res.json({
    success: true,
    message: 'Welcome to AI WeatherWise API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      locations: '/api/locations',
      weather: '/api/weather',
      ai: '/api/ai',
      admin: '/api/admin',
    },
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/admin', adminRoutes);

app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found.',
  });
});

app.use(errorHandler);

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`AI WeatherWise server running on port ${PORT}`);
  });
};

startServer().catch((error) => {
  console.error('Failed to start server:', error.message);
  process.exit(1);
});
