const express = require('express');
const { chatWithNutrionist } = require('../controllers/chatController');

const router = express.Router();

router.post('/message', chatWithNutrionist);

module.exports = router; 