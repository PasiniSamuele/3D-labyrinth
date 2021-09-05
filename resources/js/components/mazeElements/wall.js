class Wall extends LabyrinthElement{
    constructor(structure, slot, parent, program, imageUrl){
        super(structure, parent, program);
        
        this.imageUrl = imageUrl;
        this.slot = slot;
    }

    init(){
        this.loadComponent();
        this.loadLocations();
        this.loadTexture();
        this.loadVAO();
    }

    loadLocations(){
        this.program.vertCoordinates = gl.getAttribLocation(this.program, 'labVertPosition');
        this.program.texCoordinates = gl.getAttribLocation(this.program, 'labVertTexCoord');
        this.program.projMatrix = gl.getUniformLocation(this.program, 'labProjMatrix');
        this.program.texSampler = gl.getUniformLocation(this.program, 'labSampler');
    }

    /**
     * function to create the vertex array object
     */
    loadVAO() {
        this.vao = gl.createVertexArray();
        gl.bindVertexArray(this.vao);

        var mazeVertexBufferObject = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, mazeVertexBufferObject);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(this.program.vertCoordinates);
        gl.vertexAttribPointer(
            this.program.vertCoordinates,
            3,
            gl.FLOAT,
            gl.FALSE,
            3 * Float32Array.BYTES_PER_ELEMENT,
            0 // Offset from the beginning of a single vertex to this attribute
        );

        var mazeTexCoordBufferObject = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, mazeTexCoordBufferObject);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.uvs), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(this.program.texCoordinates);
        gl.vertexAttribPointer(
            this.program.texCoordinates,
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
     * function to load the image for the texture
     */
    loadTexture() {
        let imageSlot = this.slot;
        let wallTexture = gl.createTexture();
        gl.activeTexture(imageSlot);
        gl.bindTexture(gl.TEXTURE_2D, wallTexture);
        // put a 1x1 red pixel in the texture so it's renderable immediately
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([255, 0, 0, 255]));

        const wallImage = new Image();
        wallImage.src = this.imageUrl;
        wallImage.addEventListener('load', function () {
            gl.activeTexture(imageSlot);
            gl.bindTexture(gl.TEXTURE_2D, wallTexture);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, wallImage);
            gl.generateMipmap(gl.TEXTURE_2D);
        });
    }

    /**
     * function to computer the labyrinth structure
     */
    loadComponent() {
        let walls3D = labyrinthUtils.compute3DWalls(this.structure, 0.0, 1.0, 1.0);
        this.vertices = walls3D[0];
        this.indices = walls3D[1];
        this.colours = walls3D[2];
        this.normals = walls3D[3];
        this.uvs = walls3D[4];
    }

    draw(perspectiveMatrix, camera){
        super.draw(perspectiveMatrix, camera);

        let viewWorldMatrix = utils.multiplyMatrices(camera.viewMatrix, this.worldMatrix);
        let projectionMatrix = utils.multiplyMatrices(perspectiveMatrix, viewWorldMatrix);
        gl.useProgram(this.program);
        gl.bindVertexArray(this.vao);
        gl.uniformMatrix4fv(this.program.projMatrix, gl.FALSE, utils.transposeMatrix(projectionMatrix));
        gl.uniform1i(this.program.texSampler, utils.getTextureSlotOffset(gl, this.slot));
        gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_SHORT, 0);
    }
}