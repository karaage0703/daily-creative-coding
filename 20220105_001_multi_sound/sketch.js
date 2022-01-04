let osc = [];

function setup() {
    createCanvas(windowWidth, windowHeight);
    background(255);
    angleMode(DEGREES);

    osc[0] = new p5.Oscillator('sine');
    osc[1] = new p5.Oscillator('sine');
    osc[2] = new p5.Oscillator('sine');
    osc[0].freq(440);
    osc[1].freq(880);
    osc[2].freq(220);
}

function mousePressed() {
    osc[0].start();
    osc[1].start();
    osc[2].start();
}

function mouseReleased() {
    osc[0].stop();
    osc[1].stop();
    osc[2].stop();
}

function draw() {
    background(255)
}
