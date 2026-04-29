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
// [] Onion Skin?
// Proper Playback?
// [] A way to insert sub-frames 
// [] A way to delete frames
// A way to duplicate frames
// Prevent drawings outside of canvas
// Include layers
// Make the playback delay at the end slightly
// Oh, undo


p5.disableFriendlyErrors = true;

var app = {
  onion: true,
  clipboard: []
}


var layers = {};

var curLayer = 1, curFrame = 0;
  layers[curLayer] = [];
  layers[curLayer][curFrame] = [];

var currentPath = [];


function setup() {   
  createCanvas(windowWidth, windowHeight);
  console.log(layers[curLayer][curFrame])
}

function draw() {
  background(150);
  fill(255); stroke(100); strokeWeight(1);
  rect(windowWidth/2 - 200, windowHeight/2-200, 400);

  drawUI();
  drawCurrentFrame(curFrame, false);
  drawHighlights();
}

function mousePressed() {
  checkPrevNextButton();
}

function mouseDragged() {
  if ( mouseY >= windowHeight/2 - 200 )  currentPath.push({x: mouseX, y: mouseY});
}

function mouseReleased() {
  if ( mouseY >= windowHeight/2 - 200 ) layers[curLayer][curFrame].push(currentPath);
  currentPath = [];
  console.log(layers[curLayer][curFrame])
}

// ~~ HELPERS

function checkPrevNextButton() {
  if ( mouseY < windowHeight/2 - 200 && mouseY > windowHeight/2 - 250) {
    
    if ( mouseX >= windowWidth/2 - 200 && mouseX <= windowWidth/2 - 150  ) {
      if ( --curFrame < 0 ) curFrame = 0;
    } else if ( mouseX >= windowWidth/2 + 150 && mouseX <= windowWidth/2 + 200  ) {
      if ( layers[curLayer][++curFrame] == undefined ) layers[curLayer][curFrame] = [];
    }
    
    
    if ( mouseX >= windowWidth/2 - 125 && mouseX <= windowWidth/2 - 75  ) {
      // Insert frame before, move to it
      console.log('insert before');
      if ( curFrame > 0 ) {
        layers[curLayer].splice(curFrame, 0, []);
      }
      
      // if ( --curFrame < 0 ) curFrame = 0;
    } else if ( mouseX >= windowWidth/2 + 75 && mouseX <= windowWidth/2 + 125  ) {
      // if ( layers[curLayer][++curFrame] == undefined ) layers[curLayer][curFrame] = [];
      console.log("insert after");
      if ( curFrame < layers[curLayer].length - 1 ) {        
        layers[curLayer].splice((curFrame++) + 1, 0, []);
      }
    }
  }
  
  
  if ( mouseY < windowHeight/2 - 300 && mouseY > windowHeight/2 - 340 && mouseX > windowWidth/2 - 20 && mouseX < windowWidth/2 + 20 ) {
    layers[curLayer][curFrame] = [];
  }
  
  
  
  if ( mouseY < windowHeight/2 - 300 && mouseY > windowHeight/2 - 350 ) {
    if ( mouseX >= windowWidth/2 - 100 && mouseX <= windowWidth/2 - 60 ) {
      app.clipboard = layers[curLayer][curFrame];
    }
    if ( mouseX >= windowWidth/2 + 60 && mouseX <= windowWidth/2 + 90 ) {
      layers[curLayer][curFrame] = app.clipboard;
    }
  }
  
  
//   // Copy Button
//   noFill();
//   stroke(50); strokeWeight(1);
//   if ( app.clipboard.length ) fill(100);
//   beginShape();
//   vertex(windowWidth/2 + 60, windowHeight/2 - 335);
//   vertex(windowWidth/2 + 90, windowHeight/2 - 335);
//   vertex(windowWidth/2 + 85, windowHeight/2 - 300);
//   vertex(windowWidth/2 + 65, windowHeight/2 - 300);
//   endShape(CLOSE);
  
//   rect(windowWidth/2 + 55, windowHeight/2 - 340, 40, 5, 2);
//   rect(windowWidth/2 + 72, windowHeight/2 - 355, 5, 15, 2);
  
  
//   // Paste Button
//   noFill();
//   stroke(50); strokeWeight(1);
//   if ( app.clipboard.length ) fill(100);
//   rect(windowWidth/2 - 100, windowHeight/2 - 350, 40, 50, 3);
//   rect(windowWidth/2 - 95, windowHeight/2 - 343, 30, 40, 3);
//   rect(windowWidth/2 - 90, windowHeight/2 - 353, 20, 6);
}

function drawHighlights() {
  // Just for showing clickable things. Mainly debugging.
  noFill();
  stroke(255);
  strokeWeight(2);
  var extraLift = 25;
  if ( mouseY < windowHeight/2 - 200 && mouseY > windowHeight/2 - 250 - extraLift) {
    
    if ( mouseX >= windowWidth/2 - 200 && mouseX <= windowWidth/2 - 150  ) {
      rect(windowWidth/2 - 200, windowHeight/2 - 250 - extraLift,50, 50)
    } else if ( mouseX >= windowWidth/2 + 150 && mouseX <= windowWidth/2 + 200  ) {
      rect(windowWidth/2 + 150, windowHeight/2 - 250 - extraLift,50, 50)
    }
    
    
    if ( mouseX >= windowWidth/2 - 125 && mouseX <= windowWidth/2 - 75  ) {
      // Insert frame before, move to it
      // console.log('insert before');
      if ( curFrame > 0 ) {
        // layers[curLayer].splice(curFrame, 0, []);
        rect(windowWidth/2 - 125, windowHeight/2 - 250 - extraLift,50, 50)
      }
      
      // if ( --curFrame < 0 ) curFrame = 0;
    } else if ( mouseX >= windowWidth/2 + 75 && mouseX <= windowWidth/2 + 125  ) {
      // if ( layers[curLayer][++curFrame] == undefined ) layers[curLayer][curFrame] = [];
      // console.log("insert after");
      if ( curFrame < layers[curLayer].length - 1 ) {        
        // layers[curLayer].splice((curFrame++) + 1, 0, []);
        rect(windowWidth/2 + 75, windowHeight/2 - 250 - extraLift,50, 50)
      }
    }
  }
  
  
  if ( mouseY < windowHeight/2 - 300 && mouseY > windowHeight/2 - 340 && mouseX > windowWidth/2 - 20 && mouseX < windowWidth/2 + 20 ) {
    
      rect(windowWidth/2 - 20, windowHeight/2 - 340,40, 40)
  }
  
  if ( mouseY < windowHeight/2 - 300 && mouseY > windowHeight/2 - 350 ) {
    if ( mouseX >= windowWidth/2 - 100 && mouseX <= windowWidth/2 - 60 ) {
      rect(windowWidth/2 - 100, windowHeight/2 - 350, 40, 50 )
    }
    if ( mouseX >= windowWidth/2 + 60 && mouseX <= windowWidth/2 + 90 ) {
      rect(windowWidth/2 + 60, windowHeight/2 - 350, 30, 50 )
    }
  }
}

function drawUI() {
  // [] Prev/Next Buttons
  // [] Timeline Visualiser
  // [Don't need this on a fucking phone...] Canvas Rotation Tools
  // [] Drawing Previewer
  
  
  // Prev/Next Buttons
  noStroke();
  
  if ( curFrame == 0 ) fill(135); else fill(50);
  var extraLift = 25;
  triangle( windowWidth/2 - 150, windowHeight/2 - 250 - extraLift, windowWidth/2 - 200, windowHeight/2 - 225 - extraLift, windowWidth/2 - 150, windowHeight/2 - 200 - extraLift);
  if ( curFrame == layers[curLayer].length-1 ) fill(135); else fill(50);
  triangle( windowWidth/2 + 150, windowHeight/2 - 250 - extraLift, windowWidth/2 + 200, windowHeight/2 - 225 - extraLift, windowWidth/2 + 150, windowHeight/2 - 200 - extraLift);
  
  // Insert Buttons  
  noFill();
  if ( curFrame == 0 ) stroke(160); else stroke(200);
  var extraLift = 25;
  triangle( windowWidth/2 - 75, windowHeight/2 - 250 - extraLift, windowWidth/2 - 125, windowHeight/2 - 225 - extraLift, windowWidth/2 - 75, windowHeight/2 - 200 - extraLift);
  line(windowWidth/2 - 100, windowHeight/2 - 225 - extraLift, windowWidth/2 - 80, windowHeight/2 - 225 - extraLift);
  line(windowWidth/2 - 90, windowHeight/2 - 235 - extraLift, windowWidth/2 - 90, windowHeight/2 - 215 - extraLift);  
  noFill();
  if ( curFrame == layers[curLayer].length-1 ) stroke(160); else stroke(200);
  var extraLift = 25;
  triangle( windowWidth/2 + 75, windowHeight/2 - 250 - extraLift, windowWidth/2 + 125, windowHeight/2 - 225 - extraLift, windowWidth/2 + 75, windowHeight/2 - 200 - extraLift);
  line(windowWidth/2 + 100, windowHeight/2 - 225 - extraLift, windowWidth/2 + 80, windowHeight/2 - 225 - extraLift);
  line(windowWidth/2 + 90, windowHeight/2 - 235 - extraLift, windowWidth/2 + 90, windowHeight/2 - 215 - extraLift);
  
  // Delete Button
  noFill();
  stroke(50); strokeWeight(1);
  if ( layers[curLayer][curFrame].length ) fill(100);
  beginShape();
  vertex(windowWidth/2 - 10, windowHeight/2 - 300);
  vertex(windowWidth/2 + 10, windowHeight/2 - 300);
  vertex(windowWidth/2 + 15, windowHeight/2 - 330);
  vertex(windowWidth/2 - 15, windowHeight/2 - 330);
  vertex(windowWidth/2 - 10, windowHeight/2 - 300);
  endShape(CLOSE);
  line(windowWidth/2 - 17, windowHeight/2 - 334, windowWidth/2 + 17, windowHeight/2 - 334);
  // line(windowWidth/2 - 5, windowHeight/2 - 338, windowWidth/2 + 5, windowHeight/2 - 338);

  // Timeline visualiser
  // Just a thin thing above the canvas
  noFill(); stroke(170); strokeWeight(4);
  line(windowWidth/2 - 200, windowHeight/2 - 204, windowWidth/2 + 200, windowHeight/2 - 204);
  stroke(80);
  var lengthSize = 400 / layers[curLayer].length;
  var start = lengthSize * curFrame;

  line(windowWidth/2 - 200 + start, windowHeight/2 - 204, windowWidth/2 - 200 + start + lengthSize, windowHeight/2 - 204);
  
  
  // Paste Button
  noFill();
  stroke(50); strokeWeight(1);
  if ( app.clipboard.length ) fill(100);
  rect(windowWidth/2 - 100, windowHeight/2 - 350, 40, 50, 3);
  rect(windowWidth/2 - 95, windowHeight/2 - 343, 30, 40, 3);
  rect(windowWidth/2 - 90, windowHeight/2 - 353, 20, 6);
  
  
  // Copy Button
  noFill();
  stroke(50); strokeWeight(1);
  if ( app.clipboard.length ) fill(100);
  beginShape();
  vertex(windowWidth/2 + 60, windowHeight/2 - 335);
  vertex(windowWidth/2 + 90, windowHeight/2 - 335);
  vertex(windowWidth/2 + 85, windowHeight/2 - 300);
  vertex(windowWidth/2 + 65, windowHeight/2 - 300);
  endShape(CLOSE);
  
  rect(windowWidth/2 + 55, windowHeight/2 - 340, 40, 5, 2);
  rect(windowWidth/2 + 72, windowHeight/2 - 355, 5, 15, 2);
  
  

  // Drawing Previewer
  // Constantly playing back, unless we're drawing, in which case show the drawing frame only

  var framerate = 8;
  var fps = 1000 / 8;
  var renderThisFrame = Math.floor((millis() / fps ) % layers[curLayer].length);
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
  drawCurrentFrame(renderThisFrame, true);
  pop();

  
}

function drawOnionSkin() {
  if ( app.onion == false ) return;

//   strokeWeight(10);
  
//   if ( curFrame >= 2 ) { stroke(255,0,0,10); drawCurrentFrame(curFrame-2); }
//   if ( curFrame >= 1 ) { stroke(255,0,0,25); drawCurrentFrame(curFrame-1); }

//   if ( layers[curLayer].length - curFrame > 2 ) { stroke(0,0,255,20); drawCurrentFrame(curFrame+2); }
//   if ( layers[curLayer].length - curFrame > 1 ) { stroke(0,0,255,50); drawCurrentFrame(curFrame+1); }
}

function drawCurrentFrame(targFrame, preview) {
  
  noFill();
  if ( preview == false && app.onion ) {
    if ( curFrame >= 1 ) {
      drawThisFrame(curFrame-1, 255, 0, 0, 50);
    }
    if ( curFrame >= 2 ) {
      drawThisFrame(curFrame-2, 255,0,0, 25);
    }
    
    // if ( layers[curLayer].length - curFrame > 2 ) {
    //   drawThisFrame(curFrame+2, 0,0,255, 25);
    // }
    if ( layers[curLayer].length - curFrame > 1 ) {
      drawThisFrame(curFrame+1, 0,0,255, 50);
    }
  }

  var iterations = 1;

  
  var currentFrameLength = layers[curLayer][targFrame].length;
  if ( currentFrameLength == 0 ) currentFrameLength = 1;
  stroke(0, 0, 0, 180 * 0.4 + (180/currentFrameLength) * 0.6);
  strokeWeight(20 * 0.75 +(20/currentFrameLength) * 0.25 );
  beginShape();
  for ( var c = 0, cL = currentPath.length-1; c < cL; c++ ) {
    curveVertex(currentPath[c].x, currentPath[c].y);
  }
  endShape();

  // Other Paths
  drawThisFrame(targFrame, 0, 0, 0, 180);
  
  function drawThisFrame(targFrame, r, g, b, a) {
    var currentFrame = layers[curLayer][targFrame];

    for ( var i = 0, iL = currentFrame.length; i < iL; i++ ) {
      
      stroke(r, g, b, a * 0.4 + (a/iL) * 0.6);
      strokeWeight(20 * 0.6 +(20/iL) * 0.4 );
      
      var thisPath = currentFrame[i];
      beginShape();
      for ( var c = 0, cL = thisPath.length-1; c < cL; c++ ) {
        curveVertex(thisPath[c].x, thisPath[c].y);
      }
      endShape();
    }
  }
}
