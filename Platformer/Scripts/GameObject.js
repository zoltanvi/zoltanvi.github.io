class GameObject {
	constructor(x, y, width, height, isStatic) {
		// position
		this.x = x;
		this.y = y;

		// bounds
		this.left = x;              // left side
		this.top = y;               // top side
		this.right = x + width;     // right side
		this.bottom = y + height;   // bottom side

		// size
		this.width = width;
		this.height = height;

		// velocity
		this.isStatic = isStatic;
		this.color = "#ff5b45";

		this.vx = 0;
		this.vy = 0;

	}

	update() {
		this.calculateBounds();
		this.applyVelocity();
	}

	draw() {
		// Optimalization, it only draws what is inside the viewport
		if (this.right > cameraOffsetX) {
			c.save();
			c.translate(-cameraOffsetX, cameraOffsetY);
			c.fillStyle = this.color;
			c.fillRect(this.x, this.y, this.width, this.height);
			c.restore();
		}
	}

	calculateBounds() {
		this.left = this.x;                   // left side
		this.top = this.y;                    // top side
		this.right = this.x + this.width;     // right side
		this.bottom = this.y + this.height;   // bottom side
	}


	applyVelocity() {
		if (!this.isStatic) {
			// add gravity force to vertical velocity
			this.vy += GRAVITY * deltaTime;

			// apply velocity to position
			this.x += this.vx * deltaTime;
			this.y += this.vy * deltaTime;
		}

	}


}