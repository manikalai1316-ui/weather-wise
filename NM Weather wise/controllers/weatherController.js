const Location = require('../models/Location');
const { fetchWeather } = require('../services/weatherService');

const getWeatherByCity = async (req, res, next) => {
  try {
    const { city } = req.params;
    const { country } = req.query;

    if (!city) {
      return res.status(400).json({
        success: false,
        message: 'City is required.',
      });
    }

    const weather = await fetchWeather(city, country);

    res.json({
      success: true,
      data: weather,
    });
  } catch (error) {
    next(error);
  }
};

const getWeatherByLocationId = async (req, res, next) => {
  try {
    const location = await Location.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!location) {
      return res.status(404).json({
        success: false,
        message: 'Location not found.',
      });
    }

    const weather = await fetchWeather(location.city, location.country);

    res.json({
      success: true,
      data: {
        location,
        weather,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getWeatherByCity, getWeatherByLocationId };
