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

	this.moveRight = function() { this.acceleration.x = this.settings.acceleration.x.max; }
	this.moveLeft = function() { this.acceleration.x = -this.settings.acceleration.x.max; }
	this.moveUp = function() { this.acceleration.y = this.settings.acceleration.y.max; }
	this.moveDown = function() { this.acceleration.y = -this.settings.acceleration.y.max; }
	this.moveForward = function() { this.acceleration.z = this.settings.acceleration.z.max; }
	this.moveBackward = function() {this. acceleration.z = -this.settings.acceleration.z.max; }

	this.rotateRight = function() { this.acceleration.angle = this.settings.acceleration.angle.max }
	this.rotateLeft = function() { this.acceleration.angle = -this.settings.acceleration.angle.max }
	this.rotateUp = function() { this.acceleration.elevation = this.settings.acceleration.elevation.max; }
	this.rotateDown = function() { this.acceleration.elevation = -this.settings.acceleration.elevation.max; }

	this.lastRotationX = [];
	this.setRotationX = function(value) {
		// Smoothness
		if (this.lastRotationX > this.settings.position.angle.mouseSmoothness)
			this.lastRotationX.shift();
		this.lastRotationX.push(value);
		this.lastRotationSum = 0.0;
		for (let i = 0; i < this.lastRotationX.length; i++)
			this.lastRotationSum += this.lastRotationX[i];
		// New value
		this.position.angle += ((this.lastRotationSum + value) / this.lastRotationX.length) * this.settings.position.angle.mouseReactivity;
	}

	this.lastRotationY = [];
	this.setRotationY = function(value) {
		// Limit control
		if ((this.position.elevation < this.settings.position.elevation.max || value > 0) && (this.position.elevation > this.settings.position.elevation.max || value < 0)) {
			// Smoothness
			if (this.lastRotationY > this.settings.position.elevation.mouseSmoothness)
				this.lastRotationY.shift();
			this.lastRotationY.push(value);
			this.lastRotationSum = 0.0;
			for (let i = 0; i < this.lastRotationY.length; i++)
				this.lastRotationSum += this.lastRotationY[i];
			// New value
			this.position.elevation += ((this.lastRotationSum + value) / this.lastRotationY.length) * this.settings.elevation.angle.mouseReactivity;
		}
	}

	/**
	 * Function to be called every time the display is updated
	 * 
	 * @param { number } deltaTime time elapsed since the last idle call
	 */
	this.idle = function(deltaTime) {
		// Compute all speeds
		this.computeSpeeds(deltaTime);

		// Compute all positions
		this.computePositions(deltaTime);

		// Compute all matrices (with and without elevation, perspective)
		this.perspectiveMatrix = computePerspectiveMatrix();
		this.viewMatrix = computeViewMatrix();
		this.viewMatrixNoElevation = computeViewMatrixNoElevation();

		// Reset all accelerations
		this.resetAccelerations();
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
		this.speed.x = this.computeSpeed(this.speed.x, this.acceleration.x, this.settings.acceleration.x.decelerationCoefficient, this.settings.speed.x.max, this.settings.speed.x.min, deltaTime);
		this.speed.y = this.computeSpeed(this.speed.y, this.acceleration.y, this.settings.acceleration.y.decelerationCoefficient, this.settings.speed.y.max, this.settings.speed.y.min, deltaTime);
		this.speed.z = this.computeSpeed(this.speed.z, this.acceleration.z, this.settings.acceleration.z.decelerationCoefficient, this.settings.speed.z.max, this.settings.speed.z.min, deltaTime);
		this.speed.angle = this.computeSpeed(this.speed.angle, this.acceleration.angle, this.settings.acceleration.angle.decelerationCoefficient, this.settings.speed.angle.max, this.settings.speed.angle.min, deltaTime);
		this.speed.elevation = this.computeSpeed(this.speed.elevation, this.acceleration.elevation, this.settings.acceleration.elevation.decelerationCoefficient, this.settings.speed.elevation.max, this.settings.speed.elevation.min, deltaTime, this.position.elevation, this.settings.position.elevation.min, this.settings.position.elevation.max);
	}

	this.computePositions = function(deltaTime) {
		this.position.x -= (this.viewMatrixNoElevation[0] * this.speed.x + this.viewMatrixNoElevation[4] * this.speed.y + this.viewMatrixNoElevation[8] * this.speed.z) * deltaTime;
		this.position.y -= (this.viewMatrixNoElevation[1] * this.speed.x + this.viewMatrixNoElevation[5] * this.speed.y + this.viewMatrixNoElevation[9] * this.speed.z) * deltaTime;
		this.position.z -= (this.viewMatrixNoElevation[2] * this.speed.x + this.viewMatrixNoElevation[6] * this.speed.y + this.viewMatrixNoElevation[10] * this.speed.z) * deltaTime;
		this.position.angle += this.speed.angle * deltaTime;
		this.position.elevation += this.speed.elevation * deltaTime;
	}

	this.computeViewMatrix = function() {
		this.viewMatrix = utils.MakeView(this.position.x, this.position.y, this.position.z, this.position.angle, this.position.elevation);
	}

	this.computeViewMatrixNoElevation = function() {
		this.viewMatrixNoElevation = utils.MakeView(this.position.x, this.position.y, this.position.z, this.position.angle, this.position.elevation);
	}

	this.computePerspectiveMatrix = function() {
		this.perspectiveMatrix = utils.MakePerspective(this.settings.fovy, gl.canvas.width / gl.canvas.height, this.settings.near, this.settings.far);
	}

}