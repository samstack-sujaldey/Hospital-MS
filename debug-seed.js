require('dotenv').config();
const mongoose = require('mongoose');
const { Doctor, Patient, Meal, Appointment } = require('./models');

const URI = 'mongodb://127.0.0.1:27017/hospital-db';

console.log(`Attempting to connect to ${URI}...`);

mongoose.connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    family: 4 // Force IPv4
}).then(async () => {
    console.log('Connected to DB. Seeding data...');

    try {
        await Doctor.deleteMany({});
        await Patient.deleteMany({});
        await Meal.deleteMany({});
        await Appointment.deleteMany({});

        // ... (rest of seeding logic, just copying basic doctor for test)
        const doctor = new Doctor({
            name: 'Dr. Sarah Johnson',
            specialization: 'Cardiology',
            availability: true,
            slots: ['09:00 AM'],
            contact: '123',
            email: 'test@test.com'
        });
        await doctor.save();

        console.log('Data Seeded Successfully');
        process.exit(0);
    } catch (e) {
        console.error('Seeding Error:', e);
        process.exit(1);
    }
}).catch(err => {
    console.error('Connection Error:', err); // Log full error
    process.exit(1);
});
