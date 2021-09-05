class PbrLabyrinth {

    /**
     * Constructor
     * @param {*} structure structure of the labyrinth
     * @param {*} programs GLSL programs associated with this object
     * @param {*} textures paths of textures for maze elements
     */
    constructor(structure, programs, textures) {

        //ATTRIBUTES
        this.programs = programs;

        this.structure2D = structure;

        this.children = [];

        //CALLS
        this.init(textures);
    }

    /**
     * function to init the labyrinth
     */
    init(textures) {
       // this.children.push(new Wall(this.structure2D, gl.TEXTURE0+slotOffset++, this, this.programs[0], texturePaths.wall));
        this.children.push(new PbrFloor(this.structure2D, this, this.programs[1], textures.floor));

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