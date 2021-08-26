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
	let scope=this;

	// Init keyboard keydown
	window.addEventListener('keydown', (e) => {
		scope.keys[e.code] = true;
		e.preventDefault();
	});
	// Init keyboard keyup
	window.addEventListener('keyup', (e) => {
		scope.keys[e.code] = false;
		e.preventDefault();
	});

	// Init pointer lock
	gl.canvas.requestPointerLock = gl.canvas.requestPointerLock || gl.canvas.mozRequestPointerLock;
	document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock;
	gl.canvas.onclick = function () {
		gl.canvas.requestPointerLock();
	}
	document.addEventListener('pointerlockchange', scope.lockChangeAlert, false);
	document.addEventListener('mozpointerlockchange', scope.lockChangeAlert, false);
	this.lockChangeAlert=function() {
		if (document.pointerLockElement === gl.canvas ||
			document.mozPointerLockElement === gl.canvas) {
			window.addEventListener('mousemove', scope.onMouseMove, false);
		} else {
			window.removeEventListener("mousemove", scope.onMouseMove, false);
		}
	}

	// Init mouse move function
	this.onMouseMove=function(e) {
		scope.mouse.x = e.movementX;
		scope.mouse.x = e.movementY;
	}

	// Init mouse wheel movements
	window.addEventListener('wheel', (e) => {
		scope.wheel.delta.x += e.deltaX;
		scope.wheel.delta.y += e.deltaY;
	});

	/*******************
	 * Methods
	 ******************/

	this.resetMouse = function() {
		scope.mouse.x = 0;
		scope.mouse.y = 0;
	}

}