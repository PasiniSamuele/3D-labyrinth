function buildGeometry() {
	
	// Draws the outline of letter F (replace the vertices and primitive type)
	let vert1	=	[								// List of vertices
						[-3,	-5,		0],
						[-1,	-5,		0],
						[-1,	-1,		0],
						[1,		-1,		0],
						[1,		1,		0],
						[-1,	1,		0],
						[-1,	3,		0],
						[3,		3,		0],
						[3,		5,		0],
						[-3,	5,		0],
					];
	addMesh(vert1, "O", [1.0, 0.0, 0.0]);			// Draw a "line loop"

	// Draws a filled S-shaped pattern (replace the vertices and primitive type)
	let vert2	=	[								// List of vertices
						[-3,	-3,		0],
						[-3,	-5,		0],
						[1,		-3,		0],
						[3,		-5,		0],
						[1,		-1,		0],
						[3,		1,		0],
						[-3,	-1,		0],
						[-1,	1,		0],
						[-3,	5,		0],
						[-1,	3,		0],
						[3,		5,		0],
						[3,		3,		0],
					];
	addMesh(vert2, "S", [0.0, 0.0, 1.0]);			// Draw a "triangle strip"

	// Draws a filled pentacon (replace the vertices and primitive type)
	let d		=	5;																	// Dimension (1 means that the first vertex is in (0, 1) )
	let vert3	=	[																	// List of vertices
						[0, 						d,							0],
						[Math.sin(2*Math.PI/5)*d, 	Math.cos(2*Math.PI/5)*d,	0],
						[Math.sin(4*Math.PI/5)*d, 	-Math.cos(Math.PI/5)*d,		0],
						[-Math.sin(4*Math.PI/5)*d, 	-Math.cos(Math.PI/5)*d,		0],
						[-Math.sin(2*Math.PI/5)*d, 	Math.cos(2*Math.PI/5)*d,	0],
					];
	addMesh(vert3, "F", [0.0, 1.0, 0.0]);												// Drawing a "triangle fan"
	
}
