var bool = 10;
// Returns the transform matrix obtained interpolating the given positions and angles
function InterpMat(
				tx1, ty1, tz1, rx1, ry1, rz1,
			    tx2, ty2, tz2, rx2, ry2, rz2,
			    a) {
	// tx1, ty1, tz1	-> Initial position
	// rx1, ry1, rz1	-> Initial rotation (in Euler angles)
	// tx2, ty2, tz2	-> Final position
	// rx2, ry2, rz2	-> Final rotation (in Euler angles)
	// a (in 0..1 range)	-> Interpolation coefficient
	//
	// return the interpolated transform matrix with the given position and rotation
	
	let q1 = Quaternion.fromEuler(utils.degToRad(rz1), utils.degToRad(rx1), utils.degToRad(ry1));
	let q2 = Quaternion.fromEuler(utils.degToRad(rz2), utils.degToRad(rx2), utils.degToRad(ry2));

	let q = q1.slerp(q2)(a);

	out = utils.multiplyMatrices(
		utils.MakeTranslateMatrix(lerp(tx1, tx2, a), lerp(ty1, ty2, a), lerp(tz1, tz2, a)),
		q.toMatrix4()
	);

	return out;			   
}

function lerp(a, b, alpha){
	return a*(1-alpha) + b*alpha;
}

