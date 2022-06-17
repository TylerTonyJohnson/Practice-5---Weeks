class Week {
  // Hard-coded stuff

  // Constructor
  constructor(id) {
    // Track the id
    this.id = id;
    this.grid = null;

    // Create the element
    this.element = document.createElement("div");
    this.element.classList.add("week");
    this.element.id = id;

    // Create a container for the week box
    this.weekSlot = document.createElement("div");
    this.weekSlot.classList.add("week-slot");

    // Append the week element to the weekSlot element
    this.weekSlot.appendChild(this.element);

    this.anchor = {
      top: false,
      left: false,
      right: false,
      bottom: false,
    };

    this.aspect = null;
  }

  // --- METHODS ---

  // Set the grid that this week belongs in
  setGrid = (grid) => {
    this.grid = grid;
    this.grid.element.appendChild(this.weekSlot);
  }

  // Set the anchoring of the week
  setAnchor = (anchorDirection = []) => {
    anchorDirection.forEach((item) => {
      this.element.classList.add(item);
    });
  };

  // Set the aspect ratio of the week
  setAspect = (aspectRatio = "") => {
    this.element.classList.add(aspectRatio);
    this.weekSlot.classList.add(aspectRatio);
  };

}

// --- ENUMERATION OBJECTS ---

const aspect = {
  SQUARE: "square",
  TALL: "tall",
  SHORT: "short",
  BIGSQUARE: "big-square",
};

const anchor = {
  TOPLEFT: ["top", "left"],
  TOPRIGHT: ["top", "right"],
  BOTTOMRIGHT: ["bottom", "right"],
  BOTTOMLEFT: ["bottom", "left"],
};
