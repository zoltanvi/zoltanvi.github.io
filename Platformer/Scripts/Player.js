class Player extends GameObject {
	constructor(x, y, width, height) {
		super(x, y, width, height, false);

		this.jumpVelocity = 0;
		this.moveSpeed = 6;
		this.firstJumpForce = -12;
		this.secondJumpForce = -9;
		this.jumpDownForce = 2;
		this.grounded = true;
		this.facingLeft = false;
		this.isJumping = false;
		this.jumpCount = 0;
		this.MAX_JUMP_COUNT = 2;
		this.spritePadding = 4;

		this.images = [];
		for (let i = 0; i < 2; i++) {
			this.images.push(new Image());
		}
		this.images[0].src = "sprites/mariosprite.png";
		this.images[1].src = "sprites/mariospriteflipped.png";

		this.anim = 0;
		this.currentFrame = 0;

		this.canGoLeft = true;
		this.canGoRight = true;

		this.hMargin = gamePanel.width / 4;
		this.vMargin = gamePanel.height / 5;

	}

	update() {
		this.handleKeys();
		this.calculateBounds();
		this.applyGravity();
		this.move();
		this.moveCamera();
	}

	/**
	 * Handles the key presses / releases
	 */
	handleKeys() {
		if (upPressed) {
			this.jump();
		} else {
			this.jumpRelease();
		}

		// If the right key is pressed
		if (rightPressed && !leftPressed) {
			this.moveRight();
			this.facingLeft = false;
			// If the left key is pressed
		} else if (leftPressed && !rightPressed) {
			this.moveLeft();
			this.facingLeft = true;
		} else {
			this.vx = 0;
		}
	}

	/**
	 * Applies gravity to the current velocity
	 */
	applyGravity() {
		this.vy += GRAVITY * deltaTime;
	}


	/**
	 * Applies the current velocity to the player's current position
	 */
	move() {
		this.vy += this.jumpVelocity;
		this.jumpVelocity = 0;

		// If collisionCheck is false, then it's not colliding vertically,
		// and adds the current velocity to the position.
		if (!this.collisionCheck()) {
			this.y += this.vy + this.jumpVelocity * deltaTime;
		}

		this.x += this.vx * deltaTime;
	}


	/**
	 * Draws the player to the canvas
	 */
	render() {
		c.save();
		c.translate(-cameraOffsetX, -cameraOffsetY);

		this.anim += deltaTime;

		if (this.anim >= 10) {
			this.anim = 0;
			if (this.vy > 0) {
				this.currentFrame = 3;
			} else if (this.vy < 0) {
				this.currentFrame = 2;
			} else if (this.vy === 0 && leftPressed || rightPressed) {
				if (this.currentFrame !== 0) {
					this.currentFrame = 0;
				} else {
					this.currentFrame = 1;
				}
			} else if (this.vy === 0) {
				this.currentFrame = 0;
			}
		}

		if (this.facingLeft) {
			c.drawImage(this.images[0], (this.currentFrame * (this.width+this.spritePadding)) + this.currentFrame, 0, (this.width+this.spritePadding), this.height, this.x, this.y, (this.width+this.spritePadding), this.height);
		} else {
			c.drawImage(this.images[1], (this.currentFrame * (this.width+this.spritePadding)) + this.currentFrame, 0, (this.width+this.spritePadding), this.height, this.x, this.y, (this.width+this.spritePadding), this.height);

		}
		c.restore();
	}


	/**
	 * Checks if the player is colliding with the map and act accordingly.
	 * @returns {boolean} true, if the player is colliding with the map VERTICALLY, false if not.
	 */
	collisionCheck() {
		let verticalIntersecting = false;
		let horizontalIntersecting = false;
		let isGround = false;

		let xStart = ((this.y - (this.y % tileHeight)) / tileHeight) - 1;
		let xEnd = ((this.bottom - (this.bottom % tileHeight)) / tileHeight) + 2;
		let yStart = ((this.x - (this.x % tileWidth)) / tileWidth) - 1;
		let yEnd = ((this.right - (this.right % tileWidth)) / tileWidth) + 2;

		yStart = (yStart < 0) ? 0 : yStart;
		yEnd = (yEnd > mapWidth + 1) ? mapWidth + 1 : yEnd;
		xStart = (xStart < 0) ? 0 : xStart;
		xEnd = (xEnd > mapHeight + 1) ? mapHeight + 1 : xEnd;


		for (let y = yStart; y < yEnd; y++) {
			for (let x = xStart; x < xEnd; x++) {

				if (map[x][y] != null) {

					// VERTICAL INTERSECTING
					if (this.intersects(
						this.x, this.y + (this.vy * deltaTime), this.width, this.height,
						map[x][y].x, map[x][y].y, map[x][y].width, map[x][y].height)) {

						verticalIntersecting = true;

						// Intersected the ground
						if (map[x][y].y > this.y) {
							isGround = true;
							this.y = map[x][y].y - this.height;
						// Intersected the ceiling
						} else {
							this.y = map[x][y].bottom;
						}
					}

					// HORIZONTAL INTERSECTING
					if (this.intersects(
						this.x + (this.vx * deltaTime), this.y, this.width, this.height,
						map[x][y].x, map[x][y].y, map[x][y].width, map[x][y].height)) {

						horizontalIntersecting = true;

						// Intersected the RIGHT wall
						if (map[x][y].x > this.x) {
							this.x = map[x][y].x - this.width;
							this.canGoRight = false;
						// Intersected the LEFT wall
						} else {
							this.x = map[x][y].right;
							this.canGoLeft = false;
						}
					}

				}
			}
		}

		// If horizontal intersecting happened, it stops moving
		// and resets the horizontal velocity
		if (horizontalIntersecting) {
			this.vx = 0;
		} else {
			this.canGoLeft = true;
			this.canGoRight = true;
		}

		// If vertical intersecting happened, it resets the vertical velocity
		// and if the intersecting happened UNDER the character, it sets back the jump count
		if (verticalIntersecting) {
			if (isGround) {
				this.grounded = true;
				this.jumpCount = 0;
			}

			this.vy = 0;
		}

		return verticalIntersecting;
	}


	/**
	 * Moves the camera, following the player
	 */
	moveCamera() {
		if (this.x - gamePanel.width + this.hMargin >= cameraOffsetX) {
			cameraOffsetX = this.x - gamePanel.width + this.hMargin;
		} else if (this.x - this.hMargin <= cameraOffsetX) {
			cameraOffsetX = this.x - this.hMargin;
		}

		if (this.y - gamePanel.height + this.vMargin >= cameraOffsetY) {
			cameraOffsetY = this.y - gamePanel.height + this.vMargin;
		} else if (this.y - this.vMargin <= cameraOffsetY) {
			cameraOffsetY = this.y - this.vMargin;
		}
	}

	/**
	 * Moves the player left
	 */
	moveLeft() {
		this.vx = 0;
		if (this.canGoLeft) {
			this.vx = -(this.moveSpeed);
		} else {
			this.vx = 0;
		}

	}

	/**
	 * Moves the player right
	 */
	moveRight() {
		this.vx = 0;
		if (this.canGoRight) {
			this.vx = this.moveSpeed;
		} else {
			this.vx = 0;
		}
	}

	/**
	 * Pushes the player upwards
	 */
	jump() {
		if (this.jumpCount < this.MAX_JUMP_COUNT) {
			if (this.grounded) {
				this.isJumping = true;
				this.jumpCount++;
				this.vy = 0;
				this.jumpVelocity = this.firstJumpForce;
				this.grounded = false;
			}
			if (!this.isJumping && !this.grounded) {
				this.isJumping = true;
				this.vy = 0;
				this.jumpVelocity = this.secondJumpForce;
				this.jumpCount++;
			}
		}
	}

	/**
	 * Pushes the player downwards a little bit
	 */
	jumpRelease() {
		if (this.isJumping) {
			this.isJumping = false;
			if (this.vy < 0) {
				this.vy = this.jumpDownForce;
			}
		}
	}


	/**
	 * Checks if two rectangles are intersect each other.
	 * @param x1 the X position of the FIRST rectangle
	 * @param y1 the Y position of the FIRST rectangle
	 * @param width1 the WIDTH of the FIRST rectangle
	 * @param height1 the HEIGHT of the FIRST rectangle
	 * @param x2 the X position of the SECOND rectangle
	 * @param y2 the Y position of the SECOND rectangle
	 * @param width2 the WIDTH of the SECOND rectangle
	 * @param height2 the HEIGHT of the SECOND rectangle
	 * @returns {boolean} true, if the rectangles are intersecting, false if not.
	 */
	intersects(x1, y1, width1, height1, x2, y2, width2, height2) {
		if (width2 <= 0 || height2 <= 0) {
			return false;
		}

		return (x2 + width2 > x1 &&
			y2 + height2 > y1 &&
			x2 < x1 + width1 &&
			y2 < y1 + height1);
	}

}

