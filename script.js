document.body.addEventListener("click", handleLeftClick);
document.body.addEventListener("contextmenu", handleRightClick);

// Data
const weeks = [];
const weekProgress = 136;
const weekCount = 4004;
let animating = false;

for (let i = 0; i < weekCount; i++) {

    addWeek();
}

animate();

function addWeek() {
    const grid = document.getElementById("week-grid");
    const week = document.createElement("div");

    // week.id = 
    week.classList.add("week");
    // week.classList.add("center");

    // week.style.setProperty("--color", "orange");

    grid.appendChild(week);
}

function removeWeeks(event) {
    const grid = document.getElementById("week-grid");
    grid.innerHTML = "";
    addWeek();
}

function getRandomColor() {
    return (
      "#" +
      Math.floor(Math.random() * 16777216)
        .toString(16)
        .padStart(6, "0")
    );
  }

function animate() {
    if (!animating) return;
    requestAnimationFrame(animate);

    const grid = document.getElementById("week-grid");
    Array.from(grid.children).forEach(week => {
        week.style.setProperty("--color",`hsl(
            ${ Math.floor( Math.random() * 256 ) },
            ${ Math.floor( Math.random() * 100 ) }%,
            ${ Math.floor( Math.random() * 100 ) }%
        )`);
    });
}

// Left click
function handleLeftClick() {
    // addWeek();
    animating = true;
    animate();
}

//Right click
function handleRightClick(event) {
    event.preventDefault();
    // removeWeeks();
    animating = false;
}