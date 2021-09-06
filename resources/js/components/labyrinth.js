/*******************
 * Labyrinth.js
 ******************/

/**
 * Class that represents a level
 */
class Labyrinth {

	/**
	 * Constructor
	 * @param {*} structure structure of the labyrinth
	 * @param {*} programs GLSL programs associated with this object
	 * @param {*} texturePaths paths of textures for maze elements
	 */
	constructor(structure, programs, texturePaths, slotOffset, suzanneStr, pedestalStr) {

		//ATTRIBUTES
		this.programs = programs;

		this.structure2D = structure;

		this.children = [];

		//CALLS
		this.init(texturePaths, slotOffset, suzanneStr, pedestalStr);
	}

	/**
	 * function to init the labyrinth
	 */
	init(texturePaths, slotOffset, suzanneStr, pedestalStr) {
		this.children.push(new Wall(this.structure2D, gl.TEXTURE0 + slotOffset++, this, this.programs[0], texturePaths.wall));
		this.children.push(new Floor(this.structure2D, gl.TEXTURE0 + slotOffset++, this, this.programs[1], texturePaths.floor));
		this.children.push(new Suzanne(this.structure2D, this, this.programs[2], suzanneStr[0], suzanneStr[1]));
		this.children.push(new Pedestal(this.structure2D, this, this.programs[3], pedestalStr[0], pedestalStr[1]));

		this.children.forEach(child => child.init());
	}

	/**
	 * function to draw the labyrinth
	 * @param {*} perspectiveMatrix 
	 * @param {*} viewMatrix 
	 */
	draw(perspectiveMatrix, camera) {
		let worldMatrix = utils.MakeWorld(0.0, 0.5, 0.0, 0.0, 0.0, 0.0, 1.0);
		this.children.forEach(child => {
			child.updateWorld(worldMatrix);
			child.draw(perspectiveMatrix, camera);
		});
	}

}