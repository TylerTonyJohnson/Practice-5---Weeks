document.body.addEventListener("click", addWeek);
document.body.addEventListener("contextmenu", removeWeeks);

function addWeek(event) {
    const grid = document.getElementById("week-grid");
    const week = document.createElement("div");
    week.classList.add("week");
    grid.appendChild(week);
}

function removeWeeks(event) {
    event.preventDefault();
    const grid = document.getElementById("week-grid");
    grid.innerHTML = "";
}