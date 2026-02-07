const contentArea = document.getElementById('content-area');
const doctorNameEl = document.getElementById('doctorName');
const doctorImgEl = document.getElementById('doctorImg');

let myPatients = [];
let currentDoctor = null;
let allDoctors = [];

document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (!token || user.role !== 'doctor') {
        alert('Unauthorized. Redirecting to login.');
        window.location.href = '/';
        return;
    }

    // Identify Doctor Profile from User ID
    // Since we don't have a direct endpoint for "me", we fetch all doctors and find match
    // Real implementation should have /api/auth/me endpoint returning profile
    await fetchDoctorProfile(user.id);

    document.getElementById('logoutBtn').addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.clear();
        window.location.href = '/';
    });

    loadMyPatients();
});

async function fetchDoctorProfile(userId) {
    try {
        const doctors = await fetch('/api/doctors').then(res => res.json());
        // Find doctor linking to this user
        // Note: We need to populate user in GET /doctors or find logic
        // For now, assuming backend doesn't return user info on public list, this might be tricky.
        // Alternative: Filter patients where assignedDoctor matches one of the doctors but we don't know WHICH one is us.

        // WORKAROUND: We need the backend to return the Doctor object related to the logged in User.
        // Since I can't easily change backend structure too radically right now, let's assume 
        // the public /doctors endpoint includes the 'user' field if I update it.
        // Wait, I updated the model, but GET /doctors usually returns everything.

        // Let's rely on finding by some identifier or just updated GET /doctors to include user.
        // Or better: Filter on client side if 'user' field is populated/returned.

        currentDoctor = doctors.find(d => d.user === userId || (d.user && d.user._id === userId) || d.user === userId); // Flexible check

        if (currentDoctor) {
            doctorNameEl.textContent = currentDoctor.name;
            doctorImgEl.src = currentDoctor.image || 'https://ui-avatars.com/api/?name=Dr+Who';
        } else {
            console.error("Could not find doctor profile for user", userId);
            doctorNameEl.textContent = "Doctor (Profile Not Found)";
        }

    } catch (e) { console.error(e); }
}

async function loadMyPatients() {
    if (!currentDoctor) {
        setTimeout(loadMyPatients, 500); // Retry if profile loading
        return;
    }

    const allPatients = await fetch('/api/patients').then(res => res.json());
    // Filter patients assigned to THIS doctor
    myPatients = allPatients.filter(p => !p.isDischarged && p.assignedDoctor && (p.assignedDoctor._id === currentDoctor._id || p.assignedDoctor === currentDoctor._id));

    renderMyPatients();
}

function renderMyPatients() {
    const html = `
        <h2>My Patients</h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem; margin-top: 2rem;">
            ${myPatients.length > 0 ? myPatients.map(p => `
                <div style="background: white; padding: 1.5rem; border-radius: 8px; border: 1px solid #ddd;">
                    <div style="display:flex; justify-content:space-between;">
                        <h4>${p.name}</h4>
                        <span style="font-size:0.8rem; background:#f0f9ff; color:#0284c7; padding:2px 8px; border-radius:12px;">${p.bedNumber || 'No Bed'}</span>
                    </div>
                    <p style="color: gray; font-size: 0.9rem;">${p.diagnosis}</p>
                    
                    <div style="margin-top: 1rem; border-top: 1px solid #f1f5f9; padding-top: 1rem;">
                        <strong>Medicines:</strong>
                        <ul style="font-size: 0.85rem; padding-left: 1.2rem; margin: 0.5rem 0;">
                            ${p.medicines && p.medicines.length ? p.medicines.map(m => `<li>${m.name} (${m.dosage})</li>`).join('') : '<li>No medicines</li>'}
                        </ul>
                    </div>

                    <div style="margin-top: 1rem; display:flex; gap: 0.5rem;">
                        <button onclick="dischargePatient('${p._id}')" style="flex:1; background: #fee2e2; color: #b91c1c; border:none; padding: 0.5rem; border-radius: 4px; cursor: pointer;">Discharge</button>
                    </div>
                </div>
            `).join('') : '<p>No active patients assigned.</p>'}
        </div>
    `;
    contentArea.innerHTML = html;
}

window.dischargePatient = async (id) => {
    if (!confirm('Discharge this patient?')) return;
    try {
        const res = await fetch(`/api/patients/${id}/discharge`, { method: 'PUT' });
        if (res.ok) {
            alert('Patient discharged');
            loadMyPatients(); // Refresh
        }
    } catch (e) { console.error(e); }
};
