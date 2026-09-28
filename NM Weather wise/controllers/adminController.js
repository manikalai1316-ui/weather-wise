const User = require('../models/User');
const Location = require('../models/Location');

const getHealth = async (_req, res) => {
  const integrations = {
    mongodb: 'connected',
    openWeather: process.env.OPENWEATHER_API_KEY ? 'configured' : 'fallback_mode',
    gemini: process.env.GEMINI_API_KEY ? 'configured' : 'fallback_mode',
  };

  res.json({
    success: true,
    message: 'AI WeatherWise API is running.',
    data: {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      integrations,
    },
  });
};

const getAllUsers = async (_req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });

    res.json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    if (user.role === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin accounts cannot be deleted through this endpoint.',
      });
    }

    await Location.deleteMany({ user: user._id });
    await user.deleteOne();

    res.json({
      success: true,
      message: 'User account deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getHealth, getAllUsers, deleteUser };
