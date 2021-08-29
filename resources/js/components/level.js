/*******************
 * Level.js
 ******************/

/**
 * Class that represents a Level
 */
class Level {

    /**
     * Constructor
     * @param { Labyrinth } labyrinth 
     * @param { Skybox } skybox 
     * @param { Camera } camera 
     */
    constructor(labyrinth, skybox, camera) {
        this.labyrinth = labyrinth;
        this.skybox = skybox;
        this.camera = camera;
    }

    /**
     * Function to draw the level
     * @param { number } now time instant
     * @param {*} perspectiveMatrix 
     * @param {*} viewMatrix 
     */
    draw(now, perspectiveMatrix, viewMatrix) {
        this.skybox.draw(now, perspectiveMatrix, viewMatrix);
        this.labyrinth.draw(perspectiveMatrix, viewMatrix);
    }
}