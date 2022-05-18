// document.body.addEventListener("click", handleLeftClick);
// document.body.addEventListener("contextmenu", handleRightClick);
document.body.onmousedown = mouseDownHandler;
document.body.onmouseup = mouseUpHandler;
let mouseDown = false;

// const weeks = [];
const weekCount = 4004;
let rootDate // = new Date("January 1, 1990");

let mouseDownTarget = null;
// let animating = false;

// Preferences
const tooltipOffset = 20; // pixels

// const events = [];       // I'll need this later


// Create fake data
const schoolOne = {
  start: 1,
  end: 500,
  color: getRandomColor(),
};

// Generate user data
const user = new User(
  "Tyler A Johnson",
  new Date("February 27, 1991")
);


const age = getWeeksDuration(
  new Date().getTime() - user.birthdate.getTime()
);

let nowWeek = user.birthdate.toWeeks();

// Create weeks
for (let i = 1; i <= weekCount; i++) {
  addWeek(i);
}

changeColor(schoolOne);

let option = document.createElement("option");
option.value = "lifespan";
option.textContent = "Lifespan";
$("lens-choice").add(option);

option = document.createElement("option");
option.value = "homes";
option.textContent = "Homes";
$("lens-choice").add(option);

// Set display
$("display-name").textContent = user.name;
updateDisplay();

$("display-birthdate").onclick = (event) => {
  rootDate = user.birthdate;
  updateDisplay();
}

groupStyle(1,1500,"filled");




// Functions

function updateDisplay () {
  console.log("updating")
  if (rootDate) {
    $("display-birthdate").textContent = rootDate.toDateString();
  }
}

function addWeek(i) {
  // Get references to the dom
  const grid = document.getElementById("week-grid");

  // Create the week slot
  const weekSlot = document.createElement("div");
  weekSlot.classList.add("week-slot");

  // Create week
  const week = document.createElement("div");
  week.id = i;
  week.classList.add("week");

  // Calculate cell shape
  let left,
    right,
    top,
    bot = false;
  if (i % 4 === 0 && i % 52 !== 0) left = true;
  if (i % 4 === 1 && i % 52 !== 1) right = true;
  if (Math.ceil(i / 52) % 10 === 0) top = true;
  if (Math.ceil(i / 52) % 10 === 1 && Math.ceil(i / 52) !== 1) bot = true;

  // Set anchors

    // Default
  if (!left && !right) week.classList.add("left");
  if (!top && !bot) week.classList.add("top");

    // Special
  if (left) week.classList.add("left");
  if (right) week.classList.add("right");
  if (top) week.classList.add("top");
  if (bot) week.classList.add("bottom");

  // Set aspect Ratio based on cell shape
  switch (true) {
    // Small square
    case !(left || right) && !(top || bot):
      weekSlot.classList.add("square");
      week.classList.add("square");
      break;
    // Short rectangle
    case (left || right) && !(top || bot):
      weekSlot.classList.add("short");
      week.classList.add("short");
      break;
    // Tall rectangle
    case !(left || right) && (top || bot):
      weekSlot.classList.add("tall");
      week.classList.add("tall");
      break;
    // Big square
    case (left || right) && (top || bot):
      weekSlot.classList.add("big-square");
      week.classList.add("big-square");
      break;
  }

  // // Week mouse events
  // week.onclick = (event) => {
  //   // toggleIsChecked(event.target);
  //   console.log("click")
  //   event.target.style.backgroundColor = "red";
  // };

  weekSlot.ondragstart = (event) => event.preventDefault();
  weekSlot.ondragend = (event) => event.preventDefault();
  

  weekSlot.onmousedown = (event) => {
    // Set target for drag functionality
    mouseDownTarget = event.target.firstChild;

    // Set styling
    clearStyle("selected");
    clearStyle("highlight");
    clearStyle("highlight-boundary")
    groupStyle(mouseDownTarget.id, mouseDownTarget.id, "highlight-boundary");
  }

  weekSlot.onmouseup = (event) => {
    mouseUpTarget = event.target.firstChild;
    if (mouseUpTarget === mouseDownTarget) {
      groupStyle(mouseUpTarget.id, mouseUpTarget.id, "selected");
    } else {
      clearStyle("highlight");
      clearStyle("highlight-boundary");
      groupStyle(mouseDownTarget.id, mouseUpTarget.id, "selected");
    }

    mouseDownTarget = null;
    mouseUpTarget = null;
  }

  weekSlot.onmouseover = (event) => {
    const target = event.target.firstChild;
    // console.log("entering");
    target.classList.add("hovered");

    // Drag behavior
    if (mouseDownTarget) {
      // Highlight ending boundary orange
      groupStyle(target.id, target.id, "highlight-boundary")

      // Clear other boundaries
      Array.from(document.getElementsByClassName("highlight-boundary")).forEach( item => {

        if (item.id !== target.id && item.id !== mouseDownTarget.id) {
          item.classList.remove("highlight-boundary")
        };
      });

      // Highlight inner squares teal
      if (Math.abs(target.id - mouseDownTarget.id) > 1) {
        groupStyle(Number(mouseDownTarget.id) + 1, Number(target.id) - 1, "highlight");
      }
  
      // Make sure other square changes are removed.
      Array.from(document.getElementsByClassName("highlight")).forEach( item => {

        if (
          item.id <= Math.min(target.id, mouseDownTarget.id) || 
          item.id >= Math.max(target.id, mouseDownTarget.id)) {
            item.classList.remove("highlight");
        }

      })
    }


  }

  weekSlot.onmouseout = (event) => {
    const target = event.target.firstChild;
    // console.log("leaving");
    target.classList.remove("hovered");
  }

  weekSlot.onmousemove = (event) => {

    // if(mouseDown) {
    //   event.target.firstChild.style.backgroundColor = "green";
    //   event.target.firstChild.style.borderColor = "green";
    // }

    const tooltip = $("tooltip");
    if (rootDate) {

    } else {
      tooltip.innerHTML = event.target.firstChild.id;
    }

    tooltip.style.display = "block";
    tooltip.style.top = event.pageY - tooltipOffset + "px";
    tooltip.style.left = event.pageX + tooltipOffset + "px";
  };

  weekSlot.onmouseleave = (event) => {
    const tooltip = $("tooltip");

    tooltip.innerHTML = ":)";
    tooltip.style.display = "none";
  };

  // Add cell to grid
  weekSlot.appendChild(week);
  grid.appendChild(weekSlot);
}

function clearStyle(styleName) {
  Array.from(document.getElementsByClassName(styleName)).forEach( item => {
    item.classList.remove(styleName);
  })
}


// function removeWeeks(event) {
//   const grid = document.getElementById("week-grid");
//   grid.innerHTML = "";
//   addWeek();
// }

function toggleIsChecked($week) {
  if ($week.classList.contains("checked")) {
    $week.classList.remove("checked");
    $week.classList.add("unchecked");
  } else if ($week.classList.contains("unchecked")) {
    $week.classList.remove("unchecked");
    $week.classList.add("checked");
  }
}

function changeColor(boundary1, boundary2, color) {
  // Order boundaries by position
  let first = Math.min(boundary1, boundary2);
  let last = Math.max(boundary1, boundary2);

  // Loop through and apply color
  for (let i = first; i <= last; i++) {
    $(i).style.backgroundColor = color;
  }
}

function groupStyle(boundary1, boundary2, cssClass) {
  // Order boundaries by position
  let first = Math.min(boundary1, boundary2);
  let last = Math.max(boundary1, boundary2);

  // Loop through and apply style
  for (let i = first; i <= last; i++) {
    $(i).classList.add(cssClass);
  }
}


function mouseDownHandler(event) {
  mouseDown = true;
}

function mouseUpHandler(event) {
  mouseDown = false;
}

// Left click
function handleLeftClick() {
  // addWeek();
  // animating = true;
  // animate();
}

//Right click
function handleRightClick(event) {
  event.preventDefault();
  // removeWeeks();
  // animating = false;
  // changeColor(100, 200, "green");
}
