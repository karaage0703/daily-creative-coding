let app;
let sprite;

function setup() {
    createCanvas(windowWidth, windowHeight);
    canvasPixi = document.querySelector("#Canvas");
    Canvas.style.visibility = "hidden";

    app = new PIXI.Application({
        width: width,
        height: height,
        backgroundColor: "#0000FF",
        view: canvasPixi,
    });

    const container = new PIXI.Container();
    app.stage.addChild(container);

    sprite = new PIXI.Sprite(PIXI.Texture.WHITE);
    sprite.x = width / 2;
    sprite.y = height / 2;
    sprite.width = 20;
    sprite.height = 20;
    sprite.alpha = 1;

    container.addChild(sprite);
}

function draw() {
    background(220);

    drawingContext.drawImage(Canvas, 0, 0);

    sprite.x += 10 * (random() - 0.5);
    sprite.y -= 10 * (random() - 0.5);

    if (sprite.x > width){
        sprite.x -= width;
    }

    if (sprite.x < 0){
        sprite.x += width;
    }

    if (sprite.y > height){
        sprite.y -= height;
    }

    if (sprite.y < 0){
        sprite.y += height;
    }
}
