  // ~~ GOAL
// Make a quick and loose phone-friendly animation app
// Just for quickly iterating quick ideas, without needing to make things look clean

  // ~~ IDEAL FEATURES
// Quick and rough brush
// Quick and rough filles (if at all)
// Quick and rough transforms
// Quick and easy canvas rotations
// Nice and finger-friendly
// Small "render display" on the top right, so I can sketch without my thumb getting in the way
// Easy to navigate
// Easy to bring to AE?

  // ~~TO DO
// [] Build canvas/Drawing Stage
// [] Add Drawing Capabilities
// Onion Skin?
// Playback
// A way to insert sub-frames
// A way to delete frames
// A way to duplicate frames


var app = {
  onion: true
}


var layers = {};
var curLayer = 1, curFrame = 0;
  layers[curLayer] = [];
  layers[curLayer][curFrame] = [];
var currentPath = [];


function setup() {
  createCanvas(windowWidth, windowHeight);
console.log(windowWidth, windowHeight);
}

function draw() {
  background(150);
  fill(255); stroke(100); strokeWeight(1);
  rect(windowWidth/2 - 200, windowHeight/2-200, 400);

  drawUI();
  drawOnionSkin();

  stroke(0, 0, 0, 100);
  drawCurrentFrame(curFrame);
}

function mousePressed() {
  // checkNextFrameClick
  checkPrevNextButton();
}

function mouseDragged() {
  currentPath.push({x: mouseX, y: mouseY});
}

function mouseReleased() {
  layers[curLayer][curFrame].push(currentPath);
  currentPath = [];
}

// ~~ HELPERS

function checkPrevNextButton() {
  if ( mouseY < windowHeight/2 - 200 ) {
    if ( mouseX >= windowWidth/2 - 200 && mouseX <= windowWidth/2 - 150  ) {
      if ( --curFrame < 0 ) curFrame = 0;
    } else if ( mouseX >= windowWidth/2 + 150 && mouseX <= windowWidth/2 + 200  ) {
      if ( layers[curLayer][++curFrame] == undefined ) layers[curLayer][curFrame] = [];
    }
  }
}

function drawUI() {
  // [] Prev/Next Buttons
  // [] Timeline Visualiser
  // [Don't need this on a fucking phone...] Canvas Rotation Tools
  // Drawing Previewer
  
  // Prev/Next Buttons
  noStroke();
  
  if ( curFrame == 0 ) fill(135); else fill(50);
  var extraLift = 10;
  triangle( windowWidth/2 - 150, windowHeight/2 - 250 - extraLift, windowWidth/2 - 200, windowHeight/2 - 225 - extraLift, windowWidth/2 - 150, windowHeight/2 - 200 - extraLift);

  if ( curFrame == layers[curLayer].length-1 ) fill(135); else fill(50);

  triangle( windowWidth/2 + 150, windowHeight/2 - 250 - extraLift, windowWidth/2 + 200, windowHeight/2 - 225 - extraLift, windowWidth/2 + 150, windowHeight/2 - 200 - extraLift);

  // Timeline visualiser
  // Just a thin thing above the canvas

  noFill(); stroke(170); strokeWeight(4);
  line(windowWidth/2 - 200, windowHeight/2 - 204, windowWidth/2 + 200, windowHeight/2 - 204);
  stroke(80);
  var lengthSize = 400 / layers[curLayer].length;
  var start = lengthSize * curFrame;

  line(windowWidth/2 - 200 + start, windowHeight/2 - 204, windowWidth/2 - 200 + start + lengthSize, windowHeight/2 - 204);

  // Drawing Previewer
  // Constantly playing back, unless we're drawing, in which case show the drawing frame only


  var renderThisFrame = Math.floor((millis() / 1000 * 12 ) % layers[curLayer].length);
 // renderThisFrame = 0;
 // console.log(millis() / 1000 * 12 )
  if ( mouseIsPressed ) renderThisFrame = curFrame;
  push();
  translate(windowWidth/2, windowHeight/2);
  scale(0.2);
  translate(-windowWidth/2, -windowHeight/2);
  translate(0, -250 / 0.2);

  fill(255); stroke(100); strokeWeight(1);
  rect(windowWidth/2 - 200, windowHeight/2-200, 400);
  drawCurrentFrame(renderThisFrame, 10);
  pop();

  
}

function drawOnionSkin() {
  if ( app.onion == false ) return;

  
  if ( curFrame >= 2 ) { stroke(255,0,0,20); drawCurrentFrame(curFrame-2); }
  if ( curFrame >= 1 ) { stroke(255,0,0,50); drawCurrentFrame(curFrame-1); }

  if ( layers[curLayer].length - curFrame > 2 ) { stroke(0,0,255,20); drawCurrentFrame(curFrame+2); }
  if ( layers[curLayer].length - curFrame > 1 ) { stroke(0,0,255,50); drawCurrentFrame(curFrame+1); }
}

function drawCurrentFrame(targFrame, thick) {

  var iterations = 1;

  noFill();
  if ( thick == undefined ) thick = 0;

  for ( var x = 0; x < iterations; x++ ) {
    strokeWeight(x * (20/iterations) + 2 + thick);
    beginShape();
    for ( var c = 0, cL = currentPath.length-1; c < cL; c++ ) {
      curveVertex(currentPath[c].x, currentPath[c].y);
    }
    endShape();
  }

  var currentFrame = layers[curLayer][targFrame];

  for ( var x = 0; x < iterations; x++ ) {
    strokeWeight(x * (20/iterations) + 2 + thick);
    for ( var i = 0, iL = currentFrame.length; i < iL; i++ ) {
      var thisPath = currentFrame[i];
      beginShape();
      for ( var c = 0, cL = thisPath.length-1; c < cL; c++ ) {
        curveVertex(thisPath[c].x, thisPath[c].y);
      }
      endShape();
    }
  }
}
