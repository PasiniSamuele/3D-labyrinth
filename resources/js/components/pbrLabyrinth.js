class PbrLabyrinth {

    /**
     * Constructor
     * @param {*} structure structure of the labyrinth
     * @param {*} programs GLSL programs associated with this object
     * @param {*} textures paths of textures for maze elements
     */
    constructor(structure, programs, textures, suzanneStr, pedestalStr) {

        //ATTRIBUTES
        this.programs = programs;

        this.structure2D = structure;

        this.children = [];

        //CALLS
        this.init(textures, suzanneStr, pedestalStr);
    }

    /**
     * function to init the labyrinth
     */
    init(textures, suzanneStr, pedestalStr) {
       // this.children.push(new Wall(this.structure2D, gl.TEXTURE0+slotOffset++, this, this.programs[0], texturePaths.wall));
        this.children.push(new PbrFloor(this.structure2D, this, this.programs[1], textures.floor));
        this.children.push(new PbrWall(this.structure2D, this, this.programs[1], textures.wall));
        this.children.push(new Suzanne(this.structure2D, this, this.programs[2], suzanneStr[0], suzanneStr[1]));
        this.children.push(new Pedestal(this.structure2D, this, this.programs[3], pedestalStr[0], pedestalStr[1]));

        this.children.forEach(child => child.init());
    }

    /**
     * function to draw the labyrinth
     * @param {*} perspectiveMatrix 
     * @param {*} viewMatrix 
     */
    draw(perspectiveMatrix, viewMatrix, light, camPos, skybox, now) {
        let worldMatrix = utils.MakeWorld(0.0, 0.5, 0.0, 0.0, 0.0, 0.0, 1.0);
        this.children.forEach(child => {
            child.updateWorld(worldMatrix);
            child.draw(perspectiveMatrix, viewMatrix, light, camPos, skybox, now);
        });
    }
}