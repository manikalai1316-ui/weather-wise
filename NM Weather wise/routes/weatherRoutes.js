const express = require('express');
const { getWeatherByCity, getWeatherByLocationId } = require('../controllers/weatherController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/city/:city', getWeatherByCity);
router.get('/location/:id', protect, getWeatherByLocationId);

module.exports = router;
