let vinyl;
let isDragging = false;
let offsetX, offsetY;
let startRotation = 0;
let prevRotation = 0;
let angularVelocity = 0;

let sound;
let playbackRate = 1.0;
let lastPlaybackRate = 1.0;
const playbackRateChangeThreshold = 0.1;

let armAngle = 1.57;
let armIsMoving = false;
let armIn = false;
const armSpeed = 0.02;

function setup() {
  createCanvas(windowWidth, windowHeight);
  vinyl = new Vinyl(width / 2, height / 2, windowHeight / 3);
  sound = loadSound('./song.mp3', loaded);
}

function loaded() {
  sound.setVolume(0);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  background(255);
  vinyl.update();
  vinyl.display();
  drawArm();
  drawPowerButton(); // Draw the power button

  angularVelocity = (vinyl.rotation - prevRotation) / (1 / frameRate());
  prevRotation = vinyl.rotation;

  let newPlaybackRate = map(angularVelocity, -PI, PI, -1, 1);
  newPlaybackRate = newPlaybackRate >= 0 ? 0.1 : -0.1;

  if (sound.isPlaying() && sound.currentTime() >= 0 && sound.currentTime() <= sound.duration() - 5) {
    if (isDragging) {
      sound.rate(newPlaybackRate);
      console.log("new playback: ", newPlaybackRate)
      lastPlaybackRate = newPlaybackRate;
    }
  } else if (sound.isPlaying() && sound.currentTime() >= sound.duration() - 5) { sound.jump(0); console.log("Back to the beginning motherfucker") }


}

function mousePressed() {
  let armCenterX = windowWidth / 4;
  let armCenterY = windowHeight / 5;

  let buttonX = (windowWidth / 4) * 3;
  let buttonY = (windowHeight / 5) * 4;

  let armLength = 500;
  let d = dist(mouseX, mouseY, armCenterX, armCenterY);
  let dpower = dist(mouseX, mouseY, buttonX, buttonY);
  if (dpower < 50) {
    if (!sound.isPlaying()) {
      getAudioContext().resume();
      sound.loop();
    } else {
      sound.pause();
    }
  } else if (sound.isPlaying() && d < armLength / 2) {
    armIsMoving = true;
  } else {
    d = dist(mouseX, mouseY, vinyl.x, vinyl.y);
    if (d < vinyl.radius) {
      isDragging = true;
      offsetX = mouseX - vinyl.x;
      offsetY = mouseY - vinyl.y;
      startRotation = vinyl.rotation;
    }
  }
}

function mouseDragged() {
  if (isDragging) {
    let angle = atan2(mouseY - vinyl.y, mouseX - vinyl.x);
    vinyl.rotation = startRotation + (angle - PI / 2);
  }
}

function mouseReleased() {
  isDragging = false;
  sound.rate(1);
  console.log("mouseReleased!!!!!!!!!!!!!")
}

function drawArm() {
  let armCenterX = windowWidth / 4;
  let armCenterY = windowHeight / 5;
  let armLength = 500;
  let armTargetAngle = armIn ? 1.57 : 0.78;
  let easing = 0.1;

  if (armIsMoving) {
    armAngle = lerp(armAngle, armTargetAngle, easing);
    if (sound.getVolume(0.9) && armIn) sound.setVolume(0);
    if (armAngle.toFixed(2) == armTargetAngle) {
      armIn = armAngle < 1;
      armIsMoving = false;
      if (armIn && sound.getVolume() == 0) sound.setVolume(0.9)
    }
  }

  push();
  translate(armCenterX, armCenterY);
  rotate(armAngle);
  strokeWeight(20);
  stroke(255, 0, 0);
  line(0, 0, armLength, 0);
  pop();
}
function drawPowerButton() {
  // Draw the power button as a rectangle
  let buttonWidth = 50;
  let buttonHeight = 30;
  let buttonX = (windowWidth / 4) * 3;
  let buttonY = (windowHeight / 5) * 4;

  fill(100);
  rect(buttonX, buttonY, buttonWidth, buttonHeight);

  // Draw the text on the power button
  fill(255);
  textSize(16);
  textAlign(CENTER, CENTER);
  text(sound.isPlaying() ? "STOP" : "PLAY", buttonX + buttonWidth / 2, buttonY + buttonHeight / 2);
}

class Vinyl {
  constructor(x, y, radius) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.rotation = 0;
    this.spinSpeed = 0.0625;
  }

  update() {
    if (!isDragging && sound.isPlaying()) {
      this.rotation += this.spinSpeed;
    }
  }

  display() {
    push();
    translate(this.x, this.y);
    rotate(this.rotation);
    fill(0);
    ellipse(0, 0, this.radius * 2);
    stroke(255);
    line(0, 0, 0, this.radius * 0.8);
    pop();
  }
}
