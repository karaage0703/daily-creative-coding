let camera;

var handposeModel = null;
var videoDataLoaded = false;

var statusText = "";

var myHands = [];

handpose.load().then(function (_model) {
	statusText = "Model loaded."
	handposeModel = _model;
})

function setup() {
	camera = createCapture(VIDEO);

	camera.elt.onloadeddata = function () {
		videoDataLoaded = true;
		createCanvas(camera.width * 0.5, camera.height * 0.5);
	}

	camera.hide();
}

function drawHands(hands) {
	for (var i = 0; i < hands.length; i++) {
		var landmarks = hands[i].landmarks;

		for (var j = 0; j < landmarks.length; j++) {
			var [x, y, z] = landmarks[j];
            fill(255, 255, 255);
            circle(x, y, camera.width / 20);
		}
	}
}

function draw() {
	if (handposeModel && videoDataLoaded) {
		handposeModel.estimateHands(camera.elt).then(function (_hands) {
			myHands = _hands;
			if (!myHands.length) {
				statusText = "Show some hands!"
			} else {
				statusText = "Confidence: " + (Math.round(myHands[0].handInViewConfidence * 1000) / 1000);
			}
		});
	}

    let img = camera.get();

	push();
	translate(width, 0);
	scale(-0.5, 0.5);
	image(img, 0, 0, width * 2, height * 2);
	drawHands(myHands);
	pop();

	fill(127, 127, 127);
	textSize(15);
	text(statusText, 20, 20);
}
