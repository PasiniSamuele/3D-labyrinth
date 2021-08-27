/*******************
 * SceneHandler.js
 ******************/

/**
 * Object to manage the main rendering loop
 */
class SceneHandler {

	/*******************
	 * Constructor
	 ******************/

	constructor(movementHandler, interactionHandler) {

		this.then = 0;
		this.level;
		this.movementHandler = movementHandler;
		this.interactionHandler = interactionHandler;

	}

	drawScene(now) {

		// Get current time
		now *= 0.001; // seconds;
		let deltaTime = now - this.then;
		this.then = now;


		utils.resizeCanvasToDisplaySize(gl.canvas);
		gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
		gl.clearColor(1, 1, 1, 0);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		gl.enable(gl.DEPTH_TEST);
		gl.enable(gl.CULL_FACE);
		gl.frontFace(gl.CCW);
		gl.cullFace(gl.BACK);

		// TODO: MAXIMUM CALL STACK EXCEEDED NON ATTRIBUIBILE AD ALCUNA DELLE FUNZIONI CHIAMATE, BENSI' AL LOOP CHIAMANTE
		
		//console.log(this.level.camera.lastRotationY);
		
		// MovementHandler object idle
		let movementHandlerRet = this.movementHandler.idle(this.level.camera, this.interactionHandler);
		this.level.camera = movementHandlerRet.camera;
		this.interactionHandler = movementHandlerRet.interactionHandler;

		// Camera object idle
		this.level.camera.idle(deltaTime);
		
		// InteractionHandler onject idle
		this.interactionHandler.idle();


		// Perspective, World Matrix
		let perspectiveMatrix = this.level.camera.perspectiveMatrix;
		let viewMatrix = this.level.camera.viewMatrix;

		/*console.log(perspectiveMatrix);
		console.log(viewMatrix);*/

		this.level.skybox.draw(now, perspectiveMatrix, viewMatrix);
		this.level.labyrinth.draw(perspectiveMatrix, viewMatrix);

		//this.drawScene(Date.now(), this);
		//window.requestAnimationFrame(scope.drawScene(Date.now(), this));
		window.requestAnimationFrame((newNow) => { this.drawScene(newNow); });
	}

	setLevel(level) {
		this.level = level;
	}
	start() {
		//this.drawScene(Date.now(), this);
		//window.requestAnimationFrame(this.drawScene(Date.now(), this));
		window.requestAnimationFrame((newNow) => { this.drawScene(newNow); });
	}

	// TODO VERIFICARE SE E' SUPERFLUO
	//this.setLevel(level);
}