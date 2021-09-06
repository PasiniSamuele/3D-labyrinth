/*******************
 * Pedestal.js
 ******************/

/**
 * Pedestal object
 */
class Pedestal extends LabyrinthModel {

	/**
	 * Constructor
	 * @param {*} structure 
	 * @param {*} parent 
	 * @param {*} program 
	 * @param {*} objStr 
	 * @param {*} mtlStr 
	 */
	constructor(structure, parent, program, objStr, mtlStr) {
		super(structure, parent, program, objStr, mtlStr);
		// Color settings
		this.color = [0.7, 0.7, 0.7];
		this.emissive = [0, 0, 0];
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

		console.log(this.structure);

		this.localMatrix = utils.MakeWorld(extentsOffset[0] + labOffset[1], extentsOffset[1] - 0.45, extentsOffset[2] + labOffset[0], 0, 0, 0, 4.0);
	}
	
}