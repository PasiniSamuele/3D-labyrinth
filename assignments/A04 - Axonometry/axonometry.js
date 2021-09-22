function axonometry() {
	// Make an isometric view, w = 50, a = 16/9, n = 1, f = 101.
	var A1 =  getOrthProjMatrix(50, 16/9, 1, 101);

	A1 = utils.multiplyMatrices(A1, utils.MakeRotateXMatrix(35.26));

	A1 = utils.multiplyMatrices(A1, utils.MakeRotateYMatrix(45));
			   
	// Make a dimetric view, w = 50, a = 16/9, n = 1, f = 101, rotated 20 around the x-axis
	var A2 =  getOrthProjMatrix(50, 16/9, 1, 101);

	A2 = utils.multiplyMatrices(A2, utils.MakeRotateXMatrix(20));

	A2 = utils.multiplyMatrices(A2, utils.MakeRotateYMatrix(45));
			   
	// Make a trimetric view, w = 50, a = 16/9, n = 1, f = 101, rotated -30 around the x-axis and 30 around the y-axis
	var A3 =  getOrthProjMatrix(50, 16/9, 1, 101);

	A3 = utils.multiplyMatrices(A3, utils.MakeRotateXMatrix(-30));

	A3 = utils.multiplyMatrices(A3, utils.MakeRotateYMatrix(30));
			   
	// Make an cavalier projection view, w = 50, a = 16/9, n = 1, f = 101, at 45 degrees
	var O1 =  getOrthProjMatrix(50, 16/9, 1, 101);

	O1 = utils.multiplyMatrices(O1, utils.MakeShearZMatrix(-Math.cos(Math.PI/4), -Math.sin(Math.PI/4)));

	// Make a cabinet projection view, w = 50, a = 16/9, n = 1, f = 101, at 60 degrees
	var O2 =  getOrthProjMatrix(50, 16/9, 1, 101);

	O2 = utils.multiplyMatrices(O2, utils.MakeShearZMatrix(-0.5*Math.cos(Math.PI/3), -0.5*Math.sin(Math.PI/3)));

	return [A1, A2, A3, O1, O2];
}

function getOrthProjMatrix(w, a, n, f) {
	return [1/w,	0.0,		0.0,		0.0,
		0.0,		a/w,		0.0,		0.0,
		0.0,		0.0,		-2/(f-n),		-(f+n)/(f-n),
		0.0,		0.0,		0.0,		1.0];
}