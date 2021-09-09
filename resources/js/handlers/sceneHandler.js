/********************************
 * 
 * SceneHandler.js
 * 
 *******************************/

/**
 * Object to manage the main rendering loop
 */
class SceneHandler {

	/**
	 * Constructor
	 * @param { object } movementHandler movementHandler object
	 * @param { object } interactionHandler interactionHandler object
	 */
	constructor(movementHandler, interactionHandler) {
		this.then = 0;
		this.level;
		this.movementHandler = movementHandler;
		this.interactionHandler = interactionHandler;
		this.levelHandler = levelHandler;
		this.animate = false;
		this.animations = {
			cameraToMonkey: {
				startTime: 0,
				startPosition: {},
				endPosition: [],
				duration: 0,
				endAngle: 0
			},
			takeMonkey: {
				startTime: 0,
				startPosition: [],
				endPosition: [],
				duration: 0
			}
		};
		gl.enable(gl.CULL_FACE);
		gl.cullFace(gl.BACK);
	}

	/**
	 * Function responsible for drawing and calculating input parameters, motion, etc. It calls itself automatically
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
		gl.frontFace(gl.CCW);

		if (this.animate) {
			this.activeAnimation();
			if (!this.animate) return;
		} else {
			// MovementHandler object idle
			let movementHandlerRet = this.movementHandler.idle(this.level.camera, this.interactionHandler, this.level.character.light);
			this.level.camera = movementHandlerRet.camera;
			this.interactionHandler = movementHandlerRet.interactionHandler;
			this.level.character.light = movementHandlerRet.light;
		}

		// Camera object idle
		this.level.camera.idle(deltaTime);

		// InteractionHandler onject idle
		this.interactionHandler.idle();

		// Perspective, World Matrix
		let perspectiveMatrix = this.level.camera.perspectiveMatrix;
		let viewMatrix = this.level.camera.viewMatrix;

		// Draw
		this.level.draw(now, perspectiveMatrix, viewMatrix);

		// Make the next call
		if (!this.animate && this.levelHandler.finished()) {
			this.animate = true;
			this.setupCameraToMonkey();
			this.activeAnimation = this.cameraToMonkey;
		}

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

	/********************************
	 * Private
	 *******************************/

	setupCameraToMonkey() {
		this.animations.cameraToMonkey.startTime = this.then;
		this.animations.cameraToMonkey.startPosition = this.level.camera.position;
		let angle = this.animations.cameraToMonkey.startPosition.angle;
		this.animations.cameraToMonkey.startPosition.angle = (angle < 0) ? -(-angle) % 360 + 360 : angle % 360;
		this.animations.cameraToMonkey.endPosition = labyrinthUtils.getEndingPositionWithOffset(this.level.labyrinth.structure2D, 0.3);
		this.animations.cameraToMonkey.endAngle = labyrinthUtils.getFinalAngle(this.level.labyrinth.structure2D) + 180;
		if (this.animations.cameraToMonkey.endAngle - this.animations.cameraToMonkey.startPosition.angle > 180)
			this.animations.cameraToMonkey.endAngle -= 360;
		this.animations.cameraToMonkey.duration = 4.0;
	}

	cameraToMonkey() {
		let percentage = utils.getAnimationPercentage(this.animations.cameraToMonkey.duration, this.animations.cameraToMonkey.startTime, this.then);
		if (percentage > 1.0) {
			this.setupTakeMonkey();
			this.activeAnimation = this.takeMonkey;
			return;
		}
		this.level.camera.position.x = utils.lerp(this.animations.cameraToMonkey.startPosition.x, this.animations.cameraToMonkey.endPosition[1], percentage / 10);
		this.level.camera.position.y = utils.lerp(this.animations.cameraToMonkey.startPosition.y, 0.5, percentage / 10);
		this.level.camera.position.z = utils.lerp(this.animations.cameraToMonkey.startPosition.z, this.animations.cameraToMonkey.endPosition[0], percentage / 10);
		this.level.camera.position.angle = utils.lerp(this.animations.cameraToMonkey.startPosition.angle, this.animations.cameraToMonkey.endAngle, percentage / 10);
		this.level.camera.position.elevation = utils.lerp(this.animations.cameraToMonkey.startPosition.elevation, 0.0, percentage / 10);
	}

	setupTakeMonkey() {
		this.animations.takeMonkey.startTime = this.then;
		this.animations.takeMonkey.endPosition = labyrinthUtils.getEndingPositionWithOffset(this.level.labyrinth.structure2D, 0.5);
		this.animations.takeMonkey.duration = 1.0;
	}

	async takeMonkey() {
		let percentage = utils.getAnimationPercentage(this.animations.takeMonkey.duration, this.animations.takeMonkey.startTime, this.then);
		if (percentage > 1.0) {
			this.animate = false;
			this.activeAnimation = false;
			let level = await loadingHandler.loadNextLevel();
			this.animate = false;
			main(level);
			return;
		}
		this.level.labyrinth.children[2].animateModel(
			this.animations.takeMonkey.endPosition[1],
			0.5,
			this.animations.takeMonkey.endPosition[0],
			percentage
		);
	}

}