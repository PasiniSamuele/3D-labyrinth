function LoadingHandler(){

    this.levels=[];
    this.actualLevel=0;
    this.RANDOM_GENERATION=false;

    this.init=async function(settingsUrl){

        let settings = await utils.loadJSONResource(settingsUrl);
        this.RANDOM_GENERATION = settings.RANDOM_GENERATION;
        this.levels=settings.levels;
        this.initResources(this.levels[this.actualLevel]);
    };

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
        levelSettings.skybox.skyboxes.forEach((faceInfos, index) => {
            textures.push(new SkyboxTexture(faceInfos, gl.TEXTURE0+index)); 
        });
        let skybox = new Skybox(textures, program[1]);
        let labyrinth;
        if(RANDOM_GENERATION){
            let randomSettings = await utils.loadJSONResource(level.random);
            let maze2D = generate2DLabyrinth(randomSettings.rows, randomSettings.columns, randomSettings.JOIN_SIDES, randomSettings.join_parameters);
            labyrinth = new Labyrinth(maze2D, program[0]);
        }

        labyrinth = new Labyrinth(result[0], program[0]);
        let activeLevel = new Level(labyrinth, skybox, camera)
        return activeLevel;
    };

    this.loadNextLevel=async function(){
        this.actualLevel++;
        if(this.actualLevel>=this.levels.length)
            return null;
        else
            return initResources(this.levels[actualLevel])
    };

    this.init(settingsUrl);

}