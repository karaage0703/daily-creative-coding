function setup() {
    createCanvas(windowWidth, windowHeight);
    background(255);
    angleMode(DEGREES);
}

function draw() {
    background(255);
    let a = width/5;
    for(let x=0; x <= 3600; x=x+0.1){
        stroke(random(255), 0, 0)
        strokeWeight(0.1)
        point(width / 2 + a *cos(x) + random(a/5), height / 2 + a *sin(x) + random(a/5));
    }
}