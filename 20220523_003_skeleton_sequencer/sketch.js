// Copyright (c) 2019 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
// 2022/05/23 modified by karaage0703

/* ===
ml5 Example
PoseNet example using p5.js
=== */

let video;
let poseNet;
let poses = [];

let scale_width;
let scale_height;

let head_size = 200;
let skeleton_size = 100;

let dot_x_numb;
let dot_y_numb;
let dot_size = 30;

let dots = [];
let osc = [];
let osc_freq;

let count = 0;
let start_time;
let elapsed_time = 0;
const period_time = 500;

class Dot {
  constructor(x, y, size, rgb) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.color = rgb
  }

  changeColor() {
    this.color = color(255 - red(this.color), 255 - green(this.color), 255 - blue(this.color));
  }

  draw() {
    fill(this.color);
    noStroke();
    ellipse(this.x*this.size + this.size/2, this.y*this.size + this.size/2, this.size, this.size);
  }
}


function setup() {
  createCanvas(windowWidth, windowHeight);
  video = createCapture(VIDEO);

  dot_x_numb = int(width / dot_size)
  dot_y_numb = int(height / dot_size)
  // console.log( {dot_x_numb, dot_y_numb} );

  for(let y = 0; y < dot_y_numb; y += 1) {
    for(let x = 0; x < dot_x_numb; x += 1) {
      dots[x + y * dot_x_numb] = new Dot(x, y, dot_size, color(255, 0, 0));
    }
  }

  for(let y = 0; y < dot_y_numb; y += 1) {
    osc[y] = new p5.Oscillator('sine');
  }

  // Create a new poseNet method with a single detection
  poseNet = ml5.poseNet(video, modelReady);
  // This sets up an event that fills the global variable "poses"
  // with an array every time new poses are detected
  poseNet.on('pose', function(results) {
    poses = results;
  });
  // Hide the video element, and just show the canvas
  video.hide();

  start_time = millis();
}

function modelReady() {
  select('#status').html('Model Loaded');
}

function draw() {
  let img = video.get();
  image(img, 0, 0, width, height);

  scale_width = width / video.width;
  scale_height = height / video.height;
  scale_mean = (scale_width + scale_height) / 2;

  const now = millis();

  drawSkeleton();
  drawHead();
  drawBody();
  convertDot();
  background(255);

  target_x = count % dot_x_numb;
  for(let y = 0; y < dot_y_numb; y += 1) {
    dots[target_x + y * dot_x_numb].changeColor();
  }

  elasped_time = now - start_time;
  if (elasped_time >= period_time) {
    count++;
    start_time = millis();

    for (let y = 0; y < dot_y_numb; y += 1) {
      osc[y].stop();
    }

    for (let y = 0; y < dot_y_numb; y += 1) {
      if (green(dots[target_x + y * dot_x_numb].color) == 255) {
        // C
        if (y % 5 == 0) {
          osc_freq = 523.25;
        }

        // D#
        if (y % 5 == 1) {
          osc_freq = 622.25;
        }

        // F
        if (y % 5 == 2) {
          osc_freq = 698.46;
        }

        // G
        if (y % 5 == 3) {
          osc_freq = 783.99;
        }

        // A#
        if (y % 5 == 4) {
          osc_freq = 466.16;
        }

        let osc_k = int(y/5+1);
        osc[y].freq(osc_freq * 2 / osc_k);
        // osc[y].freq(osc_freq);
        osc[y].start();
      }
    }
  }

  for(let y = 0; y < dot_y_numb; y += 1) {
    for(let x = 0; x < dot_x_numb; x += 1) {
      dots[x + y * dot_x_numb].draw();
    }
  }
}


// A function to draw the head
function drawHead() {
  // Loop through all the poses detected
  for (let i = 0; i < poses.length; i++) {
    let pose = poses[i].pose;
    // A keypoint is an object describing a body part (head)
    let keypoint = pose.keypoints[0];
    // Only draw an ellipse is the pose probability is bigger than 0.2
    if (keypoint.score > 0.2) {
      fill(255, 0, 0);
      noStroke();
      ellipse(
        keypoint.position.x * scale_width,
        keypoint.position.y * scale_height,
        head_size * scale_mean,
        head_size * scale_mean
      );
    }
  }
}

// A function to draw the body
function drawBody() {
  // Loop through all the poses detected
  for (let i = 0; i < poses.length; i++) {
    let pose = poses[i].pose;
    // A keypoint is an object describing a body part (head)
    let keypoint_ls = pose.keypoints[5];
    let keypoint_rs = pose.keypoints[6];
    let keypoint_lw = pose.keypoints[11];
    let keypoint_rw = pose.keypoints[12];
    // Only draw an ellipse is the pose probability is bigger than 0.2
    if (keypoint_ls.score > 0.2 && keypoint_rs.score > 0.2
      && keypoint_lw.score > 0.2 && keypoint_rw.score > 0.2) {
      fill(255, 0, 0);
      noStroke();
      quad(
        keypoint_rs.position.x * scale_width,
        keypoint_rs.position.y * scale_height,
        keypoint_ls.position.x * scale_width,
        keypoint_ls.position.y * scale_height,
        keypoint_lw.position.x * scale_width,
        keypoint_lw.position.y * scale_height,
        keypoint_rw.position.x * scale_width,
        keypoint_rw.position.y * scale_height
      );
    }
  }
}

// A function to draw the skeletons
function drawSkeleton() {
  // Loop through all the skeletons detected
  for (let i = 0; i < poses.length; i++) {
    let skeleton = poses[i].skeleton;
    // For every skeleton, loop through all body connections
    for (let j = 0; j < skeleton.length; j++) {
      if (skeleton[j][0].score > 0.0 && skeleton[j][1].score > 0.2) {
        let partA = skeleton[j][0];
        let partB = skeleton[j][1];
        stroke(255, 0, 0);
        strokeWeight(skeleton_size * scale_mean);
        line(
          partA.position.x * scale_width,
          partA.position.y * scale_height,
          partB.position.x * scale_width,
          partB.position.y * scale_height
        );
      }
    }
  }
}

function convertDot() {
  for(let y = 0; y < dot_y_numb; y += 1) {
    for(let x = 0; x < dot_x_numb; x += 1) {
      dots[x + y * dot_x_numb].color = get(x*dot_size + int(dot_size/2), y*dot_size + int(dot_size/2))
    }
  }
}
