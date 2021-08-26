function Labyrinth(structure, program){
    
    //ATTRIBUTES
    this.program=program;
    this.locations={};

    this.vao;

    this.structure2D=structure;

    this.vertices=[];
    this.indices=[];
    this.colours=[];

    //METHODS
    this.init = function(){
        this.loadLocations();
        this.loadLabyrinth();
        this.loadVAO();
    };

    this.draw = function(perspectiveMatrix, viewMatrix){
        let worldMatrix = utils.MakeWorld(0.0, 0.5, 0.0, 0.0, 0.0, 0.0, 1.0);
        let viewWorldMatrix = utils.multiplyMatrices(viewMatrix, worldMatrix);
		let projectionMatrix = utils.multiplyMatrices(perspectiveMatrix, viewWorldMatrix);
        gl.useProgram(this.program);
        gl.bindVertexArray(this.vao);
		gl.uniformMatrix4fv(this.locations['labProjMatrix'], gl.FALSE, utils.transposeMatrix(projectionMatrix));
		gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_SHORT, 0);
    }

    this.loadVAO = function(){
        this.vao = gl.createVertexArray();
        gl.bindVertexArray(this.vao);

        var mazeVertexBufferObject = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, mazeVertexBufferObject);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(this.locations['labVertPosition']);
        gl.vertexAttribPointer(
            this.locations['labVertPosition'], // Attribute location
            3, // Number of elements per attribute
            gl.FLOAT, // Type of elements
            gl.FALSE,
            3 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
            0 // Offset from the beginning of a single vertex to this attribute
        );

        var mazeColourBufferObject = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, mazeColourBufferObject);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.colours), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(this.locations['labVertColor']);
        gl.vertexAttribPointer(
            this.locations['labVertColor'], // Attribute location
            3, // Number of elements per attribute
            gl.FLOAT, // Type of elements
            gl.FALSE,
            3 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
            0 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
        );

        var mazeIndexBufferObject = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mazeIndexBufferObject);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), gl.STATIC_DRAW);
    }

    this.loadLabyrinth = function(){
        let maze3D = compute3DLabyrinth(structure, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0, [1.0, 0.0, 0.0]);
        this.vertices = maze3D[0];
        this.indices = maze3D[1];
        this.colours = maze3D[2];
    }

    this.loadLocations = function(){
        this.locations['labVertPosition'] = gl.getAttribLocation(this.program, 'labVertPosition');
        this.locations['labVertColor'] = gl.getAttribLocation(this.program, 'labVertColor');
        this.locations['labProjMatrix'] = gl.getUniformLocation(this.program, 'labProjMatrix');
    };

    //CALLS
    this.init();
}