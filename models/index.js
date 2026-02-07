const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'doctor', 'staff'], default: 'admin' }
});

const DoctorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    specialization: { type: String, required: true },
    image: String,
    availability: { type: Boolean, default: true },
    slots: [String],
    contact: String,
    email: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

const PatientSchema = new mongoose.Schema({
    name: { type: String, required: true },
    bedNumber: String,
    age: Number,
    gender: String,
    contact: String,
    diagnosis: String,
    isDischarged: { type: Boolean, default: false },
    assignedDoctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
    medicines: [{
        name: String,
        dosage: String,
        timing: { type: String, enum: ['Morning', 'Afternoon', 'Night'] }
    }]
});

const AppointmentSchema = new mongoose.Schema({
    patientName: String,
    age: Number,
    gender: String,
    contact: String,
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
    date: Date,
    status: { type: String, default: 'Pending' }
});

const MealSchema = new mongoose.Schema({
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' },
    day: { type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] },
    dietType: { type: String, enum: ['Normal', 'Diabetic', 'Low Salt'] },
    morning: String,
    lunch: String,
    dinner: String
});

module.exports = {
    User: mongoose.model('User', UserSchema),
    Doctor: mongoose.model('Doctor', DoctorSchema),
    Patient: mongoose.model('Patient', PatientSchema),
    Appointment: mongoose.model('Appointment', AppointmentSchema),
    Meal: mongoose.model('Meal', MealSchema)
};
