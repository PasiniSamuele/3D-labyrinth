/*******************
 * InteractionHandler.js
 ******************/

/**
 * Object to manage the movements of the camera
 */
class MovementHandler {

	/*******************
	 * Constructor
	 ******************/

	constructor() {

	}

	/*******************
	 * Methods
	 ******************/

	/**
	 * Function to be called every time the display is updated
	 *
	 * @param { object } camera camera object
	 * @param { object } interactionHandler interactionHandler object
	 *
	 * @returns the new camera object
	 */
	idle(camera, interactionHandler) {

		if (interactionHandler.keys['KeyW']) { camera.moveForward(); }
		if (interactionHandler.keys['KeyS']) { camera.moveBackward(); }
		if (interactionHandler.keys['KeyD']) { camera.moveRight(); }
		if (interactionHandler.keys['KeyA']) { camera.moveLeft(); }
		if (interactionHandler.keys['KeyQ']) { camera.moveUp(); }
		if (interactionHandler.keys['KeyE']) { camera.moveDown(); }
		if (interactionHandler.keys['ArrowRight']) { camera.rotateRight(); }
		if (interactionHandler.keys['ArrowLeft']) { camera.rotateLeft(); }
		if (interactionHandler.keys['ArrowUp']) { camera.rotateUp(); }
		if (interactionHandler.keys['ArrowDown']) { camera.rotateDown(); }

		if (interactionHandler.mouse.x != 0) {
			camera.setRotationX(interactionHandler.mouse.x);
			interactionHandler.resetMouse();
		}
		if (interactionHandler.mouse.y != 0) {
			camera.setRotationY(interactionHandler.mouse.y);
			interactionHandler.resetMouse();
		}
		// Return camera and interactionHandler
		return { "camera": camera, "interactionHandler": interactionHandler };
	}

}