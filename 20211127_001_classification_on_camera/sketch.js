let classifier;
let camera;
let status_text = '';
let numClass = 1;

function preload() {
  classifier = ml5.imageClassifier('MobileNet');
  camera = createCapture(VIDEO);
  camera.hide();
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  classifier.classify(camera, numClass, gotResult);
  status_text = 'Processing...';
}

function draw() {
  let img = camera.get();
  image(img, 0, 0, width, height);
  fill(255, 255, 127);
  textSize(24);
  text(status_text, 20, 20);
}

function gotResult(err, results) {
  if (err) {
    console.error(err);
    status_text = err;
  }
  status_text = '';
  for(let i = 0; i < results.length; i++){
    status_text +=
        'ラベル: ' + results[i].label
        + ', 確度: ' + results[i].confidence + '\n';
  }
  classifier.classify(camera, numClass, gotResult);
}
