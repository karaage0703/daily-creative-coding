const PARAMS = {
    size: 10,
};

function setup() {
    createCanvas(windowWidth, windowHeight);
    background(0);
    angleMode(DEGREES);

    const pane = new Tweakpane.Pane();

    pane.addInput(PARAMS, 'size');
}

function draw() {
    background(0);
    fill(255, 255, 255);
    circle(width / 2, height / 2, PARAMS.size)
}
