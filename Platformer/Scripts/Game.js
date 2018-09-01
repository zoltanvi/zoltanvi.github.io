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


	// console.log(deltaTime);
	update();
	draw();


	startTime = drawStart;
	requestAnimationFrame(gameLoop);
}

function initGame() {

	// TODO: map generator from ascii text
	levelObjects.push(new Ground(0, gamePanel.height - 20, gamePanel.width * 3, 20));
	levelObjects.push(new Ground(0, gamePanel.height - 150, gamePanel.width / 2, 10));
	levelObjects.push(new Ground(0, gamePanel.height - 250, gamePanel.width / 2, 10));
	levelObjects.push(new Ground(0, gamePanel.height - 350, gamePanel.width / 2, 10));

	levelObjects.push(new Ground(0, gamePanel.height - 450, gamePanel.width / 2, 10, "#7a4aff"));

	levelObjects.push(new Ground(gamePanel.width / 2 + 70, gamePanel.height - 100, 20, 100));
	levelObjects.push(new Ground(600, gamePanel.height - 180, 60, 100));

	player = new Player(0, 50, 32, 44, levelObjects);
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
	c.fillStyle = "#f2efe8";
	c.fillRect(0, 0, gamePanel.width, gamePanel.height);

	// draws the level
	for (let i = 0; i < levelObjects.length; i++) {
		levelObjects[i].draw();
	}

	// draws the player
	player.draw();

}