/*******************
 * InteractionHandler.js
 ******************/

/**
 * Object to manage the movements of the camera
 * 
 * @param { object } camera camera object
 * @param { object } interactionHandler interactionHandler object
 */
function MovementHandler(camera, interactionHandler) {

	/*******************
	 * Constructor
	 ******************/

	if (keys['KeyW']) { camera.moveForward(); }
	if (keys['KeyS']) { camera.moveBackward(); }
	if (keys['KeyA']) { camera.moveRight(); }
	if (keys['KeyD']) { camera.moveLeft(); }
	if (keys['KeyQ']) { camera.moveUp(); }
	if (keys['KeyE']) { camera.moveDown(); }
	if (keys['ArrowRight']) { camera.rotateRight(); }
	if (keys['ArrowLeft']) { camera.rotateLeft(); }
	if (keys['ArrowUp']) { camera.rotateUp(); }
	if (keys['ArrowDown']) { camera.rotateDown(); }

	if (mouse.x != 0) {
		camera.setRotationX(interactionHandler,mouse.x);
		interactionHandler.resetMouse();
	}
	if (mouse.y != 0) {
		camera.setRotationY(interactionHandler,mouse.y);
		interactionHandler.resetMouse();
	}

}