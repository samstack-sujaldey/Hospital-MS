const contentArea = document.getElementById('content-area');

// State
let doctors = [];
let patients = [];

// Init
document.addEventListener('DOMContentLoaded', async () => {
    // Check Auth
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (!token || user.role !== 'admin') {
        alert('Unauthorized. Redirecting to login.');
        window.location.href = '/';
        return;
    }

    // Navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            if (item.id === 'logoutBtn') {
                localStorage.clear();
                window.location.href = '/';
                return;
            }
            e.preventDefault();
            document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
            loadView(item.dataset.tab);
        });
    });

    await fetchData();
    loadView('doctors-manage');
});

async function fetchData() {
    doctors = await fetch('/api/doctors').then(res => res.json());
    patients = await fetch('/api/patients').then(res => res.json());
}

function loadView(view) {
    switch (view) {
        case 'doctors-manage': renderDoctorsManage(); break;
        case 'patients-assign': renderPatientsAssign(); break;
        case 'meals-manage': renderMealsManage(); break;
    }
}

function renderDoctorsManage() {
    const html = `
        <h2>Manage Doctors</h2>
        <div class="booking-container">
            <div class="booking-form" style="background: white; padding: 2rem; border-radius: var(--radius-lg);">
                <h3>Add New Doctor</h3>
                <form id="addDoctorForm">
                    <div class="form-group">
                        <label>Dr. Name</label>
                        <input type="text" name="name" required placeholder="e.g. Dr. Jane Doe">
                    </div>
                    <div class="form-group">
                        <label>Specialization</label>
                        <input type="text" name="specialization" required placeholder="e.g. Cardiology">
                    </div>
                    <div class="form-group">
                        <label>Contact</label>
                        <input type="text" name="contact" required>
                    </div>
                     <div class="form-group">
                        <label>Email</label>
                        <input type="email" name="email" required>
                    </div>
                    <hr style="margin: 1.5rem 0; border: 0; border-top: 1px solid #eee;">
                    <h4>Login Credentials for Doctor</h4>
                    <div class="form-group">
                        <label>Username</label>
                        <input type="text" name="username" required>
                    </div>
                    <div class="form-group">
                        <label>Password</label>
                        <input type="password" name="password" required>
                    </div>
                    <button type="submit" class="btn-primary">Add Doctor</button>
                </form>
            </div>
            
            <div class="list-container" style="flex: 1;">
                <h3>Current Doctors</h3>
                <div style="display: flex; flex-direction: column; gap: 1rem; margin-top: 1rem;">
                    ${doctors.map(d => `
                        <div style="background: white; padding: 1rem; border-radius: 8px; border: 1px solid #eee;">
                            <strong>${d.name}</strong>
                            <div style="color: gray; font-size: 0.9rem;">${d.specialization}</div>
                            <small>${d.email || 'No email'}</small>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
    contentArea.innerHTML = html;

    document.getElementById('addDoctorForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(e.target));

        try {
            const res = await fetch('/api/doctors', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (res.ok) {
                alert('Doctor added successfully!');
                await fetchData();
                renderDoctorsManage();
            } else {
                alert('Failed to add doctor');
            }
        } catch (e) { console.error(e); }
    });
}

function renderPatientsAssign() {
    // Determine unassigned patients
    const unassigned = patients.filter(p => !p.assignedDoctor && !p.isDischarged);

    // HTML with "Register New Patient" Form + "Assign Existing" List
    const html = `
        <h2>Patient Management</h2>
        
        <!-- 1. ADD NEW PATIENT FORM -->
        <div style="background: white; padding: 2rem; border-radius: var(--radius-lg); margin-bottom: 2rem; border: 1px solid #e2e8f0;">
            <h3>Register Upcoming Patient</h3>
            <form id="addPatientForm">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                    <div class="form-group">
                        <label>Patient Name</label>
                        <input type="text" name="name" required placeholder="Full Name">
                    </div>
                    <div class="form-group">
                        <label>Age</label>
                        <input type="number" name="age" required>
                    </div>
                    <div class="form-group">
                        <label>Gender</label>
                        <select name="gender" required style="width: 100%; padding: 0.75rem; border: 1px solid var(--border-color); border-radius: var(--radius-md);">
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Contact</label>
                        <input type="text" name="contact" required>
                    </div>
                     <div class="form-group" style="grid-column: span 2;">
                        <label>Medical Condition / Diagnosis</label>
                        <input type="text" name="diagnosis" required placeholder="e.g. High Fever, Fracture">
                    </div>
                     <div class="form-group">
                        <label>Bed Number (Optional)</label>
                        <input type="text" name="bedNumber" placeholder="e.g. A-101">
                    </div>
                    <div class="form-group">
                        <label>Assign Doctor Immediately (Optional)</label>
                         <select name="assignedDoctor" style="width: 100%; padding: 0.75rem; border: 1px solid var(--border-color); border-radius: var(--radius-md);">
                             <option value="">-- Assign Later --</option>
                             ${doctors.map(d => `<option value="${d._id}">${d.name} (${d.specialization})</option>`).join('')}
                        </select>
                    </div>
                </div>
                <button type="submit" class="btn-primary" style="margin-top: 1rem;">Register Patient</button>
            </form>
        </div>

        <!-- 2. ADDRESS UNASSIGNED PATIENTS -->
        <h3>Unassigned Patients Queue</h3>
        <div style="margin-top: 1rem;">
            ${unassigned.length === 0 ? '<p style="color:gray;">No pending assignments.</p>' : ''}
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem;">
                ${unassigned.map(p => `
                    <div style="background: white; padding: 1.5rem; border-radius: 8px; border: 1px solid #ddd;">
                        <h4>${p.name}</h4>
                        <div style="font-size: 0.9rem; color: #64748b; margin-bottom: 0.5rem;">
                            <span>Age: ${p.age}</span> | <span>Condition: ${p.diagnosis}</span>
                        </div>
                        <div style="margin-top: 1rem;">
                            <label style="font-size: 0.85rem;">Assign To:</label>
                            <select class="assign-select" data-pid="${p._id}" style="width: 100%; padding: 0.5rem; margin-top: 0.5rem;">
                                <option value="">Select Doctor</option>
                                ${doctors.map(d => `<option value="${d._id}">${d.name} (${d.specialization})</option>`).join('')}
                            </select>
                            <button onclick="assignDoctor('${p._id}')" class="btn-primary" style="margin-top: 1rem; width: 100%;">Confirm Assignment</button>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    contentArea.innerHTML = html;

    // Handle New Patient Registration
    document.getElementById('addPatientForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);

        // Remove empty assignedDoctor if not selected so backend doesn't error
        if (!data.assignedDoctor) delete data.assignedDoctor;

        try {
            const res = await fetch('/api/patients', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (res.ok) {
                alert('Patient registered successfully!');
                await fetchData(); // Refresh local data
                renderPatientsAssign(); // Re-render view
            } else {
                alert('Failed to register patient');
            }
        } catch (e) { console.error(e); }
    });
}

window.assignDoctor = async (patientId) => {
    const select = document.querySelector(`.assign-select[data-pid="${patientId}"]`);
    const doctorId = select.value;

    if (!doctorId) return alert('Please select a doctor');

    try {
        const res = await fetch(`/api/patients/${patientId}/assign`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ doctorId })
        });

        if (res.ok) {
            alert('Assigned successfully');
            await fetchData();
            renderPatientsAssign();
        }
    } catch (e) { console.error(e); }
};

function renderMealsManage() {
    const html = `
        <h2>Manage Patient Meals</h2>
        <div class="booking-container">
            <div class="booking-form" style="background: white; padding: 2rem; border-radius: var(--radius-lg);">
                <h3>Add Meal Plan</h3>
                <form id="addMealForm">
                     <div class="form-group">
                        <label>Select Patient</label>
                        <select name="patient" required style="width: 100%; padding: 0.75rem; border: 1px solid var(--border-color); border-radius: var(--radius-md);">
                             ${patients.map(p => `<option value="${p._id}">${p.name} (${p.bedNumber || 'No Bed'})</option>`).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Day</label>
                        <select name="day" required style="width: 100%; padding: 0.75rem; border: 1px solid var(--border-color); border-radius: var(--radius-md);">
                            ${['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(d => `<option value="${d}">${d}</option>`).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Diet Type</label>
                        <select name="dietType" required style="width: 100%; padding: 0.75rem; border: 1px solid var(--border-color); border-radius: var(--radius-md);">
                            <option value="Normal">Normal</option>
                            <option value="Diabetic">Diabetic</option>
                             <option value="Low Salt">Low Salt</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Morning Meal</label>
                        <input type="text" name="morning" required placeholder="e.g. Oatmeal">
                    </div>
                    <div class="form-group">
                        <label>Lunch</label>
                        <input type="text" name="lunch" required placeholder="e.g. Grilled Chicken">
                    </div>
                    <div class="form-group">
                         <label>Dinner</label>
                        <input type="text" name="dinner" required placeholder="e.g. Salad">
                    </div>
                    <button type="submit" class="btn-primary">Save Meal Plan</button>
                </form>
            </div>
            <div class="list-container" style="flex: 1;">
                 <h3>Existing Meal Plans</h3>
                 <p style="color: gray; font-size: 0.9rem;">(Coming soon: List view of meals)</p>
            </div>
        </div>
    `;
    contentArea.innerHTML = html;

    document.getElementById('addMealForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(e.target));

        try {
            const res = await fetch('/api/meals', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (res.ok) {
                alert('Meal plan added successfully!');
            } else {
                alert('Failed to add meal plan');
            }
        } catch (e) { console.error(e); }
    });
}
