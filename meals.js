const tableBody = document.getElementById("mealTableBody");
const title = document.getElementById("scheduleTitle");
const countText = document.getElementById("patientCount");
const buttons = document.querySelectorAll(".day-btn");

const mealData = {
    Monday: [
        { name: "John Smith", bed: "A-101", morning: ["Oatmeal with Berries","lowsalt"], lunch: ["Grilled Chicken Salad","lowsalt"], dinner: ["Baked Fish with Vegetables","lowsalt"] },
        { name: "Mary Johnson", bed: "B-205", morning: ["Sugar-Free Oatmeal","diabetic"], lunch: ["Grilled Chicken with Greens","diabetic"], dinner: ["Baked Fish","diabetic"] },
        { name: "Robert Williams", bed: "C-312", morning: ["Pancakes with Syrup","normal"], lunch: ["Burger with Fries","normal"], dinner: ["Spaghetti Bolognese","normal"] },
        { name: "Lisa Brown", bed: "A-105", morning: ["Oatmeal","normal"], lunch: ["Chicken Salad","normal"], dinner: ["Grilled Vegetables","normal"] }
    ],
    Tuesday: [
        { name: "John Smith", bed: "A-101", morning: ["Scrambled Eggs","lowsalt"], lunch: ["Turkey Sandwich","lowsalt"], dinner: ["Chicken Breast with Rice","lowsalt"] },
        { name: "Mary Johnson", bed: "B-205", morning: ["Egg White Omelet","diabetic"], lunch: ["Lentil Soup","diabetic"], dinner: ["Turkey with Vegetables","diabetic"] },
        { name: "Robert Williams", bed: "C-312", morning: ["Eggs and Bacon","normal"], lunch: ["Pizza","normal"], dinner: ["Fried Chicken","normal"] },
        { name: "Lisa Brown", bed: "A-105", morning: ["Yogurt Parfait","normal"], lunch: ["Soup and Bread","normal"], dinner: ["Pasta Primavera","normal"] }
    ]
    
};

function loadDay(day) {
    const patients = mealData[day];
    title.textContent = `${day}'s Meal Schedule`;
    countText.textContent = `Viewing meal plan for ${patients.length} patients`;
    tableBody.innerHTML = "";

    patients.forEach(p => {
        tableBody.innerHTML += `
        <tr>
            <td>${p.name}</td>
            <td>${p.bed}</td>
            ${cell(p.morning)}
            ${cell(p.lunch)}
            ${cell(p.dinner)}
        </tr>`;
    });
}

function cell([meal,type]) {
    return `<td>${meal}<br><span class="tag ${type}">${label(type)}</span></td>`;
}

function label(t){ return {normal:"Normal", diabetic:"Diabetic", lowsalt:"Low Salt"}[t]; }

buttons.forEach(btn => {
    btn.addEventListener("click", () => {
        buttons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        loadDay(btn.dataset.day);
    });
});

loadDay("Monday");
