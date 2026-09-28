const Location = require('../models/Location');
const { fetchWeather } = require('../services/weatherService');
const {
  generateWeatherSummary,
  generateRecommendations,
} = require('../services/geminiService');

const resolveWeatherInput = async (req) => {
  const { city, country, locationId } = req.body;

  if (locationId) {
    const location = await Location.findOne({
      _id: locationId,
      user: req.user._id,
    });

    if (!location) {
      const error = new Error('Location not found.');
      error.statusCode = 404;
      throw error;
    }

    const weather = await fetchWeather(location.city, location.country);
    return { weather, location };
  }

  if (!city) {
    const error = new Error('Either locationId or city is required.');
    error.statusCode = 400;
    throw error;
  }

  const weather = await fetchWeather(city, country);
  return { weather, location: null };
};

const getSummary = async (req, res, next) => {
  try {
    const { weather, location } = await resolveWeatherInput(req);
    const insights = await generateWeatherSummary(weather);

    res.json({
      success: true,
      data: {
        weather,
        location,
        insights,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getRecommendations = async (req, res, next) => {
  try {
    const { weather, location } = await resolveWeatherInput(req);
    const insights = await generateRecommendations(weather);

    res.json({
      success: true,
      data: {
        weather,
        location,
        insights,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getSummary, getRecommendations };
