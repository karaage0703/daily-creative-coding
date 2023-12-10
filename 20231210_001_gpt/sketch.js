
function setup() {
    createCanvas(windowWidth, windowHeight);
    background(255);
    angleMode(DEGREES);
}

function draw() {
    background(255, 255, 255, 25); // 軽い透明効果を追加
    let a = map(mouseX, 0, width, width/10, width/2); // マウスのX座標によって大きさを変化
    for(let x = 0; x <= 360; x += 0.1) {
        let col = map(mouseY, 0, height, 0, 255); // マウスのY座標によって色を変化
        stroke(col, 100, 255 - col);
        strokeWeight(map(mouseX, 0, width, 0.1, 5)); // マウスのX座標によって線の太さを変化
        point(width / 2 + a * cos(x), height / 2 + a * sin(x));
    }
}

function mouseClicked() {
    // クリックでパターンをランダムに変更
    loop();
}
