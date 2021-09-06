/*******************
 * LabyrinthElement.js
 ******************/

/**
 * Object to store a labyrinth element
 */
class LabyrinthElement {

	/**
	 * Constructor
	 * @param {*} structure 
	 * @param {*} parent 
	 * @param {*} program 
	 */
	constructor(structure, parent, program) {
		// Attributes
		this.program = program;
		this.parent = parent;
		this.structure = structure;
		// Children
		this.children = [];
		// World matrices
		this.worldMatrix = utils.identityMatrix();
		this.localMatrix = utils.identityMatrix();
	}

	/**
	 * Init function
	 */
	init() {
		this.children.forEach(child => child.init());
	}

	/**
	 * Function to update the world matrices
	 * @param {*} matrix 
	 */
	updateWorld(matrix) {
		if (matrix) {
			// a matrix was passed in so do the math
			this.worldMatrix = utils.multiplyMatrices(matrix, this.localMatrix);
		} else {
			// no matrix was passed in so just copy.
			utils.copy(this.localMatrix, this.worldMatrix);
		}
		// now process all the children
		var worldMatrix = this.worldMatrix;
		this.children.forEach(function (child) {
			child.updateWorldMatrix(worldMatrix);
		});
	}

	/**
	 * Function to draw the element
	 * @param {*} perspectiveMatrix 
	 * @param {*} viewMatrix 
	 * @param {*} light 
	 * @param {*} camPos 
	 */
	draw(perspectiveMatrix, viewMatrix, light, camPos) {
		this.children.forEach(child => child.draw(perspectiveMatrix, viewMatrix, light, camPos));
	}

}