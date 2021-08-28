/*******************
 * SceneHandler.js
 ******************/

/**
 * Object to manage the main rendering loop
 */
class SceneHandler {

	/**
	 * Constructor
	 *
	 * @param { object } movementHandler movementHandler object
	 * @param { object } interactionHandler interactionHandler object
	 */
	constructor(movementHandler, interactionHandler) {
		// Attributes
		this.then = 0;
		this.level;
		this.movementHandler = movementHandler;
		this.interactionHandler = interactionHandler;
	}

	/**
	 * Function responsible for drawing and calculating input parameters, motion, etc. It calls itself automatically
	 *
	 * @param { number } now current timestamp in milliseconds (0, +inf) [milliseconds]
	 */
	drawScene(now) {

		// Get deltaTime in seconds
		now *= 0.001; // Seconds
		let deltaTime = now - this.then;
		this.then = now;

		// Set gl parameters
		utils.resizeCanvasToDisplaySize(gl.canvas);
		gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
		gl.clearColor(1, 1, 1, 0);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		gl.enable(gl.DEPTH_TEST);
		gl.enable(gl.CULL_FACE);
		gl.frontFace(gl.CCW);
		gl.cullFace(gl.BACK);
		
		// MovementHandler object idle
		let movementHandlerRet = this.movementHandler.idle(this.level.camera, this.interactionHandler);
		this.level.camera = movementHandlerRet.camera;
		this.interactionHandler = movementHandlerRet.interactionHandler;

		// Camera object idle
		this.level.camera.idle(deltaTime);

		this.level.camera.setAbsoluteSpeed(false, false, 0);
		
		// InteractionHandler onject idle
		this.interactionHandler.idle();

		// Perspective, World Matrix
		let perspectiveMatrix = this.level.camera.perspectiveMatrix;
		let viewMatrix = this.level.camera.viewMatrix;

		// Draw
		this.level.skybox.draw(now, perspectiveMatrix, viewMatrix);
		this.level.labyrinth.draw(perspectiveMatrix, viewMatrix);

		// Make the next call
		window.requestAnimationFrame((newNow) => { this.drawScene(newNow); });
	}

	/**
	 * Function to set the current level of the game. The "level" object contains all parameters, including movement, camera, objects, etc.
	 *
	 * @param { object } level Object layer, which contains the numerous parameters necessary for the operation of the drawing function and the game logic
	 */
	setLevel(level) {
		this.level = level;
	}

	/**
	 * Function to start the main loop
	 */
	start() {
		// Make the first call
		window.requestAnimationFrame((newNow) => { this.drawScene(newNow); });
	}
	
}