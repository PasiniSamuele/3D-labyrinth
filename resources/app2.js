/** @type {WebGLRenderingContext} */
var gl;

/*var initResources = function(){
    loadTextResource('resources/shaders/shader.vs.glsl', function(vsErr, vsText){
        if(vsErr){
            alert("Fatal error with vertex shader");
            console.error(vsErr);
        } else {
            loadTextResource("resources/shaders/shader.fs.glsl", function(fsErr, fsText){
                if(fsErr){
                    alert("Fatal error with fragment shader");
                    console.error(fsErr);
                } else {
                    loadJSONResource("")
                    init(vsText, fsText);
                }
            });
        }
    });
}*/

var initResources = function(){
	Promise.all([
		loadTextResource('resources/shaders/shader.vs.glsl'),
		loadTextResource("resources/shaders/shader.fs.glsl"),
		loadJSONResource("resources/assets/labyrinths/lab1.json")
	]).then(values => init(values[0], values[1], values[2]), errors => console.error(errors));
}

var init = function(vertexShaderText, fragmentShaderText, maze1){

	var canvas = document.getElementById('canvas-id');
	var gl = canvas.getContext('webgl2');

	if (!gl) {
		console.log('WebGL not supported, falling back on experimental-webgl');
		gl = canvas.getContext('experimental-webgl');
	}

	if (!gl) {
		alert('Your browser does not support WebGL');
	}

	gl.clearColor(1.0, 1.0, 1.0, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	gl.enable(gl.DEPTH_TEST);
	gl.enable(gl.CULL_FACE);
	gl.frontFace(gl.CCW);
	gl.cullFace(gl.BACK);

	//
	// Create shaders
	// 
	var vertexShader = gl.createShader(gl.VERTEX_SHADER);
	var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

	gl.shaderSource(vertexShader, vertexShaderText);
	gl.shaderSource(fragmentShader, fragmentShaderText);

	gl.compileShader(vertexShader);
	if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
		console.error('ERROR compiling vertex shader!', gl.getShaderInfoLog(vertexShader));
		return;
	}

	gl.compileShader(fragmentShader);
	if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
		console.error('ERROR compiling fragment shader!', gl.getShaderInfoLog(fragmentShader));
		return;
	}

	var program = gl.createProgram();
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);
	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		console.error('ERROR linking program!', gl.getProgramInfoLog(program));
		return;
	}
	gl.validateProgram(program);
	if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
		console.error('ERROR validating program!', gl.getProgramInfoLog(program));
		return;
	}

	//
	// Create buffer
	//

	var maze13D = compute3DLabyrinth(maze1, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0, [0.5, 0.5, 0.5], [0.0, 1.0, 0.0]);

    var maze1Vertices = maze13D[0];

	var maze1Indices = maze13D[1];

    var maze1Colours = maze13D[2];

	var maze1VertexBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, maze1VertexBufferObject);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(maze1Vertices), gl.STATIC_DRAW);
    var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
    gl.enableVertexAttribArray(positionAttribLocation);
    gl.vertexAttribPointer(
		positionAttribLocation, // Attribute location
		3, // Number of elements per attribute
		gl.FLOAT, // Type of elements
		gl.FALSE,
		3 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
		0 // Offset from the beginning of a single vertex to this attribute
	);

    console.log(maze1Colours);

    var maze1ColourBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, maze1ColourBufferObject);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(maze1Colours), gl.STATIC_DRAW);
	var colorAttribLocation = gl.getAttribLocation(program, 'vertColor'); 
	gl.enableVertexAttribArray(colorAttribLocation);
	gl.vertexAttribPointer(
		colorAttribLocation, // Attribute location
		3, // Number of elements per attribute
		gl.FLOAT, // Type of elements
		gl.FALSE,
		3 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
		0 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
	);

    var maze1IndexBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, maze1IndexBufferObject);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(maze1Indices), gl.STATIC_DRAW);

	// Tell OpenGL state machine which program should be active.
	gl.useProgram(program);

	var matWorldUniformLocation = gl.getUniformLocation(program, 'mWorld');
	var matViewUniformLocation = gl.getUniformLocation(program, 'mView');
	var matProjUniformLocation = gl.getUniformLocation(program, 'mProj');

    var mat4 = glMatrix.mat4;

	var worldMatrix = new Float32Array(16);
	var viewMatrix = new Float32Array(16);
	var projMatrix = new Float32Array(16);
	mat4.identity(worldMatrix);
	mat4.lookAt(viewMatrix, [0, 0, -8], [0, 0, 0], [0, 1, 0]);
	mat4.perspective(projMatrix, 45*Math.PI/180, canvas.clientWidth / canvas.clientHeight, 0.1, 1000.0);

	gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
	gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix);
	gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, projMatrix);

	var xRotationMatrix = new Float32Array(16);
	var yRotationMatrix = new Float32Array(16);

	//
	// Main render loop
	//
	var identityMatrix = new Float32Array(16);
	mat4.identity(identityMatrix);
	var angle = 0;
	var loop = function () {
		angle = performance.now() / 1000 / 6 * 2 * Math.PI;
		mat4.rotate(yRotationMatrix, identityMatrix, angle, [0, 1, 0]);
		mat4.rotate(xRotationMatrix, identityMatrix, angle / 4, [1, 0, 0]);
		mat4.mul(worldMatrix, yRotationMatrix, xRotationMatrix);
		gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);

		gl.clearColor(0.75, 0.85, 0.8, 1.0);
		gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
		gl.drawElements(gl.TRIANGLES, maze1Indices.length, gl.UNSIGNED_SHORT, 0);

		requestAnimationFrame(loop);
	};
	requestAnimationFrame(loop);
};