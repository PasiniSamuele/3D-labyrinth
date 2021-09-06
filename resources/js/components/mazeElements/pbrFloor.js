/*******************
 * PbrFloor.js
 ******************/

/**
 * Object that contains labyrinth floor information
 */
class PbrFloor extends PbrLabyrinthElement {
	constructor(structure, parent, program, texture) {
		super(structure, parent, program, texture);
	}

	init() {
		super.init();
	}

	/**
	 * function to create the vertex array object
	 */
	loadVAO() {
		this.vao = gl.createVertexArray();
		gl.bindVertexArray(this.vao);

		let vertexBufferObject = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufferObject);
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

		var texCoordBufferObject = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBufferObject);
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

		var indexBufferObject = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBufferObject);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), gl.STATIC_DRAW);

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
	}

	loadComponent() {
		let floor3D = labyrinthUtils.compute3DFloor(this.structure, 0.0, 1.0, 1.0);
		this.vertices = floor3D[0];
		this.indices = floor3D[1];
		this.colours = floor3D[2];
		this.normals = floor3D[3];
		this.uvs = floor3D[4];
	}



}