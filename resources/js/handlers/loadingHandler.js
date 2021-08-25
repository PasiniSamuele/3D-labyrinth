function LoadingHandler(settingsUrl){

    this.levels=[];
    this.actualLevel=0;
    this.RANDOM_GENERATION=false;

    this.init(settingsUrl);

    this.init=async function(settingsUrl){

        let settings = await utils.loadJSONResource(settingsUrl);
        this.RANDOM_GENERATION = settings.RANDOM_GENERATION;
        this.levels=settings.levels;
        this.initResources(this.levels[this.actualLevel],);
    }

    this.initResources=async function(level){
        let levelSettings = await utils.loadJSONResource(level.level);
        const results = await Promise.all([
			utils.loadJSONResource(levelSettings.structure.url),        //0: labyrinth structure
            utils.loadTextResource(levelSettings.structure.shaders.vertex), //1: vertex shader of the labyrinth
            utils.loadTextResource(levelSettings.structure.shaders.fragment),   //2: fragment shader of the labyrinth
            utils.loadTextResource(levelSettings.skybox.shaders.vertex),    //3:  vertex shader of the skybox
            utils.loadTextResource(levelSettings.skybox.shaders.fragment),  //4:  fragment shader of the skybox
		]);
        let labVertexShader = utils.createShader(gl, gl.VERTEX_SHADER, results[1]);
		let labFragmentShader = utils.createShader(gl, gl.FRAGMENT_SHADER, results[2]);
		let envVertexShader = utils.createShader(gl, gl.VERTEX_SHADER, results[3]);
		let envFragmentShader = utils.createShader(gl, gl.FRAGMENT_SHADER, results[4]);
		program[0] = utils.createProgram(gl, labVertexShader, labFragmentShader);
		program[1] = utils.createProgram(gl, envVertexShader, envFragmentShader);

        let camera = new Camera(levelSettings.camera);
        let textures=[];
        levelSettings.skybox.skyboxes.forEach(element => {
            textures.push()
            
        });
        let labyrinth;
        if(RANDOM_GENERATION){
            let randomSettings = await utils.loadJSONResource(level.random);
            let maze2D = generate2DLabyrinth(randomSettings[0], randomSettings[1], randomSettings[2], randomSettings[3]);
            labyrinth = new Labyrinth(maze2D, program[0]);
        }

        labyrinth = new Labyrinth(result[0], program[0]);
            

        
    }

}