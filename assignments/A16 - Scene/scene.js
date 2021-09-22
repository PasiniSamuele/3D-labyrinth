
function drawSceneTree(S, i = 0, parentWorld = utils.identityMatrix()) {
	let transformMatrix = utils.multiplyMatrices(
		parentWorld,
		utils.multiplyMatrices(
			utils.multiplyMatrices(
				utils.multiplyMatrices(
					 utils.MakeTranslateMatrix(S[i][0], S[i][1], S[i][2]),		//x y z of the element
					 utils.MakeRotateZMatrix(S[i][5]),			//rotation z
				),
				utils.MakeRotateXMatrix(S[i][3]),					// rotation x
			),
			utils.MakeRotateYMatrix(S[i][4])						// rotation y
		)
	);

	draw(i, transformMatrix);

	if(S[i][6] != -1 || S[i][7] != -1) 					//not leaves
		for(let j = S[i][6]; j <= S[i][7]; j++) {		//for all children
			drawSceneTree(S, j, transformMatrix);	
		}
}