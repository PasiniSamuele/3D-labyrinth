

//global variables
var program;
var gl;
var shaderDir;
var baseDir;
var assetDir;
var mazes;

var levelsSize = 1;
var activeLevel;

//TODO: remove
var mazeRx = 0.0;
var mazeRy = 0.0;
var mazeRz = 0.0;

// Interaction
let keys = {};
let mouse = {
	movementX: 0,
	movementY: 0,
};
let wheel = 0;

// Position and Direction of the camera
let cameraX = 0, cameraY = 0, cameraZ = 0;
let elev = 0, ang = 0, roll = 0;
let speed = 1, turnSpeed = 90;

function main() {

	// Initialize key listener
	utils.initInteraction();

	utils.resizeCanvasToDisplaySize(gl.canvas);
	gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	gl.enable(gl.DEPTH_TEST);
	gl.enable(gl.CULL_FACE);
	gl.frontFace(gl.CCW);
	gl.cullFace(gl.BACK);

	var maze3D = compute3DLabyrinth(maze, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0, [0.6, 0.7, 0.2], [1.0, 0.0, 0.0]);

	var mazeVertices = maze3D[0];
	var mazeIndices = maze3D[1];
	var mazeColours = maze3D[2];

	console.log(mazeVertices);

	locations = getLocations();

	vao = gl.createVertexArray();
	gl.bindVertexArray(vao);

	var mazeVertexBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, mazeVertexBufferObject);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mazeVertices), gl.STATIC_DRAW);
	gl.enableVertexAttribArray(locations['vertPosition']);
	gl.vertexAttribPointer(
		locations['vertPosition'], // Attribute location
		3, // Number of elements per attribute
		gl.FLOAT, // Type of elements
		gl.FALSE,
		3 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
		0 // Offset from the beginning of a single vertex to this attribute
	);

	var mazeColourBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, mazeColourBufferObject);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mazeColours), gl.STATIC_DRAW);
	gl.enableVertexAttribArray(locations['vertColor']);
	gl.vertexAttribPointer(
		locations['vertColor'], // Attribute location
		3, // Number of elements per attribute
		gl.FLOAT, // Type of elements
		gl.FALSE,
		3 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
		0 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
	);

	var mazeIndexBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mazeIndexBufferObject);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(mazeIndices), gl.STATIC_DRAW);

	// Perspective, Wirld Matrix
	let perspectiveMatrix = utils.MakePerspective(90, gl.canvas.width / gl.canvas.height, 0.1, 100.0);
	let worldMatrix = utils.MakeWorld(0.0, 0.5, 0.0, mazeRx, mazeRy, mazeRz, 1.0);

	let then = 0;
	function drawScene(now) {

		// Get current time
		now *= 0.001;  // seconds;
		let deltaTime = now - then;
		then = now;

		//animate();
		gl.useProgram(program[0]);
		utils.resizeCanvasToDisplaySize(gl.canvas);
		gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
		gl.clearColor(1, 1, 1, 0);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		gl.enable(gl.DEPTH_TEST);
		gl.enable(gl.CULL_FACE);

		// View, World, Projection Matrix
		let viewMatrix = utils.MakeView(0.2 + cameraX, 1.0 + cameraY, 0.2 + cameraZ, 0.0 + elev, 90.0 + ang);
		let viewWorldMatrix = utils.multiplyMatrices(viewMatrix, worldMatrix);
		let projectionMatrix = utils.multiplyMatrices(perspectiveMatrix, viewWorldMatrix);

		gl.uniformMatrix4fv(locations['projMatrix'], gl.FALSE, utils.transposeMatrix(projectionMatrix));
		gl.drawElements(gl.TRIANGLES, mazeIndices.length, gl.UNSIGNED_SHORT, 0);

		// Keyboard, Mouse Functions
		if (keys['87'] || keys['83']) {	// w s
			const direction = keys['87'] ? 1 : -1;
			cameraX -= viewMatrix[8] * deltaTime * speed * direction;
			cameraY -= viewMatrix[9] * deltaTime * speed * direction;
			cameraZ -= viewMatrix[10] * deltaTime * speed * direction;
		}
		if (keys['65'] || keys['68']) { // a d
			const direction = keys['65'] ? 1 : -1;
			cameraX -= viewMatrix[0] * deltaTime * speed * direction;
			cameraY -= viewMatrix[1] * deltaTime * speed * direction;
			cameraZ -= viewMatrix[2] * deltaTime * speed * direction;
		}
		if (keys['81'] || keys['69']) { // q e
			const direction = keys['69'] ? 1 : -1;
			cameraY -= deltaTime * speed * direction;
		}
		if (keys['37'] || keys['39']) { // LEFT RIGHT
			const direction = keys['39'] ? 1 : -1;
			ang += deltaTime * turnSpeed * direction;
		}
		if (keys['38'] || keys['40']) {	// UP DOWN
			const direction = keys['38'] ? 1 : -1;
			elev += deltaTime * turnSpeed * direction;
		}
		if (mouse.movementX != 0) {
			ang += mouse.movementX;  // mouse.movementX
			mouse.movementX = 0;
		}
		if (mouse.movementY != 0) {
			elev += mouse.movementY;  // mouse.movementY
			mouse.movementY = 0;
		}

		// Redraw when requested
		window.requestAnimationFrame(drawScene);
	}

	// Draw when requested
	window.requestAnimationFrame(drawScene);

}



function getLocations() {
	var map = {};
	map['vertPosition'] = gl.getAttribLocation(program[0], 'vertPosition');
	map['vertColor'] = gl.getAttribLocation(program[0], 'vertColor');
	map['projMatrix'] = gl.getUniformLocation(program[0], 'projMatrix');
	return map;

}
async function init() {

	var path = window.location.pathname;
	var page = path.split("/").pop();
	baseDir = window.location.href.replace(page, '');
	shaderDir = baseDir + "resources/shaders/";

	var canvas = document.getElementById("canvas-id");
	gl = canvas.getContext("webgl2");
	if (!gl) {
		console.log('WebGL not supported, falling back on experimental-webgl');
		gl = canvas.getContext('experimental-webgl');
	}

	if (!gl) {
		alert('Your browser does not support WebGL');
	}

	activeLevel = 0;
	program = [];

	await initResources();
	main();

}

async function initResources() {
	try {
		var labToLoad = activeLevel + 1;
		const results = await Promise.all([
			utils.loadTextResource('resources/shaders/labShader.vs.glsl'),
			utils.loadTextResource("resources/shaders/labShader.fs.glsl"),
			utils.loadJSONResource("resources/assets/labyrinths/lab" + labToLoad + ".json")
		])
		var labVertexShader = utils.createShader(gl, gl.VERTEX_SHADER, results[0]);
		var labFragmentShader = utils.createShader(gl, gl.FRAGMENT_SHADER, results[1]);
		program[0] = utils.createProgram(gl, labVertexShader, labFragmentShader);
		maze = results[2];
		//maze = [[0, 1, 0], [0, 1, 0], [0, 0, 0]];

	}
	catch (err) {
		console.error(err);
	}
}

async function endLevel() {
	if (activeLevel < levelsSize) {
		activeLevel++;
		await initResources();
		main();
	}
	else
		alert("You won!");
}

window.onload = init;
