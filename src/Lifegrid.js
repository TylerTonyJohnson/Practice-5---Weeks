class LifeGrid {
  // Hard-coded values
  weekCount = 4004;

  // CONSTRUCTOR
  constructor(element) {
    // Pass in an html element to use as the grid
    this.element = element;
    this.mouseDownTarget = null;

    // Create mouse tracking stuff
    this.mouseUpTarget = null;
    this.mouseOverTarget = null;
    this.hoverLabel = new HoverLabel($("hover-label"));

    // Create data structures
    this.rootDate = new Date("February 27, 1991");
    this.eras = [];
    this.weeks = [];
    this.timeSync = TimeSync.YEARSYNC;

    // Setup
    this.createWeeks();
    // this.debugColors();
  }

  // --- METHODS ---

  createWeeks = () => {
    for (let id = 1; id <= this.weekCount; id++) {
      // Create the week
      const week = new Week(id);
      week.setGrid(this);
      this.weeks.push(week);

      // Calculate cell shape
      let left, right, top, bot, wide, tall;
      left = right = top = bot = wide = tall = false;

      if (id % 4 === 0 && id % 52 !== 0) {
        left = true;
        wide = true;
      }
      if (id % 4 === 1 && id % 52 !== 1) {
        right = true;
        wide = true;
      }
      if (Math.ceil(id / 52) % 10 === 0) {
        top = true;
        tall = true;
      }
      if (Math.ceil(id / 52) % 10 === 1 && Math.ceil(id / 52) !== 1) {
        bot = true;
        tall = true;
      }

      // Set how weeks are anchored
      if (!left && !right) left = true;
      if (!top && !bot) top = true;

      if (left && top) week.setAnchor(anchor.TOPLEFT);
      if (left && bot) week.setAnchor(anchor.BOTTOMLEFT);
      if (right && top) week.setAnchor(anchor.TOPRIGHT);
      if (right && bot) week.setAnchor(anchor.BOTTOMRIGHT);

      // Set aspect Ratio based on cell shape
      switch (true) {
        // Small square
        case !wide && !tall:
          week.setAspect(aspect.SQUARE);
          break;
        // Short rectangle
        case wide && !tall:
          week.setAspect(aspect.SHORT);
          break;
        // Tall rectangle
        case tall && !wide:
          week.setAspect(aspect.TALL);
          break;
        // Big square
        case tall && wide:
          week.setAspect(aspect.BIGSQUARE);
          break;
      }

      // MOUSE EVENTS

      // Remove default drag behavior
      week.weekSlot.ondragstart = (event) => event.preventDefault();
      week.weekSlot.ondragend = (event) => event.preventDefault();

      // Mouse down events
      week.weekSlot.onmousedown = (event) => {
        // Remember what the mouse down was on
        this.mouseDownTarget = event.target.firstChild;
        console.log("mouse down on " + this.mouseDownTarget.id);

        // Clear any other selection styling
        this.clearStyle("selected");
        this.clearStyle("highlight");
        this.clearStyle("highlight-boundary");
        this.addStyle(
          this.mouseDownTarget.id,
          this.mouseDownTarget.id,
          "highlight-boundary"
        );
      };

      // Mouse up events
      week.weekSlot.onmouseup = (event) => {
        // Remember what the mouse up was on
        this.mouseUpTarget = event.target.firstChild;
        console.log("mouse up on " + this.mouseUpTarget.id);

        switch (true) {
          case this.mouseDownTarget === null:
            console.log("Should do nothing!");
            break;
          case this.mouseUpTarget === this.mouseDownTarget:
            console.log("Selecting one");
            this.addStyle(
              this.mouseDownTarget.id,
              this.mouseUpTarget.id,
              "selected"
            );
            break;
          case this.mouseUpTarget !== this.mouseDownTarget:
            console.log("Selecting many");
            this.addStyle(
              this.mouseDownTarget.id,
              this.mouseUpTarget.id,
              "selected"
            );
            break;
          default:
            console.log("Should do nothing");
            break;
        }

        // Cleanup
        this.clearStyle("highlight");
        this.clearStyle("highlight-boundary");
        this.clearTargets();
      };

      // Mouse enter events
      week.weekSlot.onmouseenter = (event) => {
        // Target the week being hovered
        this.mouseOverTarget = event.target.firstChild;
        this.mouseOverTarget.classList.add("hovered");
        this.hoverLabel.activate();
        this.hoverLabel.updateText(
          this.formatDate(
            this.weekToDate(this.mouseOverTarget.id, this.rootDate)
          ) +
            " " +
            week.id
        );

        // Drag behavior
        if (this.mouseDownTarget) {
          // Cleanup
          this.clearStyle("highlight-boundary");

          // Setup
          const firstWeek = Math.min(
            this.mouseDownTarget.id,
            this.mouseOverTarget.id
          );
          const lastWeek = Math.max(
            this.mouseDownTarget.id,
            this.mouseOverTarget.id
          );

          // Style the boundaries
          this.addStyle(
            this.mouseDownTarget.id,
            this.mouseDownTarget.id,
            "highlight-boundary"
          );
          this.addStyle(
            this.mouseOverTarget.id,
            this.mouseOverTarget.id,
            "highlight-boundary"
          );

          // Style the interior of the selection if it's larger than 2 weeks
          if (Math.abs(this.mouseOverTarget.id - this.mouseDownTarget.id) > 1) {
            console.log("BEEG");
            this.addStyle(
              Number(firstWeek) + 1,
              Number(lastWeek) - 1,
              "highlight"
            );
          }

          // Cleanup
          this.clearStyleExcept(firstWeek, lastWeek, "highlight");
        }
      };

      // Mouse out events
      week.weekSlot.onmouseout = (event) => {
        // Target the week being hovered
        const mouseOutTarget = event.target.firstChild;

        // Remove hover style
        mouseOutTarget.classList.remove("hovered");
      };

      // Mouse move events
      week.weekSlot.onmousemove = (event) => {
        // console.log("updating position");
        this.hoverLabel.updatePosition(event.pageX, event.pageY);
      };
    }
  };

  addEra = (era) => {
    this.eras.push(era);
  };

  render = () => {
    const era = this.eras[0];
    console.log(era)
    console.log(era.startDate)

    const startWeek = this.dateToWeek(era.startDate);
    const endWeek = this.dateToWeek(era.endDate);
    
    this.addColor(startWeek, endWeek, era.style);

  };

  // Method to add an overwrite color to weeks.
  addColor = (weekId1, weekId2, color) => {
    // Sort weeks from earliest to latest
    const firstWeek = Math.min(weekId1, weekId2);
    const lastWeek = Math.max(weekId1, weekId2);

    // Loop through and apply color
    for (let i = firstWeek; i <= lastWeek; i++) {
      this.weeks[i].setColor(color);
    }
  };

  // Method to reset the color of a week to the CSS style
  clearColor = (weekId1, weekId2) => {
    // Sort weeks from earliest to latest
    const firstWeek = Math.min(weekId1, weekId2);
    const lastWeek = Math.max(weekId1, weekId2);
    
    // Loop through and reset to CSS default
    for (let i = firstWeek; i <= lastWeek; i++) {
      $(i).style.backgroundColor = "";
    }

  };

  // Method to add style to a selection of weeks
  addStyle = (weekId1, weekId2, className) => {
    // Sort weeks from earliest to latest
    const firstWeek = Math.min(weekId1, weekId2);
    const lastWeek = Math.max(weekId1, weekId2);

    // Loop through and apply style
    for (let i = firstWeek; i <= lastWeek; i++) {
      $(i).classList.add(className);
    }
  };

  // Method to globally clear a style by the class name
  clearStyle = (...className) => {
    className.forEach((style) => {
      Array.from(document.getElementsByClassName(style)).forEach((week) => {
        week.classList.remove(style);
      });
    });
  };

  clearStyleExcept = (weekId1, weekId2, className) => {
    // Sort weeks from earliest to latest
    const firstWeek = Math.min(weekId1, weekId2);
    const lastWeek = Math.max(weekId1, weekId2);

    // Clear style from weeks with a lower id than first or higher than last
    Array.from(document.getElementsByClassName(className)).forEach((item) => {
      if (item.id <= firstWeek || item.id >= lastWeek) {
        item.classList.remove(className);
      }
    });
  };

  // Method for resetting mouse targets
  clearTargets = () => {
    this.mouseDownTarget = null;
    this.mouseUpTarget = null;
  };

  // For testing
  debugColors = () => {
    this.clearStyle("debug");
    Array.from(document.getElementsByClassName("week")).forEach((week) => {
      const root = this.rootDate;
      const time = this.weekToDate(week.id, this.rootDate);

      // console.log(root.getDate(), time.getDate())

      if (
        time.getMonth() === root.getMonth() &&
        Math.abs(time.getDate() - root.getDate()) < 6
      ) {
        week.classList.add("debug");
      }
    });
  };

  formatDate = (date) => {
    return (
      dayIndex[date.getDay()] +
      " " +
      (date.getMonth() + 1) +
      "/" +
      date.getDate() +
      "/" +
      date.getFullYear()
    );
  };

  // Helper functions
  weekToDate = (weekId, rootDate = this.rootDate) => {
    // Validate weekId
    if (weekId < 1 || weekId > this.weekCount) {
      console.log("Error in week count");
      return;
    }

    // Calculate the starting day of the week
    let days = 1 + (weekId - 1) * 7;

    // Add days for fudge if needed
    if (this.timeSync === TimeSync.YEARSYNC) {
      // Add a day per year to catch up
      days += Math.ceil(weekId / 52) - 1;

      // Add a day for leap years
      const firstYear = rootDate.getFullYear();
      const currentYear = firstYear + (Math.ceil(weekId / 52) - 1);
      days += this.countLeapYears(firstYear, currentYear);
    }

    // Return the date corresponding to the first day of the week
    return new Date(rootDate.getTime() + (days - 1) * (1000 * 60 * 60 * 24));
  };

  dateToWeek = (date, rootDate = this.rootDate) => {
    // Validate date
    if (
      date < this.rootDate ||
      date > this.weekToDate(this.weekCount, this.rootDate)
    ) {
      console.log("Date is out of range");
      return;
    }

    console.log(date);

    // Calculate days since the root date
    let days =
      Math.floor(
        (date.getTime() - rootDate.getTime()) / (1000 * 60 * 60 * 24)
      ) + 1;
    console.log(days);
    // If in YEARSYNC, adjust the dates
    if (this.timeSync === TimeSync.YEARSYNC) {
      const firstYear = rootDate.getFullYear();
      const currentYear = date.getFullYear();

      // Subtract a day per year
      days -= currentYear - firstYear;
      console.log("Subtracting - " + (currentYear - firstYear));

      // Subtract a day per leap yer
      days -= this.countLeapYears(firstYear, currentYear);
    }

    // Make sure week before is before

    // Make sure week after is after
    const weekId = Math.floor(days / 7) + 1;

    return weekId;
  };

  // Function to get count of leap years from root date til now.
  countLeapYears(year1, year2) {
    const firstYear = Math.min(year1, year2);
    const lastYear = Math.max(year1, year2);

    let leapYearCount = 0;
    for (let i = firstYear; i < lastYear; i++) {
      if (this.isLeapYear(i)) leapYearCount++;
    }

    return leapYearCount;
  }

  // Function to figure out if a year is a leap year (performant)
  isLeapYear = (year) => {
    return !(year & 3 || (year & 15 && !(year % 25)));
  };
}

// --- ENUMERATION OBJECTS ---
const TimeSync = {
  YEARSYNC: "year",
  WEEKSYNC: "week",
  MONTHSYNC: "month",
  CALENDARSYNC: "calendar",
};

const dayIndex = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const MonthIndex = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const Days = {
  MON: "Monday",
  TUE: "Tuesday",
  WED: "Wednesday",
  THU: "Thursday",
  FRI: "Friday",
  SAT: "Saturday",
};
