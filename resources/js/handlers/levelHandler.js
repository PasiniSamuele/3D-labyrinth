class LevelHandler {
    constructor(){
        
    }

    setLevel(level){
        this.level = level;
		let start = labyrinthUtils.computeStartPos(this.level.labyrinth.structure2D);
        this.offset = {
            row: start[0] + 0.5,
            column: start[1] + 0.5
        };
    }

    finished(){
        let column = Math.floor(this.level.camera.position.x + this.offset.column);
		let row = Math.floor(this.level.camera.position.z + this.offset.row);

        if(this.level.labyrinth.structure2D[row][column] === mazeElement.FINAL_POS){
            return true;
        }

        return false;
    }
}