let camera;

var handposeModel = null;
var videoDataLoaded = false;

var statusText = "";

var myHands = [];

let scale_width;
let scale_height;

let theremin_x;
let theremin_y;

let osc;

handpose.load().then(function (_model) {
  statusText = "Model loaded.";
  handposeModel = _model;
});


function mousePressed() {
    osc.start();
}


function mouseReleased() {
    osc.stop();
}

function setup() {
  camera = createCapture(VIDEO);

  camera.elt.onloadeddata = function () {
    videoDataLoaded = true;
    createCanvas(windowWidth, windowHeight);
  };

  camera.hide();

  osc = new p5.Oscillator('sine');
}


function drawHands(hands) {
  for (var i = 0; i < hands.length; i++) {
    var landmarks = hands[i].landmarks;

    theremin_x = 0;
    theremin_y = 0;

    for (var j = 0; j < landmarks.length; j++) {
      var [x, y, z] = landmarks[j];
      theremin_x += x;
      theremin_y += y;

      fill(255, 255, 255);
      circle(
        x * scale_width,
        y * scale_height,
        (10 * (scale_width + scale_height)) / 2
      );
    }

    theremin_x = theremin_x / landmarks.length;
    theremin_y = theremin_y / landmarks.length;
  }

  // osc.amp(theremin_y / windowHeight * 10);
  osc.freq(int((theremin_x * scale_width / windowWidth) * 100) + 440);

  // fill(mouseY, 0, 0);
  // circle(mouseX, windowHeight / 2, mouseX / 2);
}


function draw() {
  if (handposeModel && videoDataLoaded) {
    handposeModel.estimateHands(camera.elt).then(function (_hands) {
      myHands = _hands;
      if (!myHands.length) {
        statusText = "Show some hands!";
      } else {
        statusText =
          "Confidence: " +
          Math.round(myHands[0].handInViewConfidence * 1000) / 1000;
      }
    });
  }

  let img = camera.get();

  image(img, 0, 0, width, height);
  scale_width = width / camera.width;
  scale_height = height / camera.height;
  drawHands(myHands);

  fill(127, 127, 127);
  textSize(15);
  text(statusText, 20, 20);
}
