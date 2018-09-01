class Raycast {
	/**
	 * Directions:
	 * 1: up
	 * 2: down
	 * 3: left
	 * 4: right
	 * You can get the hit distance from the ray origin after you check it with the hit() method!
	 */
	constructor(x, y, direction, length, obstacles) {
		this.x = x;
		this.y = y;
		this.direction = direction;
		this.length = length;
		this.obstacles = obstacles;
		this.hitDistance = -1;
		this.obstacleHitPos = -1;
	}

	setPosition(x, y) {
		this.x = x;
		this.y = y;
	}

	setLength(length) {
		this.length = length;
	}

	/**
	 * Sets the rays direction
	 * 1: up
	 * 2: down
	 * 3: left
	 * 4: right
	 */
	setDirection(direction) {
		this.direction = direction;
	}

	/**
	 * Returns true, if it intersects any obstacle, else returns false.
	 */
	hit() {
		let collision = false;
		this.hitDistance = 0;
		for (let i = 0; i < this.obstacles.length; i++) {
			let obstacle = this.obstacles[i];

			switch (this.direction) {

				// UP
				case 1:
					if (obstacle.left <= this.x && obstacle.right >= this.x) {
						// if the line intersects the rectangle
						if ((obstacle.bottom >= this.y - this.length) && (obstacle.bottom <= this.y)) {
							// sets the intersection position
							this.obstacleHitPos = obstacle.bottom;
							// hitDistance is the distance from the nearest intersected object
							if (this.hitDistance > this.y - obstacle.bottom) {
								this.hitDistance = this.y - obstacle.bottom;
							}
							collision = true;
						}
					}
					break;

				// DOWN
				case 2:
					if (obstacle.left <= this.x && obstacle.right >= this.x) {
						// if the line intersects the rectangle
						if ((obstacle.top <= this.y + this.length) && (obstacle.top >= this.y)) {
							// sets the intersection position
							this.obstacleHitPos = obstacle.top;
							// hitDistance is the distance from the nearest intersected object
							if (this.hitDistance > obstacle.top - this.y) {
								this.hitDistance = obstacle.top - this.y;
							}
							collision = true;
						}
					}
					break;


				// LEFT
				case 3:
					if (obstacle.top <= this.y && obstacle.bottom >= this.y) {
						// if the line intersects the rectangle
						if ((obstacle.right >= this.x - this.length) && (obstacle.right <= this.x)) {
							// sets the intersection position
							this.obstacleHitPos = obstacle.right;
							// hitDistance is the distance from the nearest intersected object
							if (this.hitDistance > this.x - obstacle.right) {
								this.hitDistance = this.x - obstacle.right;
							}
							collision = true;
						}
					}
					break;

				// RIGHT
				case 4:
					if (obstacle.top <= this.y && obstacle.bottom >= this.y) {
						// if the line intersects the rectangle
						if ((obstacle.left <= this.x + this.length) && (obstacle.left >= this.x)) {
							// sets the intersection position
							this.obstacleHitPos = obstacle.left;
							// hitDistance is the distance from the nearest intersected object
							if (this.hitDistance > obstacle.left - this.x) {
								this.hitDistance = obstacle.left - this.x;
							}
							collision = true;
						}
					}
					break;
			}

		}

		return collision;
	}


	draw() {
		c.save();
		c.translate(-cameraOffsetX, cameraOffsetY);
		c.beginPath();
		c.moveTo(this.x, this.y);
		c.lineWidth = 2;
		c.strokeStyle = 'rgba(255, 0, 0, 0.4)';

		switch (this.direction) {
			// up
			case 1:
				c.lineTo(this.x, this.y - this.length);
				break;
			// down
			case 2:
				c.lineTo(this.x, this.y + this.length);
				break;
			// left
			case 3:
				c.lineTo(this.x - this.length, this.y);
				break;
			// right
			case 4:
				c.lineTo(this.x + this.length, this.y);
				break;
		}
		c.closePath();
		c.stroke();
		c.restore();
	}

}