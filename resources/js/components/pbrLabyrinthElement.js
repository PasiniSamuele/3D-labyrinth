class PbrLabyrinthElementh{
    constructor(structure, parent, program, texture){
        this.program = program;
        this.parent = parent;
        this.structure = structure;
        this.texture=texture;

        this.children = [];
        this.localMatrix = utils.identityMatrix();
        this.worldMatrix = utils.identityMatrix();
        this.projectionMatrix = [];
        this.vao = null;
    }

    init(){
        this.loadLocations();
        this.loadComponent();
        this.loadVAO();
        this.loadTexture();

        this.children.forEach(child => child.init());
    }

    loadLocations(){}
    loadComponent(){}
    loadVAO(){}
    loadTexture(){
        this.texture.init();
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

    draw(perspectiveMatrix, viewMatrix){
        this.children.forEach(child => child.draw(perspectiveMatrix, viewMatrix));
    }
}