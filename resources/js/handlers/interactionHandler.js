/*******************
 * InteractionHandler.js
 ******************/

/**
 * Object to manage all the interaction with inputs
 */
class InteractionHandler {

	/**
	 * Constructor
	 */
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
			// Avoid special keys
			if (e.code[0] != 'F' && e.code[0] != 'E' && !e.shiftKey && !e.ctrlKey && !e.altKey) {
				this.keys[e.code] = true;
				e.preventDefault();
			}
		});
		// Init keyboard keyup
		window.addEventListener('keyup', (e) => {
			// Avoid special keys
			if (e.code[0] != 'F' && e.code[0] != 'E' && !e.shiftKey && !e.ctrlKey && !e.altKey) {
				this.keys[e.code] = false;
				e.preventDefault();
			}
		});

		// Init pointer lock
		this.pointerLockBool = false;
		gl.canvas.requestPointerLock = gl.canvas.requestPointerLock || gl.canvas.mozRequestPointerLock;
		gl.canvas.exitPointerLock = gl.canvas.exitPointerLock || gl.canvas.mozExitPointerLock;
		gl.canvas.onclick = function () {
			if (!this.pointerLockBool) {
				gl.canvas.requestPointerLock();
			}
		};
		document.addEventListener('pointerlockchange', (e) => this.lockChangeAlert(e), true);
		document.addEventListener('mozpointerlockchange', (e) => this.lockChangeAlert(e), true);

		// Function needed to get an asynchronous, non-anonymous function call that can read the attributes of the class
		this.onMouseMoveHandler;
	}

	/*******************
	 * Methods
	 ******************/

	/**
	 * Function to be called at each cycle of the program
	 */
	idle() {
		// Reset mouse movements
		this.mouse.x = 0;
		this.mouse.y = 0;
	}

	/*******************
	 * Private
	 ******************/

	// Init mouse move function
	onMouseMove(e) {
		this.mouse.x = e.movementX;
		this.mouse.y = e.movementY;
	}

	// Init mouse wheel movements
	onMouseWheelMove(e) {
		this.wheel.delta.x += e.deltaX;
		this.wheel.delta.y += e.deltaY;
	}

	// Init pointer lock
	lockChangeAlert(e) {
		if (document.pointerLockElement === gl.canvas ||
			document.mozPointerLockElement === gl.canvas) {
			if (!this.pointerLockBool) {
				this.pointerLockBool = true;
				window.addEventListener('mousemove', this.onMouseMoveHandler = ((e) => { this.onMouseMove(e); }), false);
			}
		} else {
			this.pointerLockBool = false;
			window.removeEventListener("mousemove", this.onMouseMoveHandler, false);
		}
	}

}