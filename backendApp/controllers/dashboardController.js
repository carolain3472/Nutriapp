const User = require('../models/User');

// @desc    Get all dashboard data for a user
// @route   GET /api/dashboard/data
// @access  Private
exports.getDashboardData = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select(
            'nombre altura peso pesoInicial preferences weightHistory mealHistory caloriesBurnedHistory activeHoursHistory sleepHoursHistory'
        );

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Extraer los datos relevantes para el frontend
        const data = {
            nombre: user.nombre,
            altura: user.preferences?.estatura || user.altura,
            peso: user.peso, // Usar siempre user.peso como fuente de verdad para el peso actual
            pesoInicial: user.pesoInicial,
            preferences: user.preferences,
            weightHistory: user.weightHistory,
            mealHistory: user.mealHistory,
            caloriesBurnedHistory: user.caloriesBurnedHistory,
            activeHoursHistory: user.activeHoursHistory,
            sleepHoursHistory: user.sleepHoursHistory,
        };

        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

// @desc    Add weight entry
// @route   POST /api/dashboard/weight
// @access  Private
exports.addWeight = async (req, res) => {
    try {
        const { weight } = req.body;
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Si no hay peso inicial, establecerlo. La comprobación se hace más estricta para no sobreescribir si es 0.
        if (user.pesoInicial === null || user.pesoInicial === undefined) {
            user.pesoInicial = weight;
        }

        user.weightHistory.push({ weight });
        // Actualizar siempre el peso actual
        user.peso = weight;
        // También actualizar el peso en las preferencias para mantener consistencia
        if (user.preferences) {
            user.preferences.peso = weight;
        }
        await user.save();
        res.status(201).json(user.weightHistory);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

// @desc    Add meal entry
// @route   POST /api/dashboard/meal
// @access  Private
exports.addMeal = async (req, res) => {
    try {
        const { name, calories, type } = req.body;
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        user.mealHistory.push({ name, calories, type });
        await user.save();
        res.status(201).json(user.mealHistory);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

// @desc    Add calories burned entry
// @route   POST /api/dashboard/calories-burned
// @access  Private
exports.addCaloriesBurned = async (req, res) => {
    try {
        const { calories } = req.body;
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        user.caloriesBurnedHistory.push({ calories });
        await user.save();
        res.status(201).json(user.caloriesBurnedHistory);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};


// @desc    Add active hours entry
// @route   POST /api/dashboard/active-hours
// @access  Private
exports.addActiveHours = async (req, res) => {
    try {
        const { hours } = req.body;
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        user.activeHoursHistory.push({ hours });
        await user.save();
        res.status(201).json(user.activeHoursHistory);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

// @desc    Add sleep hours entry
// @route   POST /api/dashboard/sleep-hours
// @access  Private
exports.addSleepHours = async (req, res) => {
    try {
        const { hours } = req.body;
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        user.sleepHoursHistory.push({ hours });
        await user.save();
        res.status(201).json(user.sleepHoursHistory);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error del servidor' });
    }
}; 