/*******************
 * Camera.js
 ******************/

/**
 * Object to manage camera and its movements
 * 
 * @param { object } settings array containing all settings and parameters relative to the camera
 */
class Camera {

	/*******************
	 * Constructor
	 ******************/

	constructor(settings) {

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
		};
		this.speed = {
			x: this.settings.speed.x.default,
			y: this.settings.speed.y.default,
			z: this.settings.speed.z.default,
			angle: this.settings.speed.angle.default,
			elevation: this.settings.speed.elevation.default,
		};
		this.acceleration = {
			x: this.settings.acceleration.x.default,
			y: this.settings.acceleration.y.default,
			z: this.settings.acceleration.z.default,
			angle: this.settings.acceleration.angle.default,
			elevation: this.settings.acceleration.elevation.default,
		};
		this.perspectiveMatrix = utils.MakePerspective(this.settings.fovy, gl.canvas.width / gl.canvas.height, this.settings.near, this.settings.far);
		this.viewMatrix = utils.MakeView(this.position.x, this.position.y, this.position.z, this.position.elevation, this.position.angle);
		this.viewMatrixNoElevation = utils.MakeView(this.position.x, this.position.y, this.position.z, 0.0, this.position.angle, 0.0);

		this.lastRotationX = [];
		this.lastRotationY = [];
	}

	/*******************
	 * Methods
	 ******************/

	moveRight() { this.acceleration.x = this.settings.acceleration.x.max; };
	moveLeft() { this.acceleration.x = -this.settings.acceleration.x.max; };
	moveUp() { this.acceleration.y = this.settings.acceleration.y.max; };
	moveDown() { this.acceleration.y = -this.settings.acceleration.y.max; };
	moveForward() { this.acceleration.z = -this.settings.acceleration.z.max; };
	moveBackward() { this.acceleration.z = this.settings.acceleration.z.max; };

	rotateRight() { this.acceleration.angle = this.settings.acceleration.angle.max; };
	rotateLeft() { this.acceleration.angle = -this.settings.acceleration.angle.max; };
	rotateUp() { this.acceleration.elevation = this.settings.acceleration.elevation.max; };
	rotateDown() { this.acceleration.elevation = -this.settings.acceleration.elevation.max; };

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

	setRotationY(value) {
		// Limit control
		if ((this.position.elevation < this.settings.position.elevation.max || value > 0) && (this.position.elevation > this.settings.position.elevation.min || value < 0)) {
			// Smoothness
			if (this.lastRotationY.length > this.settings.position.elevation.mouseSmoothness)
				this.lastRotationY.shift();
			this.lastRotationY.push(value);
			let lastRotationSum = 0.0;
			for (let i = 0; i < this.lastRotationY.length; i++)
				lastRotationSum += this.lastRotationY[i];
			// New value
			this.position.elevation -= ((lastRotationSum + value) / this.lastRotationY.length) * this.settings.position.elevation.mouseReactivity;
			if (this.position.elevation > this.settings.position.elevation.max)
				this.position.elevation = this.settings.position.elevation.max;
			else if (this.position.elevation < this.settings.position.elevation.min)
				this.position.elevation = this.settings.position.elevation.min;
		}
	}

	/**
	 * Function to be called every time the display is updated
	 *
	 * @param { number } deltaTime time elapsed since the last idle call
	 */
	idle(deltaTime) {
		// Compute all speeds
		this.computeSpeeds(deltaTime);

		// Compute all positions
		this.computePositions(deltaTime);

		// Compute all matrices (with and without elevation, perspective)
		this.perspectiveMatrix = utils.MakePerspective(this.settings.fovy, gl.canvas.width / gl.canvas.height, this.settings.near, this.settings.far);
		this.viewMatrix = utils.MakeView(this.position.x, this.position.y, this.position.z, this.position.elevation, this.position.angle);
		this.viewMatrixNoElevation = utils.MakeView(this.position.x, this.position.y, this.position.z, 0.0, this.position.angle);

		// Reset all accelerations
		this.resetAccelerations();
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

	computePositions(deltaTime) {
		this.position.x += (this.viewMatrixNoElevation[0] * this.speed.x + this.viewMatrixNoElevation[4] * this.speed.y + this.viewMatrixNoElevation[8] * this.speed.z) * deltaTime;
		this.position.y += (this.viewMatrixNoElevation[1] * this.speed.x + this.viewMatrixNoElevation[5] * this.speed.y + this.viewMatrixNoElevation[9] * this.speed.z) * deltaTime;
		this.position.z += (this.viewMatrixNoElevation[2] * this.speed.x + this.viewMatrixNoElevation[6] * this.speed.y + this.viewMatrixNoElevation[10] * this.speed.z) * deltaTime;
		this.position.angle += this.speed.angle * deltaTime;
		this.position.elevation += this.speed.elevation * deltaTime;
	}

}