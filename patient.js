// function searchPatient() {
//   const value = document.getElementById("searchInput").value.toLowerCase();
//   document.querySelectorAll(".patient-card").forEach(card => {
//     card.style.display = card.dataset.name.includes(value) ? "flex" : "none";
//   });
// }

const patients = {
    john: {
        name: "John Smith",
        ageGender: "45 Years, Male",
        bed: "A-101",
        diagnosis: "Hypertension",
        doctor: "Dr. Sarah Johnson",
        medicines: [
            { name: "Amlodipine", dose: "5mg", time: "Morning" },
            { name: "Aspirin", dose: "75mg", time: "Night" }
        ]
    },
    mary: {
        name: "Mary Johnson",
        ageGender: "38 Years, Female",
        bed: "B-205",
        diagnosis: "Diabetes",
        doctor: "Dr. Robert Brown",
        medicines: [
            { name: "Metformin", dose: "500mg", time: "Morning" }
        ]
    },
    robert: {
        name: "Robert Williams",
        ageGender: "52 Years, Male",
        bed: "C-312",
        diagnosis: "Heart Problem",
        doctor: "Dr. Emily Davis",
        medicines: [
            { name: "Atorvastatin", dose: "10mg", time: "Night" }
        ]
    },
    lisa: {
        name: "Lisa Brown",
        ageGender: "52 Years, Female",
        bed: "A-105",
        diagnosis: "Migraine",
        doctor: "Dr. james Anderson",
        medicines: [
            { name: "sumatriptan", dose: "50mg", time: "Morning" }
        ]
    }
};

function showPatient(id, element) {
    document.querySelectorAll(".patient-card")
        .forEach(c => c.classList.remove("active"));
    element.classList.add("active");

    const p = patients[id];

    document.getElementById("pName").innerText = p.name;
    document.getElementById("pAgeGender").innerText = p.ageGender;
    document.getElementById("pBed").innerText = p.bed;
    document.getElementById("pDiagnosis").innerText = p.diagnosis;
    document.getElementById("pDoctor").innerText = p.doctor;

    document.getElementById("medicines").innerHTML =
        p.medicines.map(m => `
      <div class="medicine">
        <b>${m.name}</b><br>
        Dose: ${m.dose}<br>
        Time: ${m.time}
      </div>
    `).join("");
}

/* Default load */
showPatient("john", document.querySelector(".patient-card"));
