const gamePanel = document.getElementById("gamePanel");
const c = gamePanel.getContext("2d");

var requestAnimationFrame = window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame;

let startTime;
let leftPressed = false;
let rightPressed = false;
let upPressed = false;
let downPressed = false;

let deltaTime = 0;
let FPS = 60;
let redrawInterval = 1000 / FPS;
let GRAVITY = 0.4;
let levelObjects = [];
let player;
let cameraOffsetX = 0;
let cameraOffsetY = 0;
let tileHeight = 32;
let tileWidth = 32;

let tiles = {
	topLeft : "sprites/Tiles/TL.png",
	topCenter : "sprites/Tiles/TM.png",
	topRight : "sprites/Tiles/TR.png",
	center : "sprites/Tiles/MM.png",
	noBottom : "sprites/Tiles/noBottom.png",
	single : "sprites/Tiles/Single.png",
	sideBoth : "sprites/Tiles/SB.png",
	sideLeft : "sprites/Tiles/SL.png",
	sideRight : "sprites/Tiles/SR.png",
	bottomLeft : "sprites/Tiles/BL.png",
	bottomCenter : "sprites/Tiles/BM.png",
	bottomRight : "sprites/Tiles/BR.png",
	topBoth : "sprites/Tiles/TB.png",
	exceptRight : "sprites/Tiles/ER.png", 
	exceptLeft : "sprites/Tiles/EL.png"
};

let map = [];
let mapWidth = 0, mapHeight = level.length;

window.addEventListener("keydown", keyDownHandler, false);
window.addEventListener("keyup", keyUpHandler, false);

window.onload = function () {
	initGame();
	startTime = Date.now();
	startAnimating(60);
};

function startAnimating(fps) {
    fpsInterval = 1000 / fps;
    then = Date.now();
    startTime = then;
    console.log(startTime);
    animate();
}

function animate() {

    // request another frame
    requestAnimationFrame(animate);

    // calc elapsed time since last loop
    now = Date.now();
    elapsed = now - then;

    // if enough time has elapsed, draw the next frame
    if (elapsed > fpsInterval) {

        // Get ready for next frame by setting then=now, but...
        // Also, adjust for fpsInterval not being multiple of 16.67
        then = now - (elapsed % fpsInterval);

        // draw next frame
        gameLoop();
    }
}


function keyDownHandler(e) {
	const k = e.key;

	switch (k) {
		case 'ArrowLeft':
			leftPressed = true;
			break;
		case 'ArrowRight':
			rightPressed = true;
			break;
		case 'ArrowUp':
			upPressed = true;
			break;
		case 'ArrowDown':
			downPressed = true;
			break;
	}
}

function keyUpHandler(e) {
	const k = e.key;

	switch (k) {
		case 'ArrowLeft':
			leftPressed = false;
			break;
		case 'ArrowRight':
			rightPressed = false;
			break;
		case 'ArrowUp':
			upPressed = false;
			break;
		case 'ArrowDown':
			downPressed = false;
			break;
	}
}

function gameLoop() {

	const drawStart = Date.now();
	deltaTime = (drawStart - startTime) / redrawInterval;
	if(deltaTime < 0){
		deltaTime = 0;
	} else if(deltaTime > 1){
		deltaTime = 1;
	}
	// deltaTime = (deltaTime > 1) ? 1 : deltaTime;
	update();
	draw();

	startTime = drawStart;

}

function initGame() {

	// Initializes the map
	for (let i = 0; i < level.length; i++) {
		for (let j = 0; j < level[i].length; j++) {
			mapWidth = (j > mapWidth) ? j : mapWidth;
			map[j] = [];
		}
	}

	// Creates the map
	for (let i = 0; i < level.length; i++) {
		for (let j = 0; j < level[i].length; j++) {

			let left = false;
			let right = false;
			let top = false;
			let bottom = false;


			if(level[i].charAt(j) === "#"){
				if(i - 1 >= 0 && level[i - 1].charAt(j) === "#") top = true;
				if(i + 1 <= level.length - 1 && level[i + 1].charAt(j) === "#")	bottom = true;
				if(j - 1 >= 0 && level[i].charAt(j - 1) === "#") left = true;
				if(j + 1 <= level[i].length - 1 && level[i].charAt(j + 1) === "#") right = true;

				let tileType;
				
				
				if     (!top &&  bottom && !left &&  right) tileType = tiles.topLeft;
				else if(!top &&  bottom &&  left && !right) tileType = tiles.topRight;
				else if(!top &&  bottom &&  left &&  right) tileType = tiles.topCenter;
				else if(!top && !bottom && !left && !right) tileType = tiles.single;
				else if(!top &&  bottom && !left && !right) tileType = tiles.noBottom;
				else if( top &&  bottom && !left &&  right) tileType = tiles.sideLeft;
				else if( top &&  bottom &&  left && !right) tileType = tiles.sideRight;
				else if( top && !bottom && !left &&  right) tileType = tiles.bottomLeft;
				else if( top && !bottom &&  left &&  right) tileType = tiles.bottomCenter;
				else if( top && !bottom &&  left && !right) tileType = tiles.bottomRight;	
				else if(!top && !bottom &&  left &&  right) tileType = tiles.topBoth;	
				else if(!top && !bottom &&  left && !right) tileType = tiles.exceptLeft;	
				else if(!top && !bottom && !left &&  right) tileType = tiles.exceptRight;	
				else if( top &&  bottom && !left && !right) tileType = tiles.sideBoth;
				else                                        tileType = tiles.center;
				
				
				map[i][j] = new Tile(j * tileWidth, i * tileHeight, tileWidth, tileHeight, tileType);
				
			}

			if(level[i].charAt(j) === "@"){
				player = new Player(j * tileWidth, i * tileHeight, 28, 44);
			}

		}
	}

}


function update() {
	for (let i = 0; i < levelObjects.length; i++) {
		levelObjects[i].update();
	}
	player.update();
}

function draw() {
	// draws background
	c.fillStyle = "#9ec5e0";
	c.fillRect(0, 0, gamePanel.width, gamePanel.height);

	// draws the level
	for (let i = 0; i < map.length; i++) {
		for (let j = 0; j < map[i].length; j++) {
			if(map[i][j] != null){
				map[i][j].render();
			}
		}
	}

	// draws the player
	player.render();

}
