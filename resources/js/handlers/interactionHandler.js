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
		x = 0.0, y = 0.0,
	};
	let wheel = {
		delta = {
			x = 0.0, y = 0.0,
		},
		enhancement = {
			x = 10.0, y = 10.0,
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
	canvas.requestPointerLock = canvas.requestPointerLock || canvas.mozRequestPointerLock;
	document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock;
	canvas.onclick = function () {
		canvas.requestPointerLock();
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
		mouse.lastLastMovementX = mouse.movementX;
		mouse.lastLastMovementY = mouse.movementY;
		mouse.lastMovementX = mouse.movementX;
		mouse.lastMovementY = mouse.movementY;
		mouse.movementX = e.movementX;
		mouse.movementY = e.movementY;
	}

	// Init mouse wheel movements
	window.addEventListener('wheel', (e) => {
		wheel.deltaX += e.deltaX;
		wheel.deltaY += e.deltaY;
	});

	/*******************
	 * Methods
	 ******************/

	function resetMouse() {
		mouse.x = 0;
		mouse.y = 0;
	}

}