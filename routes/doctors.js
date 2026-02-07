const express = require('express');
const router = express.Router();
const { Doctor, User } = require('../models');
const bcrypt = require('bcryptjs');

// GET all doctors
router.get('/', async (req, res) => {
    try {
        const doctors = await Doctor.find();
        res.json(doctors);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create new doctor + user account
router.post('/', async (req, res) => {
    // Expect: { name, specialization, contact, email, username, password }
    const { name, specialization, contact, email, username, password } = req.body;

    try {
        // 1. Create User Login
        let userPayload = {};
        if (username && password) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            const newUser = new User({
                username,
                password: hashedPassword,
                role: 'doctor'
            });
            const savedUser = await newUser.save();
            userPayload = { user: savedUser._id };
        }

        // 2. Create Doctor Profile linked to User
        const doctor = new Doctor({
            name,
            specialization,
            contact,
            email,
            ...userPayload
        });

        const newDoctor = await doctor.save();
        res.status(201).json(newDoctor);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
