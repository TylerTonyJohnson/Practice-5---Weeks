function getRandomColor() {
  return (
    "#" +
    Math.floor(Math.random() * 16777216)
      .toString(16)
      .padStart(6, "0")
  );
}

function getWeeksDuration(date) {
  return Math.floor(date / (1000 * 3600 * 24 * 7));
}

const $ = (name) => document.getElementById(name);

