const express = require('express');
const router = express.Router();
const { User } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'secretkey123';

// Mock Login Route (Replaced)
// Only needed keeping User model structure

router.post('/signup', async (req, res) => {
    try {
        const { username, password } = req.body;

        let user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({
            username,
            password: hashedPassword,
            role: req.body.role || 'staff'
        });

        await user.save();

        const payload = { user: { id: user.id } };
        jwt.sign(payload, JWT_SECRET, { expiresIn: 360000 }, (err, token) => {
            if (err) throw err;
            res.json({ token, user: { username, role: 'staff' } });
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        let user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        const payload = { user: { id: user.id } };
        jwt.sign(payload, JWT_SECRET, { expiresIn: 360000 }, (err, token) => {
            if (err) throw err;
            res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
