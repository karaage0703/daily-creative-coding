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
let skeleton_size = 50;


function setup() {
  createCanvas(windowWidth, windowHeight);
  video = createCapture(VIDEO);

  // Create a new poseNet method with a single detection
  poseNet = ml5.poseNet(video, modelReady);
  // This sets up an event that fills the global variable "poses"
  // with an array every time new poses are detected
  poseNet.on('pose', function(results) {
    poses = results;
  });
  // Hide the video element, and just show the canvas
  video.hide();
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

  // draw skeleton
  // background(255)
  drawSkeleton();
  drawHead();
  drawBody();
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
