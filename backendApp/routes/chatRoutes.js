const express = require('express');
const { chatWithNutrionist } = require('../controllers/chatController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/message', authMiddleware, chatWithNutrionist);

module.exports = router; 