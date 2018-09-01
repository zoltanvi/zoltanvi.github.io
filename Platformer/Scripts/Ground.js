class Ground extends GameObject {
	constructor(x, y, width, height, color) {
		super(x, y, width, height, true);
		this.color = color || "#4a4a4a";

	}
}