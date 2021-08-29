

//global variables
var program;
var gl;
var shaderDir;
var baseDir;
var assetDir;
var mazes;

var levelsSize = 1;
var activeLevel;


//skyboxes
var skyboxDayTexture, skyboxNightTexture;
var skyboxVao;

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
	elevation: 0.0, elevationMouseCoefficient: 0.5, elevationMin: -60.00, elevationMax: 60.00,
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
	elevation: 0.0, elevationMax: 720.0, elevationDeceleration: 10.0,
	roll: 0.0, rollMax: 0.0, rollDeceleration: 10.0,
};

function main() {

	// Initialize interaction-listeners
	utils.initInteraction(gl.canvas);

	utils.resizeCanvasToDisplaySize(gl.canvas);

	var maze3D = compute3DLabyrinth(maze, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0, [0.6, 1.0, 0.2], [0.0, 0.7, 1.0]);

	var mazeVertices = maze3D[0];
	var mazeIndices = maze3D[1];
	var mazeColours = maze3D[2];

	locations = getLocations();

	LoadEnvironment();


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

	let then = 0;
	function drawScene(now) {

		// Get current time
		now *= 0.001;  // seconds;
		let deltaTime = now - then;
		then = now;

		// Perspective, World Matrix
		let perspectiveMatrix = utils.MakePerspective(90, gl.canvas.width / gl.canvas.height, 0.1, 100.0);
		let worldMatrix = utils.MakeWorld(0.0, 0.5, 0.0, mazeRx, mazeRy, mazeRz, 1.0);

		// Gl statements
		gl.useProgram(program[0]);
		utils.resizeCanvasToDisplaySize(gl.canvas);
		gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
		gl.clearColor(1, 1, 1, 0);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		gl.enable(gl.DEPTH_TEST);
		gl.enable(gl.CULL_FACE);
		gl.frontFace(gl.CCW);
		gl.cullFace(gl.BACK);
		gl.bindVertexArray(vao);

		// View, World, Projection Matrix
		let viewMatrix = utils.MakeView(cameraPosition.x, cameraPosition.y, cameraPosition.z, cameraPosition.elevation, cameraPosition.angle);
		let viewMatrixNoElevation = utils.MakeView(cameraPosition.x, cameraPosition.y, cameraPosition.z, 0.0, cameraPosition.angle);
		let viewWorldMatrix = utils.multiplyMatrices(viewMatrix, worldMatrix);
		let projectionMatrix = utils.multiplyMatrices(perspectiveMatrix, viewWorldMatrix);
		gl.uniformMatrix4fv(locations['labProjMatrix'], gl.FALSE, utils.transposeMatrix(projectionMatrix));
		gl.drawElements(gl.TRIANGLES, mazeIndices.length, gl.UNSIGNED_SHORT, 0);

		// Movement speed
		cameraSpeed.x = acc.computeSpeed(cameraSpeed.x, cameraAcceleration.x, cameraAcceleration.xDeceleration, cameraSpeed.xMax, cameraSpeed.xMin, deltaTime);
		cameraSpeed.y = acc.computeSpeed(cameraSpeed.y, cameraAcceleration.y, cameraAcceleration.yDeceleration, cameraSpeed.yMax, cameraSpeed.yMin, deltaTime);
		cameraSpeed.z = acc.computeSpeed(cameraSpeed.z, cameraAcceleration.z, cameraAcceleration.zDeceleration, cameraSpeed.zMax, cameraSpeed.zMin, deltaTime);
		cameraSpeed.angle = acc.computeSpeed(cameraSpeed.angle, cameraAcceleration.angle, cameraAcceleration.angleDeceleration, cameraSpeed.angleMax, cameraSpeed.angleMin, deltaTime);
		cameraSpeed.elevation = acc.computeSpeed(cameraSpeed.elevation, cameraAcceleration.elevation, cameraAcceleration.elevationDeceleration, cameraSpeed.elevationMax, cameraSpeed.elevationMin, deltaTime, cameraPosition.elevation, cameraPosition.elevationMin, cameraPosition.elevationMax);
		cameraSpeed.roll = acc.computeSpeed(cameraSpeed.roll, cameraAcceleration.roll, cameraAcceleration.rollDeceleration, cameraSpeed.rollMax, cameraSpeed.rollMin, deltaTime);

		// Movement position
		cameraPosition.x -= (viewMatrixNoElevation[0] * cameraSpeed.x + viewMatrixNoElevation[4] * cameraSpeed.y + viewMatrixNoElevation[8] * cameraSpeed.z) * deltaTime;
		cameraPosition.y -= (viewMatrixNoElevation[1] * cameraSpeed.x + viewMatrixNoElevation[5] * cameraSpeed.y + viewMatrixNoElevation[9] * cameraSpeed.z) * deltaTime;
		cameraPosition.z -= (viewMatrixNoElevation[2] * cameraSpeed.x + viewMatrixNoElevation[6] * cameraSpeed.y + viewMatrixNoElevation[10] * cameraSpeed.z) * deltaTime;
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
		if (interactionHandler.keys['KeyW'] || interactionHandler.keys['KeyS']) {					// Keys W and S
			const direction = interactionHandler.keys['KeyW'] ? 1 : -1;
			cameraAcceleration.z = cameraAcceleration.zMax * direction;
		}
		if (wheel.deltaY != 0) {							// Mouse wheel vertical
			const direction = (wheel.deltaY < 0) ? 1 : -1;
			cameraAcceleration.z = cameraAcceleration.zMax * direction * wheel.Yenhancement;
			wheel.deltaY = 0;
		}
		if (interactionHandler.keys['KeyA'] || interactionHandler.keys['KeyD']) {					// Keys A and D
			const direction = interactionHandler.keys['KeyA'] ? 1 : -1;
			cameraAcceleration.x = cameraAcceleration.xMax * direction;
		}
		if (wheel.deltaX != 0) {							// Mouse wheel horizontal
			const direction = (wheel.deltaX < 0) ? 1 : -1;
			cameraAcceleration.x = cameraAcceleration.xMax * direction * wheel.Xenhancement;
			wheel.deltaX = 0;
		}
		if (interactionHandler.keys['KeyE'] || interactionHandler.keys['KeyQ']) {					// Keys Q and E
			const direction = interactionHandler.keys['KeyE'] ? 1 : -1;
			cameraAcceleration.y = cameraAcceleration.yMax * direction;
		}
		if (interactionHandler.keys['ArrowLeft'] || interactionHandler.keys['ArrowRight']) {		// Keys LEFT and RIGHT
			const direction = interactionHandler.keys['ArrowRight'] ? 1 : -1;
			cameraAcceleration.angle = cameraAcceleration.angleMax * direction;
		}
		if (interactionHandler.keys['ArrowDown'] || interactionHandler.keys['ArrowUp']) {			// Keys UP and DOWN
			const direction = interactionHandler.keys['ArrowUp'] ? 1 : -1;
			cameraAcceleration.elevation = cameraAcceleration.elevationMax * direction;
		}
		if (interactionHandler.mouse.movementX != 0) {							// Horizontal mouse movements
			cameraPosition.angle += ((interactionHandler.mouse.lastLastMovementX + interactionHandler.mouse.lastMovementX + interactionHandler.mouse.movementX) / 3.0) * cameraPosition.angleMouseCoefficient;
			interactionHandler.mouse.movementX = 0;
		}
		if (interactionHandler.mouse.movementY != 0) {							// Vertical mouse movements
			if ((cameraPosition.elevation < cameraPosition.elevationMax || interactionHandler.mouse.movementY > 0) && (cameraPosition.elevation > cameraPosition.elevationMin || interactionHandler.mouse.movementY < 0))
				cameraPosition.elevation -= ((interactionHandler.mouse.lastLastMovementY + interactionHandler.mouse.lastMovementY + interactionHandler.mouse.movementY) / 3.0) * cameraPosition.elevationMouseCoefficient;
			interactionHandler.mouse.movementY = 0;
		}

		function DrawSkybox() {
			gl.useProgram(program[1]);

			gl.activeTexture(gl.TEXTURE0);
			gl.bindTexture(gl.TEXTURE_CUBE_MAP, skyboxDayTexture);
			gl.uniform1i(locations['env_u_day_texture'], 0);

			gl.activeTexture(gl.TEXTURE0 + 1);
			gl.bindTexture(gl.TEXTURE_CUBE_MAP, skyboxNightTexture);
			gl.uniform1i(locations['env_u_night_texture'], 1);

			var viewProjMat = utils.multiplyMatrices(perspectiveMatrix, viewMatrix);
			inverseViewProjMatrix = utils.invertMatrix(viewProjMat);
			gl.uniformMatrix4fv(locations['env_inverseViewProjMatrix'], gl.FALSE, utils.transposeMatrix(inverseViewProjMatrix));

			gl.uniform1f(locations['radians_over_time'], now);

			gl.bindVertexArray(skyboxVao);
			gl.depthFunc(gl.LEQUAL);
			gl.drawArrays(gl.TRIANGLES, 0, 1 * 6);
		}
		DrawSkybox();
		// Redraw when requested
		window.requestAnimationFrame(drawScene);
	}

	// Draw when requested
	window.requestAnimationFrame(drawScene);

}

function LoadEnvironment() {
	var labToLoad = activeLevel + 1;
	skyboxVertPos = new Float32Array(
		[
			-1, -1, 1.0,
			1, -1, 1.0,
			-1, 1, 1.0,
			-1, 1, 1.0,
			1, -1, 1.0,
			1, 1, 1.0,
		]);

	skyboxVao = gl.createVertexArray();
	gl.bindVertexArray(skyboxVao);

	var positionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, skyboxVertPos, gl.STATIC_DRAW);
	gl.enableVertexAttribArray(locations['env_in_position']);
	gl.vertexAttribPointer(locations['env_in_position'], 3, gl.FLOAT, false, 0, 0);

	skyboxDayTexture = gl.createTexture();
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_CUBE_MAP, skyboxDayTexture);

	skyboxNightTexture = gl.createTexture();
	gl.activeTexture(gl.TEXTURE0 + 1);
	gl.bindTexture(gl.TEXTURE_CUBE_MAP, skyboxNightTexture);

	var envTexDir = baseDir + "resources/assets/env/" + labToLoad + "/";

	const faceInfos = [
		{
			target: gl.TEXTURE_CUBE_MAP_POSITIVE_X,
			url: envTexDir + 'miramar_right.jpg',
		},
		{
			target: gl.TEXTURE_CUBE_MAP_NEGATIVE_X,
			url: envTexDir + 'miramar_left.jpg',
		},
		{
			target: gl.TEXTURE_CUBE_MAP_POSITIVE_Y,
			url: envTexDir + 'miramar_top.jpg',
		},
		{
			target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Y,
			url: envTexDir + 'miramar_bottom.jpg',
		},
		{
			target: gl.TEXTURE_CUBE_MAP_POSITIVE_Z,
			url: envTexDir + 'miramar_back.jpg',
		},
		{
			target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Z,
			url: envTexDir + 'miramar_front.jpg',
		},
	];
	faceInfos.forEach((faceInfo) => {
		const { target, url } = faceInfo;

		// Upload the canvas to the cubemap face.
		const level = 0;
		const internalFormat = gl.RGBA;
		const width = 1024;
		const height = 1024;
		const format = gl.RGBA;
		const type = gl.UNSIGNED_BYTE;

		// setup each face so it's immediately renderable
		gl.texImage2D(target, level, internalFormat, width, height, 0, format, type, null);

		// Asynchronously load an image
		const image = new Image();
		image.src = url;
		image.addEventListener('load', function () {
			// Now that the image has loaded upload it to the texture.
			gl.activeTexture(gl.TEXTURE0);
			gl.bindTexture(gl.TEXTURE_CUBE_MAP, skyboxDayTexture);
			gl.texImage2D(target, level, internalFormat, format, type, image);
			gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
		});


	});

	const faceInfos2 = [
		{
			target: gl.TEXTURE_CUBE_MAP_POSITIVE_X,
			url: envTexDir + 'grimmnight_right.jpg',
		},
		{
			target: gl.TEXTURE_CUBE_MAP_NEGATIVE_X,
			url: envTexDir + 'grimmnight_left.jpg',
		},
		{
			target: gl.TEXTURE_CUBE_MAP_POSITIVE_Y,
			url: envTexDir + 'grimmnight_top.jpg',
		},
		{
			target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Y,
			url: envTexDir + 'grimmnight_bottom.jpg',
		},
		{
			target: gl.TEXTURE_CUBE_MAP_POSITIVE_Z,
			url: envTexDir + 'grimmnight_back.jpg',
		},
		{
			target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Z,
			url: envTexDir + 'grimmnight_front.jpg',
		},
	];
	faceInfos2.forEach((faceInfo) => {
		const { target, url } = faceInfo;

		// Upload the canvas to the cubemap face.
		const level = 0;
		const internalFormat = gl.RGBA;
		const width = 1024;
		const height = 1024;
		const format = gl.RGBA;
		const type = gl.UNSIGNED_BYTE;

		// setup each face so it's immediately renderable
		gl.texImage2D(target, level, internalFormat, width, height, 0, format, type, null);

		// Asynchronously load an image
		const image = new Image();
		image.src = url;
		image.addEventListener('load', function () {
			// Now that the image has loaded upload it to the texture.
			gl.activeTexture(gl.TEXTURE0 + 1);
			gl.bindTexture(gl.TEXTURE_CUBE_MAP, skyboxNightTexture);
			gl.texImage2D(target, level, internalFormat, format, type, image);
			gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
		});


	});
	gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
	gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);

}



function getLocations() {
	var map = {};
	map['labVertPosition'] = gl.getAttribLocation(program[0], 'labVertPosition');
	map['labVertColor'] = gl.getAttribLocation(program[0], 'labVertColor');
	map['labProjMatrix'] = gl.getUniformLocation(program[0], 'labProjMatrix');
	map['env_u_day_texture'] = gl.getUniformLocation(program[1], "env_u_day_texture");
	map['env_u_night_texture'] = gl.getUniformLocation(program[1], "env_u_night_texture");
	map['env_inverseViewProjMatrix'] = gl.getUniformLocation(program[1], "env_inverseViewProjMatrix");
	map['env_in_position'] = gl.getAttribLocation(program[1], "env_in_position");
	map['radians_over_time'] = gl.getUniformLocation(program[1], "radians_over_time");
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
			utils.loadTextResource("resources/shaders/" + labToLoad + "/labShader.vs.glsl"),
			utils.loadTextResource("resources/shaders/" + labToLoad + "/labShader.fs.glsl"),
			utils.loadTextResource("resources/shaders/" + labToLoad + "/envmap.vs.glsl"),
			utils.loadTextResource("resources/shaders/" + labToLoad + "/envmap.fs.glsl"),
			utils.loadJSONResource("resources/assets/labyrinths/lab" + labToLoad + ".json")
		])
		var labVertexShader = utils.createShader(gl, gl.VERTEX_SHADER, results[0]);
		var labFragmentShader = utils.createShader(gl, gl.FRAGMENT_SHADER, results[1]);
		var envVertexShader = utils.createShader(gl, gl.VERTEX_SHADER, results[2]);
		var envFragmentShader = utils.createShader(gl, gl.FRAGMENT_SHADER, results[3]);
		program[0] = utils.createProgram(gl, labVertexShader, labFragmentShader);
		program[1] = utils.createProgram(gl, envVertexShader, envFragmentShader);
		maze = results[4];
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
