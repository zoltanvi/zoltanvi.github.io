const gamePanel = document.getElementById("gamePanel");
const c = gamePanel.getContext("2d");

const requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame;

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

};

let map = [];
let mapWidth = 0, mapHeight = level.length;

window.addEventListener("keydown", keyDownHandler, false);
window.addEventListener("keyup", keyUpHandler, false);

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
	requestAnimationFrame(gameLoop);
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

				if(!top && !left && right){
					map[i][j] = new Tile(j * tileWidth, i * tileHeight, tileWidth, tileHeight, tiles.topLeft);
				} else if(!top && left && !right){
					map[i][j] = new Tile(j * tileWidth, i * tileHeight, tileWidth, tileHeight, tiles.topRight);
				} else if(!top && left && right){
					map[i][j] = new Tile(j * tileWidth, i * tileHeight, tileWidth, tileHeight, tiles.topCenter);
				} else if(!top && !bottom && !left && !right) {
					map[i][j] = new Tile(j * tileWidth, i * tileHeight, tileWidth, tileHeight, tiles.single);
				} else if(bottom && !left && !right && !top) {
					map[i][j] = new Tile(j * tileWidth, i * tileHeight, tileWidth, tileHeight, tiles.noBottom);
				} else {
					map[i][j] = new Tile(j * tileWidth, i * tileHeight, tileWidth, tileHeight, tiles.center);
				}
			}

			if(level[i].charAt(j) === "@"){
				player = new Player(j * tileWidth, i * tileHeight, 28, 44);
			}

		}
	}

}


window.onload = function () {
	initGame();
	startTime = Date.now();
	requestAnimationFrame(gameLoop);
};


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