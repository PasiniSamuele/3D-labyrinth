function Anim1(t) {
	// moving car
	var out = utils.multiplyMatrices(
		utils.MakeTranslateMatrix(t%0.25,0.5,0),
		utils.MakeScaleNuMatrix(0.25, 0.25,1.0),
	);
	return out;
}

function Anim2(t) {
	// bumping code
	//NORMAL SOLUTION
	var out = utils.multiplyMatrices(
		utils.MakeTranslateMatrix(0.75,0.5+(t%0.5<0.25?t%0.5:0.5-t%0.5),0),
		utils.MakeScaleNuMatrix(0.25, 0.25,1.0),
	);
	/*
	//BOING BOING SOLUTION
	var out = utils.multiplyMatrices(
		utils.MakeTranslateMatrix(0.75,0.75+0.25*(-1)*Math.abs(Math.sin(Math.PI*2*t)),0),
		utils.MakeScaleNuMatrix(0.25, 0.25,1.0),
	);*/
	/*
	//SINE WAVE SOLUTION
	var out = utils.multiplyMatrices(
		utils.MakeTranslateMatrix(0.75,0.625+0.125*Math.sin(Math.PI*2*t),0),
		utils.MakeScaleNuMatrix(0.25, 0.25,1.0),
	);*/
	return out;
}

function Anim3(t) {
	// rotating fan
	var out = utils.multiplyMatrices(
		utils.MakeTranslateMatrix(0.625,0.875,0.0),
		utils.multiplyMatrices(
			utils.MakeRotateZMatrix(360*t),
			utils.multiplyMatrices(
				utils.invertMatrix(utils.MakeTranslateMatrix(0.625,0.875,0.0)),
				utils.multiplyMatrices(
					utils.MakeTranslateMatrix(0.5,0.75,0),
					utils.MakeScaleNuMatrix(0.25, 0.25,1.0)
				)
			)
		)
	);
	return out;
}

function Anim4(t) {
	t = t*72;

	let x = 0.0 + (1.0/12.0)*Math.floor(t%12);
	let y = (5.0/12.0) - (1.0/12.0)*Math.floor(t/12.0);
	// buring flame
	var out = utils.multiplyMatrices(
		utils.MakeTranslateMatrix(x,y,0.0),
		utils.MakeScaleNuMatrix(1.0/12.0, 1.0/12.0,1.0),
	);
	return out;
}
