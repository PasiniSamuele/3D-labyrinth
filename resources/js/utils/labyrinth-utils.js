
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

const mazeElement = {
    FLOOR: 0,
    WALL: 1, 
    START_POS: 2,
    FINAL_POS: 3,

    BLOCKS: [1],
    FLOORS: [0, 2, 3]
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

const shadowTextures = {
    BLANK: {
        u: 0.0,
        v: 0.75
    },
    B: {
        u: 0.25,
        v: 0.75
    },
    BR: {
        u: 0.5,
        v: 0.75
    },
    BL: {
        u: 0.75,
        v: 0.75
    },
    TBR:{
        u: 0.0,
        v: 0.5
    },
    TB: {
        u: 0.25,
        v: 0.5
    },
    TBL: {
        u: 0.5,
        v: 0.5
    },
    R: {
        u: 0.75,
        v: 0.5
    },
    LR: {
        u: 0.0,
        v: 0.25
    },
    L: {
        u: 0.25,
        v: 0.25
    },
    T: {
        u: 0.5,
        v: 0.25
    },
    TR: {
        u: 0.75,
        v: 0.25
    },
    TL: {
        u: 0.0,
        v: 0.0
    },
    TLR: {
        u: 0.25,
        v: 0.0
    },
    BLR: {
        u: 0.5,
        v: 0.0
    },
    TBLR: {
        u: 0.75,
        v: 0.0
    }
};

let getShadowPosition = function(Tcond, Bcond, Lcond, Rcond){
    let shadowArray = [shadowTextures.BLANK, shadowTextures.R, shadowTextures.L, shadowTextures.LR, 
        shadowTextures.B, shadowTextures.BR, shadowTextures.BL, shadowTextures.BLR, 
        shadowTextures.T, shadowTextures.TR, shadowTextures.TL, shadowTextures.TLR,
        shadowTextures.TB, shadowTextures.TBR, shadowTextures.TBL, shadowTextures.TBLR];
    
    let pos = (Tcond ? 8 : 0) + (Bcond ? 4 : 0) + (Lcond ? 2 : 0) + (Rcond ? 1 : 0);
    return shadowArray[pos];
}

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

let computeUV = function(position){
    switch(position){
        case vertPosition.BOTTOM_LEFT:
            return [0.0, 0.0];
        case vertPosition.BOTTOM_RIGHT:
            return [1.0, 0.0];
        case vertPosition.TOP_LEFT:
            return [0.0, 1.0];
        case vertPosition.TOP_RIGHT:
            return [1.0, 1.0];
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

let computeShadows = function(corner, baseUV){
    switch(corner){
        case vertPosition.BOTTOM_LEFT:
            return [baseUV.u, baseUV.v];
        case vertPosition.BOTTOM_RIGHT:
            return [baseUV.u+0.25, baseUV.v];
        case vertPosition.TOP_LEFT:
            return [baseUV.u, baseUV.v+0.25];
        case vertPosition.TOP_RIGHT:
            return [baseUV.u+0.25, baseUV.v+0.25];
    }
}

let shuffle = function(array) {
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

var labyrinthUtils = {
    isBlock : function(labyrinth, row, column){
        if (row < 0 || row >= labyrinth.length || column < 0 || column >= labyrinth[0].length) return true;
        else return mazeElement.BLOCKS.includes(labyrinth[row][column]);
    },

    computeStartPos : function(labyrinth){
        for(i = 0; i < labyrinth.length; i++){
            for(j = 0; j < labyrinth[0].length; j++){
                if(labyrinth[i][j] == mazeElement.START_POS) return [i, j];
            }
        }
        console.error("labyrinth has no start pos");
        return [];
    },

    computeFinalPos : function(labyrinth){
        for(i = 0; i < labyrinth.length; i++){
            for(j = 0; j < labyrinth[0].length; j++){
                if(labyrinth[i][j] == mazeElement.FINAL_POS) return [i, j];
            }
        }
        console.error("labyrinth has no final pos");
        return [];
    },

    getStartingAngle(labyrinth){
        let start = this.computeStartPos(labyrinth);
        let row = start[0];
        let col = start[1];
        if(row-1>=0 ? mazeElement.FLOORS.includes(labyrinth[row-1][col]) : false) return 0;
        else if (col+1<labyrinth[0].length ? mazeElement.FLOORS.includes(labyrinth[row][col+1]) : false) return 90;
        else if (row+1<labyrinth.length ? mazeElement.FLOORS.includes(labyrinth[row+1][col]) : false) return 180;
        else if (col-1>=0 ? mazeElement.FLOORS.includes(labyrinth[row][col-1]) : false) return 270;
        else {
            console.error("Labyrinth start not accessible");
            return null;
        }
    },

    getFinalAngle(labyrinth){
        let final = this.computeFinalPos(labyrinth);
        let row = final[0];
        let col = final[1];
        if(row-1>=0 ? mazeElement.FLOORS.includes(labyrinth[row-1][col]) : false) return 0;
        else if (col+1<labyrinth[0].length ? mazeElement.FLOORS.includes(labyrinth[row][col+1]) : false) return 90;
        else if (row+1<labyrinth.length ? mazeElement.FLOORS.includes(labyrinth[row+1][col]) : false) return 180;
        else if (col-1>=0 ? mazeElement.FLOORS.includes(labyrinth[row][col-1]) : false) return 270;
        else {
            console.error("Labyrinth exit not accessible");
            return null;
        }
    },

    getEndingPosition(labyrinth){
        let start = this.computeStartPos(labyrinth);
        let finish = this.computeFinalPos(labyrinth);
        return [finish[0]-start[0], finish[1]-start[1]];
    },

    getEndingPositionWithOffset(labyrinth, offset){
        let start = this.computeStartPos(labyrinth);
        let finish = this.computeFinalPos(labyrinth);
        let finalAngle = this.getFinalAngle(labyrinth);
        if (finalAngle === 0) return [finish[0]-start[0]-offset, finish[1]-start[1]];
        else if(finalAngle === 90) return [finish[0]-start[0], finish[1]-start[1]+offset];
        else if(finalAngle === 180) return [finish[0]-start[0]+offset, finish[1]-start[1]];
        else if(finalAngle === 270) return [finish[0]-start[0], finish[1]-start[1]-offset];
        else {
            console.error("Labyrinth exit not available");
            return null;
        }
    },

    compute3DFloor : function(labyrinth, MIN_Y, MAX_Y, size_multiplier){
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
        let shadows = [];

        let computeVertex = function(x,y,z,dir,uv,mat,shad){

            colours = colours.concat(computeColor(mat));
        
            let vertex = [];
        
            vertex.push((x+offset_x)*size_multiplier);
            vertex.push((y+offset_y)*size_multiplier);
            vertex.push((z+offset_z)*size_multiplier);
        
            normals = normals.concat(computeNormals(dir));
            uvs = uvs.concat(computeUV(uv));
            shadows = shadows.concat(computeShadows(uv, shad));
        
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

        for(let i = 0; i < Z_SIZE; i++){
            for(let j = 0; j < X_SIZE; j++){
                if(!mazeElement.BLOCKS.includes(labyrinth[i][j])){
                    if(DEBUG_FLOOR){
                        let shadow = getShadowPosition(
                            (i == 0 ? true : mazeElement.BLOCKS.includes(labyrinth[i-1][j])),
                            (i == labyrinth.length-1 ? true : mazeElement.BLOCKS.includes(labyrinth[i+1][j])),
                            (j == 0 ? true : mazeElement.BLOCKS.includes(labyrinth[i][j-1])),
                            (j == labyrinth[0].length-1 ? true : mazeElement.BLOCKS.includes(labyrinth[i][j+1]))
                        );
                        vertices.push(
                            computeVertex(j, MIN_Y, i, mazeDirection.FLOOR, vertPosition.TOP_LEFT, labyrinth[i][j], shadow),
                            computeVertex(j, MIN_Y, i+1, mazeDirection.FLOOR, vertPosition.BOTTOM_LEFT, labyrinth[i][j], shadow), 
                            computeVertex(j+1, MIN_Y, i+1, mazeDirection.FLOOR, vertPosition.BOTTOM_RIGHT, labyrinth[i][j], shadow),
                            computeVertex(j+1, MIN_Y, i, mazeDirection.FLOOR, vertPosition.TOP_RIGHT, labyrinth[i][j], shadow)
                        );
                        incrementIndexes();
                    }
                }
            }
        }

        if(VERTICES2D) return [vertices, [].concat(indexes), colours, normals, uvs, shadows];
        else return [[].concat.apply([],vertices), [].concat(indexes), colours, normals, uvs, shadows];
    },

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
    compute3DWalls : function(labyrinth, MIN_Y, MAX_Y, size_multiplier){
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
        let shadows = [];

        let computeVertex = function(x,y,z,dir,uv,mat,shad){

            colours = colours.concat(computeColor(mat));
        
            let vertex = [];
        
            vertex.push((x+offset_x)*size_multiplier);
            vertex.push((y+offset_y)*size_multiplier);
            vertex.push((z+offset_z)*size_multiplier);
        
            normals = normals.concat(computeNormals(dir));
            uvs = uvs.concat(computeUV(uv));
            shadows = shadows.concat(computeShadows(uv, shad));
        
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
                        let shadow = shadowTextures.B;
                        vertices.push(
                            computeVertex(j, MAX_Y, i, mazeDirection.FRONT, vertPosition.TOP_LEFT, (i-1 < 0) ? mazeElement.WALL : labyrinth[i-1][j], shadow),
                            computeVertex(j, MIN_Y, i, mazeDirection.FRONT, vertPosition.BOTTOM_LEFT, (i-1 < 0) ? mazeElement.WALL : labyrinth[i-1][j], shadow),
                            computeVertex(j+1, MIN_Y, i, mazeDirection.FRONT, vertPosition.BOTTOM_RIGHT, (i-1 < 0) ? mazeElement.WALL : labyrinth[i-1][j], shadow),
                            computeVertex(j+1, MAX_Y, i, mazeDirection.FRONT, vertPosition.TOP_RIGHT, (i-1 < 0) ? mazeElement.WALL : labyrinth[i-1][j], shadow)
                        );
                        incrementIndexes();
                    }

                    //RIGHT
                    if(DEBUG_RIGHT && ((j+1 >= X_SIZE) ? true : mazeElement.BLOCKS.includes(labyrinth[i][j+1]))){
                        let shadow = shadowTextures.B;
                        vertices.push(
                            computeVertex(j+1, MAX_Y, i, mazeDirection.RIGHT, vertPosition.TOP_LEFT, (j+1 >= X_SIZE) ? mazeElement.WALL : labyrinth[i][j+1], shadow),
                            computeVertex(j+1, MIN_Y, i, mazeDirection.RIGHT, vertPosition.BOTTOM_LEFT, (j+1 >= X_SIZE) ? mazeElement.WALL : labyrinth[i][j+1], shadow),
                            computeVertex(j+1, MIN_Y, i+1, mazeDirection.RIGHT, vertPosition.BOTTOM_RIGHT, (j+1 >= X_SIZE) ? mazeElement.WALL : labyrinth[i][j+1], shadow),
                            computeVertex(j+1, MAX_Y, i+1, mazeDirection.RIGHT, vertPosition.TOP_RIGHT, (j+1 >= X_SIZE) ? mazeElement.WALL : labyrinth[i][j+1], shadow)
                        );
                        incrementIndexes();
                    }

                    //BACK
                    if(DEBUG_BACK && ((i+1 >= Z_SIZE) ? true : mazeElement.BLOCKS.includes(labyrinth[i+1][j]))){
                        let shadow = shadowTextures.B;
                        vertices.push(
                            computeVertex(j+1, MAX_Y, i+1, mazeDirection.BACK, vertPosition.TOP_LEFT, (i+1 >= Z_SIZE) ? mazeElement.WALL : labyrinth[i+1][j], shadow),
                            computeVertex(j+1, MIN_Y, i+1, mazeDirection.BACK, vertPosition.BOTTOM_LEFT, (i+1 >= Z_SIZE) ? mazeElement.WALL : labyrinth[i+1][j], shadow),
                            computeVertex(j, MIN_Y, i+1, mazeDirection.BACK, vertPosition.BOTTOM_RIGHT, (i+1 >= Z_SIZE) ? mazeElement.WALL : labyrinth[i+1][j], shadow),
                            computeVertex(j, MAX_Y, i+1, mazeDirection.BACK, vertPosition.TOP_RIGHT, (i+1 >= Z_SIZE) ? mazeElement.WALL : labyrinth[i+1][j], shadow)
                        );
                        incrementIndexes();
                    }

                    //LEFT
                    if(DEBUG_LEFT && ((j-1 < 0) ? true : mazeElement.BLOCKS.includes(labyrinth[i][j-1]))){
                        let shadow = shadowTextures.B;
                        vertices.push(
                            computeVertex(j, MAX_Y, i+1, mazeDirection.LEFT, vertPosition.TOP_LEFT, (j-1 < 0) ? mazeElement.WALL : labyrinth[i][j-1], shadow),
                            computeVertex(j, MIN_Y, i+1, mazeDirection.LEFT, vertPosition.BOTTOM_LEFT, (j-1 < 0) ? mazeElement.WALL : labyrinth[i][j-1], shadow),
                            computeVertex(j, MIN_Y, i, mazeDirection.LEFT, vertPosition.BOTTOM_RIGHT, (j-1 < 0) ? mazeElement.WALL : labyrinth[i][j-1], shadow),
                            computeVertex(j, MAX_Y, i, mazeDirection.LEFT, vertPosition.TOP_RIGHT, (j-1 < 0) ? mazeElement.WALL : labyrinth[i][j-1], shadow)
                        );
                        incrementIndexes();
                    }
                }
            }
        }

        if(VERTICES2D) return [vertices, [].concat(indexes), colours, normals, uvs, shadows];
        else return [[].concat.apply([],vertices), [].concat(indexes), colours, normals, uvs, shadows];
    },

    /**
     * Function that generates a 2D labyrinth given its rows and columns
     * @param { number } rows number of rows 
     * @param { number } columns number of columns
     * @param { boolean } joinSides true if the generation should be noisy
     * @param { float } joinProbability probability to add an inconsistent wall (MUST BE SMALL!!!!!!)
     * 
     * @returns a matrix of zeroes and ones where the ones are walls
     */
    generate2DLabyrinth : function(rows, columns, joinSides, joinProbability){

        //PRIVATE METHODS

        let iterateLabyrinth = function(matrix, row, col){

            //noise termination condition
            if (
                ((row+1)<matrix.length ? mazeElement.FLOORS.includes(matrix[row+1][col]) : true) && 
                ((row-1)>=0 ? mazeElement.FLOORS.includes(matrix[row-1][col]) : true) &&
                ((col+1)<matrix[0].length ? mazeElement.FLOORS.includes(matrix[row][col+1]) : true) && 
                ((col-1)>=0 ? mazeElement.FLOORS.includes(matrix[row][col-1]) : true)
            ) return matrix;

            //set cell as visited
            if(matrix[row][col] !== mazeElement.START_POS) matrix[row][col] = 0;

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
                let noise = joinSides && (Math.random() < joinProbability);
                if(matrix[neighbors[i][0]][neighbors[i][1]] === mazeElement.WALL || noise){
                    switch(neighbors[i][2]){
                        case 0:
                            matrix[row+1][col] = mazeElement.FLOOR;
                            break;
                        case 1:
                            matrix[row-1][col] = mazeElement.FLOOR;
                            break;
                        case 2:
                            matrix[row][col+1] = mazeElement.FLOOR;
                            break;
                        case 3:
                            matrix[row][col-1] = mazeElement.FLOOR;
                            break;
                        default:
                            return null;
                    }

                    iterateLabyrinth(matrix, neighbors[i][0], neighbors[i][1]);
                }
            });

            return matrix;
        }
        
        let computeFinalPosition = function(matrix, unvisited){

            let row = unvisited.shift();
            let col = unvisited.shift();

            matrix[row][col] = "X";

            if((row+1)<matrix.length ? !mazeElement.BLOCKS.includes(matrix[row+1][col]) : false){
                if(matrix[row+1][col] !== "X"){
                    unvisited.push(row+1, col);
                } 
            }
            if((row-1)>=0 ? !mazeElement.BLOCKS.includes(matrix[row-1][col]) : false){
                if(matrix[row-1][col] !== "X"){
                    unvisited.push(row-1, col);
                } 
            }
            if((col+1)<matrix[0].length ? !mazeElement.BLOCKS.includes(matrix[row][col+1]) : false){
                if(matrix[row][col+1] !== "X"){
                    unvisited.push(row, col+1);
                } 
            }
            if((col-1)>=0 ? !mazeElement.BLOCKS.includes(matrix[row][col-1]) : false){
                if(matrix[row][col-1] !== "X"){
                    unvisited.push(row, col-1);
                } 
            }

            if(unvisited.length === 0){
                return{ row: row, column: col};
            } 
            else return computeFinalPosition(matrix, unvisited)


            /*
            //copy by value
            let matrix = maze.map(function(arr) {return arr.slice()});

            //preprocessing
            for(i = 0; i < matrix.length; i++){
                for(j = 0; j < matrix[0].length; j++){
                    switch(matrix[i][j]){
                        case mazeElement.FLOOR:
                            matrix[i][j] = Number.MAX_VALUE;
                            break;
                        case mazeElement.WALL:
                            matrix[i][j] = "X";
                            break;
                        case mazeElement.START_POS:
                            matrix[i][j] = 0;
                            break;
                        default:
                            matrix[i][j] = Number.NaN;
                            break;
                    }
                }
            }
        
            //compute
            return computeDistances(matrix, srow, scol, 0);
            */
        };

        //only odd number of rows/columns (for simpler computation)
        if(rows%2 === 0) rows--;
        if(columns%2 === 0) columns--;

        //create empty labyrinth
        let labyrinth = Array(rows).fill().map(()=>Array(columns).fill(1));
        
        //generate starting positions
        let start_row = Math.floor(Math.random()*rows);
        let start_col = Math.floor(Math.random()*columns);
        start_row -= (start_row%2 === 0) ? 0 : 1;
        start_col -= (start_col%2 === 0) ? 0 : 1;
        labyrinth[start_row][start_col] = mazeElement.START_POS;

        //generate path
        labyrinth = iterateLabyrinth(labyrinth, start_row, start_col);

        //break other walls
        for(i = 1; i < labyrinth.length; i+=2){
            for(j = 1; j < labyrinth[0].length; j+=2){
                if(joinSides && Math.random() < joinProbability) labyrinth[i][j] = mazeElement.FLOOR;
            }
        }

        //compute final position (AS THE FURTHEST FROM THE STARTING POINT)
        let maze = labyrinth.map(function(arr) {return arr.slice()});
        let finalPosition = computeFinalPosition(maze, [start_row, start_col]);
        labyrinth[finalPosition.row][finalPosition.column] = mazeElement.FINAL_POS;

        return labyrinth;
    }
}