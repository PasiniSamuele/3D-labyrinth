class LabyrinthElement{
    constructor(structure, parent, program){
        this.program = program;
        this.parent = parent;
        this.structure = structure;

        this.children = [];

        this.worldMatrix = utils.identityMatrix();
        this.localMatrix = utils.identityMatrix();
    }

    init(){
        this.children.forEach(child => child.init());
    }

    updateWorld(matrix){
        if (matrix) {
            // a matrix was passed in so do the math
            this.worldMatrix = utils.multiplyMatrices(matrix, this.localMatrix);
        } else {
            // no matrix was passed in so just copy.
            utils.copy(this.localMatrix, this.worldMatrix);
        }
    
        // now process all the children
        var worldMatrix = this.worldMatrix;
        this.children.forEach(function(child) {
            child.updateWorldMatrix(worldMatrix);
        });
    }

    draw(perspectiveMatrix, viewMatrix, light, camPos){
        this.children.forEach(child => child.draw(perspectiveMatrix, viewMatrix, light, camPos));
    }
}