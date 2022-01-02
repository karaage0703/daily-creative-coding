let tiger_mask
let camera;
let predictions = []
let mesh_scale_width;
let mesh_scale_height;

function setup() {
  createCanvas(windowWidth, windowHeight);
  status_text = 'Processing...';

  camera = createCapture(VIDEO);
  tiger_mask = ml5.facemesh(camera, modelReady);
  tiger_mask.on('predict', gotResults);
  colorMode(HSB);
  camera.hide();
}

function modelReady() {
  console.log('model ready')
}

function draw() {
  let img = camera.get();
  image(img, 0, 0, width, height);
  mesh_scale_width = width / camera.width;
  mesh_scale_height = height / camera.height;
  drawTigermask();
}

function drawTigermask() {
  for (let i = 0; i < predictions.length; i += 1) {
    const keypoints = predictions[i].scaledMesh;

    // draw face base
    for (let j = 0; j < keypoints.length; j += 1) {
      const [x, y, z] = keypoints[j];

      fill(20, 100, map(z, -70, 70, 100, 0));
      stroke(0);
      strokeWeight((2 * (mesh_scale_width + mesh_scale_height)) / 2);
      ellipse(
        x * mesh_scale_width,
        y * mesh_scale_height,
        (15 * (mesh_scale_width + mesh_scale_height)) / 2
      );
    }

    // draw eyes
    stroke(0);
    strokeWeight((4 * (mesh_scale_width + mesh_scale_height)) / 2);

    let [x, y, z] = keypoints[22];
    fill(0, 0, 255);
    ellipse(
      x * mesh_scale_width,
      y * mesh_scale_height,
      (50 * (mesh_scale_width + mesh_scale_height)) / 2
    );

    fill(0, 0, 0);
    ellipse(
      x * mesh_scale_width,
      y * mesh_scale_height,
      (20 * (mesh_scale_width + mesh_scale_height)) / 2
    );

    [x, y, z] = keypoints[252];
    fill(0, 0, 255);
    ellipse(
      x * mesh_scale_width,
      y * mesh_scale_height,
      (50 * (mesh_scale_width + mesh_scale_height)) / 2
    );

    fill(0, 0, 0);
    ellipse(
      x * mesh_scale_width,
      y * mesh_scale_height,
      (20 * (mesh_scale_width + mesh_scale_height)) / 2
    );
  }
}

function gotResults(results) {
  predictions = results;
}
