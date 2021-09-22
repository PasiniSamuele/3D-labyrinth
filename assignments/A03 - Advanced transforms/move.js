function move() {
	// Rotate 60 degrees around an arbitrary axis passing through (0,1,-1). The x-axis can be aligned to the arbitrary axis after a rotation of 45 degrees around the z-axis, and then 15 degrees around the y-axis.

	//translation matrix
	var R1a =[1.0,		0.0,		0.0,		0.0,
			   0.0,		1.0,		0.0,		1.0,
			   0.0,		0.0,		1.0,		-1.0,
			   0.0,		0.0,		0.0,		1.0];	
			   
	//rotation of 15 around y axis
	var R1b =[Math.cos(utils.degToRad(15)),		0.0,		Math.sin(utils.degToRad(15)),		0.0,
			   0.0,		1.0,		0.0,		0.0,
			   -Math.sin(utils.degToRad(15)),		0.0,		Math.cos(utils.degToRad(15)),		0.0,
			   0.0,		0.0,		0.0,		1.0];

	//rotation of 45 around z axis
	var R1c = [Math.cos(utils.degToRad(45)),		-Math.sin(utils.degToRad(45)),		0.0,		0.0,
				Math.sin(utils.degToRad(45)),		Math.cos(utils.degToRad(45)),		0.0,		0.0,
			   0.0,		0.0,		1.0,		0.0,
			   0.0,		0.0,		0.0,		1.0];	
	
	//rotation of 60 around arbitrary axis
	var R1d = [1.0,		0.0,		0.0,		0.0,
			   0.0,		Math.cos(utils.degToRad(60)),		-Math.sin(utils.degToRad(60)),		0.0,
			   0.0,		Math.sin(utils.degToRad(60)),		Math.cos(utils.degToRad(60)),		0.0,
			   0.0,		0.0,		0.0,		1.0];

	//final matrix
	var R1 = utils.multiplyMatrices(
		utils.multiplyMatrices(
			utils.multiplyMatrices(
				utils.multiplyMatrices(
					utils.multiplyMatrices(
						utils.multiplyMatrices(
							R1a,
							R1b
						),
						R1c
					),
					R1d
				),
				utils.invertMatrix(R1c)
			),
			utils.invertMatrix(R1b)
		),
		utils.invertMatrix(R1a));

	// Half the size of the object along a line that bisects the positive x and y axes on the xy-plane. 

	//rotation of 45 around z axis (align x on the bisection of xy)
	var S1a = [Math.cos(utils.degToRad(45)),		-Math.sin(utils.degToRad(45)),		0.0,		0.0,
		Math.sin(utils.degToRad(45)),		Math.cos(utils.degToRad(45)),		0.0,		0.0,
			   0.0,		0.0,		1.0,		0.0,
			   0.0,		0.0,		0.0,		1.0];
	
	//scaling
	var S1b =  [0.5,		0.0,		0.0,		0.0,
			   0.0,		1.0,		0.0,		0.0,
			   0.0,		0.0,		1.0,		0.0,
			   0.0,		0.0,		0.0,		1.0];
	
	var S1 = utils.multiplyMatrices(
		utils.multiplyMatrices(
			S1a, 
			S1b
		),
		utils.invertMatrix(S1a)
	);
			   
	// Mirror the starship along a plane passing through (1,1,1), and obtained rotating 15 degree around the x axis the xz plane

	
	 //translation 
	 var S2b=  [1.0,		0.0,		0.0,		1.0,
				0.0,		1.0,		0.0,		1.0,
				0.0,		0.0,		1.0,		1.0,
				0.0,		0.0,		0.0,		1.0];

	//rotation of 15 around x axis
	var S2a =  [1.0,		0.0,		0.0,		0.0,
			   0.0,		Math.cos(utils.degToRad(15)),		-Math.sin(utils.degToRad(15)),		0.0,
			   0.0,		Math.sin(utils.degToRad(15)),		Math.cos(utils.degToRad(15)),		0.0,
			   0.0,		0.0,		0.0,		1.0];
	
	
			   //mirroring
	var S2c =  [1.0,		0.0,		0.0,		0.0,
		0.0,		-1.0,		0.0,		0.0,
		0.0,		0.0,		1.0,		0.0,
		0.0,		0.0,		0.0,		1.0];
	
		var S2 = utils.multiplyMatrices(
			utils.multiplyMatrices(
				utils.multiplyMatrices(
					utils.multiplyMatrices(
						S2b,
						S2a
					),
					S2c
				),
				utils.invertMatrix(S2a)
			),
			utils.invertMatrix(S2b)
		);

	// Apply the inverse of the following sequence of transforms: rotation of 30 degree around the Y axis then Translation of (0, 0, 5), and finally a uniform scaling of a factor of 3.

	//scaling
	var I1a =  [1/3,		0.0,		0.0,		0.0,
			   0.0,		1/3,		0.0,		0.0,
			   0.0,		0.0,		1/3,		0.0,
			   0.0,		0.0,		0.0,		1.0];
	//translation
	var I1b =  [1.0,		0.0,		0.0,		0.0,
				0.0,		1.0,		0.0,		0.0,
				0.0,		0.0,		1.0,		-5.0,
				0.0,		0.0,		0.0,		1.0];
	
	//rotation
	var I1c =  [Math.cos(utils.degToRad(-30)),		0.0,		Math.sin(utils.degToRad(-30)),		0.0,
					0.0,		1.0,		0.0,		0.0,
					-Math.sin(utils.degToRad(-30)),		0.0,		Math.cos(utils.degToRad(-30)),		0.0,
					0.0,		0.0,		0.0,		1.0];

	var I1 = utils.multiplyMatrices(
		utils.multiplyMatrices(
			I1c,
			I1b
		),
		I1a
	);


	return [R1, S1, S2, I1];

}

