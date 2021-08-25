/*******************
 * InteractionHandler.js
 ******************/

/**
 * Object to manage the movements of the camera
 */
function MovementHandler() {

	/*******************
	 * Methods
	 ******************/

	/**
	 * Function to be called every time the display is updated
	 * 
	 * @param { object } camera camera object
	 * 
	 * @returns the new camera object
	 */
	function idle(camera) {
		if (interactionHandler.keys['KeyW']) { camera.moveForward(); }
		if (interactionHandler.keys['KeyS']) { camera.moveBackward(); }
		if (interactionHandler.keys['KeyA']) { camera.moveRight(); }
		if (interactionHandler.keys['KeyD']) { camera.moveLeft(); }
		if (interactionHandler.keys['KeyQ']) { camera.moveUp(); }
		if (interactionHandler.keys['KeyE']) { camera.moveDown(); }
		if (interactionHandler.keys['ArrowRight']) { camera.rotateRight(); }
		if (interactionHandler.keys['ArrowLeft']) { camera.rotateLeft(); }
		if (interactionHandler.keys['ArrowUp']) { camera.rotateUp(); }
		if (interactionHandler.keys['ArrowDown']) { camera.rotateDown(); }

		if (interactionHandler.mouse.x != 0) {
			camera.setRotationX(interactionHandler, interactionHandler.mouse.x);
			interactionHandler.resetMouse();
		}
		if (interactionHandler.mouse.y != 0) {
			camera.setRotationY(interactionHandler, interactionHandler.mouse.y);
			interactionHandler.resetMouse();
		}
		// Return the camera
		return camera;
	}

}