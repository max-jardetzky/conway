var imageWidth = window.innerWidth;
var imageHeight = window.innerHeight;
var canvas = null;
var ctx = null;
var bounds = null;
var panX = 0;
var panY = 0;
var mouseX = 0;
var mouseY = 0;
var oldMouseX = 0;
var oldMouseY = 0;
var mouseHeld = false;
var boxArray = [];
var start = document.getElementById("start");
var onButton = false;
var started = false;
var mouseHeld = false;
var drag = false;

function Box(x,y,width,height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.toggled = false;
}

Box.prototype.isCollidingWithPoint = function(x,y) {
    return (x > this.x && x < this.x + this.width)
        && (y > this.y && y < this.y + this.height);
}

Box.prototype.draw = function() {
    ctx.fillStyle = "black";	
    ctx.fillRect(
        this.x - panX,
        this.y - panY,
        this.width,
        this.height
    );
    
    if (!this.toggled) {
        ctx.fillStyle = "white";
        ctx.fillRect(
            this.x - panX + 0.5,
            this.y - panY + 0.5,
            this.width - 1,
            this.height - 1
        );
    } else {
        ctx.fillStyle = "black";	
        ctx.fillRect(
            this.x - panX,
            this.y - panY,
            this.width,
            this.height
        );
    }
}

window.onmousedown = function(e) {
    mouseHeld = true;
    drag = false;
}

window.onmousemove = function(e) {
    mouseX = e.clientX - bounds.left;
    mouseY = e.clientY - bounds.top;
    drag = true;

    if (mouseHeld && !started) {
        for (i = 0; i < boxArray.length; i++) {
            for (j = 0; j < boxArray[i].length; j++) {
                if (boxArray[i][j].isCollidingWithPoint(mouseX + panX, mouseY + panY) && !onButton) {
                    selectedBox = boxArray[i][j];
                    selectedBox.toggled = true;
                    requestAnimationFrame(draw);
                    return;
                }
            }
        }
    }

    if (started) {
        
        if (mouseHeld) {
            panX += oldMouseX - mouseX;
            panY += oldMouseY - mouseY;
        }
        
        oldMouseX = mouseX;
        oldMouseY = mouseY;
        
        requestAnimationFrame(draw);
    }
}

window.onmouseup = function(e) {
    mouseHeld = false;
    
    if (!drag) {
        for (i = 0; i < boxArray.length; i++) {
            for (j = 0; j < boxArray[i].length; j++) {
                if (boxArray[i][j].isCollidingWithPoint(mouseX + panX, mouseY + panY) && !onButton) {
                    selectedBox = boxArray[i][j];
                    selectedBox.toggled = !selectedBox.toggled;
                    requestAnimationFrame(draw);
                    return;
                }
            }
        }
    }
}

window.onclick = function(e) {
    
}

start.onmouseenter = function(e) {
    onButton = true;
}

start.onmouseleave = function (e) {
    onButton = false;
}

function draw() {
    ctx.fillStyle = "black";
    ctx.fillRect(0,0,window.innerWidth,window.innerHeight);
    
    var box = null;
    var xMin = 0;
    var xMax = 0;
    var yMin = 0;
    var yMax = 0;
    
    ctx.fillStyle = "white";
    
    for (i = 0; i < boxArray.length; i++) {
        for (var j = 0; j < boxArray[i].length; j++) {
            box = boxArray[i][j];
            
            xMin = box.x - panX;
            xMax = box.x + box.width - panX;
            yMin = box.y - panY;
            yMax = box.y + box.height - panY;
            
            if (xMax > 0 && xMin < imageWidth && yMax > 0 && yMin < imageHeight) {
                box.draw();
            }
        }
    }
}

window.onload = function() {
    canvas = document.getElementById("canvas");
    canvas.width = imageWidth;
    canvas.height = imageHeight;
    
    bounds = canvas.getBoundingClientRect();
    ctx = canvas.getContext("2d");
    
    boxWidth = 20;
    drawX = -5 * boxWidth;
    drawY = -5 * boxWidth;
    testDrawY = -5 * boxWidth;
    rowNum = 0;
    down = false;
    while (!down) {
        boxArray.push([]);
        rowNum++;
        testDrawY += boxWidth
        if (testDrawY > window.innerHeight + 4*boxWidth) {
            down = true;
        }
    }

    for (i = 0; i < window.innerWidth/boxWidth + 10; i++) {
        down = false;
        drawY = -5 * boxWidth;
        for (j = 0; j < rowNum; j++) {
            boxArray[j].push(new Box(drawX, drawY, boxWidth, boxWidth));
            drawY += boxWidth;
        }
        drawX += boxWidth;
    }
    requestAnimationFrame(draw);
    setInfo();
}

window.onresize = function() {
    canvas = document.getElementById("canvas");
    imageWidth = window.innerWidth;
    imageHeight = window.innerHeight;
    canvas.width = imageWidth;
    canvas.height = imageHeight;
    
    requestAnimationFrame(draw);
    setInfo();
}

window.onunload = function() {
    canvas = null;
    ctx = null;
    bounds = null;
    selectedBox = null;
    boxArray = null;
}

function setInfo() {
    info = document.getElementById("info");
    infoWidth = window.innerWidth / 2 + boxWidth;
    infoHeight = infoWidth * 0.15;
    info.style.width = infoWidth + "px";
    info.style.height = infoHeight + "px";
    info.style.left = (window.innerWidth - infoWidth)/2 + "px";
    heightCounter = 0;
    while (true) {
        if (heightCounter * boxWidth > infoHeight) {
            break;
        }
        heightCounter++;
    }
    info.style.top = boxWidth + (heightCounter*boxWidth - infoHeight)/2 + "px";

    cont = document.getElementById("textContainer");
    cont.style.top = infoHeight/2 - cont.clientHeight/1.75 + "px";

    head = document.getElementById("header");
    headFontSize = boxWidth * 0.15;
    head.style.fontSize = headFontSize + "vw";

    subhead = document.getElementById("subheader");
    subheadFontSize = boxWidth * 0.08;
    subhead.style.fontSize = subheadFontSize + "vw";

    startWidth = subhead.clientHeight * 0.7;
    start.style.width = startWidth + "px";
    start.style.height = startWidth + "px";
}

start.onclick = function(e) {
    info.style.display = "none";
    started = true;
    setInterval(function() {
        update();
    }, 500);
}

function update() {
    for (i = 0; i < boxArray.length; i++) {
        for (j = 0; j < boxArray[i].length; j++) {
            neighborCount = 0;
            // Not on edge
            if (i > 0 && j > 0 && i < boxArray.length - 1 && j < boxArray[i].length - 1) {
                for (k = -1; k < 2; k++) {
                    for (l = -1; l < 2; l++) {
                        if (!(k == 0 && l == 0)) {
                            if (boxArray[i+k][j+l].toggled) {
                                neighborCount++;
                            }
                        }
                    }
                }
            }
            // On top edge
            if (i == 0) {
                // Not in top corner
                if (j > 0 && j < boxArray[i].length - 1) {
                    for (k = 0; k < 2; k++) {
                        for (l = -1; l < 2; l++) {
                            if (!(k == 0 && l == 0)) {
                                if (boxArray[i+k][j+l].toggled) {
                                    neighborCount++;
                                }
                            }
                        }
                    }
                } else if (j == 0) {
                    for (k = 0; k < 2; k++) {
                        for (l = 0; l < 2; l++) {
                            if (!(k == 0 && l == 0)) {
                                if (boxArray[i+k][j+l].toggled) {
                                    neighborCount++;
                                }
                            }
                        }
                    }
                } else {
                    for (k = 0; k < 2; k++) {
                        for (l = -1; l < 1; l++) {
                            if (!(k == 0 && l == 0)) {
                                if (boxArray[i+k][j+l].toggled) {
                                    neighborCount++;
                                }
                            }
                        }
                    }
                }
            }
            // On bottom edge
            if (i == boxArray.length - 1) {
                // Not in bottom corner
                if (j > 0 && j < boxArray[i].length - 1) {
                    for (k = -1; k < 1; k++) {
                        for (l = -1; l < 2; l++) {
                            if (!(k == 0 && l == 0)) {
                                if (boxArray[i+k][j+l].toggled) {
                                    neighborCount++;
                                }
                            }
                        }
                    }
                } else if (j == 0) {
                    for (k = -1; k < 1; k++) {
                        for (l = 0; l < 1; l++) {
                            if (!(k == 0 && l == 0)) {
                                if (boxArray[i+k][j+l].toggled) {
                                    neighborCount++;
                                }
                            }
                        }
                    }
                } else {
                    for (k = -1; k < 1; k++) {
                        for (l = -1; l < 1; l++) {
                            if (!(k == 0 && l == 0)) {
                                if (boxArray[i+k][j+l].toggled) {
                                    neighborCount++;
                                }
                            }
                        }
                    }
                }
            }
            // On left edge
            if (j == 0) {
                // Not in corner
                if (i > 0 && i < boxArray.length - 1) {
                    for (k = -1; k < 2; k++) {
                        for (l = 0; l < 2; l++) {
                            if (!(k == 0 && l == 0)) {
                                if (boxArray[i+k][j+l].toggled) {
                                    neighborCount++;
                                }
                            }
                        }
                    }
                }
            }
            // On right edge
            if (j == boxArray[i].length - 1) {
                // Not in corner
                if (i > 0 && i < boxArray.length - 1) {
                    for (k = -1; k < 2; k++) {
                        for (l = -1; l < 1; l++) {
                            if (!(k == 0 && l == 0)) {
                                if (boxArray[i+k][j+l].toggled) {
                                    neighborCount++;
                                }
                            }
                        }
                    }
                }
            }
            if (boxArray[i][j].toggled) {
                if (neighborCount != 2 && neighborCount != 3) {
                    boxArray[i][j].toggled = false;
                }
            } else {
                if (neighborCount == 3) {
                    boxArray[i][j].toggled = true;
                }
            }
        }
    }
    requestAnimationFrame(draw);
}