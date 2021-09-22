function view() {
	// Make a Look-In-Direction matrix centered at (5,2.5,0), looking west and aiming 30 degrees down.
	var A1 = getLookInViewMatrix(5, 2.5, 0, 90, -30, 0);
			   
	// Make a Look-In-Direction matrix centered at (0,-1,-5), angled 170 degrees, with an elevation of 15 degrees, and a roll of 45 degrees.
	var A2 = getLookInViewMatrix(0, -1, -5, 170, 15, 45);
			   
	// Make a Look-At-Matrix, centered at (-4, 2, -4), aiming at (0,0.5,0.5) and with up-vector (0,1,0).
	var A3 = getLookAtViewMatrix(-4, 2, -4, 0, 0.5, 0.5, 0, 1, 0)
			   
	// Make a Look-At-Matrix, centered at (2.57, 0, 0), aiming at (2.8,0,-1) and with up-vector (1,0,0).
	var A4 = getLookAtViewMatrix(2.57, 0, 0, 2.8, 0, -1, 1, 0, 0)

	return [A1, A2, A3, A4];
}

function getLookInCameraMatrix(x,y,z,a,b,c){
	return utils.multiplyMatrices(
		utils.multiplyMatrices(
			utils.multiplyMatrices(
				utils.MakeTranslateMatrix(x,y,z),
				utils.MakeRotateYMatrix(a)
			),
			utils.MakeRotateXMatrix(b)
		),
		utils.MakeRotateZMatrix(c)
	);
}

function getLookInViewMatrix(x,y,z,a,b,c){
	return utils.invertMatrix(getLookInCameraMatrix(x,y,z,a,b,c));
}

function getLookAtCameraMatrix(cx,cy,cz,ax,ay,az,ux,uy,uz){

	let vz = utils.normalizeVector3([cx-ax,cy-ay,cz-az]);

	let vx = utils.normalizeVector3(utils.crossVector([ux,uy,uz],vz));

	let vy = utils.crossVector(vz,vx);

	return [vx[0],		vy[0],		vz[0],		cx,
		vx[1],		vy[1],		vz[1],		cy,
		vx[2],		vy[2],		vz[2],		cz,
		0.0,		0.0,		0.0,		1.0];
}

function getLookAtViewMatrix(cx,cy,cz,ax,ay,az,ux,uy,uz){
	return utils.invertMatrix(getLookAtCameraMatrix(cx,cy,cz,ax,ay,az,ux,uy,uz));
}