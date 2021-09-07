/*******************
 * InteractionHandler.js
 ******************/

/**
 * Object to manage the movements of the camera
 */
class MovementHandler {

	constructor(){
		this.blocked=false;
	}
	/*******************
	 * Methods
	 ******************/

	/**
	 * Function to be called every time the display is updated
	 *
	 * @param { object } camera camera object
	 * @param { object } interactionHandler interactionHandler object
	 * @param { object } light light object
	 *
	 * @returns { object } returns an associative array containing the new "camera" and "interactionHandler" objects
	 */
	idle(camera, interactionHandler, light) {
		// Keys recognition
		if(!this.blocked){
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
			if (interactionHandler.keys['KeyL']) {
				if (light.ignition.lastTime + light.ignition.switchTime < Date.now() / 1000) {
					light.ignition.value = !light.ignition.value;
					light.ignition.lastTime = Date.now() / 1000;
				}
			}
		}
		// Mouse movements recognition
		if (interactionHandler.mouse.x != 0) {
			if(!this.blocked)
				camera.setRotationX(interactionHandler.mouse.x);
		}
		if (interactionHandler.mouse.y != 0) {
			if(!this.blocked)
				camera.setRotationY(interactionHandler.mouse.y);
		}
		// Return camera, interactionHandler, light
		return { "camera": camera, "interactionHandler": interactionHandler, "light": light };
	}

}