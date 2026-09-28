const express = require('express');
const { getSummary, getRecommendations } = require('../controllers/aiController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.post('/summary', getSummary);
router.post('/recommendations', getRecommendations);

module.exports = router;
