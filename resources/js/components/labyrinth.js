function Labyrinth(structure, program){
    
    //ATTRIBUTES
    this.program=program;
    this.locations={};

    this.vao;

    this.structure2D=structure;

    this.vertices=[];
    this.indices=[];
    this.colours=[];
    this.normals=[];
    this.uvs=[];

    //METHODS
    this.init = function(){
        this.loadLocations();
        this.loadImage();
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

        var mazeTexCoordBufferObject = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, mazeTexCoordBufferObject);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.uvs), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(this.locations['labVertTexCoord']);
        gl.vertexAttribPointer(
            this.locations['labVertTexCoord'], // Attribute location
            2, // Number of elements per attribute
            gl.FLOAT, // Type of elements
            gl.FALSE,
            2 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
            0 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
        );

        var mazeIndexBufferObject = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mazeIndexBufferObject);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), gl.STATIC_DRAW);

        
    }

    this.loadLabyrinth = function(){
        let maze3D = compute3DLabyrinth(structure, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0);
        this.vertices = maze3D[0];
        this.indices = maze3D[1];
        this.colours = maze3D[2];
        this.normals = maze3D[3];
        this.uvs = maze3D[4];
    }

    this.loadImage = function(){
        const image = new Image();
        image.src = "resources/assets/textures/lab/labTex.png";
        image.addEventListener('load', function (){
            var mazeTexture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, mazeTexture);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        })
    }

    this.loadLocations = function(){
        this.locations['labVertPosition'] = gl.getAttribLocation(this.program, 'labVertPosition');
        this.locations['labVertTexCoord'] = gl.getAttribLocation(this.program, 'labVertTexCoord');
        this.locations['labProjMatrix'] = gl.getUniformLocation(this.program, 'labProjMatrix');
    };

    //CALLS
    this.init();
}