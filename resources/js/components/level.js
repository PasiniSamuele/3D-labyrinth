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
     * @param { Character } character 
     * @param { Camera } camera 
     */
    constructor(labyrinth, skybox, character, camera) {
        this.labyrinth = labyrinth;
        this.skybox = skybox;
        this.character = character;
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
        this.character.draw(perspectiveMatrix, viewMatrix);
    }
}