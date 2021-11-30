let osc;

function setup() {
    createCanvas(windowWidth, windowHeight);
    background(255);
    angleMode(DEGREES);


    osc = new p5.Oscillator('sine');
}

function mousePressed() {
    osc.start();
}

function mouseReleased() {
    osc.stop();
}

function draw() {
    background(255)
    print(mouseX)
    osc.amp(mouseX/windowWidth);
    osc.freq(int(mouseY/windowHeight * 100) + 440);
    fill(mouseY, 0, 0);
    circle(mouseX, windowHeight / 2, mouseX / 2);
}
