function buildGeometry() {
	// Draws a pyramid --- Already done, just for inspiration
	var vert1 = [[0.0,1.0,0.0, 0.0, 0.4472,-0.8944],[ 1.0,-1.0,-1.0, 0.0, 0.4472,-0.8944],[-1.0,-1.0,-1.0, 0.0, 0.4472,-0.8944],
				 [0.0,1.0,0.0, 0.8944, 0.4472,0.0],[ 1.0,-1.0, 1.0, 0.8944, 0.4472,0.0],[ 1.0,-1.0,-1.0, 0.8944, 0.4472,0.0], 
				 [0.0,1.0,0.0, 0.0, 0.4472,0.8944],[-1.0,-1.0, 1.0, 0.0, 0.4472,0.8944],[ 1.0,-1.0, 1.0, 0.0, 0.4472,0.8944], 
				 [0.0,1.0,0.0, -0.8944, 0.4472,0.0],[-1.0,-1.0,-1.0, -0.8944, 0.4472,0.0],[-1.0,-1.0, 1.0, -0.8944, 0.4472,0.0], 
				 [-1.0,-1.0,-1.0, 0.0,-1.0,0.0],[1.0,-1.0,-1.0, 0.0,-1.0,0.0], [1.0,-1.0,1.0, 0.0,-1.0,0.0], [-1.0,-1.0,1.0, 0.0,-1.0,0.0],
				];
	var ind1 = [0, 1, 2,  3, 4, 5,  6, 7, 8,  9, 10, 11,  12, 13, 14,  12, 14, 15];
	var color1 = [0.0, 0.0, 1.0];
	addMesh(vert1, ind1, color1);
	
	// Draws a cube -- To do for the assignment.
	var vert2 = [	[-1.0,-1.0,-1.0, 0.0,0.0,-1.0], [1.0,-1.0,-1.0, 0.0,0.0,-1.0], [1.0,1.0,-1.0, 0.0,0.0,-1.0], [-1.0,1.0,-1.0, 0.0,0.0,-1.0],
					[-1.0,-1.0,1.0, 0.0,0.0,1.0], [1.0,-1.0,1.0, 0.0,0.0,1.0], [1.0,1.0,1.0, 0.0,0.0,1.0], [-1.0,1.0,1.0, 0.0,0.0,1.0],
					[-1.0,-1.0,-1.0, 0.0,-1.0,0.0], [1.0,-1.0,-1.0, 0.0,-1.0,0.0], [1.0,-1.0,1.0, 0.0,-1.0,0.0], [-1.0,-1.0,1.0, 0.0,-1.0,0.0],
					[-1.0,1.0,-1.0, 0.0,1.0,0.0], [1.0,1.0,-1.0, 0.0,1.0,0.0], [1.0,1.0,1.0, 0.0,1.0,0.0], [-1.0,1.0,1.0, 0.0,1.0,0.0],
					[-1.0,-1.0,-1.0, -1.0,0.0,0.0], [-1.0,1.0,-1.0, -1.0,0.0,0.0], [-1.0,1.0,1.0, -1.0,0.0,0.0], [-1.0,-1.0,1.0, -1.0,0.0,0.0],
					[1.0,-1.0,-1.0, 1.0,0.0,0.0], [1.0,1.0,-1.0, 1.0,0.0,0.0], [1.0,1.0,1.0, 1.0,0.0,0.0], [1.0,-1.0,1.0, 1.0,0.0,0.0],
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
	
	// Draws function y = sin(x) * cos(z) with -3 <= x <= 3 and -3 <= z <= 3 -- To do for the assignment.
	/*var vert3 = [[-1.0,-1.0,0.0, 0.0, 0.0,1.0], [1.0,-1.0,0.0, 0.0, 0.0,1.0], [1.0,1.0,0.0, 0.0, 0.0,1.0], [-1.0,1.0,0.0, 0.0, 0.0,1.0]];
	var ind3 = [0, 1, 2,  0, 2, 3];
	var color3 = [0.0, 1.0, 1.0];
	addMesh(vert3, ind3, color3);*/
	let prec1 = 0.1; 					//precision (DON'T BE CRAZY WITH ITS VALUE, AT LEAST .025, AT MOST 1)
	let squares1 = 6;					//dimension of the matrix of squares
	let dim1 = squares1*(1/prec1);			//number of vertices in each direction
	
	///// Creates vertices
	var vert3 = [];
	for(i = 0; i <= dim1; i++) {  
		for(j = 0; j <= dim1; j++) { 
			//create a vertex for all x, y in range -3 -> 3 with precision 0.1
			let x = i*prec1 - 3;
			let z = j*prec1 - 3;
			let y = Math.sin(x) * Math.cos(z);

			let nx = Math.cos(x) * Math.cos(z);
			let ny = -1.0;
			let nz = -Math.sin(x) * Math.sin(z);

			let norm = -Math.sqrt(nx*nx+ny*ny+nz*nz);

			nx = nx/norm;
			ny = ny/norm;
			nz = nz/norm;

			vert3[i*(dim1+1)+j] = [x, y, z, nx, ny, nz];
		}
	}

	////// Creates indices
	var ind3 = [];
	for(i = 0; i < dim1; i++) {
		for(j = 0; j < dim1; j++) {
			//draw a square using the indexes of the vertices (i.e. two triangles)
			//TRIANGLE 1
			ind3.push(i*(dim1+1)+j);
			ind3.push(i*(dim1+1)+j+1);
			ind3.push((i+1)*(dim1+1)+j);
			//TRIANGLE 2
			ind3.push((i+1)*(dim1+1)+j);
			ind3.push(i*(dim1+1)+j+1);
			ind3.push((i+1)*(dim1+1)+j+1);
		}
	}

	var color3 = [0.0, 1.0, 1.0];
	addMesh(vert3, ind3, color3);

	
	// Draws a Cylinder --- To do for the assignment
	let prec3 = 0.025;
	let dim3 = 1/prec3;
	let max3 = 1.0;
	let min3 = -1.0;
	let r3 = 1.0;

	var vert4 = [];

	//top circle vertices
	vert4.push([0.0,max3,0.0, 0.0,1.0,0.0]);

	
	for(i = 0; i <= dim3; i++){
		let angle = i*Math.PI*2/dim3;
		vert4.push([r3*Math.cos(angle), max3, r3*Math.sin(angle), 0.0, 1.0, 0.0]);
	}

	//bottom circle vertices
	vert4.push([0.0,min3,0.0, 0.0,-1.0,0.0]);

	for(i = 0; i <= dim3; i++){
		let angle = i*Math.PI*2/dim3;
		vert4.push([r3*Math.cos(angle), min3, r3*Math.sin(angle), 0.0, -1.0, 0.0]);
	}

	//sides vertices
	for(i = 0; i <= dim3; i++){
		let angle = i*Math.PI*2/dim3;
		vert4.push([r3*Math.cos(angle), max3, r3*Math.sin(angle), Math.cos(angle), 0.0, Math.sin(angle)]);
		vert4.push([r3*Math.cos(angle), min3, r3*Math.sin(angle), Math.cos(angle), 0.0, Math.sin(angle)]);
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

	var color4 = [1.0, 1.0, 0.0];
	addMesh(vert4, ind4, color4);

	// Draws a Sphere --- To do for the assignment.
	let prec2 = 0.025;
	let dim2 = 1/prec2+1;
	let radius = 2;

	var vert5 = [];
	for(i = 0; i <= dim2; i++) {
		for(j = 0; j <= dim2; j++) {
			let theta = (i/(dim2-1))*Math.PI*2;
			let phi = (j/(dim2-1))*Math.PI;

			let x = radius*Math.sin(phi)*Math.cos(theta);
			let y = radius*Math.sin(phi)*Math.sin(theta);
			let z = radius*Math.cos(phi);

			let nx=Math.cos(theta)*Math.sin(phi);
			let ny=Math.sin(phi)*Math.sin(theta);
			let nz=Math.cos(phi);

			vert5[i*(dim2+1)+j] = [x, y, z, nx, ny, nz];
		}
	}
	
	////// Creates indices
	var ind5 = [];
	for(i = 0; i < dim2; i++) {
		for(j = 0; j < dim2-1; j++) {
			//draw a square using the indexes of the vertices (i.e. two triangles)
			//TRIANGLE 1
			ind5.push(i*(dim2+1)+j);
			ind5.push(i*(dim2+1)+j+1);
			ind5.push((i+1)*(dim2+1)+j);
			//TRIANGLE 2
			ind5.push((i+1)*(dim2+1)+j);
			ind5.push(i*(dim2+1)+j+1);
			ind5.push((i+1)*(dim2+1)+j+1);
		}
	}
	var color5 = [1.0, 0.0, 0.0];
	addMesh(vert5, ind5, color5);
}

