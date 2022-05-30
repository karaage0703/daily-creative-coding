// Copyright (c) 2019 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
// 2022/05/31 modified by karaage0703

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
let osc_sine = [];
let osc_triangle = [];
let osc_square = [];
let osc_sawtooth = [];
let osc_freq;

let count = 0;
let start_time;
let elapsed_time = 0;

let max_skeleton_numb = 3;
let skeleton_color_r = 255;
let skeleton_color_g = 0;
let skeleton_color_b = 0;

const PARAMS = {
  speed: 500,
  sound: 'sine',
};

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
    osc_sine[y] = new p5.Oscillator('sine');
    osc_sawtooth[y] = new p5.Oscillator('sawtooth');
    osc_triangle[y] = new p5.Oscillator('triangle');
    osc_square[y] = new p5.Oscillator('square');
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

  const pane = new Tweakpane.Pane();

  pane.addInput(
    PARAMS, 'speed',
    {min:0, max: 1000, step: 10}
  );

  pane.addInput(
    PARAMS, 'sound',
    {options: {sine: 'sine', triangle: 'triangle', sawtooth: 'sawtooth', square: 'square'}}
  );

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

  drawSkeleton();
  playMusic();
}

// A function to draw the skeletons
function drawSkeleton() {
  // Loop through all the humans detected
  for (let i = 0; i < poses.length; i++) {
    let skeleton = poses[i].skeleton;

    // For every skeleton, loop through all body connections
    for (let j = 0; j < skeleton.length; j++) {
      if (skeleton[j][0].score > 0.0 && skeleton[j][1].score > 0.2) {
        let partA = skeleton[j][0];
        let partB = skeleton[j][1];
        stroke(skeleton_color_r, skeleton_color_g, skeleton_color_b);
        strokeWeight(skeleton_size * scale_mean);
        line(
          partA.position.x * scale_width,
          partA.position.y * scale_height,
          partB.position.x * scale_width,
          partB.position.y * scale_height
        );
      }
    }

    // Draw head
    let pose = poses[i].pose;
    // A keypoint is an object describing a body part (head)
    let keypoint = pose.keypoints[0];
    // Only draw an ellipse is the pose probability is bigger than 0.2
    if (keypoint.score > 0.2) {
      // fill(255, 0, 0);
      fill(skeleton_color_r, skeleton_color_g, skeleton_color_b);
      noStroke();
      ellipse(
        keypoint.position.x * scale_width,
        keypoint.position.y * scale_height,
        head_size * scale_mean,
        head_size * scale_mean
      );
    }

    // Draw body
    // A keypoint is an object describing a body part (head)
    let keypoint_ls = pose.keypoints[5];
    let keypoint_rs = pose.keypoints[6];
    let keypoint_lw = pose.keypoints[11];
    let keypoint_rw = pose.keypoints[12];
    // Only draw an ellipse is the pose probability is bigger than 0.2
    if (keypoint_ls.score > 0.2 && keypoint_rs.score > 0.2
      && keypoint_lw.score > 0.2 && keypoint_rw.score > 0.2) {
      fill(skeleton_color_r, skeleton_color_g, skeleton_color_b);
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

function playMusic() {
  // Convert picture to dot
  for(let y = 0; y < dot_y_numb; y += 1) {
    for(let x = 0; x < dot_x_numb; x += 1) {
      dots[x + y * dot_x_numb].color = get(x*dot_size + int(dot_size/2), y*dot_size + int(dot_size/2))
    }
  }

  background(255);

  // Draw dot vertical line
  target_x = count % dot_x_numb;
  for(let y = 0; y < dot_y_numb; y += 1) {
    dots[target_x + y * dot_x_numb].changeColor();
  }

  const now = millis();
  elasped_time = now - start_time;
  if (elasped_time >= PARAMS.speed) {
    count++;
    start_time = millis();

    for (let y = 0; y < dot_y_numb; y += 1) {
      osc_sine[y].stop();
      osc_square[y].stop();
      osc_sawtooth[y].stop();
      osc_triangle[y].stop();
    }

    // Play tone
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

        if (PARAMS.sound == 'sine') {
          osc_sine[y].freq(osc_freq * 2 / osc_k);
          osc_sine[y].start();
        }

        if (PARAMS.sound == 'sawtooth') {
          osc_sawtooth[y].freq(osc_freq * 2 / osc_k);
          osc_sawtooth[y].start();
        }

        if (PARAMS.sound == 'triangle') {
          osc_triangle[y].freq(osc_freq * 2 / osc_k);
          osc_triangle[y].start();
        }

        if (PARAMS.sound == 'square') {
          osc_square[y].freq(osc_freq * 2 / osc_k);
          osc_square[y].start();
        }
      }
    }
  }

  // // Draw dot
  for(let y = 0; y < dot_y_numb; y += 1) {
    for(let x = 0; x < dot_x_numb; x += 1) {
      dots[x + y * dot_x_numb].draw();
    }
  }
}
