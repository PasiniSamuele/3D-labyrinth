/********************************
 * 
 * InteractionHandler.js
 * 
 *******************************/

/**
 * Object to manage the collision with the labyrinth walls
 */
class CollisionHandler {

	/**
	 * Constructor
	 */
	constructor() {
		this.xOff;
		this.zOff;
		this.DEBUG_COLLISION = false;
	}

	/**
	 * Function to check the camera collision
	 * @param {*} x 
	 * @param {*} newx 
	 * @param {*} z 
	 * @param {*} newz 
	 * @returns 
	 */
	checkCameraCollision(x, newx, z, newz) {
		let xCollide = false, zCollide = false;
		if (!this.DEBUG_COLLISION) {
			let zvar = newz - z;
			let xvar = newx - x;
			let xAbsolute = Math.floor(x + this.offset.column);
			let zAbsolute = Math.floor(z + this.offset.row);
			let newxAbsolute = Math.floor(newx + this.offset.column + Math.sign(xvar) * this.xOff);
			let newzAbsolute = Math.floor(newz + this.offset.row + Math.sign(zvar) * this.zOff);
			let minxAbsolute = Math.floor(newx + this.offset.column - Math.sign(xvar) * this.xOff);
			let minzAbsolute = Math.floor(newz + this.offset.row - Math.sign(zvar) * this.zOff);
			let cond1 = labyrinthUtils.isBlock(this.structure, newzAbsolute, newxAbsolute);
			let cond2 = labyrinthUtils.isBlock(this.structure, zAbsolute, newxAbsolute);
			let cond3 = labyrinthUtils.isBlock(this.structure, newzAbsolute, xAbsolute);
			let cond4 = labyrinthUtils.isBlock(this.structure, newzAbsolute, minxAbsolute);
			let cond5 = labyrinthUtils.isBlock(this.structure, minzAbsolute, newxAbsolute);
			if (xAbsolute != newxAbsolute && (cond2 || cond1 && !cond2 && !cond3 || !cond1 && cond5)) {
				newx = x;
				xCollide = true;
			}
			if (zAbsolute != newzAbsolute && (cond3 || cond1 && !cond2 && !cond3 || !cond1 && cond4)) {
				newz = z;
				zCollide = true;
			}
		}
		return {
			position: {
				x: newx,
				z: newz
			},
			collide: {
				x: xCollide,
				z: zCollide
			}
		};
	}

	/**
	 * Set the labyrinth structure
	 * @param {*} str 
	 */
	setStructure(str) {
		this.structure = str;
		let start = labyrinthUtils.computeStartPos(str);
		this.offset = {
			row: start[0] + 0.5,
			column: start[1] + 0.5
		};
	}

	/**
	 * Set the new collision parameters
	 * @param {*} xOff 
	 * @param {*} zOff 
	 */
	setCollisionParameters(xOff, zOff) {
		this.xOff = xOff;
		this.zOff = zOff;
	}
	
}