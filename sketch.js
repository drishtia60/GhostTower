PLAY = 1;
END = 0;
var gameState = PLAY;
var score = 0;


function preload() {
  sceneImg = loadImage("tower.png");
  doorImg = loadImage("door.png");
  climberImg = loadImage("climber.png");
  ghostImg = loadAnimation("ghost-jumping.png", "ghost-standing.png");
  sound = loadSound("spooky.wav");
}

function setup() {
  scene = createSprite(300, 300);
  scene.velocityY = 3;
  scene.addImage(sceneImg);

  ghost = createSprite(300, 200);
  ghost.addAnimation("jumping", ghostImg);
  ghost.scale = 0.3;
  ghost.setCollider("rectangle",0,0,200,150);
  ghost.debug = false;

  sound.loop();

  iSensorG = new Group();
  doorG = new Group();
  climberG = new Group();
}

function draw() {
  createCanvas(600, 600);
  background("black");

  if (scene.y > 400) {
    scene.y = 300;
  }
  if (gameState == PLAY) {
    score = score + Math.round(getFrameRate() / 60);
    if (keyDown("space")) {
      ghost.velocityY = -4;
    }

    //adding gravity to the ghost
    ghost.velocityY = ghost.velocityY + 0.4;

    if (keyDown("right")) {
      ghost.x = ghost.x + 5;
    } else if (keyDown("left")) {
      ghost.x = ghost.x - 5;
    }

    if (climberG.isTouching(ghost)) {
      ghost.velocityY = 0;
    }
    if (iSensorG.isTouching(ghost) || ghost.y > 600) {
     ghost.destroy();
      gameState = END;
    }

    spawnDoor();
    drawSprites();
    textSize(20);
    fill("red");
    text("score :" + score, 480, 50);
  }

  if (gameState == END) {
    fill("white");
    textSize(36);
    text("Game Over", 230, 300);
  }
}

function spawnDoor() {
  if (frameCount % 80 == 0) {
    door = createSprite(200, -50);
    door.addImage(doorImg);
    door.velocityY = 3;
    door.x = random(200, 500);
    door.lifetime = 300;
    door.depth = ghost.depth - 1;
    climber = createSprite(door.x, door.y + 50);
    climber.velocityY = door.velocityY;
    climber.addImage(climberImg);
    climber.lifetime = 300;
    iSensor = createSprite(climber.x, climber.y + 15, 100, 10);
    iSensor.velocityY = climber.velocityY;
    iSensorG.add(iSensor);
    iSensor.visible = false;
    doorG.add(door);
    climberG.add(climber);
  }
}
