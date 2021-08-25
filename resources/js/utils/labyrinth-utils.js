//
//  CONSTANTS & DEBUG
//

const CENTERED = 1;                 // true if labyrinth centered, false if using custom offsets
const CLOCKWISE_INDEXES = 1;         // true -> 2,1,0, 3,2,0    false-> 0,1,2, 0,2,3
const VERTICES2D = 0;                // true returns a 2D array of vertices, false returns a 1D array
const MINIMAL_VERTICES = 0;         // true to optimize vertices (bad for meshes), false to make only squares

const ENABLE_NORMALS = 0;
const ENABLE_UV_WALL = 0;
const ENABLE_UV_FLOOR = 0;

const DEBUG_FRONT = 1;
const DEBUG_RIGHT = 1;
const DEBUG_BACK = 1;
const DEBUG_LEFT = 1;
const DEBUG_FLOOR = 1;
const DEBUG_TOP = 0;                

const mazeElement = {
    FLOOR: 0,
    WALL: 1, 

    BLOCKS: [1]
}

/**
 * Function that returns arrays of 3D coordinates of a given 2D labyrinth
 * 
 * @param { any } labyrinth a nxm matrix of zeroes and ones (the ones are walls) with n,m > 2
 * 
 * @param { number } bottom height of the floor
 * @param { number } top height of the ceiling
 * 
 * @param { number } offset_x offset on the x axis
 * @param { number } offset_y offset on the y axis
 * @param { number } offset_z offset on the z axis
 * 
 * @param { number } size_multiplier multiplier for all dimensions
 * 
 * @param { any } wall_colours vec3 containing the colours of the walls
 * @param { any } floor_colours vec3 containing the colours of the floor
 * 
 * @returns a vector of size 3 containing respectively vertices, indices and colours
 */
 var compute3DLabyrinth = function(labyrinth, bottom, top, offset_x, offset_y, offset_z, size_multiplier, wall_colours, floor_colours){

    //
    //  INITIALIZATION
    //

    let X_SIZE = labyrinth[0].length;
    let Z_SIZE = labyrinth.length;

    const MIN_X = 0.0;
    let MAX_X = X_SIZE;
    let MIN_Y = bottom;
    let MAX_Y = top;
    const MIN_Z = 0.0;
    let MAX_Z = Z_SIZE;

    if(CENTERED){
        offset_x = -(MAX_X-MIN_X)/2;
        offset_y = -(MAX_Y-MIN_Y)/2;
        offset_z = -(MAX_Z-MIN_Z)/2;
    }

    let vertices = [];
    let indexes = [];
    let icount = 0;
    let colours = [];

    let computeWallVertex = function(x,y,z,dir,uv){

        colours.push(wall_colours[0], wall_colours[1], wall_colours[2]);

		let vertex = [];

		vertex.push((x+offset_x)*size_multiplier);
		vertex.push((y+offset_y)*size_multiplier);
		vertex.push((z+offset_z)*size_multiplier);

		if(ENABLE_NORMALS){
			switch(dir){
				case 0:
					//front
					vertex.push(0.0, 0.0, 1.0);
					break;
				case 1:
					//right
					vertex.push(-1.0, 0.0, 0.0);
					break;
				case 2:
					//back
					vertex.push(0.0, 0.0, -1.0);
					break;
				case 3:
					//left
					vertex.push(1.0, 0.0, 0.0);
					break;
				default:
					console.error("???");
			}
		}

        if(ENABLE_UV_WALL){
			switch(uv){
				case 0:
					//top left
					vertex.push(0.0, 1.0);
					break;
				case 1:
					//bottom left
					vertex.push(0.0, 0.0);
					break;
				case 2:
					//bottom right
					vertex.push(1.0, 0.0);
					break;
				case 3:
					//top right
					vertex.push(1.0, 1.0);
					break;
				default:
					console.error("???");
			}
		}

        return vertex;
    }

    let computeFloorVertex = function(x,y,z,uv){
        colours.push(floor_colours[0], floor_colours[1], floor_colours[2]);
        let vertex = [];

		vertex.push((x+offset_x)*size_multiplier);
		vertex.push((y+offset_y)*size_multiplier);
		vertex.push((z+offset_z)*size_multiplier);
		
		if(ENABLE_NORMALS) vertex.push(0.0, 1.0, 0.0);

        if(ENABLE_UV_FLOOR){
			switch(uv){
				case 0:
					//top left
					vertex.push(0.0, 1.0);
					break;
				case 1:
					//bottom left
					vertex.push(0.0, 0.0);
					break;
				case 2:
					//bottom right
					vertex.push(1.0, 0.0);
					break;
				case 3:
					//top right
					vertex.push(1.0, 1.0);
					break;
				default:
					console.error("???");
			}
		}
		
        return vertex;
    }

    let incrementIndexes = function(){
        if (CLOCKWISE_INDEXES){
            indexes.push(
                icount+2, icount+1, icount,
                icount+3, icount+2, icount
            );
        } else {
            indexes.push(
                icount, icount+1, icount+2,
                icount, icount+2, icount+3
            );
        }
        icount+=4;
    }

    //
    //  COMPUTE WALLS
    //

    for(let i = 0; i < Z_SIZE; i++){
        for(let j = 0; j < X_SIZE; j++){
            if(!mazeElement.BLOCKS.includes(labyrinth[i][j])){
                //FRONT
                if(DEBUG_FRONT && ((i-1 < 0) ? true : mazeElement.BLOCKS.includes(labyrinth[i-1][j]))) {
                    vertices.push(
                        computeWallVertex(j, MAX_Y, i, 0, 0),
                        computeWallVertex(j, MIN_Y, i, 0, 1),
                        computeWallVertex(j+1, MIN_Y, i, 0, 2),
                        computeWallVertex(j+1, MAX_Y, i, 0, 3)
                    );
                    incrementIndexes();
                }

                //RIGHT
                if(DEBUG_RIGHT && ((j+1 >= X_SIZE) ? true : mazeElement.BLOCKS.includes(labyrinth[i][j+1]))){
                    vertices.push(
                        computeWallVertex(j+1, MAX_Y, i, 1, 0),
                        computeWallVertex(j+1, MIN_Y, i, 1, 1),
                        computeWallVertex(j+1, MIN_Y, i+1, 1, 2),
                        computeWallVertex(j+1, MAX_Y, i+1, 1, 3)
                    );
                    incrementIndexes();
                }

                //BACK
                if(DEBUG_BACK && ((i+1 >= Z_SIZE) ? true : mazeElement.BLOCKS.includes(labyrinth[i+1][j]))){
                    vertices.push(
                        computeWallVertex(j+1, MAX_Y, i+1, 2, 0),
                        computeWallVertex(j+1, MIN_Y, i+1, 2, 1),
                        computeWallVertex(j, MIN_Y, i+1, 2, 2),
                        computeWallVertex(j, MAX_Y, i+1, 2, 3)
                    );
                    incrementIndexes();
                }

                //LEFT
                if(DEBUG_LEFT && ((j-1 < 0) ? true : mazeElement.BLOCKS.includes(labyrinth[i][j-1]))){
                    vertices.push(
                        computeWallVertex(j, MAX_Y, i+1, 3, 0),
                        computeWallVertex(j, MIN_Y, i+1, 3, 1),
                        computeWallVertex(j, MIN_Y, i, 3, 2),
                        computeWallVertex(j, MAX_Y, i, 3, 3)
                    );
                    incrementIndexes();
                }

                if(DEBUG_FLOOR){
                    vertices.push(
                        computeFloorVertex(j, MIN_Y, i, 0), computeFloorVertex(j, MIN_Y, i+1, 1), 
                        computeFloorVertex(j+1, MIN_Y, i+1, 2), computeFloorVertex(j+1, MIN_Y, i, 3)
                    );
                    incrementIndexes();
                }
            } else {
                if(DEBUG_TOP){
                    vertices.push(
                        computeFloorVertex(j, MAX_Y, i, 0), computeFloorVertex(j, MAX_Y, i+1, 1), 
                        computeFloorVertex(j+1, MAX_Y, i+1, 2), computeFloorVertex(j+1, MAX_Y, i, 3)
                    );
                    incrementIndexes();
                }
            }
        }
    }

    if(VERTICES2D) return [vertices, [].concat(indexes), colours];
    else return [[].concat.apply([],vertices), [].concat(indexes), colours];
}

function shuffle(array) {
    var currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle...
    while (currentIndex != 0) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
}

/**
 * Function that generates a 2D labyrinth given its rows and columns
 * @param { number } rows number of rows 
 * @param { number } columns number of columns
 * @param { boolean } JOIN_SIDES true if the generation should be noisy
 * @param { float } join_probability probability to add an inconsistent wall (MUST BE SMALL!!!!!!)
 * 
 * @returns a matrix of zeroes and ones where the ones are walls
 */
var generate2DLabyrinth = function(rows, columns, JOIN_SIDES, join_probability){

    if(rows%2 === 0) rows--;
    if(columns%2 === 0) columns--;

    let labyrinth = Array(rows).fill().map(()=>Array(columns).fill(1));
    
    let start_row = Math.floor(Math.random()*rows);
    let start_col = Math.floor(Math.random()*columns);

    start_row -= (start_row%2 === 0) ? 0 : 1;
    start_col -= (start_col%2 === 0) ? 0 : 1;

    let iterateLabyrinth = function(matrix, row, col){

        //noise termination condition
        if (
            ((row+1)<matrix.length ? matrix[row+1][col] === 0 : true) && 
            ((row-1)>=0 ? matrix[row-1][col] === 0 : true) &&
            ((col+1)<matrix[0].length ? matrix[row][col+1] === 0 : true) && 
            ((col-1)>=0 ? matrix[row][col-1] === 0 : true)
        ) return matrix;

        //set cell as visited
        matrix[row][col] = 0;

        //get neighbors
        let neighbors = [];
        if((row+2) < rows) neighbors.push([row+2, col, 0]);
        if((row-2) >= 0) neighbors.push([row-2, col, 1]);
        if((col+2) < columns) neighbors.push([row, col+2, 2]);
        if((col-2) >= 0) neighbors.push([row, col-2, 3]);
        
        //shuffle neighbors
        let ind = [];
        for(i = 0; i < neighbors.length; i++) ind.push(i);
        shuffle(ind);

        //iterate unvisited neighbors
        ind.forEach(i=>{
            let noise = JOIN_SIDES && (Math.random() < join_probability);
            if(matrix[neighbors[i][0]][neighbors[i][1]] === 1 || noise){
                switch(neighbors[i][2]){
                    case 0:
                        matrix[row+1][col] = 0;
                        break;
                    case 1:
                        matrix[row-1][col] = 0;
                        break;
                    case 2:
                        matrix[row][col+1] = 0;
                        break;
                    case 3:
                        matrix[row][col-1] = 0;
                        break;
                    default:
                        return null;
                }

                iterateLabyrinth(matrix, neighbors[i][0], neighbors[i][1]);
            }
        });

        return matrix;
    }

    return iterateLabyrinth(labyrinth, start_row, start_col);
}