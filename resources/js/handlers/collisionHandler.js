class CollisionHandler {
	constructor() {
		this.DEBUGCOLLISION = false;
	}

	checkCameraCollision(x, newx, z, newz) {

		let xCollide = false, zCollide = false;
		
		if (!this.DEBUGCOLLISION) {
			let zvar = newz - z;
			let xvar = newx - x;
			let xAbsolute = Math.floor(x + this.offset.column);
			let zAbsolute = Math.floor(z + this.offset.row);
			//TODO: AGGIUNGERE PARAMETRI IN SETTINGS
			let newxAbsolute = Math.floor(newx + this.offset.column + Math.sign(xvar) * 0.175);
			let newzAbsolute = Math.floor(newz + this.offset.row + Math.sign(zvar) * 0.175);
			let minxAbsolute = Math.floor(newx + this.offset.column - Math.sign(xvar) * 0.175);
			let minzAbsolute = Math.floor(newz + this.offset.row - Math.sign(zvar) * 0.175);

			let cond1 = labyrinthUtils.isBlock(this.structure, newzAbsolute, newxAbsolute);
			let cond2 = labyrinthUtils.isBlock(this.structure, zAbsolute, newxAbsolute);
			let cond3 = labyrinthUtils.isBlock(this.structure, newzAbsolute, xAbsolute);
			let cond4 = labyrinthUtils.isBlock(this.structure, newzAbsolute, minxAbsolute);
			let cond5 = labyrinthUtils.isBlock(this.structure, minzAbsolute, newxAbsolute);

			if (xAbsolute != newxAbsolute && (cond2 || cond1 && !cond2 && !cond3 || !cond1 && cond5)) {
				newx = x;
				xCollide = true;
			} //else if (xAbsolute != newxAbsolute && labyrinthUtils.isBlock(this.structure, ))
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

	setStructure(str) {
		this.structure = str;
		let start = labyrinthUtils.computeStartPos(str);
		this.offset = {
			row: start[0] + 0.5,
			column: start[1] + 0.5
		};
	}
}