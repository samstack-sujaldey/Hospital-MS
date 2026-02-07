const express = require('express');
const router = express.Router();
const { Meal } = require('../models');

router.get('/', async (req, res) => {
    try {
        const meals = await Meal.find().populate('patient');
        res.json(meals);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/', async (req, res) => {
    const meal = new Meal(req.body);
    try {
        const newMeal = await meal.save();
        res.status(201).json(newMeal);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
