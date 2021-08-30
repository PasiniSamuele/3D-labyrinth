/*******************
 * LoadingHandler.js
 ******************/

/**
 * Object that loads the program
 */
class LoadingHandler {

	/**
	 * Constructor
	 */
	constructor() {
		// Attributes
		this.levels = [];
		this.actualLevel = 0;
		this.RANDOM_GENERATION = false;
	}

	/**
	 * Function to initialize level loading
	 *
	 * @param { string } settingsUrl Url where is located the settings file
	 * 
	 * @returns { object } returns the actual "level" object
	 */
	async init(settingsUrl) {
		// Load JSON file
		let settings = await utils.loadJSONResource(settingsUrl);
		this.RANDOM_GENERATION = settings.RANDOM_GENERATION;
		this.levels = settings.settings.levels;
		// Init level resources
		let actualLevel = await this.initResources(this.levels[this.actualLevel]);
		// Return the actual level
		return actualLevel;
	};

	/**
	 * Function to loading all the resources asyncronously
	 *
	 * @param { object } level object "level" containing various information
	 * 
	 * @returns { object } returns the actual "level" object
	 */
	async initResources(level) {
		// Load JSON file
		let levelSettings = await utils.loadJSONResource(level.level);

		// Asyncronously load the resources
		const results = await Promise.all([
			utils.loadJSONResource(levelSettings.structure.url),
			utils.loadTextResource(levelSettings.structure.shaders.wall.vertex),
			utils.loadTextResource(levelSettings.structure.shaders.wall.fragment),
			utils.loadTextResource(levelSettings.structure.shaders.floor.vertex),
			utils.loadTextResource(levelSettings.structure.shaders.floor.fragment),
			utils.loadTextResource(levelSettings.skybox.shaders.vertex),
			utils.loadTextResource(levelSettings.skybox.shaders.fragment), //4:  fragment shader of the skybox
		]);
		// Create the shaders
		let program = [[],];
		let labWallVertexShader = utils.createShader(gl, gl.VERTEX_SHADER, results[1]);
		let labWallFragmentShader = utils.createShader(gl, gl.FRAGMENT_SHADER, results[2]);
		let labFloorVertexShader = utils.createShader(gl, gl.VERTEX_SHADER, results[3]);
		let labFloorFragmentShader = utils.createShader(gl, gl.FRAGMENT_SHADER, results[4]);
		let envVertexShader = utils.createShader(gl, gl.VERTEX_SHADER, results[5]);
		let envFragmentShader = utils.createShader(gl, gl.FRAGMENT_SHADER, results[6]);
		program[0][0] = utils.createProgram(gl, labWallVertexShader, labWallFragmentShader);
		program[0][1] = utils.createProgram(gl, labFloorVertexShader, labFloorFragmentShader);
		program[1] = utils.createProgram(gl, envVertexShader, envFragmentShader);
		// Create the camera
		let camera = new Camera(levelSettings.camera);
		// Create the skybox
		let textures = [];
		let index = 0;	//unique texture index for skybox & labyrinth elements
		levelSettings.skybox.skyboxes.forEach((skybox) => {
			textures.push(new SkyboxTexture(skybox.images, skybox.ambientLight, gl.TEXTURE0 + index++));
		});
		let skybox = new Skybox(textures, program[1]);
		// Create the labyrinth
		let labyrinth;
		if (this.RANDOM_GENERATION) {
			let randomSettings = await utils.loadJSONResource(level.random);
			let maze2D = labirinthUtils.generate2DLabyrinth(randomSettings.rows, randomSettings.columns, randomSettings.JOIN_SIDES, randomSettings.join_parameters);
			collisionHandler.setStructure(maze2D);
			labyrinth = new Labyrinth(maze2D, program[0], levelSettings.structure.images, index);
		} else {
			collisionHandler.setStructure(results[0]);
			labyrinth = new Labyrinth(results[0], program[0], levelSettings.structure.images, index);
		} 
		// Set the actual level
		let activeLevel = new Level(labyrinth, skybox, camera);
		// Return the actual level
		return activeLevel;
	};

	/**
	 * Function to load the next level
	 * 
	 * @returns { object } returns the next "level" object
	 */
	async loadNextLevel() {
		// Increment actual level index
		this.actualLevel++;
		// Load recources and return
		if (this.actualLevel >= this.levels.length)
			return null;
		else
			return initResources(this.levels[actualLevel]);
	};

}