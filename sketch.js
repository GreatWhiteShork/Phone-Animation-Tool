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
// [] A way to clear frames
// [] A way to duplicate frames
// [] A way to delete frames
// [] Prevent drawings outside of canvas
// [] Include layers
// [] Make the playback delay at the end slightly
// [] Oh, undo
// [] Include Onion Skin on the micro drawing?
// Quick-scrub by pressing and scrolling on preview
// [] Thinner strokes?
// Oh lol, export button


p5.disableFriendlyErrors = true;

var app = {
  onion: true,
  clipboard: [],
  strokeWeight: 5,
  scrubbing: false
}


var layers = {};

var curLayer = 0, curFrame = 0;
for ( var i = 0; i < 4; i++ ) {
  layers[i] = [];
  layers[i][curFrame] = [];
}

var currentPath = [];

var canvasWidth, canvasHeight;


function setup() {
  canvasWidth = 400;
  canvasHeight = 800;
  // canvasWidth = windowWidth;
  // canvasHeight = windowHeight;
  createCanvas(canvasWidth, canvasHeight);
  // console.log(layers[curLayer][curFrame])
}

function draw() {
  // console.log(curLayer);
  background(150);
  fill(255); stroke(100); strokeWeight(1);
  rect(canvasWidth/2 - 200, canvasHeight/2-200, 400);

  drawUI();
  drawCurrentFrame(curFrame, false, -1);
  // drawHighlights();
}

function touchStarted() {
  checkScrubbing();
  checkPrevNextButton();
  checkLayerChangeButton();
  checkUndo();
  return false;
}

function touchMoved() {
  if ( mouseY >= canvasHeight/2 - 200  && mouseY <= canvasHeight/2 + 200  )  currentPath.push({x: mouseX, y: mouseY});
  if ( app.scrubbing ) {
    // (mouseX - canvasWidth/2) /
  }
  return false;
}

function touchEnded() {
  if ( mouseY >= canvasHeight/2 - 200 && mouseY <= canvasHeight/2 + 200 ) layers[curLayer][curFrame].push(currentPath);
  currentPath = [];
  if ( app.scrubbing ) app.scrubbing = false;
  return false;
}

// ~~ HELPERS

function checkScrubbing() {
  if ( mouseX <= canvasWidth/2 - 40 || mouseX >= canvasWidth/2 + 40) app.scrubbing = false;
  if ( mouseY <= canvasHeight/2 - 90 || mouseY >= canvasHeight/2 - 10 ) app.scrubbing = false;
  app.scrubbing = true;
}

function checkUndo() {
  
  if ( mouseY < canvasHeight/2 + 310 || mouseY > canvasHeight/2 + 360 ) return;
  if ( mouseX < canvasWidth / 2 - 180 || mouseX > canvasWidth / 2 - 115 ) return;
  
  if ( layers[curLayer][curFrame].length ) layers[curLayer][curFrame].pop();
}

function checkLayerChangeButton() {
  // Ugh, just gonna hard-code this for a bit
  if ( mouseY < canvasHeight/2 + 210 || mouseY > canvasHeight/2 + 290 ) return;
  
  if ( mouseX < canvasWidth/2 - 200 + 10 || mouseX >= canvasWidth/2 + 200 - 10 ) return;
  
  else if ( mouseX >= canvasWidth/2 - 200 + 10 && mouseX <= canvasWidth/2 - 200 + 90 ) {
    curLayer = 0;
  } else if ( mouseX >= canvasWidth/2 - 200 + 110 && mouseX <= canvasWidth/2 - 200 + 190 ) {
    curLayer = 1;
  } else if ( mouseX >= canvasWidth/2 - 200 + 210 && mouseX <= canvasWidth/2 - 200 + 290 ) {
    curLayer = 2;
  } else if ( mouseX >= canvasWidth/2 - 200 + 310 && mouseX <= canvasWidth/2 - 200 + 390 ) {
    curLayer = 3;
  }
  if ( layers[curLayer] == undefined ) {
    layers[curLayer] = [];
    layers[curLayer][curFrame] = [];
  }
  
}

function checkPrevNextButton() {
  // Also needs to update other layers
  
  var extraLift = 25;
  
  // Prev and Next Buttons
  if ( mouseY < canvasHeight/2 - 200 - extraLift && mouseY > canvasHeight/2 - 250 - extraLift) {
    
    if ( mouseX >= canvasWidth/2 - 200 && mouseX <= canvasWidth/2 - 150  ) {
      curFrame--;
      if ( curFrame < 0 ) curFrame = 0;
    } else if ( mouseX >= canvasWidth/2 + 150 && mouseX <= canvasWidth/2 + 200  ) {
      curFrame++;
      // Do this for all layers.
      // Current layer gets an empty frame.
      // Other layers duplicate the previous frame.
      for ( var c = 0; c < 4; c++ ) {
        if ( c == curLayer ) {
          if ( layers[c][curFrame] == undefined ) layers[c][curFrame] = [];
        } else {
          if ( layers[c][curFrame] == undefined ) layers[c][curFrame] = JSON.parse(JSON.stringify(layers[c][curFrame-1]));
        }
      }
    }
    
    
    if ( mouseX >= canvasWidth/2 - 125 && mouseX <= canvasWidth/2 - 75  ) {
      // Insert frame before, move to it
      // console.log('insert before');
      if ( curFrame > 0 ) {
        for ( var c = 0; c < 4; c++ ) {
          if ( c == curLayer ) {
            layers[curLayer].splice(curFrame, 0, []);
          } else {
            layers[c].splice(curFrame, 0, JSON.parse(JSON.stringify(layers[c][curFrame-1])));
          }
        }
        // layers[curLayer].splice(curFrame, 0, []);
      }
      
      // if ( --curFrame < 0 ) curFrame = 0;
    } else if ( mouseX >= canvasWidth/2 + 75 && mouseX <= canvasWidth/2 + 125  ) {
      // if ( layers[curLayer][++curFrame] == undefined ) layers[curLayer][curFrame] = [];
      // console.log("insert after");
      if ( curFrame < layers[curLayer].length - 1 ) {        
        for ( var c = 0; c < 4; c++ ) {
          if ( c == curLayer ) {
            layers[curLayer].splice((curFrame++) + 1, 0, []);
          } else {
            layers[c].splice((curFrame) + 1, 0, JSON.parse(JSON.stringify(layers[c][curFrame])));
          }
        }
        // layers[curLayer].splice((curFrame++) + 1, 0, []);
      }
    }
  }
  
  // Delete Button
  if ( mouseY < canvasHeight/2 - 300 - extraLift && mouseY > canvasHeight/2 - 340  - extraLift && mouseX > canvasWidth/2 - 20 && mouseX < canvasWidth/2 + 20 ) {
    layers[curLayer][curFrame] = [];
  }
  
  
  // Copy/Paste Buttons
  if ( mouseY < canvasHeight/2 - 300 - extraLift&& mouseY > canvasHeight/2 - 350 - extraLift) {
    if ( mouseX >= canvasWidth/2 - 100 && mouseX <= canvasWidth/2 - 60 ) {
      app.clipboard = layers[curLayer][curFrame];
    }
    if ( mouseX >= canvasWidth/2 + 60 && mouseX <= canvasWidth/2 + 90 ) {
      layers[curLayer][curFrame] = app.clipboard;
    }
  }
  
  
}

function drawHighlights() {
  // Just for showing clickable things. Mainly debugging.
  noFill();
  stroke(255);
  strokeWeight(2);
  var extraLift = 25;
  if ( mouseY < canvasHeight/2 - 200 && mouseY > canvasHeight/2 - 250 - extraLift ) {
    
    if ( mouseX >= canvasWidth/2 - 200 && mouseX <= canvasWidth/2 - 150  ) {
      rect(canvasWidth/2 - 200, canvasHeight/2 - 250 - extraLift,50, 50)
    } else if ( mouseX >= canvasWidth/2 + 150 && mouseX <= canvasWidth/2 + 200  ) {
      rect(canvasWidth/2 + 150, canvasHeight/2 - 250 - extraLift,50, 50)
    }
    
    
    if ( mouseX >= canvasWidth/2 - 125 && mouseX <= canvasWidth/2 - 75  ) {
      // Insert frame before, move to it
      // console.log('insert before');
      if ( curFrame > 0 ) {
        // layers[curLayer].splice(curFrame, 0, []);
        rect(canvasWidth/2 - 125, canvasHeight/2 - 250 - extraLift,50, 50)
      }
      
      // if ( --curFrame < 0 ) curFrame = 0;
    } else if ( mouseX >= canvasWidth/2 + 75 && mouseX <= canvasWidth/2 + 125  ) {
      // if ( layers[curLayer][++curFrame] == undefined ) layers[curLayer][curFrame] = [];
      // console.log("insert after");
      if ( curFrame < layers[curLayer].length - 1 ) {        
        // layers[curLayer].splice((curFrame++) + 1, 0, []);
        rect(canvasWidth/2 + 75, canvasHeight/2 - 250 - extraLift,50, 50)
      }
    }
  }
  
  
  if ( mouseY < canvasHeight/2 - 300 && mouseY > canvasHeight/2 - 340 && mouseX > canvasWidth/2 - 20 && mouseX < canvasWidth/2 + 20 ) {
    
      rect(canvasWidth/2 - 20, canvasHeight/2 - 340,40, 40)
  }
  
  if ( mouseY < canvasHeight/2 - 300 && mouseY > canvasHeight/2 - 350 ) {
    if ( mouseX >= canvasWidth/2 - 100 && mouseX <= canvasWidth/2 - 60 ) {
      rect(canvasWidth/2 - 100, canvasHeight/2 - 350, 40, 50 )
    }
    if ( mouseX >= canvasWidth/2 + 60 && mouseX <= canvasWidth/2 + 90 ) {
      rect(canvasWidth/2 + 60, canvasHeight/2 - 350, 30, 50 )
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
  triangle( canvasWidth/2 - 150, canvasHeight/2 - 250 - extraLift, canvasWidth/2 - 200, canvasHeight/2 - 225 - extraLift, canvasWidth/2 - 150, canvasHeight/2 - 200 - extraLift);
  if ( curFrame == layers[curLayer].length-1 ) fill(135); else fill(50);
  triangle( canvasWidth/2 + 150, canvasHeight/2 - 250 - extraLift, canvasWidth/2 + 200, canvasHeight/2 - 225 - extraLift, canvasWidth/2 + 150, canvasHeight/2 - 200 - extraLift);
  
  // Insert Buttons  
  noFill();
  if ( curFrame == 0 ) stroke(160); else stroke(200);
  var extraLift = 25;
  triangle( canvasWidth/2 - 75, canvasHeight/2 - 250 - extraLift, canvasWidth/2 - 125, canvasHeight/2 - 225 - extraLift, canvasWidth/2 - 75, canvasHeight/2 - 200 - extraLift);
  line(canvasWidth/2 - 100, canvasHeight/2 - 225 - extraLift, canvasWidth/2 - 80, canvasHeight/2 - 225 - extraLift);
  line(canvasWidth/2 - 90, canvasHeight/2 - 235 - extraLift, canvasWidth/2 - 90, canvasHeight/2 - 215 - extraLift);  
  noFill();
  if ( curFrame == layers[curLayer].length-1 ) stroke(160); else stroke(200);
  var extraLift = 25;
  triangle( canvasWidth/2 + 75, canvasHeight/2 - 250 - extraLift, canvasWidth/2 + 125, canvasHeight/2 - 225 - extraLift, canvasWidth/2 + 75, canvasHeight/2 - 200 - extraLift);
  line(canvasWidth/2 + 100, canvasHeight/2 - 225 - extraLift, canvasWidth/2 + 80, canvasHeight/2 - 225 - extraLift);
  line(canvasWidth/2 + 90, canvasHeight/2 - 235 - extraLift, canvasWidth/2 + 90, canvasHeight/2 - 215 - extraLift);
  
  // Delete Button
  noFill();
  stroke(50); strokeWeight(1);
  if ( layers[curLayer][curFrame].length ) fill(100);
  beginShape();
  vertex(canvasWidth/2 - 10, canvasHeight/2 - 300);
  vertex(canvasWidth/2 + 10, canvasHeight/2 - 300);
  vertex(canvasWidth/2 + 15, canvasHeight/2 - 330);
  vertex(canvasWidth/2 - 15, canvasHeight/2 - 330);
  vertex(canvasWidth/2 - 10, canvasHeight/2 - 300);
  endShape(CLOSE);
  line(canvasWidth/2 - 17, canvasHeight/2 - 334, canvasWidth/2 + 17, canvasHeight/2 - 334);
  // line(canvasWidth/2 - 5, canvasHeight/2 - 338, canvasWidth/2 + 5, canvasHeight/2 - 338);

  // Timeline visualiser
  // Just a thin thing above the canvas
  noFill(); stroke(170); strokeWeight(4);
  line(canvasWidth/2 - 200, canvasHeight/2 - 204, canvasWidth/2 + 200, canvasHeight/2 - 204);
  stroke(80);
  var lengthSize = 400 / layers[curLayer].length;
  var start = lengthSize * curFrame;

  line(canvasWidth/2 - 200 + start, canvasHeight/2 - 204, canvasWidth/2 - 200 + start + lengthSize, canvasHeight/2 - 204);
  
  
  // Paste Button
  noFill();
  stroke(50); strokeWeight(1);
  if ( app.clipboard.length ) fill(100);
  rect(canvasWidth/2 - 100, canvasHeight/2 - 350, 40, 50, 3);
  rect(canvasWidth/2 - 95, canvasHeight/2 - 343, 30, 40, 3);
  rect(canvasWidth/2 - 90, canvasHeight/2 - 353, 20, 6);
  
  
  // Copy Button
  noFill();
  stroke(50); strokeWeight(1);
  if ( app.clipboard.length ) fill(100);
  beginShape();
  vertex(canvasWidth/2 + 60, canvasHeight/2 - 335);
  vertex(canvasWidth/2 + 90, canvasHeight/2 - 335);
  vertex(canvasWidth/2 + 85, canvasHeight/2 - 300);
  vertex(canvasWidth/2 + 65, canvasHeight/2 - 300);
  endShape(CLOSE);
  
  rect(canvasWidth/2 + 55, canvasHeight/2 - 340, 40, 5, 2);
  rect(canvasWidth/2 + 72, canvasHeight/2 - 355, 5, 15, 2);
  
  

  // Drawing Previewer
  // Constantly playing back, unless we're drawing, in which case show the drawing frame only

  var framerate = 8;
  var fps = 1000 / 8;
  var renderThisFrame = Math.floor((millis() / fps ) % ( layers[curLayer].length + 3) ) ;
  if ( mouseIsPressed ) {
    renderThisFrame = curFrame;
  } else {
    renderThisFrame = Math.min(layers[curLayer].length-1, renderThisFrame) 
  }
  
  push();
  translate(canvasWidth/2, canvasHeight/2);
  scale(0.2);
  translate(-canvasWidth/2, -canvasHeight/2);
  translate(0, -250 / 0.2);

  fill(255); stroke(100); strokeWeight(1);
  rect(canvasWidth/2 - 200, canvasHeight/2-200, 400);
  drawCurrentFrame(renderThisFrame, !mouseIsPressed, -1);
  pop();
  
  
  // Layers
  push();
  translate(canvasWidth/2, canvasHeight/2);
  scale(0.2);
  translate(-canvasWidth/2, -canvasHeight/2);
  for ( var i = 0; i < 4; i++ ) {
    push();
    translate(-750 + i * 500, 250 / 0.2);
    if ( i == curLayer ) {
      fill(255);
    } else {
      fill(255, 255, 255, 100);
    }
    stroke(100); strokeWeight(1);
    rect(canvasWidth/2 - 200, canvasHeight/2-200, 400);
    // Draw only the target layer
    // And only the current frame
    // drawCurrentFrame(renderThisFrame, !mouseIsPressed);
    drawCurrentLayer(curFrame, i)
    pop();
  }
  pop();

  // Undo
  noFill();
  strokeWeight(5);
  if ( layers[curLayer][curFrame].length == 0 ) {
    stroke(120);
  } else {
    stroke(0);
  }
  line(canvasWidth / 2 - 180, canvasHeight / 2 + 350, canvasWidth / 2 - 130, canvasHeight / 2 + 350 );
  line(canvasWidth / 2 - 160, canvasHeight / 2 + 320, canvasWidth / 2 - 130, canvasHeight / 2 + 320 );
  arc(canvasWidth / 2 - 130, canvasHeight / 2 + 335, 30, 30, -HALF_PI, HALF_PI);
  line(canvasWidth / 2 - 160, canvasHeight / 2 + 320, canvasWidth / 2 - 150, canvasHeight / 2 + 310 );
  line(canvasWidth / 2 - 160, canvasHeight / 2 + 320, canvasWidth / 2 - 150, canvasHeight / 2 + 330 );
  
  // Export
}

function drawOnionSkin() {
  if ( app.onion == false ) return;
}

function drawCurrentLayer(targFrame, targLayer) {
  if ( layers[targLayer] == undefined ) return;
  noFill();
  
  var theFrame = layers[targLayer][targFrame];
  
  
    for ( var i = 0, iL = theFrame.length; i < iL; i++ ) {
      
      stroke(0, 0, 0, 180 * 0.4 + (180/iL) * 0.6);
      strokeWeight(app.strokeWeight * 0.6 +(20/iL) * 0.4 );
      
      var thisPath = theFrame[i];
      beginShape();
      for ( var c = 0, cL = thisPath.length-1; c < cL; c++ ) {
        curveVertex(thisPath[c].x, thisPath[c].y);
      }
      endShape();
    }
  
}

function drawCurrentFrame(targFrame, preview) {
  
  // Needs to faintly draw the other layers, right?
  
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
  strokeWeight(app.strokeWeight * 0.75 +(20/currentFrameLength) * 0.25 );
  beginShape();
  for ( var c = 0, cL = currentPath.length-1; c < cL; c++ ) {
    curveVertex(currentPath[c].x, currentPath[c].y);
  }
  endShape();

  // Other Paths
  var originalLayer = curLayer;
  
  for ( var n = 0; n < 4; n++ ) {
    curLayer = n;
    
    if ( n == originalLayer ) {
      drawThisFrame(targFrame, 0, 0, 0, 180);
    } else {
      drawThisFrame(targFrame, 100, 100, 100, 180);
    }
  }
  curLayer = originalLayer;
  
  function drawThisFrame(targFrame, r, g, b, a) {
    var currentFrame = layers[curLayer][targFrame];

    for ( var i = 0, iL = currentFrame.length; i < iL; i++ ) {
      
      stroke(r, g, b, a * 0.4 + (a/iL) * 0.6);
      strokeWeight(app.strokeWeight * 0.6 +(20/iL) * 0.4 );
      
      var thisPath = currentFrame[i];
      beginShape();
      for ( var c = 0, cL = thisPath.length-1; c < cL; c++ ) {
        curveVertex(thisPath[c].x, thisPath[c].y);
      }
      endShape();
    }
  }
}
