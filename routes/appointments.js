const express = require('express');
const router = express.Router();
const { Appointment } = require('../models');

router.get('/', async (req, res) => {
    try {
        const appointments = await Appointment.find().populate('doctor');
        res.json(appointments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/', async (req, res) => {
    const appointment = new Appointment(req.body);
    try {
        const newAppointment = await appointment.save();
        res.status(201).json(newAppointment);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const updated = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updated);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
