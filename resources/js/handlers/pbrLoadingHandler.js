/*******************
 * LoadingHandler.js
 ******************/

/**
 * Object that loads the program
 */
 class PbrLoadingHandler {

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
			utils.loadJSONResource(levelSettings.structure.url),    //0 lab JSON structure
			utils.loadTextResource(levelSettings.structure.shaders.wall.vertex),    //1 vertex sh of the wall
			utils.loadTextResource(levelSettings.structure.shaders.wall.fragment),  //2 fragment sh of the wall
			utils.loadTextResource(levelSettings.structure.shaders.floor.vertex),   //3 vertex sh of the floor
			utils.loadTextResource(levelSettings.structure.shaders.floor.fragment), //4 fragment sh of the floor
            utils.loadTextResource(levelSettings.skybox.shaders.vertex),    //5 vertex sh of the skybox
            utils.loadTextResource(levelSettings.skybox.shaders.fragment),  //6 fragment sh of the skybox
			utils.loadTextResource(levelSettings.character.url.obj),
			utils.loadTextResource(levelSettings.character.url.mtl),
			utils.loadTextResource(levelSettings.character.shaders.vertex),
			utils.loadTextResource(levelSettings.character.shaders.fragment),
        
        ]);

		// Create the shaders
		let program = [[],];
		let labWallVertexShader = utils.createShader(gl, gl.VERTEX_SHADER, results[1]);
		let labWallFragmentShader = utils.createShader(gl, gl.FRAGMENT_SHADER, results[2]);
		let labFloorVertexShader = utils.createShader(gl, gl.VERTEX_SHADER, results[3]);
		let labFloorFragmentShader = utils.createShader(gl, gl.FRAGMENT_SHADER, results[4]);
		let envVertexShader = utils.createShader(gl, gl.VERTEX_SHADER, results[5]);
		let envFragmentShader = utils.createShader(gl, gl.FRAGMENT_SHADER, results[6]);
		let chVertexShader = utils.createShader(gl, gl.VERTEX_SHADER, results[9]);
		let chFragmentShader = utils.createShader(gl, gl.FRAGMENT_SHADER, results[10]);

		program[0][0] = utils.createProgram(gl, labWallVertexShader, labWallFragmentShader);
		program[0][1] = utils.createProgram(gl, labFloorVertexShader, labFloorFragmentShader);
		program[1] = utils.createProgram(gl, envVertexShader, envFragmentShader);
		program[2] = utils.createProgram(gl, chVertexShader, chFragmentShader);

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
		//let labyrinth;
		/*if (this.RANDOM_GENERATION) {
			let randomSettings = await utils.loadJSONResource(level.random);
			let maze2D = generate2DLabyrinth(randomSettings.rows, randomSettings.columns, randomSettings.JOIN_SIDES, randomSettings.join_parameters);
			labyrinth = new Labyrinth(maze2D, program[0], levelSettings.structure.images, index);
		}*/
		//labyrinth = new Labyrinth(results[0], program[0], levelSettings.structure.images, index);
		// Set the actual level
		let character = new Character(results[7], results[8], levelSettings.character.offset, program[2], levelSettings.character.light );
		let pbrTexture={};
		pbrTexture.floor = new PbrTexture(levelSettings.structure.textures.floor, 
			gl.TEXTURE0 + index++,
			gl.TEXTURE0 + index++,
			gl.TEXTURE0 + index++,
			gl.TEXTURE0 + index++,
			gl.TEXTURE0 + index++) 
		pbrTexture.wall = new PbrTexture(levelSettings.structure.textures.wall, 
			gl.TEXTURE0 + index++,
			gl.TEXTURE0 + index++,
			gl.TEXTURE0 + index++,
			gl.TEXTURE0 + index++,
			gl.TEXTURE0 + index++);

		let labyrinth = new PbrLabyrinth(results[0], program[0], pbrTexture);
		console.log(camera);
		let activeLevel = new Level(labyrinth, skybox, character, camera);
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