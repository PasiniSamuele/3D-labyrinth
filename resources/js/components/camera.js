/*******************
 * Camera.js
 ******************/

/**
 * Object to manage camera and its movements
 */
class Camera {

	/**
	 * Constructor
	 * 
	 * @param { object } settings array containing all settings and parameters relative to the camera
	 */
	constructor(settings) {

		/*******************
		 * Attributes
		 ******************/

		// Camera settings
		this.settings = settings;
		// Position
		this.position = {
			x: this.settings.position.x.default,
			y: this.settings.position.y.default,
			z: this.settings.position.z.default,
			angle: this.settings.position.angle.default,
			elevation: this.settings.position.elevation.default,
		};
		// Speed
		this.speed = {
			x: this.settings.speed.x.default,
			y: this.settings.speed.y.default,
			z: this.settings.speed.z.default,
			angle: this.settings.speed.angle.default,
			elevation: this.settings.speed.elevation.default,
			absolute: {
				x: 0.0, y: 0.0, z: 0.0,
				buffer: { x: false, y: false, z: false }
			}
		};
		// Acceleration
		this.acceleration = {
			x: this.settings.acceleration.x.default,
			y: this.settings.acceleration.y.default,
			z: this.settings.acceleration.z.default,
			angle: this.settings.acceleration.angle.default,
			elevation: this.settings.acceleration.elevation.default,
		};
		// Matrices
		this.perspectiveMatrix = utils.MakePerspective(this.settings.fovy, gl.canvas.width / gl.canvas.height, this.settings.near, this.settings.far);
		this.viewMatrix = utils.MakeView(this.position.x, this.position.y, this.position.z, this.position.elevation, this.position.angle);
		this.viewMatrixNoElevation = utils.MakeView(this.position.x, this.position.y, this.position.z, 0.0, this.position.angle, 0.0);
		// Rotation smoothness vector
		this.lastRotationX = [];
		this.lastRotationY = [];
		// DEBUG PARAMETERS
		this.DEBUG = true;
	}

	/*******************
	 * Methods
	 ******************/

	/**
	 * Move the camera right
	 */
	moveRight() {
		this.acceleration.x = this.settings.acceleration.x.max;
		/*this.acceleration.x += this.viewMatrixNoElevation[0] * this.settings.acceleration.x.max;
		this.acceleration.y += this.viewMatrixNoElevation[1] * this.settings.acceleration.x.max;
		this.acceleration.z += this.viewMatrixNoElevation[2] * this.settings.acceleration.x.max;*/
	};

	/**
	 * Move the camera left
	 */
	moveLeft() {
		this.acceleration.x = -this.settings.acceleration.x.max;
		/*this.acceleration.x += this.viewMatrixNoElevation[0] * -this.settings.acceleration.x.max;
		this.acceleration.y += this.viewMatrixNoElevation[1] * -this.settings.acceleration.x.max;
		this.acceleration.z += this.viewMatrixNoElevation[2] * -this.settings.acceleration.x.max;*/
	};

	/**
	 * Move the camera up
	 */
	moveUp() {
		if (this.DEBUG) {
			this.acceleration.y = this.settings.acceleration.y.max;
			/*this.acceleration.x += this.viewMatrixNoElevation[4] * this.settings.acceleration.y.max;
			this.acceleration.y += this.viewMatrixNoElevation[5] * this.settings.acceleration.y.max;
			this.acceleration.z += this.viewMatrixNoElevation[6] * this.settings.acceleration.y.max;*/
		}
	};

	/**
	 * Move the camera down
	 */
	moveDown() {
		if (this.DEBUG) {
			this.acceleration.y = -this.settings.acceleration.y.max;
			/*this.acceleration.x += this.viewMatrixNoElevation[4] * -this.settings.acceleration.y.max;
			this.acceleration.y += this.viewMatrixNoElevation[5] * -this.settings.acceleration.y.max;
			this.acceleration.z += this.viewMatrixNoElevation[6] * -this.settings.acceleration.y.max;*/
		}
	};

	/**
	 * Move the camera forward
	 */
	moveForward() {
		this.acceleration.z = -this.settings.acceleration.z.max;
		/*this.acceleration.x += this.viewMatrixNoElevation[8] * -this.settings.acceleration.z.max;
		this.acceleration.y += this.viewMatrixNoElevation[9] * -this.settings.acceleration.z.max;
		this.acceleration.z += this.viewMatrixNoElevation[10] * -this.settings.acceleration.z.max;*/
	};

	/**
	 * Move the camera backward
	 */
	moveBackward() {
		this.acceleration.z = this.settings.acceleration.z.max;
		/*this.acceleration.x += this.viewMatrixNoElevation[8] * this.settings.acceleration.z.max;
		this.acceleration.y += this.viewMatrixNoElevation[9] * this.settings.acceleration.z.max;
		this.acceleration.z += this.viewMatrixNoElevation[10] * this.settings.acceleration.z.max;*/
	};

	/**
	 * Rotate the camera right
	 */
	rotateRight() { this.acceleration.angle = this.settings.acceleration.angle.max; };

	/**
	 * Rotate the camera left
	 */
	rotateLeft() { this.acceleration.angle = -this.settings.acceleration.angle.max; };

	/**
	 * Rotate the camera up
	 */
	rotateUp() { this.acceleration.elevation = this.settings.acceleration.elevation.max; };

	/**
	 * Rotate the camera down
	 */
	rotateDown() { this.acceleration.elevation = -this.settings.acceleration.elevation.max; };

	/**
	 * Set an arbitrary camera rotation (x-axis)
	 * 
	 * @param { number } value number of pixels equal to the deviation of the mouse from the central point of the x-axis (-inf, +inf) [pixel]
	 */
	setRotationX(value) {
		// Smoothness
		if (this.lastRotationX.length > this.settings.position.angle.mouseSmoothness)
			this.lastRotationX.shift();
		this.lastRotationX.push(value);
		let lastRotationSum = 0.0;
		for (let i = 0; i < this.lastRotationX.length; i++)
			lastRotationSum += this.lastRotationX[i];
		// New value
		this.position.angle += ((lastRotationSum + value) / this.lastRotationX.length) * this.settings.position.angle.mouseReactivity;
	}

	/**
	 * Set an arbitrary camera rotation (y-axis)
	 * 
	 * @param { number } value number of pixels equal to the deviation of the mouse from the central point of the y-axis (-inf, +inf) [pixel]
	 */
	setRotationY(value) {
		// Limit control
		if (this.DEBUG || (this.position.elevation < this.settings.position.elevation.max || value > 0) && (this.position.elevation > this.settings.position.elevation.min || value < 0)) {
			// Smoothness
			if (this.lastRotationY.length > this.settings.position.elevation.mouseSmoothness)
				this.lastRotationY.shift();
			this.lastRotationY.push(value);
			let lastRotationSum = 0.0;
			for (let i = 0; i < this.lastRotationY.length; i++)
				lastRotationSum += this.lastRotationY[i];
			// New value
			this.position.elevation -= ((lastRotationSum + value) / this.lastRotationY.length) * this.settings.position.elevation.mouseReactivity;
			// Clamp
			if (this.position.elevation > this.settings.position.elevation.max)
				this.position.elevation = this.settings.position.elevation.max;
			else if (this.position.elevation < this.settings.position.elevation.min)
				this.position.elevation = this.settings.position.elevation.min;
		}
	}

	/**
	 * Function to be called every time the display is updated
	 *
	 * @param { number } deltaTime time in seconds elapsed since the last idle call (0, +inf) [seconds]
	 */
	idle(deltaTime) {
		// Compute all speeds
		this.computeSpeeds(deltaTime);

		// Convert speeds in absolute coordinate
		this.computeAbsoluteSpeed();

		// If there is an absolute speed in buffer
		this.deBufferizeAbsoluteSpeed();

		// Convert speeds in absolute coordinate
		this.computeRelativeSpeed();

		// Compute all positions
		this.computePositions(deltaTime);

		// Compute all matrices (with and without elevation, perspective)
		this.perspectiveMatrix = utils.MakePerspective(this.settings.fovy, gl.canvas.width / gl.canvas.height, this.settings.near, this.settings.far);
		this.viewMatrix = utils.MakeView(this.position.x, this.position.y, this.position.z, this.position.elevation, this.position.angle);
		this.viewMatrixNoElevation = utils.MakeView(this.position.x, this.position.y, this.position.z, 0.0, this.position.angle);

		// Reset all accelerations
		this.resetAccelerations();
	}

	/**
	 * Function that sets absolute speeds to an arbitrary value
	 * 
	 * @param {boolean} x absolute speed to overwrite
	 * @param {boolean} y absolute speed to overwrite
	 * @param {boolean} z absolute speed to overwrite
	 */
	setAbsoluteSpeed(x = false, y = false, z = false) {
		// Set the new the absolute speeds to an arbitrary value
		if (x !== false)
			this.speed.absolute.buffer.x = 0.0;
		if (y !== false)
			this.speed.absolute.buffer.y = 0.0;
		if (z !== false)
			this.speed.absolute.buffer.z = 0.0;
	}

	/*******************
	 * Private
	 ******************/

	resetAccelerations() {
		this.acceleration.x = 0.0;
		this.acceleration.y = 0.0;
		this.acceleration.z = 0.0;
		this.acceleration.angle = 0.0;
		this.acceleration.elevation = 0.0;
	}

	computeAbsoluteSpeed() {
		this.speed.absolute.x = this.viewMatrixNoElevation[0] * this.speed.x + this.viewMatrixNoElevation[4] * this.speed.y + this.viewMatrixNoElevation[8] * this.speed.z;
		this.speed.absolute.y = this.viewMatrixNoElevation[1] * this.speed.x + this.viewMatrixNoElevation[5] * this.speed.y + this.viewMatrixNoElevation[9] * this.speed.z;
		this.speed.absolute.z = this.viewMatrixNoElevation[2] * this.speed.x + this.viewMatrixNoElevation[6] * this.speed.y + this.viewMatrixNoElevation[10] * this.speed.z;
	}

	deBufferizeAbsoluteSpeed() {
		if (this.speed.absolute.buffer.x !== false) {
			this.speed.absolute.x = this.speed.absolute.buffer.x;
			this.speed.absolute.buffer.x = false;
		}
		if (this.speed.absolute.buffer.y !== false) {
			this.speed.absolute.y = this.speed.absolute.buffer.y;
			this.speed.absolute.buffer.y = false;
		}
		if (this.speed.absolute.buffer.z !== false) {
			this.speed.absolute.z = this.speed.absolute.buffer.z;
			this.speed.absolute.buffer.z = false;
		}
	}

	computeRelativeSpeed() {
		let viewMatrixNoElevationT = utils.invertMatrix(this.viewMatrixNoElevation);
		this.speed.x = viewMatrixNoElevationT[0] * this.speed.absolute.x + viewMatrixNoElevationT[4] * this.speed.absolute.y + viewMatrixNoElevationT[8] * this.speed.absolute.z;
		this.speed.y = viewMatrixNoElevationT[1] * this.speed.absolute.x + viewMatrixNoElevationT[5] * this.speed.absolute.y + viewMatrixNoElevationT[9] * this.speed.absolute.z;
		this.speed.z = viewMatrixNoElevationT[2] * this.speed.absolute.x + viewMatrixNoElevationT[6] * this.speed.absolute.y + viewMatrixNoElevationT[10] * this.speed.absolute.z;
	}

	computeSpeeds(deltaTime) {
		this.speed.x = this.computeSpeed(this.speed.x, this.acceleration.x, this.settings.acceleration.x.decelerationCoefficient, this.settings.speed.x.max, this.settings.speed.x.min, deltaTime);
		this.speed.y = this.computeSpeed(this.speed.y, this.acceleration.y, this.settings.acceleration.y.decelerationCoefficient, this.settings.speed.y.max, this.settings.speed.y.min, deltaTime);
		this.speed.z = this.computeSpeed(this.speed.z, this.acceleration.z, this.settings.acceleration.z.decelerationCoefficient, this.settings.speed.z.max, this.settings.speed.z.min, deltaTime);
		this.speed.angle = this.computeSpeed(this.speed.angle, this.acceleration.angle, this.settings.acceleration.angle.decelerationCoefficient, this.settings.speed.angle.max, this.settings.speed.angle.min, deltaTime);
		this.speed.elevation = this.computeSpeed(this.speed.elevation, this.acceleration.elevation, this.settings.acceleration.elevation.decelerationCoefficient, this.settings.speed.elevation.max, this.settings.speed.elevation.min, deltaTime, this.position.elevation, this.settings.position.elevation.min, this.settings.position.elevation.max);
	}

	computeSpeed(speed, acceleration, deceleration, maxSpeed, minSpeed, deltaTime, currentPosition = false, minPosition = false, maxPosition = false) {
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
		if (acceleration == 0 || Math.sign(acceleration) != Math.sign(speed))
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

	computePositions(deltaTime) {
		let oldx = this.position.x;
		let oldz = this.position.z;
		let newx = this.position.x + (this.viewMatrixNoElevation[0] * this.speed.x + this.viewMatrixNoElevation[4] * this.speed.y + this.viewMatrixNoElevation[8] * this.speed.z) * deltaTime;
		let newz = this.position.z + (this.viewMatrixNoElevation[2] * this.speed.x + this.viewMatrixNoElevation[6] * this.speed.y + this.viewMatrixNoElevation[10] * this.speed.z) * deltaTime;

		let newPositions = collisionHandler.checkCameraCollision(oldx, newx, oldz, newz);

		this.position.x = newPositions.x;
		this.position.y += (this.viewMatrixNoElevation[1] * this.speed.x + this.viewMatrixNoElevation[5] * this.speed.y + this.viewMatrixNoElevation[9] * this.speed.z) * deltaTime;
		this.position.z = newPositions.z;
		/*this.position.x += this.speed.x * deltaTime;
		this.position.y += this.speed.y * deltaTime;
		this.position.z += this.speed.z * deltaTime;*/
		this.position.angle += this.speed.angle * deltaTime;
		this.position.elevation += this.speed.elevation * deltaTime;
	}

}