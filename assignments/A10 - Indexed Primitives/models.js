function buildGeometry() {

	
	// Draws function y = sin(x) * cos(z) with -3 <= x <= 3 and -3 <= z <= 3.

	
	let prec1 = 0.05; 					//precision (DON'T BE CRAZY WITH ITS VALUE, AT LEAST .025, AT MOST 1)
	let squares1 = 6;					//dimension of the matrix of squares
	let dim1 = squares1*(1/prec1); 	//number of vertices in each direction
	
	///// Creates vertices
	var vert2 = [];
	for(i = 0; i <= dim1; i++) {  
		for(j = 0; j <= dim1; j++) { 
			//create a vertex for all x, y in range -3 -> 3 with precision 0.05
			x = i*prec1 - squares1/2;
			z = j*prec1 - squares1/2;
			y = Math.sin(x) * Math.cos(z);
			vert2[i*(dim1+1)+j] = [x, y, z];
		}
	}

	////// Creates indices
	var ind2 = [];
	for(i = 0; i < dim1; i++) {
		for(j = 0; j < dim1; j++) {
			//draw a square using the indexes of the vertices (i.e. two triangles)
			//TRIANGLE 1
			ind2.push(i*(dim1+1)+j);
			ind2.push(i*(dim1+1)+j+1);
			ind2.push((i+1)*(dim1+1)+j);
			//TRIANGLE 2
			ind2.push((i+1)*(dim1+1)+j);
			ind2.push(i*(dim1+1)+j+1);
			ind2.push((i+1)*(dim1+1)+j+1);
		}
	}

	var color2 = [Math.random(), Math.random(), Math.random()];
	addMesh(vert2, ind2, color2);




	let prec2 = 0.01;
	let dim2 = 1/prec2+1;
	let radius = 2;

	// Draws a Half Sphere
	///// Creates vertices
	var vert3 = [];
	for(i = 0; i <= dim2; i++) {
		for(j = 0; j <= dim2; j++) {
			theta = (i/(dim2-1))*Math.PI*2;
			phi = (j/(dim2-1))*Math.PI;

			x = radius*Math.sin(phi)*Math.cos(theta);
			z = radius*Math.cos(phi);
			//y = radius*Math.sin(phi)*Math.sin(theta);

			if(theta <= Math.PI){
				y = radius*Math.sin(phi)*Math.sin(theta);
			} else {
				y = 0;
			}

			vert3[i*(dim2+1)+j] = [x, y, z];
		}
	}
	
	////// Creates indices
	var ind3 = [];
	for(i = 0; i < dim2; i++) {
		for(j = 0; j < dim2-1; j++) {
			//draw a square using the indexes of the vertices (i.e. two triangles)
			//TRIANGLE 1
			ind3.push(i*(dim2+1)+j);
			ind3.push(i*(dim2+1)+j+1);
			ind3.push((i+1)*(dim2+1)+j);
			//TRIANGLE 2
			ind3.push((i+1)*(dim2+1)+j);
			ind3.push(i*(dim2+1)+j+1);
			ind3.push((i+1)*(dim2+1)+j+1);
		}
	}
	
	var color3 = [Math.random(), Math.random(), Math.random()];
	addMesh(vert3, ind3, color3);
}

