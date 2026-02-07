const express = require('express');
const router = express.Router();
const { Patient } = require('../models');

router.get('/', async (req, res) => {
    try {
        const patients = await Patient.find().populate('assignedDoctor');
        res.json(patients);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/', async (req, res) => {
    const patient = new Patient(req.body);
    try {
        const newPatient = await patient.save();
        res.status(201).json(newPatient);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update medicines
router.put('/:id/medicines', async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.id);
        if (!patient) return res.status(404).json({ message: 'Patient not found' });

        patient.medicines = req.body.medicines;
        await patient.save();
        res.json(patient);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Discharge patient
router.put('/:id/discharge', async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.id);
        if (!patient) return res.status(404).json({ message: 'Patient not found' });

        patient.isDischarged = true;
        await patient.save();
        res.json(patient);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Assign doctor
router.put('/:id/assign', async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.id);
        if (!patient) return res.status(404).json({ message: 'Patient not found' });

        patient.assignedDoctor = req.body.doctorId;
        // Validate if doctorId is a valid ObjectId if strict
        await patient.save();
        res.json(patient);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
