const express = require('express');
const router = express.Router();
const {
    getDashboardData,
    addWeight,
    addMeal,
    addCaloriesBurned,
    addActiveHours,
    addSleepHours
} = require('../controllers/dashboardController');
const authMiddleware = require('../middleware/authMiddleware');

// Todas las rutas aquí están protegidas y requieren autenticación
router.use(authMiddleware);

router.get('/data', getDashboardData);
router.post('/weight', addWeight);
router.post('/meal', addMeal);
router.post('/calories-burned', addCaloriesBurned);
router.post('/active-hours', addActiveHours);
router.post('/sleep-hours', addSleepHours);

module.exports = router; 