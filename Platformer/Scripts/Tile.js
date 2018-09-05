class Tile extends GameObject {
	constructor(x, y, width, height, imgSource) {
		super(x, y, width, height, true);
		this.image = new Image();
		this.image.src = imgSource;
	}

	draw() {
		c.drawImage(this.image, this.x, this.y, this.width, this.height);
	}





}