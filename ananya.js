let selectedTime = "";
let selectedDoctor = "";


const doctorSelect = document.getElementById("doctor");
const doctorCards = document.querySelectorAll(".doctor-card");



document.querySelectorAll(".slot").forEach(slot => {
    slot.addEventListener("click", () => {
        document.querySelectorAll(".slot").forEach(s => s.classList.remove("active"));
        slot.classList.add("active");
        selectedTime = slot.innerText;
    });
});

// function selectDoctor(card, doctorName) {
//     document.querySelectorAll(".doctor-card").forEach(c => c.classList.remove("active"));
//     card.classList.add("active");
//     selectedDoctor = doctorName;
// }


/* ---------- DOCTOR CARD CLICK ---------- */
function selectDoctor(card, doctorName) {
    document.querySelectorAll(".doctor-card").forEach(c => c.classList.remove("active"));
    card.classList.add("active");
    selectedDoctor = doctorName;

    // dropdown bhi update ho
    document.getElementById("doctor").value = doctorName;

    console.log("Card selected:", selectedDoctor);
}

/* ---------- DROPDOWN CHANGE ---------- */
function doctorDropdownChange(select) {
    selectedDoctor = select.value;

    document.querySelectorAll(".doctor-card").forEach(card => {
        card.classList.remove("active");

        if (card.dataset.name === selectedDoctor) {
            card.classList.add("active");
        }

    });
    console.log("Dropdown selected:", selectedDoctor);
}





function bookAppointment() {
    document.getElementById("formSection").style.display = "none";
    document.querySelector(".doctor-section").style.display = "none";
    document.getElementById("confirmSection").style.display = "block";

    document.getElementById("cName").innerText =
        document.getElementById("name").value;

    document.getElementById("cDoctor").innerText = selectedDoctor;
    document.getElementById("cDate").innerText =
        document.getElementById("date").value;

    document.getElementById("cTime").innerText = selectedTime;
}

