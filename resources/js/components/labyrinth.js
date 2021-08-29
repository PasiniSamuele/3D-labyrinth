/*******************
 * Labyrinth.js
 ******************/

/**
 * Class that represents a level
 */
class Labyrinth {

    /**
     * Constructor
     * @param {*} structure structure of the labyrinth
     * @param {*} programs GLSL programs associated with this object
     * @param {*} texturePaths paths of textures for maze elements
     */
    constructor(structure, programs, texturePaths, slotOffset) {

        //ATTRIBUTES
        this.programs = programs;

        this.structure2D = structure;

        this.children = [];

        //CALLS
        this.init(texturePaths, slotOffset);
    }

    /**
     * function to init the labyrinth
     */
    init(texturePaths, slotOffset) {
        this.children.push(new Wall(this.structure2D, gl.TEXTURE0+slotOffset++, this, this.programs[0], texturePaths.wall));
        this.children.push(new Floor(this.structure2D, gl.TEXTURE0+slotOffset++, this, this.programs[1], texturePaths.floor));

        this.children.forEach(child => child.init());
    }

    /**
     * function to draw the labyrinth
     * @param {*} perspectiveMatrix 
     * @param {*} viewMatrix 
     */
    draw(perspectiveMatrix, viewMatrix) {
        let worldMatrix = utils.MakeWorld(0.0, 0.5, 0.0, 0.0, 0.0, 0.0, 1.0);
        this.children.forEach(child => {
            child.updateWorld(worldMatrix);
            child.draw(perspectiveMatrix, viewMatrix)
        });
    }
}