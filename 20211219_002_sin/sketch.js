function setup() {
    createCanvas(windowWidth, windowHeight);
    background(255);
    angleMode(DEGREES);
}

function draw() {
    background(255);
    let a = width/5;
    for(let x=0; x <= 3600; x=x+0.05){
        stroke(random(255), random(255), random(255))
        strokeWeight(0.1)
        point(width/2 + random(a)*cos(x), height/2 + random(a)*sin(x));
    }
}