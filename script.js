// document.body.addEventListener("click", handleLeftClick);
// document.body.addEventListener("contextmenu", handleRightClick);

const lifeGrid = new LifeGrid($("life-grid"));

const today = new Date();
const journey = new Era(lifeGrid.rootDate, today, "teal");
lifeGrid.addEra(journey);
console.log(journey);
lifeGrid.render();


// Body mouse events - mostly cleanup
document.onmouseleave = (event) => {
  // lifeGrid.clearTargets();
}

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

// Generate user data
const user = new User("Tyler A Johnson", new Date("February 27, 1991"));

const age = getWeeksDuration(new Date().getTime() - user.birthdate.getTime());

// Date search events
$("date-search").oninput = (event) => {
  const targetDate = new Date(event.target.value);
  const selection = lifeGrid.dateToWeek(targetDate, lifeGrid.rootDate);
  lifeGrid.clearStyle("selected");
  lifeGrid.addStyle(selection, selection, "selected");
}


// Select Options
let option = document.createElement("option");
option.value = "lifespan";
option.textContent = "Lifespan";
$("lens-choice").add(option);

option = document.createElement("option");
option.value = "homes";
option.textContent = "Homes";
$("lens-choice").add(option);

// Populate Sync options from enum
for (let [key, value] of Object.entries(TimeSync)) {
  const option = document.createElement("option");
  option.value = value;
  option.textContent = key;
  $("time-sync").add(option);
}

$("time-sync").onchange = (event) => {
  lifeGrid.timeSync = event.target.value;
  // lifeGrid.debugColors();
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

