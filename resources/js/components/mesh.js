/**
 * mesh.js
 */

class Mesh {

	constructor(objStr, matStr, program, offset) {
		this.mesh = utils.ParseOBJ(objStr);
		this.material = utils.ParseMTL(matStr);
		
		this.program = program;
		
		this.offset = offset;

		this.init();
	}

	init() {
        this.loadLocations();
        this.loadVAO();
	}

	loadLocations(){
        this.program.position = gl.getAttribLocation(this.program, 'a_position');
        this.program.normal = gl.getAttribLocation(this.program, 'a_normal');
        this.program.color = gl.getAttribLocation(this.program, 'a_color');
        this.program.projection = gl.getUniformLocation(this.program, 'u_projection');
        this.program.view = gl.getUniformLocation(this.program, 'u_view');
        this.program.world = gl.getUniformLocation(this.program, 'u_world');
        this.program.viewWorldPosition = gl.getUniformLocation(this.program, 'u_viewWorldPosition');
        this.program.diffuse = gl.getUniformLocation(this.program, 'diffuse');
        this.program.ambient = gl.getUniformLocation(this.program, 'ambient');
        this.program.emissive = gl.getUniformLocation(this.program, 'emissive');
        this.program.specular = gl.getUniformLocation(this.program, 'specular');
        this.program.shininess = gl.getUniformLocation(this.program, 'shininess');
        this.program.opacity = gl.getUniformLocation(this.program, 'opacity');
        this.program.lightDirection = gl.getUniformLocation(this.program, 'u_lightDirection');
        this.program.ambientLight = gl.getUniformLocation(this.program, 'u_ambientLight');
    }

	loadVAO() {
		let scope = this;
		this.vao = [];
		this.mesh.geometries.forEach((element, pos) => {
			scope.vao[pos] = gl.createVertexArray();
			gl.bindVertexArray(scope.vao[pos]);
			// Load character buffers
			let vertexBufferObject = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufferObject);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(element.data.position), gl.STATIC_DRAW);
			gl.enableVertexAttribArray(scope.program.position);
			gl.vertexAttribPointer(
				scope.program.position,
				3,
				gl.FLOAT,
				gl.FALSE,
				3 * Float32Array.BYTES_PER_ELEMENT,
				0 * Float32Array.BYTES_PER_ELEMENT// Offset from the beginning of a single vertex to this attribute
			);

			let colorBufferObject = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, colorBufferObject);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(new Array(element.data.position.length).fill(1.0)), gl.STATIC_DRAW);
			gl.enableVertexAttribArray(scope.program.color);
			gl.vertexAttribPointer(
				scope.program.color,
				3,
				gl.FLOAT,
				gl.FALSE,
				3 * Float32Array.BYTES_PER_ELEMENT,
				0 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
			);

			let normBufferObject = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, normBufferObject);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(element.data.normal), gl.STATIC_DRAW);
			gl.enableVertexAttribArray(scope.program.normal);
			gl.vertexAttribPointer(
				scope.program.normal,
				3,
				gl.FLOAT,
				gl.FALSE,
				3 * Float32Array.BYTES_PER_ELEMENT,
				0 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
			);
		});
    }

}