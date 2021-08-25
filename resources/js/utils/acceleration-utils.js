/////////////////////
// ACCELERATION UTILS
/////////////////////

var acc = {

	/**
	 * Function that computes the speed of an object
	 * 
	 * @param { number } speed initial speed of the object [m/s]
	 * 
	 * @param { number } acceleration acceleration to be given to the object [m/s^2]
	 * @param { number } deceleration deceleration to be given to the object (is not a physical quantity)
	 * 
	 * @param { number } maxSpeed maximum speed the object can assume
	 * @param { number } minSpeed minimum speed the object can assume
	 * 
	 * @param { number } deltaTime time elapsed since the last time the algorithm was run
	 * 
	 * @param { number } currentPosition [optional] current position of the object
	 * @param { number } minPosition [optional] minimum position the object can assume
	 * @param { number } maxPosition [optional] maximum position the object can assume
	 * 
	 * @returns returns the new speed calculated according to the input parameters
	 */
	computeSpeed: function (speed, acceleration, deceleration, maxSpeed, minSpeed, deltaTime, currentPosition = false, minPosition = false, maxPosition = false) {
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
	},

};