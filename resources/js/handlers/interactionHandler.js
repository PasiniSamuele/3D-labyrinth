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
	let keys = {};
	let mouse = {
		x: 0.0, y: 0.0,
	};
	let wheel = {
		delta: {
			x: 0.0, y: 0.0,
		},
		enhancement: {
			x: 10.0, y: 10.0,
		},
	};

	// Init keyboard keydown
	window.addEventListener('keydown', (e) => {
		keys[e.code] = true;
		console.log(e);
		e.preventDefault();
	});
	// Init keyboard keyup
	window.addEventListener('keyup', (e) => {
		keys[e.code] = false;
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
		mouse.x = e.movementX;
		mouse.x = e.movementY;
	}

	// Init mouse wheel movements
	window.addEventListener('wheel', (e) => {
		wheel.delta.x += e.deltaX;
		wheel.delta.y += e.deltaY;
	});

	/*******************
	 * Methods
	 ******************/

	function resetMouse() {
		mouse.x = 0;
		mouse.y = 0;
	}

}