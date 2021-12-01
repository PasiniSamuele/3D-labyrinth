/*******************
 * PbrLabyrinth.js
 ******************/

/**
 * Object to store a PbrLabyrinth
 */
class PbrLabyrinth {

	/**
	 * Constructor
	 * @param {*} structure structure of the labyrinth
	 * @param {*} programs GLSL programs associated with this object
	 * @param {*} textures paths of textures for maze elements
	 */
	constructor(structure, programs, textures, suzanneStr, pedestalStr) {

		//ATTRIBUTES
		this.programs = programs;

		this.structure2D = structure;

		this.children = [];

		//CALLS
		this.init(textures, suzanneStr, pedestalStr);
	}

	/**
	 * function to init the labyrinth
	 */
	init(textures, suzanneStr, pedestalStr) {
		// this.children.push(new Wall(this.structure2D, gl.TEXTURE0+slotOffset++, this, this.programs[0], texturePaths.wall));
		this.children.push(new PbrFloor(this.structure2D, this, this.programs[1], textures.floor));
		this.children.push(new PbrWall(this.structure2D, this, this.programs[1], textures.wall));
		this.children.push(new Suzanne(this.structure2D, this, this.programs[2], suzanneStr[0], suzanneStr[1]));
		this.children.push(new Pedestal(this.structure2D, this, this.programs[3], pedestalStr[0], pedestalStr[1]));

		this.children.forEach(child => child.init());
		
		
		//OBJ maker for labyrinth
		let s = "";
		for(let i = 0; i < this.children[0].vertices.length; i += 3){
			s += "v " + this.children[0].vertices[i] + " " + this.children[0].vertices[i+1] + " " + this.children[0].vertices[i+2] + "\n";
		}
		for(let i = 0; i < this.children[1].vertices.length; i += 3){
			s += "v " + this.children[1].vertices[i] + " " + this.children[1].vertices[i+1] + " " + this.children[1].vertices[i+2] + "\n";
		}
		for(let i = 0; i < this.children[0].normals.length; i += 3){
			s += "vn " + this.children[0].normals[i] + " " + this.children[0].normals[i+1] + " " + this.children[0].normals[i+2] + "\n";
		}
		for(let i = 0; i < this.children[1].normals.length; i += 3){
			s += "vn " + this.children[1].normals[i] + " " + this.children[1].normals[i+1] + " " + this.children[1].normals[i+2] + "\n";
		}
		for(let i = 0; i < this.children[0].uvs.length; i += 2){
			s += "vt " + this.children[0].uvs[i] + " " + this.children[0].uvs[i+1] + "\n";
		}
		for(let i = 0; i < this.children[1].uvs.length; i += 2){
			s += "vt " + this.children[1].uvs[i] + " " + this.children[1].uvs[i+1] + "\n";
		}
		for(let i = 0; i < this.children[0].indices.length; i += 3){
			s += "f " + (this.children[0].indices[i]+1) + " " + (this.children[0].indices[i+1]+1) + " " + (this.children[0].indices[i+2]+1) + "\n";
		}
		for(let i = 0; i < this.children[1].indices.length; i += 3){
			s += "f " + ((this.children[1].indices[i] + this.children[0].vertices.length/3)+1) + " " + ((this.children[1].indices[i+1]+ this.children[0].vertices.length/3)+1) + " " + ((this.children[1].indices[i+2]+ this.children[0].vertices.length/3)+1) + "\n";
		}
		console.log(s)
		
	}

	/**
	 * function to draw the labyrinth
	 * @param {*} perspectiveMatrix 
	 * @param {*} viewMatrix 
	 */
	draw(perspectiveMatrix, viewMatrix, light, camPos, skybox, now) {
		let worldMatrix = utils.MakeWorld(0.0, 0.5, 0.0, 0.0, 0.0, 0.0, 1.0);
		this.children.forEach(child => {
			child.updateWorld(worldMatrix);
			child.draw(perspectiveMatrix, viewMatrix, light, camPos, skybox, now);
		});
	}

}