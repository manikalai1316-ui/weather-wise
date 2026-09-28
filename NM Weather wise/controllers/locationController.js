const Location = require('../models/Location');

const getLocations = async (req, res, next) => {
  try {
    const locations = await Location.find({ user: req.user._id }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: locations.length,
      data: locations,
    });
  } catch (error) {
    next(error);
  }
};

const addLocation = async (req, res, next) => {
  try {
    const { city, country } = req.body;

    if (!city || !country) {
      return res.status(400).json({
        success: false,
        message: 'City and country are required.',
      });
    }

    const location = await Location.create({
      user: req.user._id,
      city,
      country,
    });

    res.status(201).json({
      success: true,
      message: 'Favorite location saved.',
      data: location,
    });
  } catch (error) {
    next(error);
  }
};

const updateLocation = async (req, res, next) => {
  try {
    const { city, country } = req.body;
    const location = await Location.findOne({ _id: req.params.id, user: req.user._id });

    if (!location) {
      return res.status(404).json({
        success: false,
        message: 'Location not found.',
      });
    }

    if (city) location.city = city;
    if (country) location.country = country;
    await location.save();

    res.json({
      success: true,
      message: 'Location updated successfully.',
      data: location,
    });
  } catch (error) {
    next(error);
  }
};

const deleteLocation = async (req, res, next) => {
  try {
    const location = await Location.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!location) {
      return res.status(404).json({
        success: false,
        message: 'Location not found.',
      });
    }

    res.json({
      success: true,
      message: 'Location removed from favorites.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getLocations, addLocation, updateLocation, deleteLocation };
