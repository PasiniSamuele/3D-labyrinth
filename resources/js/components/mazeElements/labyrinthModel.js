class LabyrinthModel extends LabyrinthElement {
    constructor(structure, parent, program, objStr, mtlStr){
        super(structure, parent, program);

        this.mesh = utils.ParseOBJ(objStr);
        this.material = utils.ParseMTL(mtlStr);
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
		this.vao = [];
		this.mesh.geometries.forEach((element, pos) => {
			this.vao[pos] = gl.createVertexArray();
			gl.bindVertexArray(this.vao[pos]);
			// Load character buffers
			let vertexBufferObject = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufferObject);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(element.data.position), gl.STATIC_DRAW);
			gl.enableVertexAttribArray(this.program.position);
			gl.vertexAttribPointer(
				this.program.position,
				3,
				gl.FLOAT,
				gl.FALSE,
				3 * Float32Array.BYTES_PER_ELEMENT,
				0 * Float32Array.BYTES_PER_ELEMENT// Offset from the beginning of a single vertex to this attribute
			);

			let colorArray = [];
			for(i = 0; i < element.data.position.length; i+=4){
				colorArray = colorArray.concat(this.color);
			}

			let colorBufferObject = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, colorBufferObject);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorArray), gl.STATIC_DRAW);
			gl.enableVertexAttribArray(this.program.color);
			gl.vertexAttribPointer(
				this.program.color,
				3,
				gl.FLOAT,
				gl.FALSE,
				3 * Float32Array.BYTES_PER_ELEMENT,
				0 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
			);

			let normBufferObject = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, normBufferObject);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(element.data.normal), gl.STATIC_DRAW);
			gl.enableVertexAttribArray(this.program.normal);
			gl.vertexAttribPointer(
				this.program.normal,
				3,
				gl.FLOAT,
				gl.FALSE,
				3 * Float32Array.BYTES_PER_ELEMENT,
				0 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
			);
		});
    }

	draw(perspectiveMatrix, viewMatrix, light, camPos) {
		super.draw(perspectiveMatrix, viewMatrix, light, camPos);

        gl.useProgram(this.program);
		console.log(light);

		this.mesh.geometries.forEach((element, pos) => {
			gl.bindVertexArray(this.vao[pos]);

			gl.uniformMatrix4fv(this.program.view, gl.FALSE, utils.transposeMatrix(viewMatrix));
			gl.uniformMatrix4fv(this.program.world, gl.FALSE, utils.transposeMatrix(this.worldMatrix));
			gl.uniformMatrix4fv(this.program.projection, gl.FALSE, utils.transposeMatrix(perspectiveMatrix));
			gl.uniform3f(this.program.viewWorldPosition, camPos.x, camPos.y, camPos.z);
			gl.uniform3fv(this.program.diffuse, this.material[element.material].diffuse);
			gl.uniform3fv(this.program.ambient, this.material[element.material].ambient);
			gl.uniform3fv(this.program.emissive, this.emissive);
			gl.uniform3fv(this.program.specular, this.material[element.material].specular);
			gl.uniform1f(this.program.shininess, this.material[element.material].shininess);
			gl.uniform1f(this.program.opacity, this.material[element.material].opacity);
			gl.uniform3fv(this.program.lightDirection, [light.direction.x, light.direction.y, light.direction.z]);
			gl.uniform3fv(this.program.ambientLight, [0.0, 5.0, 0.0]);
			
			gl.drawArrays(gl.TRIANGLES, 0, element.data.position.length/3);
		});
    }
}