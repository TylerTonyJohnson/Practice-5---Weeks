document.body.addEventListener("click", handleLeftClick);
document.body.addEventListener("contextmenu", handleRightClick);

// Data
const weeks = [];
const weekProgress = 136;
const weekCount = 4004;
let animating = false;

for (let i = 1; i <= weekCount; i++) {

    addWeek(i);
}

animate();

function addWeek(i) {
    const grid = document.getElementById("week-grid");
    const week = document.createElement("div");

    week.id = i;
    week.classList.add("week");

    let left, right, top, bot = false;

    if (week.id % 4 === 0 && week.id % 52 !== 0) left = true;
    if (week.id % 4 === 1 && week.id % 52 !== 1) right = true;
    if (Math.ceil(week.id / 52) % 10 === 0) top = true;
    if ((Math.ceil(week.id / 52) % 10 === 1) && (Math.ceil(week.id / 52) !== 1)) bot = true; 

    // Set anchor
    if (left) week.classList.add("left");
    if (right) week.classList.add("right");
    if (top) week.classList.add("top");
    if (bot) week.classList.add("bottom");

    // Set aspect Ratio
    switch (true) {
        case ((left || right) && !(top || bot)):
            week.classList.add("short");
            break;
        case (!(left || right) && (top || bot)):
            week.classList.add("tall");
            break;
        default:
            week.classList.add("square");
    }

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