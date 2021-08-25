/*******************
 * Camera.js
 ******************/

/**
 * Object to manage camera and its movements
 * 
 * @param { object } settings array containing all settings and parameters relative to the camera
 */
function Camera(settings) {

	/*******************
	 * Attributes
	 ******************/

	// Movement parameters
	this.settings = settings;

	// Attributes
	this.position = {
		x: this.settings.position.x.default,
		y: this.settings.position.y.default,
		z: this.settings.position.z.default,
		angle: this.settings.position.angle.default,
		elevation: this.settings.position.elevation.default,
	}
	this.speed = {
		x: this.settings.speed.x.default,
		y: this.settings.speed.y.default,
		z: this.settings.speed.z.default,
		angle: this.settings.speed.angle.default,
		elevation: this.settings.speed.elevation.default,
	}
	this.acceleration = {
		x: this.settings.acceleration.x.default,
		y: this.settings.acceleration.y.default,
		z: this.settings.acceleration.z.default,
		angle: this.settings.acceleration.angle.default,
		elevation: this.settings.acceleration.elevation.default,
	}
	this.viewMatrix = computeViewMatrix();
	this.viewMatrixNoElevation = computeViewMatrixNoElevation();
	this.perspectiveMatrix = computePerspectiveMatrix();

	/*******************
	 * Functions
	 ******************/

	function moveRight() { acceleration.x = settings.acceleration.x.max; }
	function moveLeft() { acceleration.x = -settings.acceleration.x.max; }
	function moveUp() { acceleration.y = settings.acceleration.y.max; }
	function moveDown() { acceleration.y = -settings.acceleration.y.max; }
	function moveForward() { acceleration.z = settings.acceleration.z.max; }
	function moveBackward() { acceleration.z = -settings.acceleration.z.max; }

	function rotateRight() { acceleration.angle = settings.acceleration.angle.max }
	function rotateLeft() { acceleration.angle = -settings.acceleration.angle.max }
	function rotateUp() { acceleration.elevation = settings.acceleration.elevation.max; }
	function rotateDown() { acceleration.elevation = -settings.acceleration.elevation.max; }

	this.lastRotationX = [];
	function setRotationX(value) {
		// Smoothness
		if (lastRotationX > settings.position.angle.mouseSmoothness)
			lastRotationX.shift();
		lastRotationX.push(value);
		lastRotationSum = 0.0;
		for (let i = 0; i < lastRotationX.length; i++)
			lastRotationSum += lastRotationX[i];
		// New value
		position.angle += ((lastRotationSum + value) / lastRotationX.length) * settings.position.angle.mouseReactivity;
	}

	this.lastRotationY = [];
	function setRotationY(value) {
		// Limit control
		if ((position.elevation < settings.position.elevation.max || mouse.movementY > 0) && (position.elevation > settings.position.elevation.max || mouse.movementY < 0))
		// Smoothness
		if (lastRotationY > settings.position.elevation.mouseSmoothness)
			lastRotationY.shift();
		lastRotationY.push(value);
		lastRotationSum = 0.0;
		for (let i = 0; i < lastRotationY.length; i++)
			lastRotationSum += lastRotationY[i];
		// New value
		position.elevation += ((lastRotationSum + value) / lastRotationY.length) * settings.elevation.angle.mouseReactivity;
	}

	/**
	 * Function to be called every time the display is updated
	 * 
	 * @param { number } deltaTime time elapsed since the last idle call
	 */
	function idle(deltaTime) {
		// Compute all speeds
		computeSpeeds(deltaTime);

		// Compute all positions
		computePositions(deltaTime);

		// Compute all matrices (with and without elevation, perspective)
		perspectiveMatrix = computePerspectiveMatrix();
		viewMatrix = computeViewMatrix();
		viewMatrixNoElevation = computeViewMatrixNoElevation();

		// Reset all accelerations
		resetAccelerations();
	}

	/*******************
	 * Private
	 ******************/

	function computeSpeed(speed, acceleration, deceleration, maxSpeed, minSpeed, deltaTime, currentPosition = false, minPosition = false, maxPosition = false) {
		// If max or min position [optional]
		if (currentPosition !== false && maxPosition !== false && minPosition !== false)
			if (currentPosition > maxPosition && acceleration > 0) {
				acceleration = 0.0;
			} else if (currentPosition < minPosition && acceleration < 0) {
				acceleration = 0.0;
			}
		// Acceleration
		speed += acceleration * deltaTime;
		// Max speed
		if (speed > maxSpeed || speed < -maxSpeed)
			speed = maxSpeed * Math.sign(speed);
		// Deceleration
		if (acceleration == 0)
			if (Math.abs(speed) > minSpeed)
				if (Math.abs(speed) > Math.abs(deltaTime * Math.pow(speed, 2) * Math.sign(speed) * deceleration))
					speed -= deltaTime * Math.pow(speed, 2) * Math.sign(speed) * deceleration;
				else
					speed = 0.0;
			else
				speed = 0.0;
		// End
		return speed;
	}

	function resetAccelerations() {
		acceleration.x = 0.0;
		acceleration.y = 0.0;
		acceleration.z = 0.0;
		acceleration.angle = 0.0;
		acceleration.elevation = 0.0;
	}

	function computeSpeeds(deltaTime) {
		speed.x = computeSpeed(speed.x, acceleration.x, settings.acceleration.x.decelerationCoefficient, settings.speed.x.max, settings.speed.x.min, deltaTime);
		speed.y = computeSpeed(speed.y, acceleration.y, settings.acceleration.y.decelerationCoefficient, settings.speed.y.max, settings.speed.y.min, deltaTime);
		speed.z = computeSpeed(speed.z, acceleration.z, settings.acceleration.z.decelerationCoefficient, settings.speed.z.max, settings.speed.z.min, deltaTime);
		speed.angle = computeSpeed(speed.angle, acceleration.angle, settings.acceleration.angle.decelerationCoefficient, settings.speed.angle.max, settings.speed.angle.min, deltaTime);
		speed.elevation = computeSpeed(speed.elevation, acceleration.elevation, settings.acceleration.elevation.decelerationCoefficient, settings.speed.elevation.max, settings.speed.elevation.min, deltaTime, position.elevation, settings.position.elevation.min, settings.position.elevation.max);
	}

	function computePositions(deltaTime) {
		position.x -= (viewMatrixNoElevation[0] * speed.x + viewMatrixNoElevation[4] * speed.y + viewMatrixNoElevation[8] * speed.z) * deltaTime;
		position.y -= (viewMatrixNoElevation[1] * speed.x + viewMatrixNoElevation[5] * speed.y + viewMatrixNoElevation[9] * speed.z) * deltaTime;
		position.z -= (viewMatrixNoElevation[2] * speed.x + viewMatrixNoElevation[6] * speed.y + viewMatrixNoElevation[10] * speed.z) * deltaTime;
		position.angle += speed.angle * deltaTime;
		position.elevation += speed.elevation * deltaTime;
	}

	function computeViewMatrix() {
		viewMatrix = utils.MakeView(position.x, position.y, position.z, position.angle, position.elevation);
	}

	function computeViewMatrixNoElevation() {
		viewMatrixNoElevation = utils.MakeView(position.x, position.y, position.z, position.angle, position.elevation);
	}

	function computePerspectiveMatrix() {
		perspectiveMatrix = utils.MakePerspective(settings.fovy, gl.canvas.width / gl.canvas.height, settings.near, settings.far);
	}

}