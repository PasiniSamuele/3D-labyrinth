class CollisionHandler {
    constructor(){}

    checkCameraCollisionXAxis(x, newx, z){
        let xvar = newx-x;
        let xAbsolute = Math.floor(x+this.offset.column);
        let zAbsolute = Math.floor(z+this.offset.row);
        let newxAbsolute = Math.floor(newx+this.offset.column+0.2*Math.sign(xvar));

        if(xAbsolute != newxAbsolute && labyrinthUtils.isBlock(this.structure, zAbsolute, newxAbsolute)){
            newx = x;
        }

        return newx;
    }

    checkCameraCollisionZAxis(z, newz, x){
        let zvar = newz-z;
        let xAbsolute = Math.floor(x+this.offset.column);
        let zAbsolute = Math.floor(z+Math.sign(zvar)*this.offset.row);
        let newzAbsolute = Math.floor(newz+this.offset.row+Math.sign(zvar)*0.2);
        
        if(zAbsolute != newzAbsolute && labyrinthUtils.isBlock(this.structure, newzAbsolute, xAbsolute)){
            newz = z;
        }
        return newz;
    }

    setStructure(str){
        this.structure = str;
        let start = labyrinthUtils.computeStartPos(str);
        this.offset = {
            row: start[0]+0.5,
            column: start[1]+0.5
        };
        console.log(this.structure);
        console.log(this.offset);
    }
}