/*******************
 * InteractionHandler.js
 ******************/

/**
 * Object to manage all the interaction with inputs
 */
class InteractionHandler {

	/*******************
	 * Constructor
	 ******************/

	constructor() {

		// Interaction attributes
		this.keys = {};
		this.mouse = {
			x: 0.0, y: 0.0,
		};
		this.wheel = {
			delta: {
				x: 0.0, y: 0.0,
			},
			enhancement: {
				x: 10.0, y: 10.0,
			},
		};

		// Init keyboard keydown
		window.addEventListener('keydown', (e) => {
			this.keys[e.code] = true;
			e.preventDefault();
		});
		// Init keyboard keyup
		window.addEventListener('keyup', (e) => {
			this.keys[e.code] = false;
			e.preventDefault();
		});

		// Init mouse move function
		this.onMouseMove = function (e) {
			this.mouse.x = e.movementX;
			this.mouse.x = e.movementY;
		}

		// Init mouse wheel movements
		this.onMouseWheelMove = function (e) {
			this.wheel.delta.x += e.deltaX;
			this.wheel.delta.y += e.deltaY;
		}

		// Init pointer lock
		gl.canvas.requestPointerLock = gl.canvas.requestPointerLock || gl.canvas.mozRequestPointerLock;
		document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock;
		gl.canvas.onclick = function () {
			gl.canvas.requestPointerLock();
		};
		document.addEventListener('pointerlockchange', lockChangeAlert, false);
		document.addEventListener('mozpointerlockchange', lockChangeAlert, false);
		function lockChangeAlert() {
			if (document.pointerLockElement === gl.canvas ||
				document.mozPointerLockElement === gl.canvas) {
				window.addEventListener('mousemove', this.onMouseMove, false);
				window.addEventListener('wheel', this.onMouseWheelMove, false);
			} else {
				window.removeEventListener("mousemove", this.onMouseMove, false);
				window.removeEventListener("wheel", this.onMouseWheelMove, false);
			}
		}

	}

	/*******************
	 * Methods
	 ******************/

	resetMouse() {
		this.mouse.x = 0;
		this.mouse.y = 0;
	}

}