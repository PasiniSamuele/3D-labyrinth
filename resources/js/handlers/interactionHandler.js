/*******************
 * InteractionHandler.js
 ******************/

/**
 * Object to manage all the interaction with inputs
 */
function InteractionHandler() {

	/*******************
	 * Constructor
	 ******************/

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

	// Init pointer lock
	gl.canvas.requestPointerLock = gl.canvas.requestPointerLock || gl.canvas.mozRequestPointerLock;
	document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock;
	gl.canvas.onclick = function () {
		gl.canvas.requestPointerLock();
	}
	document.addEventListener('pointerlockchange', lockChangeAlert, false);
	document.addEventListener('mozpointerlockchange', lockChangeAlert, false);
	function lockChangeAlert() {
		if (document.pointerLockElement === canvas ||
			document.mozPointerLockElement === canvas) {
			window.addEventListener('mousemove', onMouseMove, false);
		} else {
			window.removeEventListener("mousemove", onMouseMove, false);
		}
	}

	// Init mouse move function
	function onMouseMove(e) {
		this.mouse.x = e.movementX;
		this.mouse.x = e.movementY;
	}

	// Init mouse wheel movements
	window.addEventListener('wheel', (e) => {
		this.wheel.delta.x += e.deltaX;
		this.wheel.delta.y += e.deltaY;
	});

	/*******************
	 * Methods
	 ******************/

	this.resetMouse = function() {
		this.mouse.x = 0;
		this.mouse.y = 0;
	}

}