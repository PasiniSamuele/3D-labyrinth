/**
 * 
 */

class Character extends Mesh{

	constructor(meshString, offset, worldMatrix, program) {
		super(meshString);
		this.worldMatrix = worldMatrix;
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

		//console.log(this.locations);
    }

    /**
     * function to create the vertex array object
     */
    loadVAO() {
        this.vao = gl.createVertexArray();
        gl.bindVertexArray(this.vao);

        //OBJ.initMeshBuffers(gl, this.mesh);

        console.log(this.mesh);

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
            0 // Offset from the beginning of a single vertex to this attribute
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
        console.log(indices)
        var indexBufferObject = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBufferObject);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
    }

    /**
     * function to draw the character
     * @param {*} perspectiveMatrix 
     * @param {*} viewMatrix 
     */
    draw(perspectiveMatrix, viewMatrix) {
        let viewWorldMatrix = utils.multiplyMatrices(viewMatrix, this.worldMatrix);
        let projectionMatrix = utils.multiplyMatrices(perspectiveMatrix, viewWorldMatrix);
        gl.useProgram(this.program);
        gl.bindVertexArray(this.vao);


		/*OBJ.initMeshBuffers(gl, this.objModel);

		gl.bindBuffer(gl.ARRAY_BUFFER, this.objModel.vertexBuffer);
		gl.vertexAttribPointer(this.locations['chVertPosition'], this.objModel.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);
	    gl.bindBuffer(gl.ARRAY_BUFFER, this.objModel.textureBuffer);
	    gl.vertexAttribPointer(this.locations['chTexCoord'], this.objModel.textureBuffer.itemSize, gl.FLOAT, false, 0, 0);
		
		gl.bindBuffer(gl.ARRAY_BUFFER, this.objModel.normalBuffer);
		gl.vertexAttribPointer(this.locations['chNormal'], this.objModel.normalBuffer.itemSize, gl.FLOAT, false, 0, 0);
		 
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.objModel.indexBuffer);*/

        let length = [].concat.apply([],this.mesh.indicesPerMaterial).length;
        gl.uniformMatrix4fv(this.locations['chProjMatrix'], gl.FALSE, utils.transposeMatrix(projectionMatrix));
        gl.uniformMatrix4fv(this.locations['chWorldMatrix'], gl.FALSE, utils.transposeMatrix(this.worldMatrix));
        //gl.uniform1i(this.locations['labSampler'], utils.getTextureSlotOffset(gl, this.slot));
        gl.drawElements(gl.TRIANGLES, length, gl.UNSIGNED_SHORT, 0);
    }

}