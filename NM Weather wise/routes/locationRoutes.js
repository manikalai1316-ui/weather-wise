const express = require('express');
const {
  getLocations,
  addLocation,
  updateLocation,
  deleteLocation,
} = require('../controllers/locationController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/').get(getLocations).post(addLocation);
router.route('/:id').put(updateLocation).delete(deleteLocation);

module.exports = router;
