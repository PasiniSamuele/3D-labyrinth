// these global variables are used to contain the current angles of the world
// HERE YOU WILL HAVE TO ADD ONE OR MORE GLOBAL VARIABLES TO CONTAIN THE ORIENTATION
// OF THE OBJECT



// this function returns the world matrix with the updated rotations.
// parameters rvx, rvy and rvz contains a value in the degree that how much the object rotates in the given direction.

Pitch = 0;
Yaw = 0;
Roll = 0;
globalQuaternion = Quaternion.fromEuler(Roll, Pitch, Yaw)

function updateWorld(rvx, rvy, rvz) {

	globalQuaternion= Quaternion.fromEuler(utils.degToRad(rvz), utils.degToRad(rvx), utils.degToRad(rvy)).mul(globalQuaternion);
	return globalQuaternion.toMatrix4();

}

