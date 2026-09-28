const express = require('express');
const { getHealth, getAllUsers, deleteUser } = require('../controllers/adminController');
const { protect } = require('../middleware/auth');
const authorize = require('../middleware/roleGuard');

const router = express.Router();

router.get('/health', getHealth);
router.get('/users', protect, authorize('admin'), getAllUsers);
router.delete('/users/:id', protect, authorize('admin'), deleteUser);

module.exports = router;
