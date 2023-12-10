
// パーティクルを表すクラス
class Particle {
    constructor() {
        this.x = random(width);
        this.y = random(height);
        this.vx = random(-1, 1);
        this.vy = random(-1, 1);
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        // 画面の端に到達した場合の処理
        if (this.x <= 0 || this.x >= width) this.vx *= -1;
        if (this.y <= 0 || this.y >= height) this.vy *= -1;
    }

    show() {
        stroke(0);
        strokeWeight(2);
        point(this.x, this.y);
    }
}

let particles = [];

function setup() {
    createCanvas(windowWidth, windowHeight);
    for (let i = 0; i < 100; i++) {
        particles.push(new Particle());
    }
}

function draw() {
    background(255);

    for (let particle of particles) {
        particle.update();
        particle.show();
    }
}
