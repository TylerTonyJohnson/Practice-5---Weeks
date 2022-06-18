class LifeGrid {
  // Hard-coded values
  weekCount = 4004;

  // CONSTRUCTOR
  constructor(element) {
    // Pass in an html element to use as the grid
    this.element = element;
    this.mouseDownTarget = null;
    this.mouseUpTarget = null;
    this.mouseOverTarget = null;
    this.hoverLabel = new HoverLabel($("hover-label"));
    this.rootDate = new Date("February 27, 1991");
    console.log(this.hoverLabel);

    // Keep track of eras inside
    this.eras = [];
    this.createWeeks();
  }

  // --- METHODS ---

  createWeeks = () => {
    for (let id = 1; id <= this.weekCount; id++) {
      // Create the week
      const week = new Week(id);
      week.setGrid(this);

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
        this.hoverLabel.updateText(this.weekToDate(this.mouseOverTarget.id));

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
        console.log("updating position");
        this.hoverLabel.updatePosition(event.pageX, event.pageY);
      };
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

  // Helper functions
  weekToDate = (weekId) => {
    const dayIndex = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const date = new Date(
      this.rootDate.getTime() + (weekId - 1) * (1000 * 60 * 60 * 24 * 7)
    );

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
}

// --- ENUMERATION OBJECTS ---
