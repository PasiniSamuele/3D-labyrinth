function draw() {
	// line(x1,y1, x2,y2)
	// draws a line from a point at Normalized screen coordinates x1,y1 to Normalized screen coordinates x2,y2

	// Here there are a few random lines, you will have to replace with your code
	/*line(0.3, 0.3,-0.4,-0.4);
	line(0.4,-0.4,-0.4, 0.4);*/
	/*for(i = 0; i <= 16; i++) {
		y = 1.6*Math.random() - 0.5;
		line(0.4, y,-0.4, y);
	}*/

	line(-0.5, -0.3, -0.5, 0.3);
	line(-0.5, -0.3, 0.3, -0.3);
	line(-0.5, 0.3, 0.3, 0.3);
	compassDraw(0.3, 0, 0.3, 0, 180);
}


function compassDraw(centerX, centerY, radius, startingGrade, endingGrade){
	if(endingGrade<startingGrade){
		let temp =startingGrade;
		startingGrade=endingGrade;
		endingGrade=temp;
	}
	let resolution = (endingGrade-startingGrade)*64/180;

		for(let i=0; i<resolution; i++){		
			line(
				centerX+radius*Math.sin((startingGrade+i/resolution*(endingGrade-startingGrade))*Math.PI/180),
				centerY+radius*Math.cos((startingGrade+i/resolution*(endingGrade-startingGrade))*Math.PI/180),
				centerX+radius*Math.sin((startingGrade+(i+1)/resolution*(endingGrade-startingGrade))*Math.PI/180),
				centerY+radius*Math.cos((startingGrade+(i+1)/resolution*(endingGrade-startingGrade))*Math.PI/180)
			)
		}
}

