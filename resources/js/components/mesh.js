/**
 * mesh.js
 */

class Mesh {

	constructor(objStr, matStr, program, offset) {
		this.mesh = utils.ParseOBJ(objStr);
		console.log(this.mesh);
		this.material = utils.ParseMTL(matStr);
		console.log(this.material);
		
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

	draw(perspectiveMatrix, camera) {

		let worldMatrix = utils.MakeWorld(
			camera.position.x + this.offset.x + Math.sin(utils.degToRad(camera.position.angle)) * this.offset.angle,
			camera.position.y + this.offset.y, //+ Math.sin(utils.degToRad(camera.position.elevation)) * offset.elevation,
			camera.position.z + this.offset.z- Math.cos(utils.degToRad(camera.position.angle)) * this.offset.angle, //+ Math.sin(utils.degToRad(camera.position.elevation)) * offset.elevation,
			camera.position.angle + 180,
			0.0,0.0,0.25
		);

        gl.useProgram(this.program);

		let scope = this;

		this.mesh.geometries.forEach((element, pos) => {
			gl.bindVertexArray(this.vao[pos]);

			gl.uniformMatrix4fv(this.program.view, gl.FALSE, utils.transposeMatrix(camera.viewMatrix));
			gl.uniformMatrix4fv(this.program.world, gl.FALSE, utils.transposeMatrix(worldMatrix));
			gl.uniformMatrix4fv(this.program.projection, gl.FALSE, utils.transposeMatrix(perspectiveMatrix));
			gl.uniform3f(this.program.viewWorldPosition, camera.position.x, camera.position.y, camera.position.z);
			gl.uniform3fv(this.program.diffuse, scope.material[element.material].diffuse);
			gl.uniform3fv(this.program.ambient, scope.material[element.material].ambient);
			gl.uniform3fv(this.program.emissive, scope.material[element.material].emissive);
			gl.uniform3fv(this.program.specular, scope.material[element.material].specular);
			gl.uniform1f(this.program.shininess, scope.material[element.material].shininess);
			gl.uniform1f(this.program.opacity, scope.material[element.material].opacity);
			gl.uniform3fv(this.program.lightDirection, [-1.0, 3.0, 5.0]);
			gl.uniform3fv(this.program.ambientLight, [0.0, 0.0, 0.0]);
			
			gl.drawArrays(gl.TRIANGLES, 0, element.data.position.length/3);
		});
    }

}