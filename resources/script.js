//global variables
var program;
var gl;
var shaderDir; 
var baseDir;
var maze;

var cubeRx = 0.0;
  var cubeRy = 0.0;
  var cubeRz = 0.0;
  var lastUpdateTime = (new Date).getTime();

function main() {
  
    utils.resizeCanvasToDisplaySize(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	gl.enable(gl.DEPTH_TEST);
	gl.enable(gl.CULL_FACE);
	gl.frontFace(gl.CCW);
	gl.cullFace(gl.BACK);

    var maze13D = compute3DLabyrinth(maze, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0, [0.6, 0.7, 0.2], [1.0, 0.0, 0.0]);

    var maze1Vertices = maze13D[0];
	var maze1Indices = maze13D[1];
    var maze1Colours = maze13D[2];

    console.log(maze1Vertices);

    locations = getLocations();

    vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

    var maze1VertexBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, maze1VertexBufferObject);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(maze1Vertices), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(locations['vertPosition']);
    gl.vertexAttribPointer(
		locations['vertPosition'], // Attribute location
		3, // Number of elements per attribute
		gl.FLOAT, // Type of elements
		gl.FALSE,
		3 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
		0 // Offset from the beginning of a single vertex to this attribute
	);

    var maze1ColourBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, maze1ColourBufferObject);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(maze1Colours), gl.STATIC_DRAW);
	gl.enableVertexAttribArray(locations['vertColor']);
	gl.vertexAttribPointer(
		locations['vertColor'], // Attribute location
		3, // Number of elements per attribute
		gl.FLOAT, // Type of elements
		gl.FALSE,
		3 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
		0 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
	);

    var maze1IndexBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, maze1IndexBufferObject);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(maze1Indices), gl.STATIC_DRAW);

    var perspectiveMatrix = utils.MakePerspective(90, gl.canvas.width/gl.canvas.height, 0.1, 100.0);
    var worldMatrix = utils.MakeWorld(  0.0, 0.0, 0.0, cubeRx, cubeRy, cubeRz, 1.0);
    
    drawScene();
    
    function drawScene(){
        //animate();
        gl.useProgram(program);
        utils.resizeCanvasToDisplaySize(gl.canvas);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.clearColor(1, 1, 1, 0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.CULL_FACE);

        var viewMatrix = utils.MakeView(0.0, 0.0, 0.0, 0.0, 90.0);
        var viewWorldMatrix = utils.multiplyMatrices(viewMatrix, worldMatrix);
        var projectionMatrix = utils.multiplyMatrices(perspectiveMatrix, viewWorldMatrix);

        gl.uniformMatrix4fv(locations['projMatrix'], gl.FALSE, utils.transposeMatrix(projectionMatrix));
        gl.drawElements(gl.TRIANGLES, maze1Indices.length, gl.UNSIGNED_SHORT, 0);
    
          window.requestAnimationFrame(drawScene);
    
    }
    
    function animate(){
        var currentTime = (new Date).getTime();
        if(lastUpdateTime){
          var deltaC = (30 * (currentTime - lastUpdateTime)) / 1000.0;
          cubeRx += deltaC;
          cubeRy -= deltaC;
          cubeRz += deltaC;
        }
        worldMatrix = utils.MakeWorld(  0.0, 0.0, 0.0, cubeRx, cubeRy, cubeRz, 1.0);
        lastUpdateTime = currentTime;               
      }
}



function getLocations(){
    var map = {};
    map['vertPosition'] =   gl.getAttribLocation(program, 'vertPosition');
    map['vertColor'] =   gl.getAttribLocation(program, 'vertColor');
    map['projMatrix'] =   gl.getUniformLocation(program, 'projMatrix');
    return map;

}
async function init(){
  
    var path = window.location.pathname;
    var page = path.split("/").pop();
    baseDir = window.location.href.replace(page, '');
    shaderDir = baseDir+"resources/shaders/";

    var canvas = document.getElementById("canvas-id");
    gl = canvas.getContext("webgl2");
    if (!gl) {
		console.log('WebGL not supported, falling back on experimental-webgl');
		gl = canvas.getContext('experimental-webgl');
	}

	if (!gl) {
		alert('Your browser does not support WebGL');
	}

    await utils.loadFiles([shaderDir + 'shader.vs.glsl', shaderDir + 'shader.fs.glsl'], function (shaderText) {
      var vertexShader = utils.createShader(gl, gl.VERTEX_SHADER, shaderText[0]);
      console.log(vertexShader);
      var fragmentShader = utils.createShader(gl, gl.FRAGMENT_SHADER, shaderText[1]);
      program = utils.createProgram(gl, vertexShader, fragmentShader);

    });

    await utils.loadFiles(['resources/assets/labyrinths/lab1.json'], function (lab) {
       // maze=lab;
       maze = [[0,1,0],[0,1,0],[0,0,0]];
  
      });

    
    main();
}

window.onload = init;