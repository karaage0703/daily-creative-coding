let fireworks = [];
let gravity;
let autoLaunch = false;
let lastLaunch = 0;
let shakeAmount = 0;
let bloomLayer;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 100);
  gravity = createVector(0, 0.15);
  
  // Create bloom layer for glow effects
  bloomLayer = createGraphics(width, height);
  bloomLayer.colorMode(HSB, 360, 100, 100, 100);
  
  // Start with auto-launching fireworks
  autoLaunch = true;
}

function draw() {
  // Screen shake effect
  if (shakeAmount > 0) {
    translate(random(-shakeAmount, shakeAmount), random(-shakeAmount, shakeAmount));
    shakeAmount *= 0.9;
  }
  
  // Darker background for more dramatic effect
  background(0, 0, 5, 15);
  
  // Clear bloom layer
  bloomLayer.clear();
  bloomLayer.background(0, 0, 0, 0);
  
  // Auto-launch fireworks
  if (autoLaunch && millis() - lastLaunch > random(500, 1500)) {
    launchRandomFirework();
    lastLaunch = millis();
  }
  
  // Update and draw fireworks
  for (let i = fireworks.length - 1; i >= 0; i--) {
    fireworks[i].update();
    fireworks[i].show();
    fireworks[i].showBloom(bloomLayer);
    
    if (fireworks[i].done()) {
      fireworks.splice(i, 1);
    }
  }
  
  // Apply bloom effect
  drawingContext.globalCompositeOperation = 'screen';
  drawingContext.filter = 'blur(8px)';
  image(bloomLayer, 0, 0);
  drawingContext.filter = 'none';
  drawingContext.globalCompositeOperation = 'source-over';
  
  // Draw bloom layer again for stronger effect
  drawingContext.globalCompositeOperation = 'screen';
  tint(360, 0, 100, 80);
  image(bloomLayer, 0, 0);
  noTint();
  drawingContext.globalCompositeOperation = 'source-over';
  
  displayInfo();
}

function mousePressed() {
  let firework = new Firework(mouseX, height);
  fireworks.push(firework);
}

function launchRandomFirework() {
  let types = ['mega', 'rainbow', 'chrysanthemum', 'peony', 'palm', 'ring', 'crossette'];
  let type = random(types);
  let x = random(width * 0.1, width * 0.9);
  let firework = new Firework(x, height);
  firework.particleType = type;
  firework.particleCount = random(150, 400);
  firework.hue = random(360);
  fireworks.push(firework);
  
  // Add screen shake for big explosions
  if (type === 'mega' || type === 'chrysanthemum') {
    shakeAmount = 8;
  } else {
    shakeAmount = 4;
  }
}

function keyPressed() {
  if (key === '1') {
    for (let i = 0; i < 5; i++) {
      let firework = new Firework(width * (i + 1) / 6, height);
      firework.particleType = 'mega';
      firework.particleCount = 300;
      firework.hue = i * 60;
      fireworks.push(firework);
    }
    shakeAmount = 15;
  } else if (key === '2') {
    for (let i = 0; i < 4; i++) {
      let firework = new Firework(width * (i + 1) / 5, height);
      firework.particleType = 'rainbow';
      firework.particleCount = 200;
      fireworks.push(firework);
    }
    shakeAmount = 10;
  } else if (key === '3') {
    for (let i = 0; i < 6; i++) {
      let firework = new Firework(width * (i + 1) / 7, height);
      firework.particleType = 'chrysanthemum';
      firework.particleCount = 250;
      firework.hue = random(360);
      fireworks.push(firework);
    }
    shakeAmount = 12;
  } else if (key === '4') {
    for (let i = 0; i < 3; i++) {
      let firework = new Firework(random(width * 0.2, width * 0.8), height);
      firework.particleType = 'crossette';
      firework.particleCount = 180;
      firework.hue = random([0, 120, 240]);
      fireworks.push(firework);
    }
    shakeAmount = 8;
  } else if (key === '5') {
    // Ultimate finale
    for (let i = 0; i < 15; i++) {
      let firework = new Firework(random(width * 0.1, width * 0.9), height);
      firework.particleType = random(['mega', 'rainbow', 'chrysanthemum', 'crossette']);
      firework.particleCount = random(200, 500);
      firework.hue = random(360);
      firework.delay = i * 100;
      fireworks.push(firework);
    }
    shakeAmount = 20;
  } else if (key === ' ') {
    for (let firework of fireworks) {
      if (!firework.exploded) {
        firework.explode();
        shakeAmount = 6;
      }
    }
  } else if (key === 'a' || key === 'A') {
    autoLaunch = !autoLaunch;
  }
}

function displayInfo() {
  fill(0, 0, 100);
  textSize(12);
  text(`Active fireworks: ${fireworks.length}`, 10, height - 40);
  text(`FPS: ${Math.round(frameRate())}`, 10, height - 25);
}

class Firework {
  constructor(x, y) {
    this.firework = new Particle(x, y, true);
    this.exploded = false;
    this.particles = [];
    this.particleType = 'normal';
    this.particleCount = 50;
    this.launchAngle = 90;
    this.hue = random(360);
    this.delay = 0;
    this.birthTime = millis();
  }

  update() {
    if (!this.exploded) {
      if (millis() - this.birthTime > this.delay) {
        this.firework.applyForce(gravity);
        this.firework.update();
        
        if (this.firework.vel.y >= 0) {
          this.explode();
        }
      }
    }
    
    for (let i = this.particles.length - 1; i >= 0; i--) {
      this.particles[i].applyForce(gravity);
      this.particles[i].update();
      
      if (this.particles[i].done()) {
        this.particles.splice(i, 1);
      }
    }
  }

  explode() {
    this.exploded = true;
    
    for (let i = 0; i < this.particleCount; i++) {
      let p;
      
      if (this.particleType === 'mega') {
        p = new MegaParticle(this.firework.pos.x, this.firework.pos.y);
      } else if (this.particleType === 'rainbow') {
        p = new RainbowParticle(this.firework.pos.x, this.firework.pos.y, i);
      } else if (this.particleType === 'chrysanthemum') {
        p = new ChrysanthemumParticle(this.firework.pos.x, this.firework.pos.y, i, this.particleCount);
      } else if (this.particleType === 'peony') {
        p = new PeonyParticle(this.firework.pos.x, this.firework.pos.y);
      } else if (this.particleType === 'palm') {
        p = new PalmParticle(this.firework.pos.x, this.firework.pos.y);
      } else if (this.particleType === 'ring') {
        p = new RingParticle(this.firework.pos.x, this.firework.pos.y, i, this.particleCount);
      } else if (this.particleType === 'crossette') {
        p = new CrossetteParticle(this.firework.pos.x, this.firework.pos.y, i);
      } else if (this.particleType === 'willow') {
        p = new WillowParticle(this.firework.pos.x, this.firework.pos.y);
      } else if (this.particleType === 'sparkle') {
        p = new SparkleParticle(this.firework.pos.x, this.firework.pos.y);
      } else {
        p = new Particle(this.firework.pos.x, this.firework.pos.y, false);
      }
      
      p.hue = this.hue + random(-30, 30);
      this.particles.push(p);
    }
  }

  show() {
    if (!this.exploded && millis() - this.birthTime > this.delay) {
      this.firework.show();
    }
    
    for (let particle of this.particles) {
      particle.show();
    }
  }
  
  showBloom(layer) {
    if (!this.exploded && millis() - this.birthTime > this.delay) {
      this.firework.showBloom(layer);
    }
    
    for (let particle of this.particles) {
      particle.showBloom(layer);
    }
  }

  done() {
    return this.exploded && this.particles.length === 0;
  }
}

class Particle {
  constructor(x, y, firework) {
    this.pos = createVector(x, y);
    this.firework = firework;
    this.lifespan = 100;
    this.hue = random(360);
    
    if (this.firework) {
      this.vel = createVector(0, random(-12, -8));
    } else {
      this.vel = p5.Vector.random2D();
      this.vel.mult(random(2, 8));
    }
    
    this.acc = createVector(0, 0);
  }

  applyForce(force) {
    this.acc.add(force);
  }

  update() {
    if (!this.firework) {
      this.vel.mult(0.98);
      this.lifespan -= 2;
    }
    
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }

  show() {
    if (this.firework) {
      strokeWeight(6);
      stroke(this.hue, 100, 100);
      point(this.pos.x, this.pos.y);
      strokeWeight(3);
      stroke(this.hue, 50, 100);
      point(this.pos.x, this.pos.y);
    } else {
      strokeWeight(3);
      stroke(this.hue, 80, 100, this.lifespan);
      point(this.pos.x, this.pos.y);
    }
  }
  
  showBloom(layer) {
    layer.strokeWeight(this.firework ? 20 : 15);
    layer.stroke(this.hue, 60, 80, this.firework ? 100 : this.lifespan * 0.8);
    layer.point(this.pos.x, this.pos.y);
  }

  done() {
    return this.lifespan < 0;
  }
}

class WillowParticle extends Particle {
  constructor(x, y) {
    super(x, y, false);
    this.vel.mult(0.5);
    this.trail = [];
    this.maxTrail = 15;
  }

  update() {
    super.update();
    this.trail.push(createVector(this.pos.x, this.pos.y));
    
    if (this.trail.length > this.maxTrail) {
      this.trail.splice(0, 1);
    }
  }

  show() {
    for (let i = 0; i < this.trail.length; i++) {
      let alpha = map(i, 0, this.trail.length - 1, 0, this.lifespan);
      strokeWeight(map(i, 0, this.trail.length - 1, 1, 4));
      stroke(this.hue, 80, 100, alpha);
      point(this.trail[i].x, this.trail[i].y);
    }
  }
  
  showBloom(layer) {
    for (let i = 0; i < this.trail.length; i++) {
      let alpha = map(i, 0, this.trail.length - 1, 0, this.lifespan * 0.6);
      layer.strokeWeight(map(i, 0, this.trail.length - 1, 8, 15));
      layer.stroke(this.hue, 60, 80, alpha);
      layer.point(this.trail[i].x, this.trail[i].y);
    }
  }
}

class SparkleParticle extends Particle {
  constructor(x, y) {
    super(x, y, false);
    this.sparkleTime = 0;
  }

  update() {
    super.update();
    this.sparkleTime += 0.2;
  }

  show() {
    let brightness = 50 + 50 * sin(this.sparkleTime * 10);
    strokeWeight(random(2, 6));
    stroke(this.hue + random(-30, 30), 100, brightness, this.lifespan);
    
    for (let i = 0; i < 5; i++) {
      point(this.pos.x + random(-3, 3), this.pos.y + random(-3, 3));
    }
  }
  
  showBloom(layer) {
    let brightness = 50 + 50 * sin(this.sparkleTime * 10);
    layer.strokeWeight(20);
    layer.stroke(this.hue + random(-30, 30), 60, brightness * 0.8, this.lifespan * 0.6);
    layer.point(this.pos.x, this.pos.y);
  }
}

class CascadeParticle extends Particle {
  constructor(x, y, angle) {
    super(x, y, false);
    let rad = radians(angle);
    this.vel = createVector(cos(rad), sin(rad));
    this.vel.mult(random(3, 6));
    this.secondaryParticles = [];
    this.hasExploded = false;
  }

  update() {
    super.update();
    
    if (this.lifespan < 70 && !this.hasExploded) {
      this.hasExploded = true;
      for (let i = 0; i < 5; i++) {
        let p = new Particle(this.pos.x, this.pos.y, false);
        p.vel.mult(0.5);
        p.hue = this.hue + random(-10, 10);
        p.lifespan = 50;
        this.secondaryParticles.push(p);
      }
    }
    
    for (let i = this.secondaryParticles.length - 1; i >= 0; i--) {
      this.secondaryParticles[i].applyForce(gravity);
      this.secondaryParticles[i].update();
      
      if (this.secondaryParticles[i].done()) {
        this.secondaryParticles.splice(i, 1);
      }
    }
  }

  show() {
    super.show();
    
    for (let particle of this.secondaryParticles) {
      particle.show();
    }
  }
  
  showBloom(layer) {
    super.showBloom(layer);
    
    for (let particle of this.secondaryParticles) {
      particle.showBloom(layer);
    }
  }

  done() {
    return super.done() && this.secondaryParticles.length === 0;
  }
}

// Spectacular new particle types
class MegaParticle extends Particle {
  constructor(x, y) {
    super(x, y, false);
    this.vel.mult(random(4, 12));
    this.lifespan = 120;
    this.size = random(3, 8);
  }
  
  show() {
    strokeWeight(this.size);
    stroke(this.hue, 90, 100, this.lifespan);
    point(this.pos.x, this.pos.y);
    strokeWeight(this.size * 0.6);
    stroke(this.hue, 60, 100, this.lifespan * 1.2);
    point(this.pos.x, this.pos.y);
  }
  
  showBloom(layer) {
    layer.strokeWeight(this.size * 6);
    layer.stroke(this.hue, 50, 90, this.lifespan * 0.8);
    layer.point(this.pos.x, this.pos.y);
  }
}

class RainbowParticle extends Particle {
  constructor(x, y, index) {
    super(x, y, false);
    this.hue = (index * 15) % 360;
    this.vel.mult(random(3, 8));
  }
  
  update() {
    super.update();
    this.hue = (this.hue + 2) % 360;
  }
  
  show() {
    strokeWeight(4);
    stroke(this.hue, 100, 100, this.lifespan);
    point(this.pos.x, this.pos.y);
  }
  
  showBloom(layer) {
    layer.strokeWeight(20);
    layer.stroke(this.hue, 70, 100, this.lifespan * 0.7);
    layer.point(this.pos.x, this.pos.y);
  }
}

class ChrysanthemumParticle extends Particle {
  constructor(x, y, index, total) {
    super(x, y, false);
    let angle = (index / total) * TWO_PI;
    this.vel = createVector(cos(angle), sin(angle));
    this.vel.mult(random(2, 6));
    this.secondaryParticles = [];
    this.hasExploded = false;
  }
  
  update() {
    super.update();
    
    if (this.lifespan < 60 && !this.hasExploded) {
      this.hasExploded = true;
      for (let i = 0; i < 3; i++) {
        let p = new Particle(this.pos.x, this.pos.y, false);
        p.vel = p5.Vector.random2D().mult(random(1, 3));
        p.hue = this.hue + random(-20, 20);
        p.lifespan = 40;
        this.secondaryParticles.push(p);
      }
    }
    
    for (let i = this.secondaryParticles.length - 1; i >= 0; i--) {
      this.secondaryParticles[i].update();
      if (this.secondaryParticles[i].done()) {
        this.secondaryParticles.splice(i, 1);
      }
    }
  }
  
  show() {
    strokeWeight(5);
    stroke(this.hue, 90, 100, this.lifespan);
    point(this.pos.x, this.pos.y);
    
    for (let p of this.secondaryParticles) {
      p.show();
    }
  }
  
  showBloom(layer) {
    layer.strokeWeight(25);
    layer.stroke(this.hue, 60, 90, this.lifespan * 0.9);
    layer.point(this.pos.x, this.pos.y);
    
    for (let p of this.secondaryParticles) {
      p.showBloom(layer);
    }
  }
}

class CrossetteParticle extends Particle {
  constructor(x, y, index) {
    super(x, y, false);
    let directions = [0, 90, 180, 270];
    let angle = directions[index % 4];
    this.vel = createVector(cos(radians(angle)), sin(radians(angle)));
    this.vel.mult(random(4, 8));
    this.crossParticles = [];
    this.hasCrossed = false;
  }
  
  update() {
    super.update();
    
    if (this.lifespan < 70 && !this.hasCrossed) {
      this.hasCrossed = true;
      let perpAngle = atan2(this.vel.y, this.vel.x) + HALF_PI;
      for (let i = -1; i <= 1; i += 2) {
        let p = new Particle(this.pos.x, this.pos.y, false);
        p.vel = createVector(cos(perpAngle) * i, sin(perpAngle) * i);
        p.vel.mult(random(2, 4));
        p.hue = this.hue + random(-15, 15);
        p.lifespan = 50;
        this.crossParticles.push(p);
      }
    }
    
    for (let i = this.crossParticles.length - 1; i >= 0; i--) {
      this.crossParticles[i].update();
      if (this.crossParticles[i].done()) {
        this.crossParticles.splice(i, 1);
      }
    }
  }
  
  show() {
    strokeWeight(4);
    stroke(this.hue, 100, 100, this.lifespan);
    point(this.pos.x, this.pos.y);
    
    for (let p of this.crossParticles) {
      p.show();
    }
  }
  
  showBloom(layer) {
    layer.strokeWeight(18);
    layer.stroke(this.hue, 70, 95, this.lifespan * 0.8);
    layer.point(this.pos.x, this.pos.y);
    
    for (let p of this.crossParticles) {
      p.showBloom(layer);
    }
  }
}

class PeonyParticle extends Particle {
  constructor(x, y) {
    super(x, y, false);
    this.vel.mult(random(1, 4));
    this.trail = [];
    this.maxTrail = 8;
  }
  
  update() {
    super.update();
    this.trail.push(createVector(this.pos.x, this.pos.y));
    if (this.trail.length > this.maxTrail) {
      this.trail.splice(0, 1);
    }
  }
  
  show() {
    for (let i = 0; i < this.trail.length; i++) {
      let alpha = map(i, 0, this.trail.length - 1, 0, this.lifespan);
      strokeWeight(map(i, 0, this.trail.length - 1, 2, 5));
      stroke(this.hue, 85, 100, alpha);
      point(this.trail[i].x, this.trail[i].y);
    }
  }
  
  showBloom(layer) {
    for (let i = 0; i < this.trail.length; i++) {
      let alpha = map(i, 0, this.trail.length - 1, 0, this.lifespan * 0.7);
      layer.strokeWeight(map(i, 0, this.trail.length - 1, 12, 20));
      layer.stroke(this.hue, 60, 85, alpha);
      layer.point(this.trail[i].x, this.trail[i].y);
    }
  }
}

class PalmParticle extends Particle {
  constructor(x, y) {
    super(x, y, false);
    this.vel = createVector(random(-1, 1), random(-6, -2));
    this.vel.mult(random(2, 5));
    this.trail = [];
    this.maxTrail = 25;
  }
  
  update() {
    super.update();
    this.vel.y += 0.2; // Extra gravity for drooping effect
    this.trail.push(createVector(this.pos.x, this.pos.y));
    if (this.trail.length > this.maxTrail) {
      this.trail.splice(0, 1);
    }
  }
  
  show() {
    for (let i = 0; i < this.trail.length; i++) {
      let alpha = map(i, 0, this.trail.length - 1, 0, this.lifespan);
      strokeWeight(map(i, 0, this.trail.length - 1, 1, 6));
      stroke(this.hue, 80, 100, alpha);
      point(this.trail[i].x, this.trail[i].y);
    }
  }
  
  showBloom(layer) {
    for (let i = 0; i < this.trail.length; i++) {
      let alpha = map(i, 0, this.trail.length - 1, 0, this.lifespan * 0.6);
      layer.strokeWeight(map(i, 0, this.trail.length - 1, 10, 25));
      layer.stroke(this.hue, 50, 80, alpha);
      layer.point(this.trail[i].x, this.trail[i].y);
    }
  }
}

class RingParticle extends Particle {
  constructor(x, y, index, total) {
    super(x, y, false);
    let angle = (index / total) * TWO_PI;
    this.vel = createVector(cos(angle), sin(angle));
    this.vel.mult(random(6, 10));
    this.vel.y *= 0.3; // Flatten the ring
    this.lifespan = 80;
  }
  
  show() {
    strokeWeight(6);
    stroke(this.hue, 100, 100, this.lifespan);
    point(this.pos.x, this.pos.y);
    strokeWeight(3);
    stroke(this.hue, 70, 100, this.lifespan * 1.5);
    point(this.pos.x, this.pos.y);
  }
  
  showBloom(layer) {
    layer.strokeWeight(30);
    layer.stroke(this.hue, 60, 90, this.lifespan * 0.8);
    layer.point(this.pos.x, this.pos.y);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  bloomLayer = createGraphics(width, height);
  bloomLayer.colorMode(HSB, 360, 100, 100, 100);
}