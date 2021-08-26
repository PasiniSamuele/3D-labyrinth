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
		x: settings.position.x.default,
		y: settings.position.y.default,
		z: settings.position.z.default,
		angle: settings.position.angle.default,
		elevation: settings.position.elevation.default,
	}
	this.speed = {
		x: settings.speed.x.default,
		y: settings.speed.y.default,
		z: settings.speed.z.default,
		angle: settings.speed.angle.default,
		elevation: settings.speed.elevation.default,
	}
	this.acceleration = {
		x: settings.acceleration.x.default,
		y: settings.acceleration.y.default,
		z: settings.acceleration.z.default,
		angle: settings.acceleration.angle.default,
		elevation: settings.acceleration.elevation.default,
	}
	this.viewMatrix;
	this.viewMatrixNoElevation/* = computeViewMatrixNoElevation()*/;
	this.perspectiveMatrix/* = computePerspectiveMatrix()*/;

	/*******************
	 * Methods
	 ******************/

	this.moveRight = function() { acceleration.x = settings.acceleration.x.max; }
	this.moveLeft = function() { acceleration.x = -settings.acceleration.x.max; }
	this.moveUp = function() { acceleration.y = settings.acceleration.y.max; }
	this.moveDown = function() { acceleration.y = -settings.acceleration.y.max; }
	this.moveForward = function() { acceleration.z = settings.acceleration.z.max; }
	this.moveBackward = function() { acceleration.z = -settings.acceleration.z.max; }

	this.rotateRight = function() { acceleration.angle = settings.acceleration.angle.max }
	this.rotateLeft = function() { acceleration.angle = -settings.acceleration.angle.max }
	this.rotateUp = function() { acceleration.elevation = settings.acceleration.elevation.max; }
	this.rotateDown = function() { acceleration.elevation = -settings.acceleration.elevation.max; }

	this.lastRotationX = [];
	this.setRotationX = function(value) {
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
	this.setRotationY = function(value) {
		// Limit control
		if ((position.elevation < settings.position.elevation.max || value > 0) && (position.elevation > settings.position.elevation.max || value < 0)) {
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
	}

	/**
	 * Function to be called every time the display is updated
	 * 
	 * @param { number } deltaTime time elapsed since the last idle call
	 */
	this.idle = function(deltaTime) {
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

	this.computeSpeed = function(speed, acceleration, deceleration, maxSpeed, minSpeed, deltaTime, currentPosition = false, minPosition = false, maxPosition = false) {
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

	this.resetAccelerations = function() {
		this.acceleration.x = 0.0;
		this.acceleration.y = 0.0;
		this.acceleration.z = 0.0;
		this.acceleration.angle = 0.0;
		this.acceleration.elevation = 0.0;
	}

	this.computeSpeeds = function(deltaTime) {
		this.speed.x = computeSpeed(speed.x, acceleration.x, settings.acceleration.x.decelerationCoefficient, settings.speed.x.max, settings.speed.x.min, deltaTime);
		this.speed.y = computeSpeed(speed.y, acceleration.y, settings.acceleration.y.decelerationCoefficient, settings.speed.y.max, settings.speed.y.min, deltaTime);
		this.speed.z = computeSpeed(speed.z, acceleration.z, settings.acceleration.z.decelerationCoefficient, settings.speed.z.max, settings.speed.z.min, deltaTime);
		this.speed.angle = computeSpeed(speed.angle, acceleration.angle, settings.acceleration.angle.decelerationCoefficient, settings.speed.angle.max, settings.speed.angle.min, deltaTime);
		this.speed.elevation = computeSpeed(speed.elevation, acceleration.elevation, settings.acceleration.elevation.decelerationCoefficient, settings.speed.elevation.max, settings.speed.elevation.min, deltaTime, position.elevation, settings.position.elevation.min, settings.position.elevation.max);
	}

	this.computePositions = function(deltaTime) {
		position.x -= (viewMatrixNoElevation[0] * speed.x + viewMatrixNoElevation[4] * speed.y + viewMatrixNoElevation[8] * speed.z) * deltaTime;
		position.y -= (viewMatrixNoElevation[1] * speed.x + viewMatrixNoElevation[5] * speed.y + viewMatrixNoElevation[9] * speed.z) * deltaTime;
		position.z -= (viewMatrixNoElevation[2] * speed.x + viewMatrixNoElevation[6] * speed.y + viewMatrixNoElevation[10] * speed.z) * deltaTime;
		position.angle += speed.angle * deltaTime;
		position.elevation += speed.elevation * deltaTime;
	}

	this.computeViewMatrix = function() {
		viewMatrix = utils.MakeView(position.x, position.y, position.z, position.angle, position.elevation);
	}

	this.computeViewMatrixNoElevation = function() {
		viewMatrixNoElevation = utils.MakeView(position.x, position.y, position.z, position.angle, position.elevation);
	}

	this.computePerspectiveMatrix = function() {
		perspectiveMatrix = utils.MakePerspective(settings.fovy, gl.canvas.width / gl.canvas.height, settings.near, settings.far);
	}

}