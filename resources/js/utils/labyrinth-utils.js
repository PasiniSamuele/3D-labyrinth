//
//  CONSTANTS & DEBUG
//
       
const CLOCKWISE_INDEXES = 0;         // true -> 2,1,0, 3,2,0    false-> 0,1,2, 0,2,3
const VERTICES2D = 0;                // true returns a 2D array of vertices, false returns a 1D array

const DEBUG_FRONT = 1;
const DEBUG_RIGHT = 1;
const DEBUG_BACK = 1;
const DEBUG_LEFT = 1;
const DEBUG_FLOOR = 1;
const DEBUG_TOP = 0;                

const U_UNIT = 0.5;
const V_UNIT = 0.5;

const mazeElement = {
    FLOOR: 0,
    WALL: 1, 
    START_POS: 2,

    BLOCKS: [1],
    FLOORS: [0, 2]
};

const mazeDirection = {
    FRONT: 0,
    RIGHT: 1,
    BACK: 2,
    LEFT: 3,
    FLOOR: 4
};

const vertPosition = {
    TOP_LEFT: 0,
    BOTTOM_LEFT: 1,
    BOTTOM_RIGHT: 2,
    TOP_RIGHT: 3
};

/**
 * Function that returns arrays of 3D coordinates of a given 2D labyrinth
 * 
 * @param { any } labyrinth a nxm matrix of zeroes and ones (the ones are walls) with n,m > 2
 * 
 * @param { number } MIN_Y height of the floor
 * @param { number } MAX_Y height of the ceiling
 * 
 * @param { number } size_multiplier multiplier for all dimensions
 * 
 * @returns a vector of size 3 containing respectively vertices, indices and colours
 */
 var compute3DLabyrinth = function(labyrinth, MIN_Y, MAX_Y, size_multiplier){
    //
    //  INITIALIZATION
    //

    let X_SIZE = labyrinth[0].length;
    let Z_SIZE = labyrinth.length;

    let offset_x, offset_y, offset_z;
    for(let i = 0; i < Z_SIZE; i++){
        for(let j = 0; j < X_SIZE; j++){
            if(labyrinth[i][j] == 2){
                offset_x = -j-0.5;
                offset_y = -(MAX_Y-MIN_Y)/2;
                offset_z = -i-0.5;
            }
        }
    }

    let vertices = [];
    let indexes = [];
    let normals = [];
    let uvs = [];
    let icount = 0;
    let colours = [];

    let computeColor = function(material){
        switch(material){
            case mazeElement.FLOOR:
                return [0.0, 1.0, 0.0];
            case mazeElement.WALL:
                return [1.0, 0.0, 0.0];
            case mazeElement.START_POS:
                return [0.0, 1.0, 0.0];
        }
    }

    let computeUV = function(position, material){
        let uv;
        
        switch(material){
            case mazeElement.FLOOR:
                uv = [0.5, 0.0];
                break;
            case mazeElement.WALL:
                uv = [0.0, 0.0];
                break;
            case mazeElement.START_POS:
                uv = [0.5, 0.0];
                break;
            default:
                uv = [0.0, 0.0];
                break;
        }

        switch(position){
            case vertPosition.BOTTOM_LEFT:
                return uv;
            case vertPosition.BOTTOM_RIGHT:
                uv[0] += U_UNIT;
                return uv;
            case vertPosition.TOP_LEFT:
                uv[1] += V_UNIT;
                return uv;
            case vertPosition.TOP_RIGHT:
                uv[0] += U_UNIT;
                uv[1] += V_UNIT;
                return uv;
        }
    }

    let computeNormals = function(direction){
        switch(direction){
            case mazeDirection.FRONT:
                return [0.0, 0.0, 1.0];
            case mazeDirection.RIGHT:
                return [-1.0, 0.0, 0.0];
            case mazeDirection.BACK:
                return [0.0, 0.0, -1.0];
            case mazeDirection.LEFT:
                return [1.0, 0.0, 0.0];
            case mazeDirection.FLOOR:
                return [0.0, 1.0, 0.0];
        }
    }

    let computeVertex = function(x,y,z,dir,uv,mat){

        colours = colours.concat(computeColor(mat));

		let vertex = [];

		vertex.push((x+offset_x)*size_multiplier);
		vertex.push((y+offset_y)*size_multiplier);
		vertex.push((z+offset_z)*size_multiplier);

		normals = normals.concat(computeNormals(dir));
        uvs = uvs.concat(computeUV(uv,mat));

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
                        computeVertex(j, MAX_Y, i, mazeDirection.FRONT, vertPosition.TOP_LEFT, (i-1 < 0) ? mazeElement.WALL : labyrinth[i-1][j]),
                        computeVertex(j, MIN_Y, i, mazeDirection.FRONT, vertPosition.BOTTOM_LEFT, (i-1 < 0) ? mazeElement.WALL : labyrinth[i-1][j]),
                        computeVertex(j+1, MIN_Y, i, mazeDirection.FRONT, vertPosition.BOTTOM_RIGHT, (i-1 < 0) ? mazeElement.WALL : labyrinth[i-1][j]),
                        computeVertex(j+1, MAX_Y, i, mazeDirection.FRONT, vertPosition.TOP_RIGHT, (i-1 < 0) ? mazeElement.WALL : labyrinth[i-1][j])
                    );
                    incrementIndexes();
                }

                //RIGHT
                if(DEBUG_RIGHT && ((j+1 >= X_SIZE) ? true : mazeElement.BLOCKS.includes(labyrinth[i][j+1]))){
                    vertices.push(
                        computeVertex(j+1, MAX_Y, i, mazeDirection.RIGHT, vertPosition.TOP_LEFT, (j+1 >= X_SIZE) ? mazeElement.WALL : labyrinth[i][j+1]),
                        computeVertex(j+1, MIN_Y, i, mazeDirection.RIGHT, vertPosition.BOTTOM_LEFT, (j+1 >= X_SIZE) ? mazeElement.WALL : labyrinth[i][j+1]),
                        computeVertex(j+1, MIN_Y, i+1, mazeDirection.RIGHT, vertPosition.BOTTOM_RIGHT, (j+1 >= X_SIZE) ? mazeElement.WALL : labyrinth[i][j+1]),
                        computeVertex(j+1, MAX_Y, i+1, mazeDirection.RIGHT, vertPosition.TOP_RIGHT, (j+1 >= X_SIZE) ? mazeElement.WALL : labyrinth[i][j+1])
                    );
                    incrementIndexes();
                }

                //BACK
                if(DEBUG_BACK && ((i+1 >= Z_SIZE) ? true : mazeElement.BLOCKS.includes(labyrinth[i+1][j]))){
                    vertices.push(
                        computeVertex(j+1, MAX_Y, i+1, mazeDirection.BACK, vertPosition.TOP_LEFT, (i+1 >= Z_SIZE) ? mazeElement.WALL : labyrinth[i+1][j]),
                        computeVertex(j+1, MIN_Y, i+1, mazeDirection.BACK, vertPosition.BOTTOM_LEFT, (i+1 >= Z_SIZE) ? mazeElement.WALL : labyrinth[i+1][j]),
                        computeVertex(j, MIN_Y, i+1, mazeDirection.BACK, vertPosition.BOTTOM_RIGHT, (i+1 >= Z_SIZE) ? mazeElement.WALL : labyrinth[i+1][j]),
                        computeVertex(j, MAX_Y, i+1, mazeDirection.BACK, vertPosition.TOP_RIGHT, (i+1 >= Z_SIZE) ? mazeElement.WALL : labyrinth[i+1][j])
                    );
                    incrementIndexes();
                }

                //LEFT
                if(DEBUG_LEFT && ((j-1 < 0) ? true : mazeElement.BLOCKS.includes(labyrinth[i][j-1]))){
                    vertices.push(
                        computeVertex(j, MAX_Y, i+1, mazeDirection.LEFT, vertPosition.TOP_LEFT, (j-1 < 0) ? mazeElement.WALL : labyrinth[i][j-1]),
                        computeVertex(j, MIN_Y, i+1, mazeDirection.LEFT, vertPosition.BOTTOM_LEFT, (j-1 < 0) ? mazeElement.WALL : labyrinth[i][j-1]),
                        computeVertex(j, MIN_Y, i, mazeDirection.LEFT, vertPosition.BOTTOM_RIGHT, (j-1 < 0) ? mazeElement.WALL : labyrinth[i][j-1]),
                        computeVertex(j, MAX_Y, i, mazeDirection.LEFT, vertPosition.TOP_RIGHT, (j-1 < 0) ? mazeElement.WALL : labyrinth[i][j-1])
                    );
                    incrementIndexes();
                }

                //FLOOR
                if(DEBUG_FLOOR){
                    vertices.push(
                        computeVertex(j, MIN_Y, i, mazeDirection.FLOOR, vertPosition.TOP_LEFT, labyrinth[i][j]),
                        computeVertex(j, MIN_Y, i+1, mazeDirection.FLOOR, vertPosition.BOTTOM_LEFT, labyrinth[i][j]), 
                        computeVertex(j+1, MIN_Y, i+1, mazeDirection.FLOOR, vertPosition.BOTTOM_RIGHT, labyrinth[i][j]),
                        computeVertex(j+1, MIN_Y, i, mazeDirection.FLOOR, vertPosition.TOP_RIGHT, labyrinth[i][j])
                    );
                    incrementIndexes();
                }
            }
        }
    }

    if(VERTICES2D) return [vertices, [].concat(indexes), colours, normals, uvs];
    else return [[].concat.apply([],vertices), [].concat(indexes), colours, normals, uvs];
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

    labyrinth[start_row][start_col] = 2;

    let iterateLabyrinth = function(matrix, row, col){

        //noise termination condition
        if (
            ((row+1)<matrix.length ? mazeElement.FLOORS.includes(matrix[row+1][col]) : true) && 
            ((row-1)>=0 ? mazeElement.FLOORS.includes(matrix[row-1][col]) : true) &&
            ((col+1)<matrix[0].length ? mazeElement.FLOORS.includes(matrix[row][col+1]) : true) && 
            ((col-1)>=0 ? mazeElement.FLOORS.includes(matrix[row][col-1]) : true)
        ) return matrix;

        //set cell as visited
        if(matrix[row][col] !== 2) matrix[row][col] = 0;

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