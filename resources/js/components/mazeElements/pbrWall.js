/*******************
 * PbrWall.js
 ******************/

/**
 * Object that contains labyrinth walls information
 */
class PbrWall extends PbrLabyrinthElement {

	/**
	 * Constructor
	 * @param {*} structure 
	 * @param {*} slot 
	 * @param {*} parent 
	 * @param {*} program 
	 * @param {*} imageUrl 
	 */
	constructor(structure, slot, parent, program, imageUrl) {
		super(structure, slot, parent, program, imageUrl);
	}

	/**
	 * Init function
	 */
	init() {
		super.init();
	}

	/**
	 * Creates a vertex array object and then sets the attributes on it
	 */
	loadVAO() {
		this.vao = gl.createVertexArray();
		gl.bindVertexArray(this.vao);

		var mazeVertexBufferObject = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, mazeVertexBufferObject);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
		gl.enableVertexAttribArray(this.program.vertPosition);
		gl.vertexAttribPointer(
			this.program.vertPosition,
			3,
			gl.FLOAT,
			gl.FALSE,
			3 * Float32Array.BYTES_PER_ELEMENT,
			0 // Offset from the beginning of a single vertex to this attribute
		);

		var mazeTexCoordBufferObject = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, mazeTexCoordBufferObject);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.uvs), gl.STATIC_DRAW);
		gl.enableVertexAttribArray(this.program.texCoord);
		gl.vertexAttribPointer(
			this.program.texCoord,
			2,
			gl.FLOAT,
			gl.FALSE,
			2 * Float32Array.BYTES_PER_ELEMENT,
			0 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
		);

		var normalBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.normals), gl.STATIC_DRAW);
		gl.enableVertexAttribArray(this.program.normal);
		gl.vertexAttribPointer(
			this.program.normal,
			3,
			gl.FLOAT,
			gl.FALSE,
			3 * Float32Array.BYTES_PER_ELEMENT,
			0 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
		);

		var shadowBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, shadowBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.shadows), gl.STATIC_DRAW);
		gl.enableVertexAttribArray(this.program.shadowUv);
		gl.vertexAttribPointer(
			this.program.shadowUv,
			2,
			gl.FLOAT,
			gl.FALSE,
			2 * Float32Array.BYTES_PER_ELEMENT,
			0 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
		);

		var mazeIndexBufferObject = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mazeIndexBufferObject);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), gl.STATIC_DRAW);
	}

	/**
	 * Loads walls components
	 */
	loadComponent() {
		let walls3D = labyrinthUtils.compute3DWalls(this.structure, 0.0, 1.0, 1.0);
		this.vertices = walls3D[0];
		this.indices = walls3D[1];
		this.colours = walls3D[2];
		this.normals = walls3D[3];
		this.uvs = walls3D[4];
		this.shadows = walls3D[5];
	}


}
