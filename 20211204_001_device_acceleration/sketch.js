function setup() {
    createCanvas(windowWidth, windowHeight);
    background(0);
    angleMode(DEGREES);
}

function draw() {
    fill(255, 255, 255);
    circle(width / 2, height / 2, accelerationZ)
}

