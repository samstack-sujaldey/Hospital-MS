// DOM Elements
const contentArea = document.getElementById('content-area');
const navItems = document.querySelectorAll('.nav-item');

// State
let currentState = {
    view: 'dashboard',
    patients: [],
    doctors: [],
    appointments: [],
    meals: []
};

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    loadView('dashboard');
    setupNavigation();
});

function setupNavigation() {
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const view = item.dataset.tab;

            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');

            loadView(view);
        });
    });

    // Search Functionality
    const searchInput = document.querySelector('.search-bar input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            if (currentState.view === 'patients' && currentState.patients) {
                const filtered = currentState.patients.filter(p => p.name.toLowerCase().includes(term) || (p.bedNumber && p.bedNumber.toLowerCase().includes(term)));
                document.getElementById('patientList').innerHTML = renderPatientList(filtered);
                attachPatientClickHandlers(filtered);
            } else if (currentState.view === 'doctors' && currentState.doctors) {
                // Should implement render filter for doctors too if needed
                // For now, let's just log or support page reload/filter
            }
        });
    }
}

async function loadView(view) {
    currentState.view = view;
    contentArea.innerHTML = '<div class="loading">Loading...</div>';

    try {
        switch (view) {
            case 'dashboard':
                await loadDashboardData();
                renderDashboard();
                break;
            case 'appointments':
                await loadAppointmentData();
                renderAppointments();
                break;
            case 'patients':
                await loadPatientData();
                renderPatients();
                break;
            case 'meals':
                await loadMealData();
                renderMeals();
                break;
            case 'doctors':
                await loadDoctorData();
                renderDoctors();
                break;
        }
    } catch (err) {
        console.error(err);
        contentArea.innerHTML = `<div class="error">Error loading data: ${err.message}</div>`;
    }
}

// Data Fetching
async function loadDashboardData() {
    const [patients, doctors, appointments, meals] = await Promise.all([
        fetch('/api/patients').then(res => res.json()),
        fetch('/api/doctors').then(res => res.json()),
        fetch('/api/appointments').then(res => res.json()),
        fetch('/api/meals').then(res => res.json()) // Just to have data
    ]);
    currentState = { ...currentState, patients, doctors, appointments, meals };
}

async function loadPatientData() {
    currentState.patients = await fetch('/api/patients').then(res => res.json());
}

async function loadDoctorData() {
    currentState.doctors = await fetch('/api/doctors').then(res => res.json());
}

async function loadAppointmentData() {
    currentState.appointments = await fetch('/api/appointments').then(res => res.json());
    currentState.doctors = await fetch('/api/doctors').then(res => res.json()); // Need doctors for booking
}

async function loadMealData() {
    currentState.meals = await fetch('/api/meals').then(res => res.json());
}


// Rendering Functions
function renderDashboard() {
    const { patients, doctors, appointments, meals } = currentState;

    const html = `
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-icon" style="background: #E0F2FE; color: #0284C7;">
                    <i class="uil uil-users-alt"></i>
                </div>
                <div class="stat-info">
                    <h3>${patients.length}</h3>
                    <p>Total Patients</p>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon" style="background: #DCFCE7; color: #16A34A;">
                    <i class="uil uil-stethoscope"></i>
                </div>
                <div class="stat-info">
                    <h3>${doctors.length}</h3>
                    <p>Active Doctors</p>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon" style="background: #FAE8FF; color: #C026D3;">
                    <i class="uil uil-calendar-alt"></i>
                </div>
                <div class="stat-info">
                    <h3>${appointments.length}</h3>
                    <p>Appointments</p>
                </div>
            </div>
             <div class="stat-card">
                <div class="stat-icon" style="background: #FFEDD5; color: #EA580C;">
                    <i class="uil uil-bed"></i>
                </div>
                <div class="stat-info">
                    <h3>${patients.filter(p => p.bedNumber).length}</h3>
                    <p>Occupied Beds</p>
                </div>
            </div>
        </div>

        <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 2rem;">
            <div class="card">
                <h3>Recent Patients</h3>
                <table class="meal-table" style="margin-top: 1rem;">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Bed</th>
                            <th>Diagnosis</th>
                            <th>Gender</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${patients.slice(0, 5).map(p => `
                            <tr>
                                <td>${p.name}</td>
                                <td>${p.bedNumber || '-'}</td>
                                <td>${p.diagnosis}</td>
                                <td>${p.gender}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
             <div class="card">
                <h3>Doctor Availability</h3>
                <div style="margin-top: 1rem; display: flex; flex-direction: column; gap: 1rem;">
                    ${doctors.slice(0, 4).map(d => `
                        <div style="display: flex; align-items: center; gap: 1rem; padding: 0.5rem; background: var(--bg-light); border-radius: 8px;">
                            <div style="width: 10px; height: 10px; background: #16A34A; border-radius: 50%;"></div>
                            <div>
                                <strong>${d.name}</strong>
                                <div style="font-size: 0.8rem; color: gray;">${d.specialization}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
    contentArea.innerHTML = html;
}

function renderAppointments() {
    const { appointments, doctors } = currentState;

    const html = `
        <h2 style="margin-bottom: 2rem;">Appointments</h2>
        
        <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 2rem;">
             <!-- Booking Form -->
            <div class="booking-form" style="background: white; padding: 2rem; border-radius: var(--radius-lg);">
                <h3 style="margin-bottom: 1.5rem;">Book New Appointment</h3>
                <form id="appointmentForm">
                    <div class="form-group">
                        <label>Patient Name</label>
                        <input type="text" name="patientName" required>
                    </div>
                    <div style="display: flex; gap: 1rem;">
                        <div class="form-group" style="flex: 1;">
                            <label>Age</label>
                            <input type="number" name="age" required>
                        </div>
                        <div class="form-group" style="flex: 1;">
                            <label>Gender</label>
                            <select name="gender" style="width: 100%; padding: 0.75rem; border: 1px solid var(--border-color); border-radius: var(--radius-md);">
                                <option>Male</option>
                                <option>Female</option>
                                <option>Other</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Contact Number</label>
                        <input type="text" name="contact" required>
                    </div>
                    <div class="form-group">
                        <label>Select Doctor</label>
                        <select name="doctor" id="doctorSelect" style="width: 100%; padding: 0.75rem; border: 1px solid var(--border-color); border-radius: var(--radius-md);">
                            <option value="">Choose a doctor</option>
                            ${doctors.map(d => `<option value="${d._id}">${d.name} (${d.specialization})</option>`).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Date</label>
                        <input type="date" name="date" required>
                    </div>
                    <button type="submit" class="btn-primary">Book Appointment</button>
                </form>
            </div>

            <!-- Appointments List -->
            <div class="upcoming-appointments">
                <h3 style="margin-bottom: 1rem;">Upcoming Appointments</h3>
                <div style="display: flex; flex-direction: column; gap: 1rem;">
                    ${appointments.length > 0 ? appointments.map(app => `
                        <div style="background: white; padding: 1rem; border-radius: 8px; border: 1px solid #eee;">
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <strong>${app.patientName}</strong>
                                <span class="badge" style="background: #e0f2fe; color: #0369a1;">${new Date(app.date).toLocaleDateString()}</span>
                            </div>
                            <div style="font-size: 0.85rem; color: gray; margin-top: 0.5rem;">
                                With: ${app.doctor ? app.doctor.name : 'Unknown Doctor'}
                            </div>
                             <div style="font-size: 0.85rem; color: gray;">
                                Status: <span style="color: #ca8a04;">${app.status || 'Pending'}</span>
                            </div>
                        </div>
                    `).join('') : '<p style="color: gray;">No upcoming appointments.</p>'}
                </div>
            </div>
        </div>
    `;
    contentArea.innerHTML = html;

    document.getElementById('appointmentForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());

        try {
            const res = await fetch('/api/appointments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (res.ok) {
                alert('Appointment Booked Successfully!');
                // Re-fetch data to show new appointment immediately
                await loadAppointmentData();
                renderAppointments();
            } else {
                alert('Error booking appointment');
            }
        } catch (err) {
            console.error(err);
            alert('Error booking appointment');
        }
    });
}

function renderPatients() {
    const { patients } = currentState;

    // We'll show a split view: List on left, details on right (if selected)
    // For simplicity, let's just show the list and clicking expands or shows a modal? 
    // Let's do the "Search and View" style.

    const html = `
        <div style="display: flex; gap: 2rem; height: 100%;">
            <div style="width: 350px; overflow-y: auto;">
                 <div class="search-bar" style="width: 100%; margin-bottom: 1rem;">
                    <i class="uil uil-search"></i>
                    <input type="text" id="patientSearch" placeholder="Name or Bed Number">
                </div>
                <div id="patientList">
                    ${renderPatientList(patients)}
                </div>
            </div>
            <div class="patient-detail-card" id="patientDetailView">
                <div style="text-align: center; color: #aaa; margin-top: 5rem;">
                    Select a patient to view details
                </div>
            </div>
        </div>
    `;
    contentArea.innerHTML = html;

    // Search Logic
    document.getElementById('patientSearch').addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const filtered = patients.filter(p =>
            p.name.toLowerCase().includes(term) ||
            (p.bedNumber && p.bedNumber.toLowerCase().includes(term))
        );
        document.getElementById('patientList').innerHTML = renderPatientList(filtered);
        attachPatientClickHandlers(filtered);
    });

    attachPatientClickHandlers(patients);
}

function renderPatientList(patients) {
    return patients.map(p => `
        <div class="patient-card" data-id="${p._id}">
            <div style="display: flex; justify-content: space-between;">
                <strong>${p.name}</strong>
                <span class="badge badge-teal">${p.bedNumber || 'No Bed'}</span>
            </div>
            <div style="font-size: 0.85rem; color: gray; margin-top: 0.25rem;">
                ${p.gender}, ${p.age} yrs
            </div>
        </div>
    `).join('');
}

function attachPatientClickHandlers(patients) {
    document.querySelectorAll('.patient-card').forEach(card => {
        card.addEventListener('click', () => {
            const id = card.dataset.id;
            const patient = patients.find(p => p._id === id);
            renderPatientDetail(patient);
        });
    });
}

function renderPatientDetail(patient) {
    const detailView = document.getElementById('patientDetailView');
    detailView.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: start;">
            <div>
                <h2>${patient.name}</h2>
                <div style="color: gray;">Bed: <strong>${patient.bedNumber}</strong></div>
            </div>
            <div class="badge badge-teal" style="font-size: 1rem;">${patient.diagnosis}</div>
        </div>
        
        <div style="margin-top: 2rem; display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
            <div>
                <h4>Bio</h4>
                <p><strong>Age:</strong> ${patient.age}</p>
                <p><strong>Gender:</strong> ${patient.gender}</p>
                <p><strong>Contact:</strong> ${patient.contact || 'N/A'}</p>
            </div>
            <div>
                 <h4>Assigned Doctor</h4>
                 <div style="display: flex; align-items: center; gap: 0.5rem; margin-top: 0.5rem;">
                    <i class="uil uil-user-md" style="font-size: 1.5rem;"></i>
                    <span>${patient.assignedDoctor ? patient.assignedDoctor.name : 'Unassigned'}</span>
                 </div>
            </div>
        </div>

        <h3 style="margin-top: 2rem; margin-bottom: 1rem;">Prescribed Medicines</h3>
        ${patient.medicines && patient.medicines.length > 0 ? patient.medicines.map(m => `
            <div class="medicine-item">
                <div style="display: flex; justify-content: space-between; font-weight: 600;">
                    ${m.name}
                    <span>${m.dosage}</span>
                </div>
                <div style="font-size: 0.85rem; color: gray; margin-top: 0.25rem;">
                    <i class="uil uil-clock"></i> ${m.timing}
                </div>
            </div>
        `).join('') : '<p>No medicines prescribed.</p>'}
    `;
}

function renderMeals() {
    const { meals } = currentState;
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    // Default to Monday or get from existing context? 
    // Let's simple filter by day tab.

    const html = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
            <h2>Meal Schedule</h2>
            <div class="day-selector">
                ${days.map(day => `<button class="day-btn ${day === 'Monday' ? 'active' : ''}" onclick="filterMeals('${day}')">${day.substring(0, 3)}</button>`).join('')}
            </div>
        </div>

        <div class="meal-table-container">
            <h3 style="padding: 1.5rem; background: #f0fdf4; color: #166534; border-bottom: 1px solid #e5e7eb;">
                <span id="currentDay">Monday</span>'s Meal Schedule
            </h3>
            <table class="meal-table">
                <thead>
                    <tr>
                        <th>Patient Name</th>
                        <th>Bed Number</th>
                        <th>Diet Type</th>
                        <th><i class="uil uil-sun"></i> Morning</th>
                         <th><i class="uil uil-utensils-alt"></i> Lunch</th>
                         <th><i class="uil uil-moon"></i> Dinner</th>
                    </tr>
                </thead>
                <tbody id="mealTableBody">
                    <!-- Injected -->
                </tbody>
            </table>
        </div>
        
        <div style="margin-top: 1rem; display: flex; gap: 1rem; font-size: 0.85rem;">
             <span class="badge" style="background: #dcfce7; color: #166534;">Normal</span> Regular Diet
             <span class="badge" style="background: #dbeafe; color: #1e40af;">Diabetic</span> Sugar-controlled
             <span class="badge" style="background: #ffedd5; color: #9a3412;">Low Salt</span> Sodium-restricted
        </div>
    `;
    contentArea.innerHTML = html;

    // Add styles for day buttons dynamically
    const style = document.createElement('style');
    style.innerHTML = `
        .day-btn { padding: 0.5rem 1rem; border: 1px solid #eee; background: white; cursor: pointer; border-radius: 4px; }
        .day-btn.active { background: var(--text-dark); color: white; border-color: var(--text-dark); }
    `;
    document.head.appendChild(style);

    // Initial load
    window.filterMeals = (day) => {
        document.querySelectorAll('.day-btn').forEach(btn => btn.classList.remove('active'));
        event.target.classList.add('active'); // Won't work directly with window function context, need fix

        document.getElementById('currentDay').innerText = day;
        updateMealTable(day);
    };

    // Re-attach listeners properly
    document.querySelectorAll('.day-btn').forEach(btn => {
        btn.onclick = (e) => {
            document.querySelectorAll('.day-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            const day = e.target.innerText === 'Mon' ? 'Monday' :
                e.target.innerText === 'Tue' ? 'Tuesday' :
                    e.target.innerText === 'Wed' ? 'Wednesday' :
                        e.target.innerText === 'Thu' ? 'Thursday' :
                            e.target.innerText === 'Fri' ? 'Friday' :
                                e.target.innerText === 'Sat' ? 'Saturday' : 'Sunday';

            document.getElementById('currentDay').innerText = day;
            updateMealTable(day);
        }
    });

    updateMealTable('Monday');
}

function updateMealTable(day) {
    const { meals } = currentState;
    const dailyMeals = meals.filter(m => m.day === day);
    const tbody = document.getElementById('mealTableBody');

    if (dailyMeals.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; color:gray;">No meals scheduled for this day.</td></tr>';
        return;
    }

    tbody.innerHTML = dailyMeals.map(m => {
        const dietClass = m.dietType === 'Diabetic' ? 'background: #dbeafe; color: #1e40af;' :
            m.dietType === 'Low Salt' ? 'background: #ffedd5; color: #9a3412;' :
                'background: #dcfce7; color: #166534;';

        return `
        <tr>
            <td>${m.patient ? m.patient.name : 'Unknown'}</td>
            <td>${m.patient ? m.patient.bedNumber : '-'}</td>
            <td><span class="badge" style="${dietClass}">${m.dietType}</span></td>
            <td>${m.morning}</td>
            <td>${m.lunch}</td>
            <td>${m.dinner}</td>
        </tr>
    `}).join('');
}


function renderDoctors() {
    const { doctors } = currentState;

    const html = `
        <h2 style="margin-bottom: 2rem;">Medical Professionals</h2>
        <div class="doctor-grid">
            ${doctors.map(d => `
                <div class="doctor-card" style="flex-direction: column;">
                    <div style="display: flex; gap: 1rem; align-items: start;">
                        <img src="https://ui-avatars.com/api/?name=${d.name}&background=random" class="doctor-img">
                        <div class="doctor-info">
                            <h3>${d.name}</h3>
                            <span class="badge badge-teal">${d.specialization}</span>
                             <div style="margin-top: 0.5rem; font-size: 0.85rem; color: #16A34A; display: flex; align-items: center; gap: 0.25rem;">
                                <div style="width: 8px; height: 8px; background: #16A34A; border-radius: 50%;"></div>
                                Available Today
                             </div>
                        </div>
                    </div>
                    
                    <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #eee;">
                        <div style="font-size: 0.85rem; color: gray; margin-bottom: 0.5rem;">
                            <i class="uil uil-clock-three"></i> Available Slots
                        </div>
                        <div class="slots-grid">
                             ${d.slots.length ? d.slots.map(s => `<span class="slot-time">${s}</span>`).join('') : 'No free slots'}
                             ${d.slots.length > 3 ? `<span class="slot-time">+${d.slots.length - 3} more</span>` : ''}
                        </div>
                    </div>

                    <div style="margin-top: 1rem; font-size: 0.9rem;">
                        <div style="margin-bottom: 0.5rem;"><i class="uil uil-phone-alt" style="margin-right: 0.5rem; color: var(--primary-color);"></i> ${d.contact || 'N/A'}</div>
                        <div><i class="uil uil-envelope" style="margin-right: 0.5rem; color: var(--primary-color);"></i> ${d.email || 'N/A'}</div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
    contentArea.innerHTML = html;
}
