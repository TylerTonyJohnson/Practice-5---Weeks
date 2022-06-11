class HoverLabel {
    // Hard-coded stuff
    offsetX = 0;    // Pixels
    offsetY = -40;

    // Constructor
    constructor(element) {
        this.element = element;
        this.text = "HOOPS";
        this.activate();
    }

    // --- METHODS ---

    // Controls
    activate = () => {
        this.element.style.display = "block";
    }

    clear = () => {
        this.element.style.display = "none";
    }

    // Updaters
    updatePosition = (x, y) => {
        this.element.style.top = (y - this.offsetY) + "px";
        this.element.style.left = (x + this.offsetX) + "px";
    }
    
    updateText = (text) => {
        this.element.innerText = text;
    }

}