
function buildGeometry() {
	var i,j;
	// Draws a pyramid --- To complete for the assignment. This is just the one in Assignment 13, where two 0.1, 0.1 UV components have been added to the vertices definitions. Such number must be replaced (differently for each vertexes), to obtain a proper Egyptian Pyramid
		var vert1 = [[0.0,1.0,0.0, 0.0, 0.4472,-0.8944, 0.625, 0.5],[ 1.0,-1.0,-1.0, 0.0, 0.4472,-0.8944, 0.75, 0.25],[-1.0,-1.0,-1.0, 0.0, 0.4472,-0.8944, 0.5, 0.25],
				 [0.0,1.0,0.0, 0.8944, 0.4472,0.0, 0.625, 0.5],[ 1.0,-1.0, 1.0, 0.8944, 0.4472,0.0, 0.75, 0.25],[ 1.0,-1.0,-1.0, 0.8944, 0.4472,0.0, 0.5, 0.25], 
				 [0.0,1.0,0.0, 0.0, 0.4472,0.8944, 0.625, 0.25],[-1.0,-1.0, 1.0, 0.0, 0.4472,0.8944, 0.5, 0.0],[ 1.0,-1.0, 1.0, 0.0, 0.4472,0.8944, 0.75, 0.0], 
				 [0.0,1.0,0.0, -0.8944, 0.4472,0.0, 0.875, 0.5],[-1.0,-1.0,-1.0, -0.8944, 0.4472,0.0, 0.75, 0.25],[-1.0,-1.0, 1.0, -0.8944, 0.4472,0.0, 1.0, 0.25], 
				 [-1.0,-1.0,-1.0, 0.0,-1.0,0.0, 0.75,0.0],[1.0,-1.0,-1.0, 0.0,-1.0,0.0, 1.0,0.0], [1.0,-1.0,1.0, 0.0,-1.0,0.0, 1.0,0.25], [-1.0,-1.0,1.0, 0.0,-1.0,0.0, 0.75,0.25]
				];
	var ind1 = [0, 1, 2,  3, 4, 5,  6, 7, 8,  9, 10, 11,  12, 13, 14,  12, 14, 15];
	var color1 = [0.0, 0.0, 1.0];
	
	addMesh(vert1, ind1, color1);
	
	// Draws a cube -- To do for the assignment.
	var vert2 = [	[-1.0,-1.0,-1.0, 0.0,0.0,-1.0, 0.125,1.0], [1.0,-1.0,-1.0, 0.0,0.0,-1.0, 0.25,1.0], [1.0,1.0,-1.0, 0.0,0.0,-1.0, 0.25,0.875], [-1.0,1.0,-1.0, 0.0,0.0,-1.0, 0.125,0.875],
					[-1.0,-1.0,1.0, 0.0,0.0,1.0, 0.125,0.625], [1.0,-1.0,1.0, 0.0,0.0,1.0, 0.25,0.625], [1.0,1.0,1.0, 0.0,0.0,1.0, 0.25,0.75], [-1.0,1.0,1.0, 0.0,0.0,1.0, 0.125,0.75],
					[-1.0,-1.0,-1.0, 0.0,-1.0,0.0, 0.125,0.5], [1.0,-1.0,-1.0, 0.0,-1.0,0.0, 0.25,0.5], [1.0,-1.0,1.0, 0.0,-1.0,0.0, 0.25,0.625], [-1.0,-1.0,1.0, 0.0,-1.0,0.0, 0.125,0.625],
					[-1.0,1.0,-1.0, 0.0,1.0,0.0, 0.125,0.875], [1.0,1.0,-1.0, 0.0,1.0,0.0, 0.25,0.875], [1.0,1.0,1.0, 0.0,1.0,0.0, 0.25,0.75], [-1.0,1.0,1.0, 0.0,1.0,0.0, 0.125,0.75],
					[-1.0,-1.0,-1.0, -1.0,0.0,0.0, 0.0,0.625], [-1.0,1.0,-1.0, -1.0,0.0,0.0, 0.0,0.75], [-1.0,1.0,1.0, -1.0,0.0,0.0, 0.125,0.75], [-1.0,-1.0,1.0, -1.0,0.0,0.0, 0.125,0.625],
					[1.0,-1.0,-1.0, 1.0,0.0,0.0, 0.375,0.625], [1.0,1.0,-1.0, 1.0,0.0,0.0, 0.375,0.75], [1.0,1.0,1.0, 1.0,0.0,0.0, 0.25,0.75], [1.0,-1.0,1.0, 1.0,0.0,0.0, 0.25,0.625],
				];
	var ind2 = [3, 2, 0,  2, 1, 0,
				4, 5, 6,  4, 6, 7,
				8, 9, 10,  8, 10, 11,
				15, 14, 12,  14, 13, 12,
				19, 18, 16,  18, 17, 16,
				20, 21, 22,  20, 22, 23,
			];
	var color2 = [0.0, 1.0, 1.0];
	addMesh(vert2, ind2, color2);
	
	
	// Draws a Cylinder --- To do for the assignment
	let prec3 = 0.025;
	let dim3 = 1/prec3;
	let max3 = 1.0;
	let min3 = -1.0;
	let r3 = 1.0;

	var vert4 = [];

	//top circle vertices
	vert4.push([0.0,max3,0.0, 0.0,1.0,0.0, 0.625,0.875]);

	
	for(i = 0; i <= dim3; i++){
		let angle = i*Math.PI*2/dim3;
		vert4.push([r3*Math.cos(angle), max3, r3*Math.sin(angle), 0.0, 1.0, 0.0, 0.625+0.125*Math.cos(angle),0.875+0.125*Math.sin(angle)]);
	}

	//bottom circle vertices
	vert4.push([0.0,min3,0.0, 0.0,-1.0,0.0, 0.875,0.875]);

	for(i = 0; i <= dim3; i++){
		let angle = i*Math.PI*2/dim3;
		vert4.push([r3*Math.cos(angle), min3, r3*Math.sin(angle), 0.0, -1.0, 0.0, 0.875+0.125*Math.cos(angle),0.875+0.125*Math.sin(angle)]);
	}

	//sides vertices
	let uint = (1-0.5)*prec3;
	for(i = 0; i <= dim3; i++){
		let angle = i*Math.PI*2/dim3;
		let u = 0.5+uint*(dim3-i);
		vert4.push([r3*Math.cos(angle), max3, r3*Math.sin(angle), Math.cos(angle), 0.0, Math.sin(angle), u, 0.75]);
		vert4.push([r3*Math.cos(angle), min3, r3*Math.sin(angle), Math.cos(angle), 0.0, Math.sin(angle), u, 0.5]);
	}

	var ind4 = [];

	//top circle indexes
	for(i = 1; i <= dim3+1; i++){
		if(i !== dim3+1){
			ind4.push(i+1);
			ind4.push(i);
			ind4.push(0);
		}
		else{
			ind4.push(1);
			ind4.push(i);
			ind4.push(0);
		}
	}

	//bottom circle indexes
	let offset1 = dim3+2;
	for(i = 1; i <= dim3+1; i++){
		if(i !== dim3+1){
			ind4.push(offset1);
			ind4.push(offset1+i);
			ind4.push(offset1+i+1);
		}
		else{
			ind4.push(offset1);
			ind4.push(offset1+i);
			ind4.push(offset1+1);
		}
	}

	//sides indexes
	let offset2 = offset1+dim3+2;
	for(i = 0; i <= dim3; i++){
		if(i !== dim3){
			
			ind4.push(offset2+2*i+2);
			ind4.push(offset2+2*i+1);
			ind4.push(offset2+2*i);

			ind4.push(offset2+2*i+1);
			ind4.push(offset2+2*i+2);
			ind4.push(offset2+2*i+3);
		}
		else{
			ind4.push(offset2);
			ind4.push(offset2+2*i+1);
			ind4.push(offset2+2*i);

			ind4.push(offset2+2*i+1);
			ind4.push(offset2);
			ind4.push(offset2+1);
		}
	}
	var color3 = [0.0, 1.0, 1.0];
	addMesh(vert4, ind4, color3);
}