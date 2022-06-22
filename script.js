// document.body.addEventListener("click", handleLeftClick);
// document.body.addEventListener("contextmenu", handleRightClick);

const lifeGrid = new LifeGrid($("life-grid"));

// Body mouse events - mostly cleanup

document.body.onmouseup = (event) => {
  lifeGrid.clearStyle("highlight", "highlight-boundary");
  lifeGrid.clearTargets();
}

document.body.onmousedown = (event) => {
  lifeGrid.clearStyle("highlight");
  lifeGrid.clearStyle("selected");
}

document.body.onmouseover = (event) => {
  lifeGrid.hoverLabel.clear();
}

// Keyboard events
document.onkeydown = (event) => {
  const key = event.code;
  console.log(event.code);
  switch (key) {
    case "Escape":
      lifeGrid.clearStyle("highlight", "highlight-boundary", "selected");
      lifeGrid.clearTargets();
      break;
    case "KeyG":
      console.log("You a G!");
      break;
    default:
      break;
  }

}




const weekCount = 4004;
let rootDate;

// Initialize mouse events
let mouseDown = false;
let mouseDownTarget = null;

// // Preferences
// const hoverLabel = new HoverLabel($("hover-label"));
// const hoverLabelOffset = 20; // pixels

// // Create fake data
// const schoolOne = {
//   start: 1,
//   end: 500,
//   color: getRandomColor(),
// };

// Generate user data
const user = new User("Tyler A Johnson", new Date("February 27, 1991"));

const age = getWeeksDuration(new Date().getTime() - user.birthdate.getTime());

// Select Options

let option = document.createElement("option");
option.value = "lifespan";
option.textContent = "Lifespan";
$("lens-choice").add(option);

option = document.createElement("option");
option.value = "homes";
option.textContent = "Homes";
$("lens-choice").add(option);

// Sync options
option = document.createElement("option");
option.value = TimeSync.WEEKSYNC;
option.textContent = "Week Sync";
$("time-sync").add(option);

option = document.createElement("option");
option.value = TimeSync.MONTHSYNC;
option.textContent = "Month Sync";
$("time-sync").add(option);

option = document.createElement("option");
option.value = TimeSync.YEARSYNC;
option.textContent = "Year Sync";
$("time-sync").add(option);

$("time-sync").onchange = (event) => {
  lifeGrid.timeSync = event.target.value;
  lifeGrid.updateColors();
}

// $("time-sync").selectedIndex = 0;
$("time-sync").value = TimeSync.YEARSYNC;

// function toggleIsChecked($week) {
//   if ($week.classList.contains("checked")) {
//     $week.classList.remove("checked");
//     $week.classList.add("unchecked");
//   } else if ($week.classList.contains("unchecked")) {
//     $week.classList.remove("unchecked");
//     $week.classList.add("checked");
//   }
// }

