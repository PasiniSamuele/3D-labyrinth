/**
 * 
 */

class Character extends Mesh{

	constructor(meshString, offset, program) {
		super(meshString);
		this.offset = offset;
		this.program = program;
		this.init();
	}

	/**
	 * 
	 */
	init() {
        this.loadLocations();
        this.loadVAO();
        //this.loadTexture();
	}

	/**
	 * Load the shader locations
	 */
    loadLocations(){
        this.locations = {};
        this.locations['chVertPosition'] = gl.getAttribLocation(this.program, 'chVertPosition');
        this.locations['chTexCoord'] = gl.getAttribLocation(this.program, 'chTexCoord');
        this.locations['chNormal'] = gl.getAttribLocation(this.program, 'chNormal');
        this.locations['chProjMatrix'] = gl.getUniformLocation(this.program, 'chProjMatrix');
        this.locations['chWorldMatrix'] = gl.getUniformLocation(this.program, 'chWorldMatrix');
    }

    /**
     * function to create the vertex array object
     */
    loadVAO() {
        this.vao = gl.createVertexArray();
        gl.bindVertexArray(this.vao);
		// Load character buffers
        let vertexBufferObject = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufferObject);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.mesh.vertices), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(this.locations['chVertPosition']);
        gl.vertexAttribPointer(
            this.locations['chVertPosition'],
            3,
            gl.FLOAT,
            gl.FALSE,
            3 * Float32Array.BYTES_PER_ELEMENT,
            0 * Float32Array.BYTES_PER_ELEMENT// Offset from the beginning of a single vertex to this attribute
        );

        let texCoordBufferObject = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBufferObject);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.mesh.textures), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(this.locations['chTexCoord']);
        gl.vertexAttribPointer(
            this.locations['chTexCoord'],
            2,
            gl.FLOAT,
            gl.FALSE,
            2 * Float32Array.BYTES_PER_ELEMENT,
            0 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
        );

        let normBufferObject = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, normBufferObject);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.mesh.vertexNormals), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(this.locations['chNormal']);
        gl.vertexAttribPointer(
            this.locations['chNormal'],
            3,
            gl.FLOAT,
            gl.FALSE,
            3 * Float32Array.BYTES_PER_ELEMENT,
            0 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
        );

        let indices = [].concat.apply([],this.mesh.indicesPerMaterial);
        var indexBufferObject = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBufferObject);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
    }

    /**
     * function to draw the character
     * @param {*} perspectiveMatrix 
     * @param {*} viewMatrix 
     */
    draw(perspectiveMatrix, camera) {

		// Positioned in 1,-1,2.5. Yaw=-30, Pitch = 45 Roll = -15, Scaled with the following factors: 0.8 (x), 0.75 (y), 1.2 (z)
	/*let A5T		=	utils.MakeTranslateMatrix(camera.position.x + offset.x,
		camera.position.y + offset.y,
		camera.position.z + offset.z);		// Translate matrix in (1, -1, 2.5)
	let A5Rx	=	utils.MakeRotateXMatrix(offset.elevation);				// Rotate x (Pitch) 45°
	let A5Ry	=	utils.MakeRotateYMatrix(offset.angle);				// Rotate y (Yaw) -30°
	let A5Rz	=	utils.MakeRotateZMatrix(0.0);				// Rotate z (Roll) -15°
	let A5S		=	utils.MakeScaleMatrix(0.25);	// Scaling factor (x, y, z)
	let worldMatrix		=	utils.multiplyMatrices(A5T,
						utils.multiplyMatrices(A5Ry,
							utils.multiplyMatrices(A5Rx,
								utils.multiplyMatrices(A5Rz, A5S)
							)
						)
					);*/

		let worldMatrix = utils.MakeWorld(
			camera.position.x + offset.x + Math.sin(utils.degToRad(camera.position.angle)) * offset.angle,
			camera.position.y + Math.sin(utils.degToRad(camera.position.elevation)) * offset.y,
			camera.position.z - Math.cos(utils.degToRad(camera.position.angle)) * offset.z - Math.cos(utils.degToRad(camera.position.elevation)) * offset.z,
			camera.position.angle + offset.angle ,
			0.0 + offset.elevation,0.0,0.25
		);

        let viewWorldMatrix = utils.multiplyMatrices(camera.viewMatrix, worldMatrix);
        let projectionMatrix = utils.multiplyMatrices(perspectiveMatrix, viewWorldMatrix);
        gl.useProgram(this.program);
        gl.bindVertexArray(this.vao);
        let length = [].concat.apply([],this.mesh.indicesPerMaterial).length;
        gl.uniformMatrix4fv(this.locations['chProjMatrix'], gl.FALSE, utils.transposeMatrix(projectionMatrix));
        gl.uniformMatrix4fv(this.locations['chWorldMatrix'], gl.FALSE, utils.transposeMatrix(worldMatrix));
        //gl.uniform1i(this.locations['labSampler'], utils.getTextureSlotOffset(gl, this.slot));
        gl.drawElements(gl.TRIANGLES, length, gl.UNSIGNED_SHORT, 0);
    }

}