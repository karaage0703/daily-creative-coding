let camera;

var handposeModel = null;
var videoDataLoaded = false;

var statusText = "";

var myHands = [];

let scale_width;
let scale_height;

handpose.load().then(function (_model) {
  statusText = "Model loaded.";
  handposeModel = _model;
});

function setup() {
  camera = createCapture(VIDEO);

  camera.elt.onloadeddata = function () {
    videoDataLoaded = true;
    createCanvas(windowWidth, windowHeight);
  };

  camera.hide();
}

function drawHands(hands) {
  for (var i = 0; i < hands.length; i++) {
    var landmarks = hands[i].landmarks;

    for (var j = 0; j < landmarks.length; j++) {
      var [x, y, z] = landmarks[j];
      fill(255, 255, 255);
      circle(
        x * scale_width,
        y * scale_height,
        (10 * (scale_width + scale_height)) / 2
      );
    }
  }
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
