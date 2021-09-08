/*******************
 * Suzanne.js
 ******************/

/**
 * Suzanne object
 */
class Suzanne extends LabyrinthModel {
	constructor(structure, parent, program, objStr, mtlStr) {
		super(structure, parent, program, objStr, mtlStr);
		// Color settings (radioattiva)
		this.color = [218/255,165/255,32/255, 1.0];
		this.emissive = [0.0, 0.0, 0.0];
	}

	/**
	 * Init function
	 */
	init() {
		this.positionModel();
		super.init();
	}

	/**
	 * positionModel function
	 */
	positionModel() {
		let extents = utils.getGeometriesExtents(this.mesh.geometries);
		const range = utils.sub3Vectors(extents.max, extents.min);

		let extentsOffset = utils.scale3Vector(
			utils.add3Vectors(
				extents.min,
				utils.scale3Vector(range, 0.5)
			),
			-1
		);

		let final = labyrinthUtils.computeFinalPos(this.structure);
		let initial = labyrinthUtils.computeStartPos(this.structure);
		let labOffset = [
			final[0] - initial[0],
			final[1] - initial[1]
		];

		let finalAngle = labyrinthUtils.getFinalAngle(this.structure);

		this.startParams = {
			x: extentsOffset[0] + labOffset[1],
			y: extentsOffset[1] - 0.4,
			z: extentsOffset[2] + labOffset[0],
			angle: finalAngle,
			size: 4.0
		}

		this.localMatrix = utils.MakeWorld(this.startParams.x, this.startParams.y, this.startParams.z, this.startParams.angle, 0, 0, this.startParams.size);
	}

	animateModel(newx, newy, newz, percentage){
		this.localMatrix = utils.MakeWorld(
			utils.lerp(this.startParams.x, newx, percentage),
			this.startParams.y,
			utils.lerp(this.startParams.z, newz, percentage),
			this.startParams.angle,
			0,
			0,
			this.startParams.size
		);
	}
	
}