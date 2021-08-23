

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
	movementX: 0, movementY: 0,
	lastMovementX: 0, lastMovementY: 0,
	lastLastMovementX: 0, lastLastMovementY: 0,
};
let wheel = {
	deltaX: 0, deltaY: 0,
	Xenhancement: 10.0, Yenhancement: 10.0,
};

// Debug constant for Position and Direction of the camera
const DEBUG_MOVEMENT = false;

// Position and Direction of the camera
let cameraPosition = {
	x: 0.5,
	y: 1.0,
	z: 0.5,
	angle: 180.0, angleMouseCoefficient: 0.5,
	elevation: 180.0 * DEBUG_MOVEMENT, elevationMouseCoefficient: 0.0,
	roll: 0.0, rollMouseCoefficient: 0.0,
};
let cameraSpeed = {
	x: 0.0, xMax: 2.0, xMin: 0.1,
	y: 0.0, yMax: 2.0, yMin: 0.1,
	z: 0.0, zMax: 2.0, zMin: 0.1,
	angle: 0.0, angleMax: 180.0, angleMin: 0.1,
	elevation: 0.0, elevationMax: 180.0, elevationMin: 0.1,
	roll: 0.0, rollMax: 180.0, rollMin: 0.1,
};
let cameraAcceleration = {
	x: 0.0, xMax: 2.5, xDeceleration: 20.0,
	y: 0.0, yMax: 2.5 * DEBUG_MOVEMENT, yDeceleration: 20.0,
	z: 0.0, zMax: 2.5, zDeceleration: 10.0,
	angle: 0.0, angleMax: 720.0, angleDeceleration: 10.0,
	elevation: 0.0, elevationMax: 0.0, elevationDeceleration: 10.0,
	roll: 0.0, rollMax: 0.0, rollDeceleration: 10.0,
};

function main() {

	// Initialize interaction listeners
	utils.initInteraction(gl.canvas);

	utils.resizeCanvasToDisplaySize(gl.canvas);
	gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	gl.enable(gl.DEPTH_TEST);
	gl.enable(gl.CULL_FACE);
	gl.frontFace(gl.CCW);
	gl.cullFace(gl.BACK);

	var maze3D = compute3DLabyrinth(maze, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0, [0.6, 1.0, 0.2], [0.0, 0.7, 1.0]);

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
	gl.enableVertexAttribArray(locations['labVertPosition']);
	gl.vertexAttribPointer(
		locations['labVertPosition'], // Attribute location
		3, // Number of elements per attribute
		gl.FLOAT, // Type of elements
		gl.FALSE,
		3 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
		0 // Offset from the beginning of a single vertex to this attribute
	);

	var mazeColourBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, mazeColourBufferObject);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mazeColours), gl.STATIC_DRAW);
	gl.enableVertexAttribArray(locations['labVertColor']);
	gl.vertexAttribPointer(
		locations['labVertColor'], // Attribute location
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
		let viewMatrix = utils.MakeView(cameraPosition.x, cameraPosition.y, cameraPosition.z, cameraPosition.elevation, cameraPosition.angle);
		let viewWorldMatrix = utils.multiplyMatrices(viewMatrix, worldMatrix);
		let projectionMatrix = utils.multiplyMatrices(perspectiveMatrix, viewWorldMatrix);
		gl.uniformMatrix4fv(locations['labProjMatrix'], gl.FALSE, utils.transposeMatrix(projectionMatrix));
		gl.drawElements(gl.TRIANGLES, mazeIndices.length, gl.UNSIGNED_SHORT, 0);

		// Movement speed
		cameraSpeed.x = acc.computeSpeed(cameraSpeed.x, cameraAcceleration.x, cameraAcceleration.xDeceleration, cameraSpeed.xMax, cameraSpeed.xMin, deltaTime);
		cameraSpeed.y = acc.computeSpeed(cameraSpeed.y, cameraAcceleration.y, cameraAcceleration.yDeceleration, cameraSpeed.yMax, cameraSpeed.yMin, deltaTime);
		cameraSpeed.z = acc.computeSpeed(cameraSpeed.z, cameraAcceleration.z, cameraAcceleration.zDeceleration, cameraSpeed.zMax, cameraSpeed.zMin, deltaTime);
		cameraSpeed.angle = acc.computeSpeed(cameraSpeed.angle, cameraAcceleration.angle, cameraAcceleration.angleDeceleration, cameraSpeed.angleMax, cameraSpeed.angleMin, deltaTime);
		cameraSpeed.elevation = acc.computeSpeed(cameraSpeed.elevation, cameraAcceleration.elevation, cameraAcceleration.elevationDeceleration, cameraSpeed.elevationMax, cameraSpeed.elevationMin, deltaTime);
		cameraSpeed.roll = acc.computeSpeed(cameraSpeed.roll, cameraAcceleration.roll, cameraAcceleration.rollDeceleration, cameraSpeed.rollMax, cameraSpeed.rollMin, deltaTime);

		// Movement position
		cameraPosition.x -= (viewMatrix[0] * cameraSpeed.x + viewMatrix[4] * cameraSpeed.y + viewMatrix[8] * cameraSpeed.z) * deltaTime;
		cameraPosition.y -= (viewMatrix[1] * cameraSpeed.x + viewMatrix[5] * cameraSpeed.y + viewMatrix[9] * cameraSpeed.z) * deltaTime;
		cameraPosition.z -= (viewMatrix[2] * cameraSpeed.x + viewMatrix[6] * cameraSpeed.y + viewMatrix[10] * cameraSpeed.z) * deltaTime;
		cameraPosition.angle += cameraSpeed.angle * deltaTime;
		cameraPosition.elevation += cameraSpeed.elevation * deltaTime;
		cameraPosition.roll += cameraSpeed.roll * deltaTime;

		// Movement acceleration reset
		cameraAcceleration.x = 0.0;
		cameraAcceleration.y = 0.0;
		cameraAcceleration.z = 0.0;
		cameraAcceleration.angle = 0.0;
		cameraAcceleration.elevation = 0.0;
		cameraAcceleration.roll = 0.0;

		// Keyboard, Mouse Functions
		if (keys['87'] || keys['83']) {		// Keys W and S
			const direction = keys['87'] ? 1 : -1;
			cameraAcceleration.z = cameraAcceleration.zMax * direction;
		}
		if (wheel.deltaY != 0) {			// Mouse wheel vertical
			const direction = (wheel.deltaY < 0) ? 1 : -1;
			cameraAcceleration.z = cameraAcceleration.zMax * direction * wheel.Yenhancement;
			wheel.deltaY = 0;
		}
		if (keys['65'] || keys['68']) {		// Keys A and D
			const direction = keys['65'] ? 1 : -1;
			cameraAcceleration.x = cameraAcceleration.xMax * direction;
		}
		if (wheel.deltaX != 0) {			// Mouse wheel horizontal
			const direction = (wheel.deltaX < 0) ? 1 : -1;
			cameraAcceleration.x = cameraAcceleration.xMax * direction * wheel.Xenhancement;
			wheel.deltaX = 0;
		}
		if (keys['81'] || keys['69']) {		// Keys Q and E
			const direction = keys['69'] ? 1 : -1;
			cameraAcceleration.y = cameraAcceleration.yMax * direction;
		}
		if (keys['37'] || keys['39']) {		// Keys LEFT and RIGHT
			const direction = keys['39'] ? 1 : -1;
			cameraAcceleration.angle = cameraAcceleration.angleMax * direction;
		}
		if (keys['38'] || keys['40']) {		// Keys UP and DOWN
			const direction = keys['38'] ? 1 : -1;
			cameraAcceleration.elevation = cameraAcceleration.elevationMax * direction;
		}
		if (mouse.movementX != 0) {			// Horizontal mouse movements
			cameraPosition.angle += ((mouse.lastLastMovementX + mouse.lastMovementX + mouse.movementX) / 3.0) * cameraPosition.angleMouseCoefficient;
			mouse.movementX = 0;
		}
		if (mouse.movementY != 0) {			// Vertical mouse movements
			cameraPosition.elevation -= ((mouse.lastLastMovementY + mouse.lastMovementY + mouse.movementY) / 3.0) * cameraPosition.elevationMouseCoefficient;
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
	map['labVertPosition'] = gl.getAttribLocation(program[0], 'labVertPosition');
	map['labVertColor'] = gl.getAttribLocation(program[0], 'labVertColor');
	map['labProjMatrix'] = gl.getUniformLocation(program[0], 'labProjMatrix');
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
